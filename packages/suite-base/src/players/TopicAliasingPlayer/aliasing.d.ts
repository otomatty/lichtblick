import { TopicAliasFunction, Immutable as Im } from "@lichtblick/suite";
import { GlobalVariables } from "@lichtblick/suite-base/hooks/useGlobalVariables";
import { PlayerState, SubscribePayload, Topic } from "@lichtblick/suite-base/players/types";
export type TopicAliasFunctions = Array<{
    extensionId: string;
    aliasFunction: TopicAliasFunction;
}>;
export type AliasingInputs = {
    aliasFunctions: TopicAliasFunctions;
    topics: undefined | Topic[];
    variables: GlobalVariables;
};
/**
 * Aliases topics in a player state to a new player state with all topic name aliases
 * applied.
 *
 * @param inputs the inputs to the alias function
 * @param playerState the player state containing topics to alias
 * @returns a player state with all aliased topic names replaced with their aliased value.
 */
export declare function aliasPlayerState(inputs: Im<AliasingInputs>, subscriptions: Im<SubscribePayload[]>, playerState: PlayerState): PlayerState;
