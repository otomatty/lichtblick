import type { Theme } from "@mui/material";
import { Immutable } from "@lichtblick/suite";
import { Bounds } from "@lichtblick/suite-base/types/Bounds";
import { Dataset, HoverElement, Scale, UpdateAction } from "./types";
export declare class OffscreenCanvasRenderer {
    #private;
    constructor(canvas: OffscreenCanvas, theme: Theme);
    update(action: Immutable<UpdateAction>): Promise<Bounds | undefined>;
    getElementsAtPixel(pixel: {
        x: number;
        y: number;
    }): Promise<HoverElement[]>;
    updateDatasets(datasets: Dataset[]): Promise<Scale | undefined>;
}
