import { MessageEvent } from "@lichtblick/suite";
import { GetBackfillMessagesArgs, IIterableSource, Initialization, IteratorResult, MessageIteratorArgs } from "@lichtblick/suite-base/players/IterablePlayer/IIterableSource";
type Options = {
    size: number;
    stream: ReadableStream<Uint8Array>;
};
/** Only efficient for small files */
export declare class McapUnindexedIterableSource implements IIterableSource {
    #private;
    constructor(options: Options);
    initialize(): Promise<Initialization>;
    messageIterator(args: MessageIteratorArgs): AsyncIterableIterator<Readonly<IteratorResult>>;
    getBackfillMessages(args: GetBackfillMessagesArgs): Promise<MessageEvent[]>;
}
export {};
