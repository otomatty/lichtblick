import { Time } from "@lichtblick/rostime";
import { Immutable } from "@lichtblick/suite";
import { MessagePathDataItem } from "@lichtblick/suite-base/components/MessagePathSyntax/useCachedGetMessagePathDataItems";
import { MessageEvent } from "@lichtblick/suite-base/players/types";
import { PANEL_TITLE_CONFIG_KEY } from "@lichtblick/suite-base/util/layout";
import { TimestampMethod } from "@lichtblick/suite-base/util/time";
export type Messages = Record<string, MessageEvent[]>;
export type BasePlotPath = {
    value: string;
    enabled: boolean;
};
export type PlotPath = BasePlotPath & {
    color?: string;
    label?: string;
    timestampMethod: TimestampMethod;
    showLine?: boolean;
    lineSize?: number;
};
export type PlotXAxisVal = "timestamp" | "index" | "custom" | "currentCustom";
export type PlotDataItem = {
    queriedData: MessagePathDataItem[];
    receiveTime: Time;
    headerStamp?: Time;
};
/**
 * A "reference line" plot path is a numeric value. It creates a horizontal line on the plot at the
 * specified value.
 * @returns true if the series config is a reference line
 */
export declare function isReferenceLinePlotPathType(path: Immutable<PlotPath>): boolean;
export declare function plotPathDisplayName(path: Readonly<PlotPath>, index: number): string;
type DeprecatedPlotConfig = {
    showSidebar?: boolean;
    sidebarWidth?: number;
};
export type PlotLegendDisplay = "floating" | "top" | "left" | "none";
export type PlotConfig = DeprecatedPlotConfig & {
    paths: PlotPath[];
    minXValue?: number;
    maxXValue?: number;
    minYValue?: string | number;
    maxYValue?: string | number;
    showLegend: boolean;
    legendDisplay: PlotLegendDisplay;
    showPlotValuesInLegend: boolean;
    showXAxisLabels: boolean;
    showYAxisLabels: boolean;
    isSynced: boolean;
    xAxisVal: PlotXAxisVal;
    xAxisPath?: BasePlotPath;
    followingViewWidth?: number;
    sidebarDimension: number;
    [PANEL_TITLE_CONFIG_KEY]?: string;
};
export {};
