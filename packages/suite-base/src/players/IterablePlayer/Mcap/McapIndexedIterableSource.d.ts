import { McapIndexedReader } from "@mcap/core";
import { Time } from "@lichtblick/rostime";
import { MessageEvent } from "@lichtblick/suite";
import { GetBackfillMessagesArgs, IIterableSource, Initialization, IteratorResult, MessageIteratorArgs } from "@lichtblick/suite-base/players/IterablePlayer/IIterableSource";
export declare class McapIndexedIterableSource implements IIterableSource {
    #private;
    constructor(reader: McapIndexedReader);
    initialize(): Promise<Initialization>;
    messageIterator(args: MessageIteratorArgs): AsyncIterableIterator<Readonly<IteratorResult>>;
    getBackfillMessages(args: GetBackfillMessagesArgs): Promise<MessageEvent[]>;
    getStart(): Time | undefined;
}
