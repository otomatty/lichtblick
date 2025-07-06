// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import * as _ from "lodash-es";
import { getTopicToSchemaNameMap } from "@lichtblick/suite-base/components/MessagePipeline/selectors";
import { maybeCast } from "@lichtblick/suite-base/util/maybeCast";
export const buildSettingsTree = ({ config, extensionSettings, messagePipelineState, panelType, selectedPanelId, settingsTrees, }) => {
    if (selectedPanelId == undefined || panelType == undefined) {
        return undefined;
    }
    const set = settingsTrees[selectedPanelId];
    if (!set) {
        return undefined;
    }
    const topicToSchemaNameMap = getTopicToSchemaNameMap(messagePipelineState());
    const topics = Object.keys(set.nodes.topics?.children ?? {});
    const topicsConfig = maybeCast(config)?.topics;
    const topicsSettings = topics.reduce((acc, topic) => {
        const schemaName = topicToSchemaNameMap[topic];
        if (schemaName != undefined) {
            acc[topic] = extensionSettings[panelType]?.[schemaName]?.settings(topicsConfig?.[topic]);
        }
        return acc;
    }, {});
    return {
        ...set,
        nodes: {
            ...set.nodes,
            topics: {
                ...set.nodes.topics,
                children: _.merge({}, set.nodes.topics?.children, topicsSettings),
            },
        },
    };
};
