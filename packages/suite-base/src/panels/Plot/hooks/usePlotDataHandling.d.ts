import { GlobalVariables } from "@lichtblick/suite-base/hooks/useGlobalVariables";
import { UsePlotDataHandling } from "@lichtblick/suite-base/panels/Plot/types";
import { PlotConfig } from "@lichtblick/suite-base/panels/Plot/utils/config";
declare const usePlotDataHandling: (config: PlotConfig, globalVariables: GlobalVariables) => UsePlotDataHandling;
export default usePlotDataHandling;
