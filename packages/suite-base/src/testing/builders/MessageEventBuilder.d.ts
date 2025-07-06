import { MessageEvent } from "@lichtblick/suite";
declare class MessageEventBuilder {
    static messageEvent<T>(props?: Partial<MessageEvent<T>>): MessageEvent<T>;
    static messageEvents(count?: number): MessageEvent[];
}
export default MessageEventBuilder;
