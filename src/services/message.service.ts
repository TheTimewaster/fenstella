import { Message, MessageStatus } from "@/models";
import { DataStore, Predicates, SortDirection } from "@aws-amplify/datastore";
import { ZenObservable } from "zen-observable-ts";

export const MESSAGES_PER_PAGE = 20;
class MessageService {
    observers: { [key: string]: ZenObservable.Subscription } = {};

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
            ({ messageStatus }) => messageStatus("eq", MessageStatus.PUBLISHED), { sort: (message) => message.publishTimestamp(SortDirection.DESCENDING) });

        if (messages.length > 0) {
            return messages[0];
        }
        return null;
    }

    async getNewMessages(pageNum = 0) {
        return DataStore.query(
            Message,
            ({ messageStatus }) => messageStatus("eq", MessageStatus.NEW),
            {
                sort: (message) => message.timestamp(SortDirection.DESCENDING),
                page: pageNum,
                limit: MESSAGES_PER_PAGE
            });
    }

    async getStagedMessages(pageNum = 0) {
        return DataStore.query(Message,
            ({ messageStatus }) => messageStatus("eq", MessageStatus.STAGED),
            {
                sort: (message) => message.timestamp(SortDirection.DESCENDING),
                page: pageNum,
                limit: MESSAGES_PER_PAGE
            });
    }

    async getArchivedMessages(pageNum = 0) {
        return DataStore.query(Message,
            m => m.or(
                m => m
                    .messageStatus("eq", MessageStatus.ARCHIVED)
                    .messageStatus("eq", MessageStatus.DENIED)
            ),
            {
                sort: (message) => message.timestamp(SortDirection.DESCENDING),
                page: pageNum,
                limit: MESSAGES_PER_PAGE
            });
    }

    async getAllMessages(pageNum = 0) {
        return DataStore.query(Message,
            Predicates.ALL, {
                sort: (message) => message.timestamp(SortDirection.DESCENDING),
                page: pageNum,
                limit: MESSAGES_PER_PAGE
            });
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
