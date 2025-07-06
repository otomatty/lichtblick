import { SettingsTreeNodes } from "@lichtblick/suite";
import { DiagnosticSummaryConfig } from "@lichtblick/suite-base/panels/DiagnosticSummary/types";
export type BuildSettingsTreeProps = {
    config: DiagnosticSummaryConfig;
    topicToRender: string;
    availableTopics: readonly string[];
};
export declare function buildSettingsTree({ availableTopics, config, topicToRender, }: BuildSettingsTreeProps): SettingsTreeNodes;
