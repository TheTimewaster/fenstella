import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum MessageStatus {
  NEW = "NEW",
  STAGED = "STAGED",
  PUBLISHED = "PUBLISHED",
  DENIED = "DENIED",
  ARCHIVED = "ARCHIVED",
  DISPLAY = "DISPLAY"
}



export declare class Message {
  readonly id: string;
  readonly content: string;
  readonly timestamp: number;
  readonly messageStatus: MessageStatus | keyof typeof MessageStatus;
  readonly stagingTimestamp?: number;
  readonly publishTimestamp?: number;
  constructor(init: ModelInit<Message>);
  static copyOf(source: Message, mutator: (draft: MutableModel<Message>) => MutableModel<Message> | void): Message;
}