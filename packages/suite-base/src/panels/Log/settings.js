// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { LogLevel } from "./types";
// Create the log level options nodes once since they don't change per render.
const LOG_LEVEL_OPTIONS = [
    { label: ">= DEBUG", value: LogLevel.DEBUG },
    { label: ">= INFO", value: LogLevel.INFO },
    { label: ">= WARN", value: LogLevel.WARN },
    { label: ">= ERROR", value: LogLevel.ERROR },
    { label: ">= FATAL", value: LogLevel.FATAL },
];
export function buildSettingsTree(topicToRender, minLogLevel, nameFilter, availableTopics, availableNames, t) {
    const topicOptions = availableTopics.map((topic) => ({ label: topic.name, value: topic.name }));
    const topicIsAvailable = availableTopics.some((topic) => topic.name === topicToRender);
    if (!topicIsAvailable) {
        topicOptions.unshift({ value: topicToRender, label: topicToRender });
    }
    const topicError = topicIsAvailable ? undefined : t("topicError", { topic: topicToRender });
    const nodeChildren = Object.fromEntries(availableNames.map((name) => [
        name,
        {
            label: name,
            visible: nameFilter[name]?.visible ?? true,
        },
    ]));
    return {
        general: {
            fields: {
                topicToRender: {
                    input: "select",
                    label: t("topic"),
                    value: topicToRender,
                    error: topicError,
                    options: topicOptions,
                },
                minLogLevel: {
                    input: "select",
                    label: t("minLogLevel"),
                    value: minLogLevel,
                    options: LOG_LEVEL_OPTIONS,
                },
            },
        },
        nameFilter: {
            enableVisibilityFilter: true,
            children: nodeChildren,
            label: t("nameFilter"),
            actions: [
                { id: "show-all", type: "action", label: t("showAll") },
                { id: "hide-all", type: "action", label: t("hideAll") },
            ],
        },
    };
}
