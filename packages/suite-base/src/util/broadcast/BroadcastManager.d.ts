import { BroadcastMessageEvent } from "./types";
export default class BroadcastManager {
    private static instance;
    private static shouldSync;
    private readonly channel;
    private readonly listeners;
    private constructor();
    postMessage(message: BroadcastMessageEvent): void;
    addListener(listener: (message: BroadcastMessageEvent) => void): void;
    removeListener(listener: (message: BroadcastMessageEvent) => void): void;
    close(): void;
    static getInstance(): BroadcastManager;
    static setShouldSync({ shouldSync }: {
        shouldSync: boolean;
    }): void;
}
