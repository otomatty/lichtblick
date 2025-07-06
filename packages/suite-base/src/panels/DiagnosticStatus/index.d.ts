/// <reference types="react" />
declare const _default: import("react").ComponentType<{
    childId?: string | undefined;
    overrideConfig?: import("./types").DiagnosticStatusConfig | undefined;
    tabId?: string | undefined;
} & Omit<import("./types").DiagnosticStatusPanelProps, "config" | "saveConfig">> & import("@lichtblick/suite-base/components/Panel").PanelStatics<import("./types").DiagnosticStatusConfig>;
export default _default;
