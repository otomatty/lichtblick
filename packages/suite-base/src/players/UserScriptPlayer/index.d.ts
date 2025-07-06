import { Time } from "@lichtblick/rostime";
import { Metadata, ParameterValue } from "@lichtblick/suite";
import { Asset } from "@lichtblick/suite-base/components/PanelExtensionAdapter";
import { IPerformanceRegistry } from "@lichtblick/suite-base/context/PerformanceContext";
import { GlobalVariables } from "@lichtblick/suite-base/hooks/useGlobalVariables";
import { Diagnostic, UserScriptLog } from "@lichtblick/suite-base/players/UserScriptPlayer/types";
import { AdvertiseOptions, Player, PlayerState, PublishPayload, SubscribePayload } from "@lichtblick/suite-base/players/types";
import { UserScripts } from "@lichtblick/suite-base/types/panels";
declare let SharedWorker: {
    prototype: SharedWorker;
    new (scriptURL: URL, options?: string | WorkerOptions): SharedWorker;
};
type UserScriptActions = {
    setUserScriptDiagnostics: (scriptId: string, diagnostics: readonly Diagnostic[]) => void;
    addUserScriptLogs: (scriptId: string, logs: readonly UserScriptLog[]) => void;
    setUserScriptRosLib: (rosLib: string) => void;
    setUserScriptTypesLib: (lib: string) => void;
};
export default class UserScriptPlayer implements Player {
    #private;
    static CreateTransformWorker: () => SharedWorker;
    static CreateRuntimeWorker: () => SharedWorker;
    constructor(player: Player, userScriptActions: UserScriptActions, perfRegistry?: IPerformanceRegistry);
    setGlobalVariables(globalVariables: GlobalVariables): void;
    setUserScripts(userScripts: UserScripts): Promise<void>;
    setListener(listener: (_: PlayerState) => Promise<void>): void;
    setSubscriptions(subscriptions: SubscribePayload[]): void;
    close: () => void;
    getMetadata(): ReadonlyArray<Readonly<Metadata>>;
    setPublishers(publishers: AdvertiseOptions[]): void;
    setParameter(key: string, value: ParameterValue): void;
    publish(request: PublishPayload): void;
    callService(service: string, request: unknown): Promise<unknown>;
    fetchAsset(uri: string): Promise<Asset>;
    startPlayback(): void;
    pausePlayback(): void;
    playUntil(time: Time): void;
    setPlaybackSpeed(speed: number): void;
    seekPlayback(time: Time): void;
}
export {};
