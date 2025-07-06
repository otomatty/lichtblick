import EventEmitter from "eventemitter3";
import { Time, MessageEvent } from "@lichtblick/suite";
import { Range } from "@lichtblick/suite-base/util/ranges";
import { GetBackfillMessagesArgs, IIterableSource, Initialization, IteratorResult, MessageIteratorArgs } from "./IIterableSource";
type Options = {
    readAheadDuration?: Time;
    minReadAheadDuration?: Time;
};
interface EventTypes {
    /** Dispatched when the loaded ranges have changed. Use `loadedRanges()` to get the new ranges. */
    loadedRangesChange: () => void;
}
/**
 * BufferedIterableSource proxies access to IIterableSource. It buffers the messageIterator by
 * reading ahead in the underlying source.
 *
 * The architecture of BufferedIterableSource follows a producer-consumer model. The messageIterator
 * is the consumer and reads messages from cache while the startProducer method produces messages by
 * reading from the underlying source and populating the cache.
 */
declare class BufferedIterableSource extends EventEmitter<EventTypes> implements IIterableSource {
    #private;
    constructor(source: IIterableSource, opt?: Options);
    initialize(): Promise<Initialization>;
    terminate(): Promise<void>;
    stopProducer(): Promise<void>;
    loadedRanges(): Range[];
    getCacheSize(): number;
    messageIterator(args: MessageIteratorArgs): AsyncIterableIterator<Readonly<IteratorResult>>;
    getBackfillMessages(args: GetBackfillMessagesArgs): Promise<MessageEvent[]>;
}
export { BufferedIterableSource };
