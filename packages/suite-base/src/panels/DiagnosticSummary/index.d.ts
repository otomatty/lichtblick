/// <reference types="react" />
declare const _default: import("react").ComponentType<{
    childId?: string | undefined;
    overrideConfig?: import("./types").DiagnosticSummaryConfig | undefined;
    tabId?: string | undefined;
} & Omit<import("./types").DiagnosticSummaryProps, "config" | "saveConfig">> & import("@lichtblick/suite-base/components/Panel").PanelStatics<import("./types").DiagnosticSummaryConfig>;
export default _default;
