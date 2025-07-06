import { BroadcastMessageEvent } from "@lichtblick/suite-base/util/broadcast/types";
export default class MockBroadcastChannel {
    name: string;
    onmessage: ((event: MessageEvent) => void) | undefined;
    postedMessages: BroadcastMessageEvent[];
    isClosed: boolean;
    postMessage(message: BroadcastMessageEvent): void;
    close(): void;
    simulateIncomingMessage(message: BroadcastMessageEvent): void;
}
