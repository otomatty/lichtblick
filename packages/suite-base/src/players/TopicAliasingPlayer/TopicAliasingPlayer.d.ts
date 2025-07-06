import { Time } from "@lichtblick/rostime";
import { Immutable, Metadata, ParameterValue } from "@lichtblick/suite";
import { Asset } from "@lichtblick/suite-base/components/PanelExtensionAdapter";
import { GlobalVariables } from "@lichtblick/suite-base/hooks/useGlobalVariables";
import { AdvertiseOptions, Player, PlayerState, PublishPayload, SubscribePayload } from "@lichtblick/suite-base/players/types";
import { TopicAliasFunctions } from "./StateProcessorFactory";
export type { TopicAliasFunctions };
/**
 * This is a player that wraps an underlying player and applies aliases to all topic names
 * in data emitted from the player.
 *
 * Aliases that alias input topics to other input topics or that request conflicting
 * aliases from multiple input topics to the same output topic are disallowed and flagged
 * as player alerts
 */
export declare class TopicAliasingPlayer implements Player {
    #private;
    constructor(player: Player);
    getMetadata(): ReadonlyArray<Readonly<Metadata>>;
    setListener(listener: (playerState: PlayerState) => Promise<void>): void;
    setAliasFunctions(aliasFunctions: Immutable<TopicAliasFunctions>): void;
    close(): void;
    setSubscriptions(subscriptions: SubscribePayload[]): void;
    setPublishers(publishers: AdvertiseOptions[]): void;
    setParameter(key: string, value: ParameterValue): void;
    publish(request: PublishPayload): void;
    callService(service: string, request: unknown): Promise<unknown>;
    startPlayback?(): void;
    pausePlayback?(): void;
    seekPlayback?(time: Time): void;
    playUntil?(time: Time): void;
    setPlaybackSpeed?(speedFraction: number): void;
    setGlobalVariables(globalVariables: GlobalVariables): void;
    fetchAsset(uri: string): Promise<Asset>;
}
