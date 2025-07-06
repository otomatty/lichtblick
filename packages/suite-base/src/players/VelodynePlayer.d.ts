import { ParameterValue } from "@lichtblick/suite";
import { GlobalVariables } from "@lichtblick/suite-base/hooks/useGlobalVariables";
import { AdvertiseOptions, Player, PlayerMetricsCollectorInterface, PlayerState, PublishPayload, SubscribePayload } from "@lichtblick/suite-base/players/types";
type VelodynePlayerOpts = {
    port?: number;
    metricsCollector: PlayerMetricsCollectorInterface;
};
export default class VelodynePlayer implements Player {
    #private;
    constructor({ port, metricsCollector }: VelodynePlayerOpts);
    setListener(listener: (arg0: PlayerState) => Promise<void>): void;
    close(): void;
    setSubscriptions(_subscriptions: SubscribePayload[]): void;
    setPublishers(_publishers: AdvertiseOptions[]): void;
    setParameter(_key: string, _value: ParameterValue): void;
    publish(_request: PublishPayload): void;
    callService(): Promise<unknown>;
    setGlobalVariables(_globalVariables: GlobalVariables): void;
}
export {};
