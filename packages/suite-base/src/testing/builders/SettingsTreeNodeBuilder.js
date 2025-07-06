// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { SETTINGS_ICONS, } from "@lichtblick/suite";
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import { defaults } from "@lichtblick/suite-base/testing/builders/utilities";
export default class SettingsTreeNodeBuilder {
    static nodeAction(props = {}) {
        return defaults(props, {
            id: BasicBuilder.string(),
            label: BasicBuilder.string(),
            type: "action",
            display: BasicBuilder.sample(["menu", "inline"]),
            icon: BasicBuilder.sample(SETTINGS_ICONS),
        });
    }
    static nodeActions(count = 3) {
        return BasicBuilder.multiple(SettingsTreeNodeBuilder.nodeAction, count);
    }
    static nodeDivider(props = {}) {
        return defaults(props, {
            type: "divider",
        });
    }
    static settingsTreeNode(props = {}) {
        return defaults(props, {
            actions: SettingsTreeNodeBuilder.nodeActions(),
            children: BasicBuilder.genericDictionary(SettingsTreeNodeBuilder.settingsTreeNodeNoChildren),
            defaultExpansionState: BasicBuilder.sample(["collapsed", "expanded"]),
            enableVisibilityFilter: BasicBuilder.boolean(),
            error: undefined,
            fields: undefined,
            icon: BasicBuilder.sample(SETTINGS_ICONS),
            label: BasicBuilder.string(),
            order: undefined,
            renamable: BasicBuilder.boolean(),
            visible: BasicBuilder.boolean(),
        });
    }
    static settingsTreeNodeNoChildren(props = {}) {
        return defaults(props, {
            ...SettingsTreeNodeBuilder.settingsTreeNode(),
            children: undefined,
        });
    }
}
