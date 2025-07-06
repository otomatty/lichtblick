// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
export function openSiblingStateTransitionsPanel(openSiblingPanel, topicName) {
    openSiblingPanel({
        panelType: "StateTransitions",
        updateIfExists: true,
        siblingConfigCreator: (config) => {
            const existingPath = config.paths.find((path) => path.value === topicName);
            if (existingPath) {
                return config;
            }
            return {
                ...config,
                paths: [
                    ...config.paths,
                    { value: topicName, timestampMethod: "receiveTime" },
                ],
            };
        },
    });
}
