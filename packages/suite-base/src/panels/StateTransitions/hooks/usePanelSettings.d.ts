import { TFunction } from "i18next";
import { SettingsTreeNode, SettingsTreeNodeActionItem, SettingsTreeNodes } from "@lichtblick/suite";
import { SaveConfig } from "@lichtblick/suite-base/types/panels";
import { IUsePanelSettings, PathState, SeriesAction, StateTransitionConfig } from "../types";
export declare function setSeriesAction({ label, icon, id }: SeriesAction): SettingsTreeNodeActionItem;
export declare const makeSeriesNode: ((index: number, { path, canDelete, isArray }: PathState & {
    canDelete: boolean;
}, t: TFunction<"stateTransitions">) => SettingsTreeNode) & {
    clear(): void;
};
export declare const makeRootSeriesNode: ((paths: PathState[], t: TFunction<"stateTransitions">) => SettingsTreeNode) & {
    clear(): void;
};
export declare function buildSettingsTree({ isSynced, xAxisMaxValue, xAxisMinValue, xAxisRange, showPoints }: StateTransitionConfig, paths: PathState[], t: TFunction<"stateTransitions">): SettingsTreeNodes;
export declare function usePanelSettings(config: StateTransitionConfig, saveConfig: SaveConfig<StateTransitionConfig>, paths: PathState[], focusedPath?: readonly string[]): IUsePanelSettings;
