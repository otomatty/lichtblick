/// <reference types="react" />
import { SaveConfig } from "@lichtblick/suite-base/types/panels";
import { IndicatorConfig } from "./types";
type IndicatorPanelAdapterProps = {
    config: IndicatorConfig;
    saveConfig: SaveConfig<IndicatorConfig>;
};
declare const _default: import("react").ComponentType<{
    childId?: string | undefined;
    overrideConfig?: {} | undefined;
    tabId?: string | undefined;
} & Omit<IndicatorPanelAdapterProps, "config" | "saveConfig">> & import("@lichtblick/suite-base/components/Panel").PanelStatics<{}>;
export default _default;
