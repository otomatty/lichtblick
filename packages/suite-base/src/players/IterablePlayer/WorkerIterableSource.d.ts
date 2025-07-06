import { Immutable, MessageEvent } from "@lichtblick/suite";
import type { GetBackfillMessagesArgs, IIterableSource, IMessageCursor, Initialization, IteratorResult, MessageIteratorArgs, IterableSourceInitializeArgs } from "./IIterableSource";
type ConstructorArgs = {
    initWorker: () => Worker;
    initArgs: IterableSourceInitializeArgs;
};
export declare class WorkerIterableSource implements IIterableSource {
    #private;
    constructor(args: ConstructorArgs);
    initialize(): Promise<Initialization>;
    messageIterator(args: MessageIteratorArgs): AsyncIterableIterator<Readonly<IteratorResult>>;
    getBackfillMessages(args: GetBackfillMessagesArgs): Promise<MessageEvent[]>;
    getMessageCursor(args: Immutable<MessageIteratorArgs & {
        abort?: AbortSignal;
    }>): IMessageCursor;
    terminate(): Promise<void>;
}
export {};
