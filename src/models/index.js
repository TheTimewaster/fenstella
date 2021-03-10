// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const MessageStatus = {
  "NEW": "NEW",
  "STAGED": "STAGED",
  "PUBLISHED": "PUBLISHED",
  "DENIED": "DENIED",
  "ARCHIVED": "ARCHIVED",
  "DISPLAY": "DISPLAY"
};

const { Message } = initSchema(schema);

export {
  Message,
  MessageStatus
};