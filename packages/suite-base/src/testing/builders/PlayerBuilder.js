// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { PLAYER_CAPABILITIES } from "@lichtblick/suite-base/players/constants";
import { PlayerPresence, } from "@lichtblick/suite-base/players/types";
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import MessageEventBuilder from "@lichtblick/suite-base/testing/builders/MessageEventBuilder";
import RosDatatypesBuilder from "@lichtblick/suite-base/testing/builders/RosDatatypesBuilder";
import RosTimeBuilder from "@lichtblick/suite-base/testing/builders/RosTimeBuilder";
import { defaults } from "@lichtblick/suite-base/testing/builders/utilities";
class PlayerBuilder {
    static subscribePayload(props = {}) {
        return defaults(props, {
            fields: BasicBuilder.strings(),
            preloadType: BasicBuilder.sample(["full", "partial"]),
            topic: BasicBuilder.string(),
        });
    }
    static topicSelection(props = {}) {
        return defaults(props, BasicBuilder.genericMap(PlayerBuilder.subscribePayload));
    }
    static messageBlock(props = {}) {
        return defaults(props, {
            messagesByTopic: BasicBuilder.genericDictionary(MessageEventBuilder.messageEvents),
            needTopics: PlayerBuilder.topicSelection(),
            sizeInBytes: BasicBuilder.number(),
        });
    }
    static messageBlocks(count = 3) {
        return BasicBuilder.multiple(PlayerBuilder.messageBlock, count);
    }
    static blockCache(props = {}) {
        return defaults(props, {
            blocks: PlayerBuilder.messageBlocks(),
            startTime: RosTimeBuilder.time(),
        });
    }
    static range(props = {}) {
        return defaults(props, {
            end: BasicBuilder.number(),
            start: BasicBuilder.number(),
        });
    }
    static ranges(count = 3) {
        return BasicBuilder.multiple(PlayerBuilder.range, count);
    }
    static progress(props = {}) {
        return defaults(props, {
            fullyLoadedFractionRanges: PlayerBuilder.ranges(),
            memoryInfo: BasicBuilder.genericDictionary(BasicBuilder.number),
            messageCache: PlayerBuilder.blockCache(),
        });
    }
    static topic(props = {}) {
        return defaults(props, {
            aliasedFromName: BasicBuilder.string(),
            name: `/${BasicBuilder.string()}/${BasicBuilder.string()}`,
            schemaName: BasicBuilder.string(),
        });
    }
    static topics(count = 3) {
        return BasicBuilder.multiple(PlayerBuilder.topic, count);
    }
    static topicStats(props = {}) {
        return defaults(props, {
            firstMessageTime: RosTimeBuilder.time(),
            lastMessageTime: RosTimeBuilder.time(),
            numMessages: BasicBuilder.number(),
        });
    }
    static activeData(props = {}) {
        return defaults(props, {
            currentTime: RosTimeBuilder.time(),
            datatypes: BasicBuilder.genericMap(RosDatatypesBuilder.optionalMessageDefinition),
            endTime: RosTimeBuilder.time(),
            isPlaying: BasicBuilder.boolean(),
            lastSeekTime: BasicBuilder.number(),
            messages: MessageEventBuilder.messageEvents(),
            speed: BasicBuilder.number(),
            startTime: RosTimeBuilder.time(),
            topics: PlayerBuilder.topics(),
            topicStats: BasicBuilder.genericMap(PlayerBuilder.topicStats),
            totalBytesReceived: BasicBuilder.number(),
        });
    }
    static playerState(props = {}) {
        return defaults(props, {
            capabilities: BasicBuilder.sample(PLAYER_CAPABILITIES, 3),
            name: BasicBuilder.string(),
            playerId: BasicBuilder.string(),
            presence: BasicBuilder.sample(PlayerPresence),
            profile: BasicBuilder.string(),
            progress: PlayerBuilder.progress(),
        });
    }
}
export default PlayerBuilder;
