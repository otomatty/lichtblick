import EventEmitter from "eventemitter3";
import { Immutable } from "@lichtblick/suite";
import { Bounds1D } from "@lichtblick/suite-base/components/TimeBasedChart/types";
import { GlobalVariables } from "@lichtblick/suite-base/hooks/useGlobalVariables";
import { PlayerState } from "@lichtblick/suite-base/players/types";
import { OffscreenCanvasRenderer } from "./OffscreenCanvasRenderer";
import { CsvDataset, IDatasetsBuilder } from "./builders/IDatasetsBuilder";
import { InteractionEvent, Scale } from "./types";
import { PlotConfig } from "./utils/config";
type PlotCoordinatorEventTypes = {
    timeseriesBounds(bounds: Immutable<Bounds1D>): void;
    /** X scale changed. */
    xScaleChanged(scale: Scale | undefined): void;
    /** Current values changed (for displaying in the legend) */
    currentValuesChanged(values: readonly unknown[]): void;
    /** Paths with mismatched data lengths were detected */
    pathsWithMismatchedDataLengthsChanged(pathsWithMismatchedDataLengths: string[]): void;
    /** Rendering updated the viewport. `canReset` is true if the viewport can be reset. */
    viewportChange(canReset: boolean): void;
};
/**
 * PlotCoordinator interfaces commands and updates between the dataset builder and the chart
 * renderer.
 */
export declare class PlotCoordinator extends EventEmitter<PlotCoordinatorEventTypes> {
    private renderer;
    private datasetsBuilder;
    private shouldSync;
    private configBounds;
    private globalBounds?;
    private datasetRange?;
    private followRange?;
    private interactionBounds?;
    private lastSeekTime;
    /** Normalized series from latest config */
    private series;
    /** Current value for each series to show in the legend */
    private currentValuesByConfigIndex;
    /** Flag indicating that new Y bounds should be sent to the renderer because the bounds have been reset */
    private shouldResetY;
    private updateAction;
    private isTimeseriesPlot;
    private currentSeconds?;
    private viewport;
    private latestXScale?;
    private queueDispatchRender;
    private queueDispatchDownsample;
    private queueDatasetsRender;
    private queueBlocks;
    private destroyed;
    private latestBlocks?;
    constructor(renderer: OffscreenCanvasRenderer, builder: IDatasetsBuilder);
    /** Stop the coordinator from sending any future updates to the renderer. */
    destroy(): void;
    setShouldSync({ shouldSync }: {
        shouldSync: boolean;
    }): void;
    handlePlayerState(state: Immutable<PlayerState>): void;
    handleConfig(config: Immutable<PlotConfig>, colorScheme: "light" | "dark", globalVariables: GlobalVariables): void;
    setGlobalBounds(bounds: Immutable<Bounds1D> | undefined): void;
    setZoomMode(mode: "x" | "xy" | "y"): void;
    resetBounds(): void;
    setSize(size: {
        width: number;
        height: number;
    }): void;
    addInteractionEvent(ev: InteractionEvent): void;
    /** Get the plot x value at the canvas pixel x location */
    getXValueAtPixel(pixelX: number): number;
    /** Get the entire data for all series */
    getCsvData(): Promise<CsvDataset[]>;
    /**
     * Return true if the plot viewport has deviated from the config or dataset bounds and can reset
     */
    private canReset;
    /**
     * Get the xBounds if we cleared the interaction and global bounds (i.e) reset
     * back to the config or dataset bounds
     */
    private getXResetBounds;
    private getXBounds;
    private isDestroyed;
    private dispatchRender;
    /** Dispatch getting the latest downsampled datasets and then queue rendering them */
    private dispatchDownsample;
    /** Render the provided datasets */
    private dispatchDatasetsRender;
    private dispatchBlocks;
}
export {};
