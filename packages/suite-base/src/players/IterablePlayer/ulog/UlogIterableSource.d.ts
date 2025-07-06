import { MessageEvent } from "@lichtblick/suite";
import { IIterableSource, IteratorResult, Initialization, MessageIteratorArgs, GetBackfillMessagesArgs } from "../IIterableSource";
type UlogOptions = {
    type: "file";
    file: File;
};
export declare class UlogIterableSource implements IIterableSource {
    #private;
    constructor(options: UlogOptions);
    initialize(): Promise<Initialization>;
    messageIterator(args: MessageIteratorArgs): AsyncIterableIterator<Readonly<IteratorResult>>;
    getBackfillMessages(_args: GetBackfillMessagesArgs): Promise<MessageEvent[]>;
}
export {};
