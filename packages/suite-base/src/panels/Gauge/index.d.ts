/// <reference types="react" />
import { GaugePanelAdapterProps } from "./types";
declare const _default: import("react").ComponentType<{
    childId?: string | undefined;
    overrideConfig?: {} | undefined;
    tabId?: string | undefined;
} & Omit<GaugePanelAdapterProps, "config" | "saveConfig">> & import("@lichtblick/suite-base/components/Panel").PanelStatics<{}>;
export default _default;
