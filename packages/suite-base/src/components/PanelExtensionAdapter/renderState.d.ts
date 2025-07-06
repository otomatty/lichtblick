import { AppSettingValue, Immutable, MessageEvent, RegisterMessageConverterArgs, RenderState, Subscription } from "@lichtblick/suite";
import { GlobalVariables } from "@lichtblick/suite-base/hooks/useGlobalVariables";
import { PlayerState, Topic as PlayerTopic } from "@lichtblick/suite-base/players/types";
import { HoverValue } from "@lichtblick/suite-base/types/hoverValue";
export type RenderStateConfig = {
    topics: Record<string, unknown>;
};
export type BuilderRenderStateInput = Immutable<{
    appSettings: Map<string, AppSettingValue> | undefined;
    colorScheme: RenderState["colorScheme"] | undefined;
    currentFrame: MessageEvent[] | undefined;
    globalVariables: GlobalVariables;
    hoverValue: HoverValue | undefined;
    messageConverters?: readonly RegisterMessageConverterArgs<unknown>[];
    playerState: PlayerState | undefined;
    sharedPanelState: Record<string, unknown> | undefined;
    sortedTopics: readonly PlayerTopic[];
    subscriptions: Subscription[];
    watchedFields: Set<string>;
    config?: RenderStateConfig | undefined;
}>;
type BuildRenderStateFn = (input: BuilderRenderStateInput) => Immutable<RenderState> | undefined;
/**
 * initRenderStateBuilder creates a function that transforms render state input into a new
 * RenderState
 *
 * This function tracks previous input to determine what parts of the existing render state to
 * update or whether there are any updates
 *
 * @returns a function that accepts render state input and returns a new RenderState to render or
 * undefined if there's no update for rendering
 */
declare function initRenderStateBuilder(): BuildRenderStateFn;
export { initRenderStateBuilder };
