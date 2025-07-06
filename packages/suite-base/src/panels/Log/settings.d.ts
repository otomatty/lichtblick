import { TFunction } from "i18next";
import { SettingsTreeNodes } from "@lichtblick/suite";
import { Topic } from "@lichtblick/suite-base/players/types";
export declare function buildSettingsTree(topicToRender: string, minLogLevel: number, nameFilter: Record<string, {
    visible?: boolean;
}>, availableTopics: Topic[], availableNames: string[], t: TFunction<"log">): SettingsTreeNodes;
