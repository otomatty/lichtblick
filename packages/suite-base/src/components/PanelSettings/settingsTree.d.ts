import { Immutable, SettingsTree } from "@lichtblick/suite";
import { BuildSettingsTreeProps } from "@lichtblick/suite-base/components/PanelSettings/types";
export declare const buildSettingsTree: ({ config, extensionSettings, messagePipelineState, panelType, selectedPanelId, settingsTrees, }: BuildSettingsTreeProps) => Immutable<SettingsTree> | undefined;
