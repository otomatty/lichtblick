import EventEmitter from "eventemitter3";
import { Immutable } from "@lichtblick/suite";
import { Bounds } from "@lichtblick/suite-base/types/Bounds";
import { ChartRendererProps, ChartType, Dataset, HoverElement, Scale, UpdateAction } from "./types";
export declare class ChartRenderer {
    #private;
    constructor(args: ChartRendererProps);
    update(action: Immutable<UpdateAction>): Bounds | undefined;
    getElementsAtPixel(pixel: {
        x: number;
        y: number;
    }): HoverElement[];
    updateDatasets(datasets: Dataset[]): Scale | undefined;
    /**
     * Exposed as protected for unit testing strictly private fields.
     * Developers are encouraged to avoid using these methods in production logic.
     */
    protected getChartInstance(): ChartType;
    /**
     * Exposed as protected for unit testing strictly private fields.
     * Developers are encouraged to avoid using these methods in production logic.
     */
    protected getFakeNodeEvents(): EventEmitter;
}
