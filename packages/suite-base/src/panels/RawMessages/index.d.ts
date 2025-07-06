/// <reference types="react" />
import { Immutable } from "@lichtblick/suite";
import { MessagePathDataItem } from "@lichtblick/suite-base/components/MessagePathSyntax/useCachedGetMessagePathDataItems";
import { SaveConfig } from "@lichtblick/suite-base/types/panels";
import { RawMessagesPanelConfig } from "./types";
type Props = {
    config: Immutable<RawMessagesPanelConfig>;
    saveConfig: SaveConfig<RawMessagesPanelConfig>;
};
export declare const getSingleValue: (data: unknown, queriedData: MessagePathDataItem[]) => unknown;
declare const _default: import("react").ComponentType<{
    childId?: string | undefined;
    overrideConfig?: RawMessagesPanelConfig | undefined;
    tabId?: string | undefined;
} & Omit<Props, "config" | "saveConfig">> & import("@lichtblick/suite-base/components/Panel").PanelStatics<RawMessagesPanelConfig>;
export default _default;
