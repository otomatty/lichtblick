// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { isTabPanel, isTabPanelConfig } from "@lichtblick/suite-base/util/layout";
function replacePanelInLayout(layout, oldId, newId) {
    if (typeof layout === "string") {
        return layout === oldId ? newId : layout;
    }
    else {
        return {
            ...layout,
            first: replacePanelInLayout(layout.first, oldId, newId),
            second: replacePanelInLayout(layout.second, oldId, newId),
        };
    }
}
export function replacePanel(panelsState, oldId, newId, newConfig) {
    const newPanelsState = {
        ...panelsState,
        configById: { ...panelsState.configById, [newId]: newConfig },
    };
    delete newPanelsState.configById[oldId];
    if (newPanelsState.layout != undefined) {
        newPanelsState.layout = replacePanelInLayout(newPanelsState.layout, oldId, newId);
        const tabPanelIds = Object.keys(newPanelsState.configById).filter(isTabPanel);
        for (const tabId of tabPanelIds) {
            const tabConfig = newPanelsState.configById[tabId];
            if (isTabPanelConfig(tabConfig)) {
                newPanelsState.configById[tabId] = {
                    ...tabConfig,
                    tabs: tabConfig.tabs.map((tab) => ({
                        ...tab,
                        layout: tab.layout != undefined ? replacePanelInLayout(tab.layout, oldId, newId) : undefined,
                    })),
                };
            }
        }
    }
    return newPanelsState;
}
