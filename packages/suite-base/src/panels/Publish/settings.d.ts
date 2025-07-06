import { Immutable } from "@lichtblick/suite";
import { Topic } from "@lichtblick/suite-base/players/types";
import { RosDatatypes } from "@lichtblick/suite-base/types/RosDatatypes";
import { SaveConfig } from "@lichtblick/suite-base/types/panels";
import { PublishConfig } from "./types";
export declare const defaultConfig: PublishConfig;
export declare function usePublishPanelSettings(config: PublishConfig, saveConfig: SaveConfig<PublishConfig>, topics: readonly Topic[], datatypes: Immutable<RosDatatypes>): void;
