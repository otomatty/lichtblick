// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import RosTimeBuilder from "@lichtblick/suite-base/testing/builders/RosTimeBuilder";
import { defaults } from "@lichtblick/suite-base/testing/builders/utilities";
export default class InitilizationSourceBuilder {
    static initialization(props = {}) {
        return defaults(props, {
            start: RosTimeBuilder.time(),
            end: RosTimeBuilder.time(),
            datatypes: new Map(),
            publishersByTopic: new Map(),
            topicStats: new Map(),
            alerts: [],
            topics: [],
            metadata: [],
            profile: BasicBuilder.string(),
        });
    }
    static metadata(props = {}) {
        return defaults(props, {
            name: BasicBuilder.string(),
            metadata: BasicBuilder.genericDictionary(String),
        });
    }
    static metadataList(count = 3) {
        return BasicBuilder.multiple(InitilizationSourceBuilder.metadata, count);
    }
}
