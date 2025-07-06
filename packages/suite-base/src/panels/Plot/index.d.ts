/// <reference types="react" />
declare const _default: import("react").ComponentType<{
    childId?: string | undefined;
    overrideConfig?: import("./utils/config").PlotConfig | undefined;
    tabId?: string | undefined;
} & Omit<import("./types").PlotProps, "config" | "saveConfig">> & import("@lichtblick/suite-base/components/Panel").PanelStatics<import("./utils/config").PlotConfig>;
export default _default;
