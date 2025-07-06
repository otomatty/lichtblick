// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import buildSampleMessage, { builtinSampleValues } from "./buildSampleMessage";
describe("buildSampleMessage", () => {
    const datatypes = new Map(Object.entries({
        A: { definitions: [] },
        B: { definitions: [{ name: "data", type: "A" }] },
        C: {
            definitions: [
                { name: "foo", type: "B", isConstant: true },
                { name: "bar", type: "B", isConstant: true, isArray: true },
            ],
        },
        D: { definitions: [{ name: "foo", type: "B", isArray: true }] },
        E: { definitions: [{ name: "foo", type: "B", isArray: true, arrayLength: 4 }] },
    }));
    it("handles empty types", () => {
        expect(buildSampleMessage(datatypes, "A")).toEqual({});
    });
    it("handles single field", () => {
        expect(buildSampleMessage(datatypes, "B")).toEqual({ data: {} });
    });
    it("ignores constants", () => {
        expect(buildSampleMessage(datatypes, "C")).toEqual({});
    });
    it("handles variable-length arrays", () => {
        expect(buildSampleMessage(datatypes, "D")).toEqual({ foo: [{ data: {} }] });
    });
    it("handles fixed-length arrays", () => {
        expect(buildSampleMessage(datatypes, "E")).toEqual({
            foo: [{ data: {} }, { data: {} }, { data: {} }, { data: {} }],
        });
    });
    it("handles builtin types", () => {
        for (const type in builtinSampleValues) {
            expect(buildSampleMessage(new Map(), type)).toEqual(builtinSampleValues[type]);
            expect(buildSampleMessage(new Map(Object.entries({ A: { definitions: [{ name: "data", type }] } })), "A")).toEqual({
                data: builtinSampleValues[type],
            });
        }
    });
});
