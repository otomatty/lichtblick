/// <reference types="react" />
import { Immutable } from "@lichtblick/suite";
import { PlotPath } from "./utils/config";
type PlotLegendRowProps = Immutable<{
    hasMismatchedDataLength: boolean;
    index: number;
    onClickPath: () => void;
    path: PlotPath;
    paths: PlotPath[];
    value?: unknown;
    valueSource: "hover" | "current";
    savePaths: (paths: PlotPath[]) => void;
}>;
export declare const ROW_HEIGHT = 30;
export declare function PlotLegendRow({ hasMismatchedDataLength, index, onClickPath, path, paths, savePaths, value, valueSource, }: PlotLegendRowProps): React.JSX.Element;
export {};
