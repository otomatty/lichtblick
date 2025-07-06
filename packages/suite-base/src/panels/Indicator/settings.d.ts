import { SettingsTreeAction, SettingsTreeNodes } from "@lichtblick/suite";
import { IndicatorConfig } from "./types";
export declare function settingsActionReducer(prevConfig: IndicatorConfig, action: SettingsTreeAction): IndicatorConfig;
export declare function useSettingsTree(config: IndicatorConfig, pathParseError: string | undefined, error: string | undefined): SettingsTreeNodes;
