/// <reference types="react" />
import { TabPanelConfig as Config } from "@lichtblick/suite-base/types/layouts";
import { SaveConfig } from "@lichtblick/suite-base/types/panels";
type Props = {
    config: Config;
    saveConfig: SaveConfig<Config>;
};
declare const _default: import("react").ComponentType<{
    childId?: string | undefined;
    overrideConfig?: Config | undefined;
    tabId?: string | undefined;
} & Omit<Props, "config" | "saveConfig">> & import("@lichtblick/suite-base/components/Panel").PanelStatics<Config>;
export default _default;
