/// <reference types="react" />
import { StateTransitionConfig, StateTransitionPanelProps } from "./types";
declare const _default: import("react").ComponentType<{
    childId?: string | undefined;
    overrideConfig?: StateTransitionConfig | undefined;
    tabId?: string | undefined;
} & Omit<StateTransitionPanelProps, "config" | "saveConfig">> & import("@lichtblick/suite-base/components/Panel").PanelStatics<StateTransitionConfig>;
export default _default;
