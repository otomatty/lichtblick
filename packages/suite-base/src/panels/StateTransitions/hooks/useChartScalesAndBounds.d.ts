import { ScaleOptions } from "chart.js";
import { OnRefChangeType } from "react-resize-detector/build/types/types";
import { StateTransitionConfig } from "@lichtblick/suite-base/panels/StateTransitions/types";
import { Bounds } from "@lichtblick/suite-base/types/Bounds";
type UseChartScalesAndBounds = {
    yScale: ScaleOptions<"linear">;
    xScale: ScaleOptions<"linear">;
    databounds: Bounds | undefined;
    width: number | undefined;
    sizeRef: OnRefChangeType<HTMLDivElement>;
};
declare const useChartScalesAndBounds: (minY: number | undefined, currentTimeSinceStart: number | undefined, endTimeSinceStart: number | undefined, config: StateTransitionConfig) => UseChartScalesAndBounds;
export default useChartScalesAndBounds;
