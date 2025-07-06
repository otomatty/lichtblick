import { Time } from "@lichtblick/rostime";
import { ParameterValue } from "@lichtblick/suite";
import { AdvertiseOptions, Player, PlayerState, PublishPayload, SubscribePayload, PlayerMetricsCollectorInterface } from "@lichtblick/suite-base/players/types";
export default class RosbridgePlayer implements Player {
    #private;
    constructor({ url, metricsCollector, sourceId, }: {
        url: string;
        metricsCollector: PlayerMetricsCollectorInterface;
        sourceId: string;
    });
    setListener(listener: (arg0: PlayerState) => Promise<void>): void;
    close(): void;
    setSubscriptions(subscriptions: SubscribePayload[]): void;
    setPublishers(publishers: AdvertiseOptions[]): void;
    setParameter(_key: string, _value: ParameterValue): void;
    publish({ topic, msg }: PublishPayload): void;
    callService(service: string, request: unknown): Promise<unknown>;
    startPlayback(): void;
    pausePlayback(): void;
    seekPlayback(_time: Time): void;
    setPlaybackSpeed(_speedFraction: number): void;
    setGlobalVariables(): void;
}
