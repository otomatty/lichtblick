/// <reference types="react" />
import { Immutable } from "@lichtblick/suite";
import { SaveConfig } from "@lichtblick/suite-base/types/panels";
import type { PlotCoordinator } from "./PlotCoordinator";
import { PlotPath, PlotConfig } from "./utils/config";
type Props = Immutable<{
    coordinator: PlotCoordinator | undefined;
    legendDisplay: "floating" | "top" | "left";
    onClickPath: (index: number) => void;
    paths: PlotPath[];
    saveConfig: SaveConfig<PlotConfig>;
    showLegend: boolean;
    sidebarDimension: number;
    showValues: boolean;
    hoveredValuesBySeriesIndex?: string[];
}>;
declare function PlotLegendComponent(props: Props): React.JSX.Element;
export declare const PlotLegend: import("react").MemoExoticComponent<typeof PlotLegendComponent>;
export {};
