// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { PlayerPresence, } from "@lichtblick/suite-base/players/types";
export function mockMessage(message, fields) {
    return {
        topic: "topic",
        schemaName: "schema",
        receiveTime: { sec: 0, nsec: 0 },
        message,
        sizeInBytes: 1,
        ...fields,
    };
}
export function mockPlayerState(overrides, dataOverrides) {
    return {
        activeData: {
            messages: [],
            currentTime: { sec: 0, nsec: 0 },
            endTime: { sec: 0, nsec: 0 },
            lastSeekTime: 1,
            topics: [],
            speed: 1,
            isPlaying: false,
            topicStats: new Map(),
            startTime: { sec: 0, nsec: 0 },
            datatypes: new Map(),
            totalBytesReceived: 0,
            ...dataOverrides,
        },
        capabilities: [],
        presence: PlayerPresence.PRESENT,
        profile: undefined,
        playerId: "1",
        progress: {
            fullyLoadedFractionRanges: [],
            messageCache: undefined,
        },
        ...overrides,
    };
}
