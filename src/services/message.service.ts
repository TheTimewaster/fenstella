import { Message, MessageStatus } from "@/models";
import { DataStore, Predicates, SortDirection } from "@aws-amplify/datastore";

class MessageService {
    observers: {[key: string]: any} = {};

    async saveNewMessage(content: string) {
        return DataStore.save(
            new Message({
                content,
                timestamp: new Date().valueOf(),
                messageStatus: "NEW"
            })
        );
    }

    async assignStatus(message: Message, status: MessageStatus) {
        const updateMessage = Message.copyOf(message, (currentMessage) => {
            currentMessage.messageStatus = status;
            if (status === MessageStatus.PUBLISHED) {
                currentMessage.publishTimestamp = new Date().valueOf();
            } else if (status === MessageStatus.STAGED) {
                currentMessage.stagingTimestamp = new Date().valueOf();
            }
        });
        return DataStore.save(updateMessage);
    }

    async getLastPublishedMessage() {
        const messages = await DataStore.query(Message,
            ({ messageStatus }) => messageStatus("eq", MessageStatus.PUBLISHED), { sort: (message) => message.publishTimestamp(SortDirection.DESCENDING), limit: 1 });

        if (messages.length > 0) {
            return messages[0];
        }
        return null;
    }

    async getNewMessages() {
        return DataStore.query(Message,
            ({ messageStatus }) => messageStatus("eq", MessageStatus.NEW), { sort: (message) => message.timestamp(SortDirection.DESCENDING) });
    }

    async getStagedMessages() {
        const msg = DataStore.query(Message,
            ({ messageStatus }) => messageStatus("eq", MessageStatus.STAGED), { sort: (message) => message.timestamp(SortDirection.DESCENDING) });
        return msg;
    }

    async getArchivedMessages() {
        const msg = DataStore.query(Message,
            m => m.or(
                m => m
                    .messageStatus("eq", MessageStatus.ARCHIVED)
                    .messageStatus("eq", MessageStatus.DENIED)
            )
            , { sort: (message) => message.timestamp(SortDirection.DESCENDING) });
        return msg;
    }

    async getAllMessages() {
        return DataStore.query(Message,
            Predicates.ALL, { sort: (message) => message.timestamp(SortDirection.DESCENDING) });
    }

    async deleteMessage(message: Message) {
        return DataStore.delete(message);
    }

    async observeMessage(observerCallbacks: ObserverCallbacks, observerKey: string, status: MessageStatus) {
        this.observers[observerKey] = DataStore
            .observe(Message, ({ messageStatus }) => messageStatus("eq", status))
            .subscribe((response) => {
                if (observerCallbacks[response.opType] != null) {
                    observerCallbacks[response.opType](response.element);
                }
            });
    }

    closeObserver(observerKey: string) {
        const toCloseObserver = this.observers[observerKey];
        if (toCloseObserver != null) {
            toCloseObserver.unsubscribe();
        }
    }
}

type OpTypeClient =
    "INSERT" |
    "UPDATE" |
    "DELETE"

export type ObserverCallbacks = {
    [key in OpTypeClient]: (message: Message) => void;
}

export default new MessageService();