// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { parseMessagePath } from "@lichtblick/message-path";
import { simpleGetMessagePathDataItems } from "@lichtblick/suite-base/components/MessagePathSyntax/simpleGetMessagePathDataItems";
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import GlobalVariableBuilder from "@lichtblick/suite-base/testing/builders/GlobalVariableBuilder";
import MessageEventBuilder from "@lichtblick/suite-base/testing/builders/MessageEventBuilder";
import { stateReducer, getSingleDataItem } from "./gaugeAndIndicatorStateReducer";
jest.mock("@lichtblick/message-path", () => ({
    parseMessagePath: jest.fn(),
}));
jest.mock("@lichtblick/suite-base/components/MessagePathSyntax/simpleGetMessagePathDataItems", () => ({
    simpleGetMessagePathDataItems: jest.fn(),
}));
describe("getSingleDataItem", () => {
    it("should return the single item when the array has one element", () => {
        const items = BasicBuilder.numbers(1);
        const result = getSingleDataItem(items);
        expect(result).toBe(items[0]);
    });
    it("should throw an error when the array has multiple elements", () => {
        const items = BasicBuilder.numbers();
        expect(() => getSingleDataItem(items)).toThrow("Message path produced multiple results");
    });
    it("should return undefined when the array is empty", () => {
        const items = [];
        const result = getSingleDataItem(items);
        expect(result).toBeUndefined();
    });
});
describe("stateReducer", () => {
    function buildFrameAction({ messages } = {}) {
        return {
            type: "frame",
            messages: messages ?? MessageEventBuilder.messageEvents(),
        };
    }
    function buildPathAction() {
        return {
            type: "path",
            path: BasicBuilder.string(),
        };
    }
    function buildSeekAction() {
        return {
            type: "seek",
        };
    }
    function buildMessagePath(messagePath = {}) {
        return {
            messagePath: [],
            modifier: undefined,
            topicName: BasicBuilder.string(),
            topicNameRepr: "",
            ...messagePath,
        };
    }
    function setup({ stateOverride, actionOverride, } = {}) {
        const state = {
            error: undefined,
            globalVariables: undefined,
            latestMatchingQueriedData: undefined,
            latestMessage: undefined,
            parsedPath: buildMessagePath(),
            path: "",
            pathParseError: undefined,
            ...stateOverride,
        };
        const action = actionOverride ?? buildFrameAction();
        return {
            state,
            action,
        };
    }
    it("should return the state when throw an error", () => {
        const { state } = setup();
        const { pathParseError, error, latestMatchingQueriedData, latestMessage, parsedPath, path } = stateReducer(state, undefined);
        expect(error).not.toBeUndefined();
        expect(latestMatchingQueriedData).toBeUndefined();
        expect(latestMessage).toEqual(state.latestMessage);
        expect(parsedPath).toEqual(state.parsedPath);
        expect(path).toEqual(state.path);
        expect(pathParseError).toEqual(state.pathParseError);
    });
    describe("stateReducer when frame action", () => {
        it("should handle latestMessage and latestMatchingQueriedData", () => {
            const topicName = BasicBuilder.string();
            const { action, state } = setup({
                stateOverride: {
                    parsedPath: buildMessagePath({
                        topicName,
                    }),
                },
                actionOverride: buildFrameAction({
                    messages: [MessageEventBuilder.messageEvent({ topic: topicName })],
                }),
            });
            const frameAction = action;
            simpleGetMessagePathDataItems.mockReturnValue(frameAction.messages);
            const newState = stateReducer(state, action);
            expect(newState.latestMessage).toEqual(frameAction.messages[0]);
            expect(newState.latestMatchingQueriedData).toEqual(frameAction.messages[0]);
        });
        it("should handle latestMessage and latestMatchingQueriedData when single data is undefined", () => {
            const topicName = BasicBuilder.string();
            const { action, state } = setup({
                stateOverride: {
                    parsedPath: buildMessagePath({
                        topicName,
                    }),
                    latestMessage: MessageEventBuilder.messageEvent(),
                    latestMatchingQueriedData: BasicBuilder.strings(),
                },
                actionOverride: buildFrameAction({
                    messages: [MessageEventBuilder.messageEvent({ topic: topicName })],
                }),
            });
            simpleGetMessagePathDataItems.mockReturnValue([]);
            const newState = stateReducer(state, action);
            expect(newState.latestMessage).toEqual(state.latestMessage);
            expect(newState.latestMatchingQueriedData).toEqual(state.latestMatchingQueriedData);
        });
        it("should handle latestMessage and latestMatchingQueriedData when topic is not found", () => {
            const { action, state } = setup();
            simpleGetMessagePathDataItems.mockReturnValue([]);
            const newState = stateReducer(state, action);
            expect(newState).toEqual(state);
        });
        it("should handle latestMessage and latestMatchingQueriedData when parsedPath is undefined", () => {
            const { action, state } = setup({
                stateOverride: {
                    parsedPath: undefined,
                },
            });
            const newState = stateReducer(state, action);
            expect(newState).toEqual(state);
        });
        it("should handle latestMessage when pathParseError is not undefined", () => {
            const { action, state } = setup({
                stateOverride: {
                    pathParseError: BasicBuilder.string(),
                },
            });
            const frameAction = action;
            const newState = stateReducer(state, action);
            expect(newState.latestMessage).toEqual(frameAction.messages[frameAction.messages.length - 1]);
        });
    });
    describe("stateReducer when path action", () => {
        it("should parse the path and update state accordingly", () => {
            const { action, state } = setup({
                actionOverride: buildPathAction(),
            });
            const pathAction = action;
            const newPath = {
                messagePath: [],
                topicName: pathAction.path,
                topicNameRepr: pathAction.path,
            };
            parseMessagePath.mockReturnValue(newPath);
            const newState = stateReducer(state, action);
            expect(parseMessagePath).toHaveBeenCalledWith(pathAction.path);
            expect(newState.path).toBe(pathAction.path);
            expect(newState.parsedPath).toMatchObject(newPath);
            expect(newState.error).toBeUndefined();
            expect(newState.pathParseError).toBeUndefined();
            expect(newState.latestMatchingQueriedData).toBeUndefined();
        });
        it("should parse the path and update latestMatchingQueriedData", () => {
            const { action, state } = setup({
                actionOverride: buildPathAction(),
                stateOverride: {
                    latestMessage: MessageEventBuilder.messageEvent(),
                },
            });
            const pathAction = action;
            const newPath = {
                messagePath: [{ type: "filter", value: BasicBuilder.number() }],
                topicName: "",
                topicNameRepr: "",
            };
            const expectedLatestMessage = MessageEventBuilder.messageEvent();
            parseMessagePath.mockReturnValue(newPath);
            simpleGetMessagePathDataItems.mockReturnValue([expectedLatestMessage]);
            const newState = stateReducer(state, action);
            expect(parseMessagePath).toHaveBeenCalledWith(pathAction.path);
            expect(simpleGetMessagePathDataItems).toHaveBeenCalledWith(state.latestMessage, newPath);
            expect(newState.path).toBe(pathAction.path);
            expect(newState.parsedPath).toMatchObject(newPath);
            expect(newState.error).toBeUndefined();
            expect(newState.pathParseError).toBeUndefined();
            expect(newState.latestMatchingQueriedData).toBe(expectedLatestMessage);
        });
    });
    describe("stateReducer when seek action", () => {
        it("should reset latestMessage and latestMatchingQueriedData", () => {
            const { action, state } = setup({
                actionOverride: buildSeekAction(),
            });
            const newState = stateReducer(state, action);
            expect(newState).toEqual(state);
            expect(newState.latestMessage).toBeUndefined();
            expect(newState.latestMatchingQueriedData).toBeUndefined();
            expect(newState.error).toBeUndefined();
        });
    });
    describe("stateReducer when updateGlobalVariables action", () => {
        it("should update globalVariables in the state", () => {
            const initialGlobalVariables = GlobalVariableBuilder.globalVariables();
            const newGlobalVariables = GlobalVariableBuilder.globalVariables();
            const { action, state } = setup({
                actionOverride: {
                    type: "updateGlobalVariables",
                    globalVariables: newGlobalVariables,
                },
                stateOverride: {
                    globalVariables: initialGlobalVariables,
                },
            });
            const newState = stateReducer(state, action);
            expect(newState.globalVariables).toEqual(newGlobalVariables);
            expect(newState.error).toBe(state.error);
            expect(newState.latestMatchingQueriedData).toBe(state.latestMatchingQueriedData);
            expect(newState.latestMessage).toBe(state.latestMessage);
            expect(newState.parsedPath).toBe(state.parsedPath);
            expect(newState.path).toBe(state.path);
            expect(newState.pathParseError).toBe(state.pathParseError);
        });
    });
});
