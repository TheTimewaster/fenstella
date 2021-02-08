import { Message, MessageStatus } from "@/models";
import { DataStore, SortDirection } from "@aws-amplify/datastore";

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
        const updateMessage = Message.copyOf(message, currentMessage => { currentMessage.messageStatus = status; });
        return DataStore.save(updateMessage);
    }

    async getDisplayMessage() {
        const messages = await DataStore.query(Message,
            ({ messageStatus }) => messageStatus("eq", MessageStatus.DISPLAY), { sort: (message) => message.timestamp(SortDirection.DESCENDING), limit: 1 });

        if (messages.length > 0) {
            return messages[0];
        }
        return null;
    }

    async getNewMessages() {
        return DataStore.query(Message,
            ({ messageStatus }) => messageStatus("eq", MessageStatus.NEW), { sort: (message) => message.timestamp(SortDirection.ASCENDING) });
    }

    async deleteMessage(message: Message) {
        return DataStore.delete(message);
    }

    async observeMessage(observerCallbacks: ObserverCallbacks, observerKey: string, status = MessageStatus.NEW) {
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

export enum OpTypeClient {
    INSERT = "INSERT",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}

export type ObserverCallbacks = {
    [OpTypeClient.INSERT]: (message: Message) => void;
    [OpTypeClient.UPDATE]: (message: Message) => void;
    [OpTypeClient.DELETE]: (message: Message) => void;
}

export default new MessageService();
