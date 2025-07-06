import { Datum, HoverElement } from "@lichtblick/suite-base/panels/Plot/types";
import { BasePlotPath, PlotConfig, PlotPath } from "@lichtblick/suite-base/panels/Plot/utils/config";
export default class PlotBuilder {
    static datum(props?: Partial<Datum>): Datum;
    static hoverElement(props?: Partial<HoverElement>): HoverElement;
    static hoverElements(count?: number): HoverElement[];
    static path(props?: Partial<PlotPath>): PlotPath;
    static paths(count?: number): PlotPath[];
    static basePlotPath(props?: Partial<BasePlotPath>): BasePlotPath;
    static config(props?: Partial<PlotConfig>): PlotConfig;
}
