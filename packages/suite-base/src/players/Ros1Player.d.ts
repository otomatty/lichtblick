import { ParameterValue } from "@lichtblick/suite";
import { AdvertiseOptions, Player, PlayerMetricsCollectorInterface, PlayerState, PublishPayload, SubscribePayload } from "@lichtblick/suite-base/players/types";
type Ros1PlayerOpts = {
    url: string;
    hostname?: string;
    metricsCollector: PlayerMetricsCollectorInterface;
    sourceId: string;
};
export default class Ros1Player implements Player {
    #private;
    constructor({ url, hostname, metricsCollector, sourceId }: Ros1PlayerOpts);
    setListener(listener: (arg0: PlayerState) => Promise<void>): void;
    close(): void;
    setSubscriptions(subscriptions: SubscribePayload[]): void;
    setPublishers(publishers: AdvertiseOptions[]): void;
    setParameter(key: string, value: ParameterValue): void;
    publish({ topic, msg }: PublishPayload): void;
    callService(): Promise<unknown>;
    setGlobalVariables(): void;
}
export {};
