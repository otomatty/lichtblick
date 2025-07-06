import * as Comlink from "@lichtblick/comlink";
import { Immutable, MessageEvent } from "@lichtblick/suite";
import type { GetBackfillMessagesArgs, IIterableSource, IMessageCursor, Initialization, IteratorResult, MessageIteratorArgs } from "./IIterableSource";
export declare class WorkerIterableSourceWorker implements IIterableSource {
    protected _source: IIterableSource;
    constructor(source: IIterableSource);
    initialize(): Promise<Initialization>;
    messageIterator(args: MessageIteratorArgs): AsyncIterableIterator<Readonly<IteratorResult>> & Comlink.ProxyMarked;
    getBackfillMessages(args: Omit<GetBackfillMessagesArgs, "abortSignal">, abortSignal?: AbortSignal): Promise<MessageEvent[]>;
    getMessageCursor(args: Omit<Immutable<MessageIteratorArgs>, "abort">, abort?: AbortSignal): IMessageCursor & Comlink.ProxyMarked;
}
