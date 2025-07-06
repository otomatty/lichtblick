import { Time } from "@lichtblick/rostime";
import { MessageEvent } from "@lichtblick/suite-base/players/types";
import { IIterableSource, IteratorResult, Initialization, MessageIteratorArgs, GetBackfillMessagesArgs } from "../IIterableSource";
type McapSource = {
    type: "file";
    file: Blob;
} | {
    type: "url";
    url: string;
};
export declare class McapIterableSource implements IIterableSource {
    #private;
    constructor(source: McapSource);
    initialize(): Promise<Initialization>;
    messageIterator(opt: MessageIteratorArgs): AsyncIterableIterator<Readonly<IteratorResult>>;
    getBackfillMessages(args: GetBackfillMessagesArgs): Promise<MessageEvent[]>;
    getStart(): Time | undefined;
}
export {};
