// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const MessageStatus = {
  "NEW": "NEW",
  "STAGED": "STAGED",
  "DISPLAY": "DISPLAY",
  "DENIED": "DENIED"
};

const { Message } = initSchema(schema);

export {
  Message,
  MessageStatus
};