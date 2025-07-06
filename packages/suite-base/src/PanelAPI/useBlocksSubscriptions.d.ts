import { Immutable } from "@lichtblick/suite";
import { MessageEvent, SubscribePayload } from "@lichtblick/suite-base/players/types";
export type MessageBlock = Immutable<{
    [topicName: string]: MessageEvent[];
}>;
export declare function useBlocksSubscriptions(subscriptions: Immutable<SubscribePayload[]>): readonly MessageBlock[];
