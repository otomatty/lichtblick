// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { compare } from "@lichtblick/rostime";
export const setStartTime = (accumulated, current) => {
    return compare(current, accumulated) < 0 ? current : accumulated;
};
export const setEndTime = (accumulated, current) => {
    return compare(current, accumulated) > 0 ? current : accumulated;
};
export const mergeMetadata = (accumulated, current) => {
    return [...(accumulated ?? []), ...(current ?? [])];
};
export const accumulateMap = (accumulated, current) => {
    return new Map([...accumulated, ...current]);
};
export const mergeTopicStats = (accumulated, current) => {
    for (const [topic, stats] of current) {
        if (!accumulated.has(topic)) {
            accumulated.set(topic, { numMessages: 0 });
        }
        const accStats = accumulated.get(topic);
        accStats.numMessages += stats.numMessages;
        // Keep the earliest firstMessageTime
        if (stats.firstMessageTime &&
            (!accStats.firstMessageTime || compare(stats.firstMessageTime, accStats.firstMessageTime) < 0)) {
            accStats.firstMessageTime = stats.firstMessageTime;
        }
        // Keep the latest lastMessageTime
        if (stats.lastMessageTime &&
            (!accStats.lastMessageTime || compare(stats.lastMessageTime, accStats.lastMessageTime) > 0)) {
            accStats.lastMessageTime = stats.lastMessageTime;
        }
    }
    return accumulated;
};
