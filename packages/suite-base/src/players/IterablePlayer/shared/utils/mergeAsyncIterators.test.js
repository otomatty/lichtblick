// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import MessageEventBuilder from "@lichtblick/suite-base/testing/builders/MessageEventBuilder";
import { mergeAsyncIterators } from "./mergeAsyncIterators";
async function* asyncGenerator(items) {
    for (const item of items) {
        yield item;
    }
}
const createMsgStamp = (overwriteSec) => {
    return {
        type: "stamp",
        stamp: {
            sec: overwriteSec ?? BasicBuilder.number(),
            nsec: BasicBuilder.number(),
        },
    };
};
describe("mergeAsyncIterators", () => {
    it("should merge multiple async iterators in order", async () => {
        const resultStamps = [1, 2, 3, 4].map((sec) => createMsgStamp(sec));
        const iterator1 = asyncGenerator([resultStamps[0], resultStamps[2]]);
        const iterator2 = asyncGenerator([resultStamps[1], resultStamps[3]]);
        const mergedIterator = mergeAsyncIterators([iterator1, iterator2]);
        const results = [];
        for await (const result of mergedIterator) {
            results.push(result);
        }
        expect(results).toEqual(resultStamps);
    });
    it("should handle empty iterators", async () => {
        const msgStamp = createMsgStamp(2);
        const iterator1 = asyncGenerator([]);
        const iterator2 = asyncGenerator([msgStamp]);
        const mergedIterator = mergeAsyncIterators([iterator1, iterator2]);
        const results = [];
        for await (const result of mergedIterator) {
            results.push(result);
        }
        expect(results).toEqual([msgStamp]);
    });
    it("should handle iterators with different types", async () => {
        const resultMessage = {
            type: "message-event",
            msgEvent: MessageEventBuilder.messageEvent({
                receiveTime: { sec: 1, nsec: 0 },
            }),
        };
        const resultStamp = createMsgStamp(2);
        const iterator1 = asyncGenerator([resultMessage]);
        const iterator2 = asyncGenerator([resultStamp]);
        const mergedIterator = mergeAsyncIterators([iterator1, iterator2]);
        const results = [];
        for await (const result of mergedIterator) {
            results.push(result);
        }
        expect(results).toEqual([resultMessage, resultStamp]);
    });
    it("should handle iterators with different types and empty iterators", async () => {
        const resultStamp = createMsgStamp();
        const iterator1 = asyncGenerator([]);
        const iterator2 = asyncGenerator([resultStamp]);
        const mergedIterator = mergeAsyncIterators([iterator1, iterator2]);
        const results = [];
        for await (const result of mergedIterator) {
            results.push(result);
        }
        expect(results).toEqual([resultStamp]);
    });
    it("should sort results even with different types", async () => {
        const resultMessage = {
            type: "message-event",
            msgEvent: MessageEventBuilder.messageEvent({
                receiveTime: { sec: 2, nsec: 0 },
            }),
        };
        const resultStamp = createMsgStamp(1);
        const iterator1 = asyncGenerator([resultMessage]);
        const iterator2 = asyncGenerator([resultStamp]);
        const mergedIterator = mergeAsyncIterators([iterator1, iterator2]);
        const results = [];
        for await (const result of mergedIterator) {
            results.push(result);
        }
        expect(results).toEqual([resultStamp, resultMessage]);
    });
});
