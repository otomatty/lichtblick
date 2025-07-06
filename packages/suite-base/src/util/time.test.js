// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import * as time from "./time";
describe("time.formatTimeRaw", () => {
    it("formats whole values correction", () => {
        expect(time.formatTimeRaw({ sec: 1, nsec: 0 })).toEqual("1.000000000");
    });
    it("formats partial nanos", () => {
        expect(time.formatTimeRaw({ sec: 102, nsec: 304 })).toEqual("102.000000304");
        expect(time.formatTimeRaw({ sec: 102, nsec: 99900000 })).toEqual("102.099900000");
    });
    it("formats max nanos", () => {
        expect(time.formatTimeRaw({ sec: 102, nsec: 999000000 })).toEqual("102.999000000");
    });
    it("does not format negative times", () => {
        expect(time.formatTimeRaw({ sec: -1, nsec: 0 })).toEqual("(invalid negative time)");
        expect(console.error).toHaveBeenCalled();
        console.error.mockClear();
    });
});
describe("time.getTimestampForMessageEvent", () => {
    it("uses headerStamp when available", () => {
        const messageBase = {
            topic: "/foo",
            receiveTime: { sec: 1000, nsec: 0 },
            sizeInBytes: 0,
            schemaName: "stamped",
        };
        expect(time.getTimestampForMessageEvent({
            ...messageBase,
            message: { header: { stamp: { sec: 123, nsec: 456 }, seq: 0, frame_id: "" } },
        }, "headerStamp")).toEqual({ sec: 123, nsec: 456 });
        expect(time.getTimestampForMessageEvent({
            ...messageBase,
            message: {
                header: { stamp: { sec: 0, nsec: 0 }, seq: 0, frame_id: "" },
            },
        }, "headerStamp")).toEqual({ sec: 0, nsec: 0 });
        expect(time.getTimestampForMessageEvent({ ...messageBase, message: {} }, "headerStamp")).toEqual(undefined);
        expect(time.getTimestampForMessageEvent({
            ...messageBase,
            message: { header: { stamp: 1694712977, seq: 0, frame_id: "" } },
        }, "headerStamp")).toEqual(undefined);
    });
});
