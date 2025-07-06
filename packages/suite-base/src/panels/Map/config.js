// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import * as _ from "lodash-es";
import { filterMap } from "@lichtblick/den/collection";
export function validateCustomUrl(url) {
    const placeholders = url.match(/\{.+?\}/g) ?? [];
    const validPlaceholders = ["{x}", "{y}", "{z}"];
    for (const placeholder of placeholders) {
        if (!validPlaceholders.includes(placeholder)) {
            return new Error(`Invalid placeholder ${placeholder}`);
        }
    }
    return undefined;
}
function isGeoJSONSchema(schemaName) {
    switch (schemaName) {
        case "foxglove_msgs/GeoJSON":
        case "foxglove_msgs/msg/GeoJSON":
        case "foxglove::GeoJSON":
        case "foxglove.GeoJSON":
            return true;
        default:
            return false;
    }
}
export function buildSettingsTree(config, eligibleTopics) {
    const topics = _.transform(eligibleTopics, (result, topic) => {
        const coloring = config.topicColors[topic.name];
        result[topic.name] = {
            label: topic.name,
            fields: {
                enabled: {
                    label: "Enabled",
                    input: "boolean",
                    value: !config.disabledTopics.includes(topic.name),
                },
                coloring: {
                    label: "Coloring",
                    input: "select",
                    value: coloring ? "Custom" : "Automatic",
                    options: [
                        { label: "Automatic", value: "Automatic" },
                        { label: "Custom", value: "Custom" },
                    ],
                },
                color: coloring
                    ? {
                        label: "Color",
                        input: "rgb",
                        value: coloring,
                    }
                    : undefined,
            },
        };
    }, {});
    const eligibleFollowTopicOptions = filterMap(eligibleTopics, (topic) => config.disabledTopics.includes(topic.name) || isGeoJSONSchema(topic.schemaName)
        ? undefined
        : { label: topic.name, value: topic.name });
    const followTopicOptions = [{ label: "Off", value: "" }, ...eligibleFollowTopicOptions];
    const generalSettings = {
        layer: {
            label: "Tile layer",
            input: "select",
            value: config.layer,
            options: [
                { label: "Map", value: "map" },
                { label: "Satellite", value: "satellite" },
                { label: "Custom", value: "custom" },
            ],
        },
    };
    // Only show the custom url input when the user selects the custom layer
    if (config.layer === "custom") {
        let error;
        if (config.customTileUrl.length > 0) {
            error = validateCustomUrl(config.customTileUrl)?.message;
        }
        generalSettings.customTileUrl = {
            label: "Custom map tile URL",
            input: "string",
            value: config.customTileUrl,
            error,
        };
        generalSettings.maxNativeZoom = {
            label: "Max tile level",
            input: "select",
            value: config.maxNativeZoom,
            options: [18, 19, 20, 21, 22, 23, 24].map((num) => {
                return { label: String(num), value: num };
            }),
            help: "Highest zoom supported by the custom map source. See https://leafletjs.com/examples/zoom-levels/ for more information.",
        };
    }
    generalSettings.followTopic = {
        label: "Follow topic",
        input: "select",
        value: config.followTopic,
        options: followTopicOptions,
    };
    const settings = {
        general: {
            label: "General",
            fields: generalSettings,
        },
        topics: {
            label: "Topics",
            children: topics,
        },
    };
    return settings;
}
