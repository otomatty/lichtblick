import { Immutable } from "@lichtblick/suite";
import { SubscribePayload } from "@lichtblick/suite-base/players/types";
/**
 * Calculates a mapping from topic name to a SubscribePayload containing the
 * minimum `preloadType` necessary to fulfill that request.
 */
export declare function getPreloadTypes(subscriptions: SubscribePayload[]): Record<string, SubscribePayload>;
/**
 * Rewrites the provided array of subscriptions to omit subscriptions to
 * virtual topics and subscribe only to the inputs to those topics, then
 * deduplicates.
 */
export declare function remapVirtualSubscriptions(subscriptions: SubscribePayload[], inputsByOutputTopic: Map<string, readonly string[]>): Immutable<SubscribePayload[]>;
