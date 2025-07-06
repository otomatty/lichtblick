// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import formatMessages from "@lichtblick/suite-base/panels/Log/formatMessages";
import { formatTime } from "@lichtblick/suite-base/util/formatTime";
describe("formatMessages", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should format a log message correctly", () => {
        const stamp = {
            sec: 1672531200,
            nsec: 0,
        };
        const item = {
            level: 2,
            stamp,
            name: "TestLogger",
            message: "This is a test message",
        };
        const formattedTime = formatTime(stamp);
        const formatted = formatMessages([item]);
        expect(formatted).toEqual([`[INFO] [${formattedTime}] [${item.name}] ${item.message}`]);
    });
    it("should format a log message without name attribute", () => {
        const stamp = {
            sec: 1672531200,
            nsec: 0,
        };
        const item = {
            level: 4,
            stamp,
            name: "",
            message: "This is a test message with no name",
        };
        const formattedTime = formatTime(stamp);
        const formatted = formatMessages([item]);
        expect(formatted).toEqual([`[ERROR] [${formattedTime}] [] ${item.message}`]);
    });
});
