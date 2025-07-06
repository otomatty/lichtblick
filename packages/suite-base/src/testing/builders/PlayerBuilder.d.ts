import { BlockCache, MessageBlock, PlayerState, PlayerStateActiveData, Progress, SubscribePayload, Topic, TopicSelection, TopicStats } from "@lichtblick/suite-base/players/types";
import { Range } from "@lichtblick/suite-base/util/ranges";
declare class PlayerBuilder {
    static subscribePayload(props?: Partial<SubscribePayload>): SubscribePayload;
    static topicSelection(props?: Partial<TopicSelection>): TopicSelection;
    static messageBlock(props?: Partial<MessageBlock>): MessageBlock;
    static messageBlocks(count?: number): MessageBlock[];
    static blockCache(props?: Partial<BlockCache>): BlockCache;
    static range(props?: Partial<Range>): Range;
    static ranges(count?: number): Range[];
    static progress(props?: Partial<Progress>): Progress;
    static topic(props?: Partial<Topic>): Topic;
    static topics(count?: number): Topic[];
    static topicStats(props?: Partial<TopicStats>): TopicStats;
    static activeData(props?: Partial<PlayerStateActiveData>): PlayerStateActiveData;
    static playerState(props?: Partial<PlayerState>): PlayerState;
}
export default PlayerBuilder;
