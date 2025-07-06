// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import MessageEventBuilder from "@lichtblick/suite-base/testing/builders/MessageEventBuilder";
import { datasetContainsArray, stateTransitionPathDisplayName } from "./shared";
describe("stateTransitionPathDisplayName", () => {
    function buildStateTransitionPath(overrideProps = {}) {
        return {
            timestampMethod: BasicBuilder.sample(["receiveTime", "headerStamp"]),
            value: BasicBuilder.string(),
            enabled: true,
            label: BasicBuilder.string(),
            ...overrideProps,
        };
    }
    it("should return the path label if it is defined", () => {
        const path = buildStateTransitionPath();
        expect(stateTransitionPathDisplayName(path, 0)).toEqual(path.label);
    });
    it("should return the path value if label is empty", () => {
        const path = buildStateTransitionPath({
            label: "",
        });
        expect(stateTransitionPathDisplayName(path, 0)).toEqual(path.value);
    });
    it("should return the path value if label is undefined", () => {
        const path = buildStateTransitionPath({
            label: undefined,
        });
        expect(stateTransitionPathDisplayName(path, 0)).toEqual(path.value);
    });
    it("should return the fallback display name if neither label or value are empty", () => {
        const path = buildStateTransitionPath({
            label: "",
            value: "",
        });
        expect(stateTransitionPathDisplayName(path, 0)).toEqual("Series 1");
        expect(stateTransitionPathDisplayName(path, 1)).toEqual("Series 2");
        expect(stateTransitionPathDisplayName(path, 42)).toEqual("Series 43");
    });
});
describe("datasetContainsArray", () => {
    const createMessageAndData = (queriedDataLength) => ({
        messageEvent: MessageEventBuilder.messageEvent(), // Mock the MessageEvent
        queriedData: new Array(queriedDataLength).fill({}), // Create an array of the specified length
    });
    it("should return false for an empty dataset", () => {
        const dataset = [];
        expect(datasetContainsArray(dataset)).toBe(false);
    });
    it("should return false when all elements are undefined", () => {
        const dataset = [undefined, undefined];
        expect(datasetContainsArray(dataset)).toBe(false);
    });
    it("should return false when the dataset contains mixed undefined and empty arrays", () => {
        const dataset = [undefined, []];
        expect(datasetContainsArray(dataset)).toBe(false);
    });
    it("should return false for a single MessageAndData[] element with queriedData of length 1", () => {
        const dataset = [[createMessageAndData(1)]];
        expect(datasetContainsArray(dataset)).toBe(false);
    });
    it("should return true for a single MessageAndData[] element with queriedData of length greater than 1", () => {
        const dataset = [[createMessageAndData(2)]];
        expect(datasetContainsArray(dataset)).toBe(true);
    });
    it("should return true for multiple MessageAndData[] elements with consistent queriedData lengths greater than 1", () => {
        const dataset = [[createMessageAndData(2)], [createMessageAndData(2)]];
        expect(datasetContainsArray(dataset)).toBe(true);
    });
    it("should return false for multiple MessageAndData[] elements with mixed queriedData lengths, including lengths less than or equal to 1", () => {
        const dataset = [[createMessageAndData(2)], [createMessageAndData(1)]];
        expect(datasetContainsArray(dataset)).toBe(false);
    });
});
