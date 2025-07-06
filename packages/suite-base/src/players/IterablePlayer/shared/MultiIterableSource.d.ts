import { IterableSourceConstructor, MultiSource } from "@lichtblick/suite-base/players/IterablePlayer/shared/types";
import { MessageEvent } from "@lichtblick/suite-base/players/types";
import { IIterableSource, IteratorResult, Initialization, MessageIteratorArgs, GetBackfillMessagesArgs } from "../IIterableSource";
export declare class MultiIterableSource<T extends IIterableSource, P> implements IIterableSource {
    private SourceConstructor;
    private dataSource;
    private sourceImpl;
    constructor(dataSource: MultiSource, SourceConstructor: IterableSourceConstructor<T, P>);
    private loadMultipleSources;
    initialize(): Promise<Initialization>;
    messageIterator(opt: MessageIteratorArgs): AsyncIterableIterator<Readonly<IteratorResult>>;
    getBackfillMessages(args: GetBackfillMessagesArgs): Promise<MessageEvent[]>;
    private mergeInitializations;
}
