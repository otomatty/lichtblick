import { MessageEvent } from "@lichtblick/suite-base/players/types";
import { GetBackfillMessagesArgs, IIterableSource, Initialization, IteratorResult, MessageIteratorArgs } from "./IIterableSource";
type BagSource = {
    type: "file";
    file: File;
} | {
    type: "remote";
    url: string;
};
export declare class BagIterableSource implements IIterableSource {
    #private;
    constructor(source: BagSource);
    initialize(): Promise<Initialization>;
    messageIterator(opt: MessageIteratorArgs): AsyncIterableIterator<Readonly<IteratorResult>>;
    getBackfillMessages({ topics, time, }: GetBackfillMessagesArgs): Promise<MessageEvent[]>;
}
export {};
