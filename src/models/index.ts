export enum MessageStatus {
  NEW = "NEW",
  STAGED = "STAGED",
  PUBLISHED = "PUBLISHED",
  DENIED = "DENIED",
  ARCHIVED = "ARCHIVED",
  DISPLAY = "DISPLAY",
}

export interface Message {
  $id: string;
  $createdAt: string;
  $collectionId: string;
  $databaseId: string;
  $updatedAt: string;
  $permissions: string[];
  content: string;
  status: MessageStatus | keyof typeof MessageStatus;
  stagingTimestamp?: Date;
  publishTimestamp?: Date;
}
