// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { DEFAULT_SETTINGS_TREE_NODE } from "@lichtblick/suite-base/panels/DiagnosticSummary/constants";
export function buildSettingsTree({ availableTopics, config, topicToRender, }) {
    const topicOptions = availableTopics.map((topic) => ({ label: topic, value: topic }));
    const topicIsAvailable = availableTopics.includes(topicToRender);
    if (!topicIsAvailable) {
        topicOptions.unshift({ value: topicToRender, label: topicToRender });
    }
    const topicError = topicIsAvailable ? undefined : `Topic ${topicToRender} is not available`;
    return {
        general: {
            ...DEFAULT_SETTINGS_TREE_NODE.general,
            fields: {
                topicToRender: {
                    ...DEFAULT_SETTINGS_TREE_NODE.general?.fields?.topicToRender,
                    value: topicToRender,
                    error: topicError,
                    options: topicOptions,
                },
                sortByLevel: {
                    ...DEFAULT_SETTINGS_TREE_NODE.general?.fields?.sortByLevel,
                    value: config.sortByLevel,
                },
                secondsUntilStale: {
                    ...DEFAULT_SETTINGS_TREE_NODE.general?.fields?.secondsUntilStale,
                    value: config.secondsUntilStale,
                },
            },
        },
    };
}
