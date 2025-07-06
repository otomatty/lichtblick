import { SettingsTreeActionUpdatePayload } from "@lichtblick/suite";
import { SaveConfig } from "@lichtblick/suite-base/types/panels";
import { PlotConfig } from "../utils/config";
export type HandleAction = {
    draft: PlotConfig;
};
export type HandleDeleteSeriesAction = HandleAction & {
    index: number;
};
export type HandleUpdateAction = HandleAction & Omit<SettingsTreeActionUpdatePayload, "input">;
export declare function handleUpdateAction({ draft, path, value }: HandleUpdateAction): void;
export declare function handleAddSeriesAction({ draft }: HandleAction): void;
export declare function handleDeleteSeriesAction({ draft, index }: HandleDeleteSeriesAction): void;
export default function usePlotPanelSettings(config: PlotConfig, saveConfig: SaveConfig<PlotConfig>, focusedPath?: readonly string[]): void;
