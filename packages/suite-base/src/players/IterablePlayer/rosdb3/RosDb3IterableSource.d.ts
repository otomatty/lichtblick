import { MessageEvent } from "@lichtblick/suite";
import { GetBackfillMessagesArgs, IIterableSource, Initialization, IteratorResult, MessageIteratorArgs } from "../IIterableSource";
export declare class RosDb3IterableSource implements IIterableSource {
    #private;
    constructor(files: File[]);
    initialize(): Promise<Initialization>;
    messageIterator(opt: MessageIteratorArgs): AsyncIterableIterator<Readonly<IteratorResult>>;
    getBackfillMessages(_args: GetBackfillMessagesArgs): Promise<MessageEvent[]>;
}
