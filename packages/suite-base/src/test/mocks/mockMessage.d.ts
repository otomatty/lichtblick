import { MessageEvent } from "@lichtblick/suite";
/**
 * Helper function for generating mock messages for tests and stories.
 *
 * @param message the message body
 * @param fields fields in the message object to override
 * @returns a MessageEvent
 */
export declare function mockMessage<T>(message: T, fields?: Partial<MessageEvent<T>>): MessageEvent<T>;
