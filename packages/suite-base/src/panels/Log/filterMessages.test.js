// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import filterMessages from "./filterMessages";
import { LogLevel } from "./types";
describe("filter", () => {
    const ros1msgs = [
        {
            topic: "/some_topic",
            receiveTime: { sec: 123, nsec: 456 },
            schemaName: "rosgraph_msgs/Log",
            message: {
                msg: "Couldn't find int 83757.",
                level: 2,
                name: "/some_topic",
            },
        },
    ];
    const ros2msgs = [
        {
            topic: "/some_topic",
            receiveTime: { sec: 123, nsec: 456 },
            schemaName: "rcl_interfaces/msg/Log",
            message: {
                msg: "Couldn't find int 83757.",
                level: 30,
                name: "/some_topic",
            },
        },
    ];
    it("should remove when minLogLevel is higher than msg level", () => {
        expect(filterMessages(ros1msgs, {
            minLogLevel: 3,
            searchTerms: [],
            nameFilter: {},
        })).toEqual([]);
    });
    it("should filter when minLogLevel is same as msg level", () => {
        expect(filterMessages(ros1msgs, {
            minLogLevel: 2,
            searchTerms: [],
            nameFilter: {},
        })).toEqual(ros1msgs);
    });
    it("should map log levels by data source", () => {
        expect(filterMessages(ros2msgs, {
            minLogLevel: LogLevel.INFO,
            searchTerms: [],
            nameFilter: {},
        })).toEqual(ros2msgs);
        expect(filterMessages(ros2msgs, {
            minLogLevel: LogLevel.ERROR,
            searchTerms: [],
            nameFilter: {},
        })).toEqual([]);
    });
    describe("when minLogLevel lower than or equal to msg level", () => {
        const minLogLevel = 1;
        it("should keep when search term is empty", () => {
            expect(filterMessages(ros1msgs, {
                minLogLevel,
                searchTerms: ["/some_topic"],
                nameFilter: {},
            })).toEqual(ros1msgs);
        });
        it("should keep when msg name contains search terms", () => {
            expect(filterMessages(ros1msgs, {
                minLogLevel,
                searchTerms: ["some"],
                nameFilter: {},
            })).toEqual(ros1msgs);
        });
        it("should keep when msg contains search term", () => {
            expect(filterMessages(ros1msgs, {
                minLogLevel,
                searchTerms: ["int"],
                nameFilter: {},
            })).toEqual(ros1msgs);
        });
        it("should remove when msg name doesn't contain any search terms", () => {
            expect(filterMessages(ros1msgs, {
                minLogLevel,
                searchTerms: ["random"],
                nameFilter: {},
            })).toEqual([]);
        });
        it("should keep when minLogLevel equals msg level and msg contains search terms", () => {
            expect(filterMessages(ros1msgs, {
                minLogLevel: 2,
                searchTerms: ["int", "random"],
                nameFilter: {},
            })).toEqual(ros1msgs);
        });
        it("should exclude messages for names that are set to invisible", () => {
            expect(filterMessages(ros1msgs, {
                minLogLevel,
                searchTerms: [],
                nameFilter: { "/some_topic": { visible: false } },
            })).toEqual([]);
        });
        it("should include messages for names that are set to visible", () => {
            expect(filterMessages(ros1msgs, {
                minLogLevel,
                searchTerms: [],
                nameFilter: { "/some_topic": { visible: true } },
            })).toEqual(ros1msgs);
        });
    });
});
