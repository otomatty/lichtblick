/** @jest-environment jsdom */
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { renderHook } from "@testing-library/react";
import { parseMessagePath } from "@lichtblick/message-path";
import { fillInGlobalVariablesInPath } from "@lichtblick/suite-base/components/MessagePathSyntax/useCachedGetMessagePathDataItems";
import { useMessagePipeline } from "@lichtblick/suite-base/components/MessagePipeline";
import useGlobalVariables from "@lichtblick/suite-base/hooks/useGlobalVariables";
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import GlobalVariableBuilder from "@lichtblick/suite-base/testing/builders/GlobalVariableBuilder";
import PlotBuilder from "@lichtblick/suite-base/testing/builders/PlotBuilder";
import useSubscriptions from "./useSubscriptions";
import { isReferenceLinePlotPathType } from "../utils/config";
import { pathToSubscribePayload } from "../utils/subscription";
jest.mock("@lichtblick/suite-base/components/MessagePipeline", () => ({
    useMessagePipeline: jest.fn(),
}));
jest.mock("@lichtblick/message-path", () => ({
    parseMessagePath: jest.fn(),
}));
jest.mock("@lichtblick/suite-base/components/MessagePathSyntax/useCachedGetMessagePathDataItems", () => ({
    fillInGlobalVariablesInPath: jest.fn(),
}));
jest.mock("../utils/config", () => ({
    isReferenceLinePlotPathType: jest.fn(),
}));
jest.mock("../utils/subscription", () => ({
    pathToSubscribePayload: jest.fn(),
}));
jest.mock("@lichtblick/suite-base/hooks/useGlobalVariables", () => ({
    __esModule: true,
    default: jest.fn(),
}));
describe("useSubscriptions", () => {
    const setSubscriptions = jest.fn();
    const globalVariables = GlobalVariableBuilder.globalVariables();
    useMessagePipeline.mockReturnValue(setSubscriptions);
    useGlobalVariables.mockReturnValue({ globalVariables });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const setup = (override = {}) => {
        const config = {
            ...PlotBuilder.config(),
            ...override.config,
        };
        const subscriberId = Object.hasOwn(override, "subscriberId")
            ? override.subscriberId
            : BasicBuilder.string();
        return {
            ...renderHook(() => {
                useSubscriptions(config, subscriberId);
            }),
            config,
            subscriberId,
        };
    };
    describe("Setting subscriptions", () => {
        it("should set subscriptions when preload type is full", () => {
            const parsedPath = BasicBuilder.string();
            const filledInGlobalVarsPath = BasicBuilder.string();
            isReferenceLinePlotPathType.mockImplementation(() => false);
            parseMessagePath.mockImplementation(() => parsedPath);
            fillInGlobalVariablesInPath.mockImplementation(() => filledInGlobalVarsPath);
            pathToSubscribePayload.mockImplementation(() => "");
            const { subscriberId, config } = setup({
                config: {
                    xAxisVal: "timestamp",
                },
            });
            expect(setSubscriptions).toHaveBeenCalledWith(subscriberId, expect.any(Array));
            expect(isReferenceLinePlotPathType).toHaveBeenCalledTimes(config.paths.length);
            expect(isReferenceLinePlotPathType).toHaveBeenNthCalledWith(1, config.paths[0]);
            expect(isReferenceLinePlotPathType).toHaveBeenNthCalledWith(2, config.paths[1]);
            expect(isReferenceLinePlotPathType).toHaveBeenNthCalledWith(3, config.paths[2]);
            expect(parseMessagePath).toHaveBeenCalledTimes(config.paths.length);
            expect(parseMessagePath).toHaveBeenNthCalledWith(1, config.paths[0].value);
            expect(parseMessagePath).toHaveBeenNthCalledWith(2, config.paths[1].value);
            expect(parseMessagePath).toHaveBeenNthCalledWith(3, config.paths[2].value);
            expect(fillInGlobalVariablesInPath).toHaveBeenCalledTimes(config.paths.length);
            expect(fillInGlobalVariablesInPath).toHaveBeenLastCalledWith(parsedPath, globalVariables);
            expect(pathToSubscribePayload).toHaveBeenCalledTimes(config.paths.length);
            expect(pathToSubscribePayload).toHaveBeenLastCalledWith(filledInGlobalVarsPath, "full");
        });
        it("should set subscriptions when preload type is partial", () => {
            const parsedPath = BasicBuilder.string();
            const filledInGlobalVarsPath = BasicBuilder.string();
            isReferenceLinePlotPathType.mockImplementation(() => false);
            parseMessagePath.mockImplementation(() => parsedPath);
            fillInGlobalVariablesInPath.mockImplementation(() => filledInGlobalVarsPath);
            pathToSubscribePayload.mockImplementation(() => "");
            const { subscriberId, config } = setup({
                config: {
                    xAxisVal: "index",
                },
            });
            expect(parseMessagePath).toHaveBeenCalledTimes(config.paths.length);
            expect(parseMessagePath).toHaveBeenNthCalledWith(1, config.paths[0].value);
            expect(parseMessagePath).toHaveBeenNthCalledWith(2, config.paths[1].value);
            expect(parseMessagePath).toHaveBeenNthCalledWith(3, config.paths[2].value);
            expect(isReferenceLinePlotPathType).toHaveBeenCalledTimes(config.paths.length);
            expect(isReferenceLinePlotPathType).toHaveBeenLastCalledWith(config.paths[2]);
            expect(fillInGlobalVariablesInPath).toHaveBeenCalledTimes(config.paths.length);
            expect(fillInGlobalVariablesInPath).toHaveBeenLastCalledWith(parsedPath, globalVariables);
            expect(pathToSubscribePayload).toHaveBeenCalledTimes(config.paths.length);
            expect(pathToSubscribePayload).toHaveBeenLastCalledWith(filledInGlobalVarsPath, "partial");
            expect(setSubscriptions).toHaveBeenCalledWith(subscriberId, expect.any(Array));
        });
        it("should set subscriptions when xAxisVal is custom", () => {
            const parsedPath = BasicBuilder.string();
            const filledInGlobalVarsPath = BasicBuilder.string();
            isReferenceLinePlotPathType.mockImplementation(() => false);
            parseMessagePath.mockImplementation(() => parsedPath);
            fillInGlobalVariablesInPath.mockImplementation(() => filledInGlobalVarsPath);
            pathToSubscribePayload.mockImplementation(() => "");
            const { subscriberId, config } = setup({
                config: {
                    paths: [],
                    xAxisVal: "custom",
                },
            });
            expect(parseMessagePath).toHaveBeenCalledTimes(1);
            expect(parseMessagePath).toHaveBeenCalledWith(config.xAxisPath?.value);
            expect(fillInGlobalVariablesInPath).toHaveBeenCalledTimes(1);
            expect(fillInGlobalVariablesInPath).toHaveBeenCalledWith(parsedPath, globalVariables);
            expect(pathToSubscribePayload).toHaveBeenCalledTimes(1);
            expect(pathToSubscribePayload).toHaveBeenCalledWith(filledInGlobalVarsPath, "full");
            expect(setSubscriptions).toHaveBeenCalledWith(subscriberId, expect.any(Array));
        });
        it("should set subscriptions when xAxisVal is currentCustom", () => {
            const parsedPath = BasicBuilder.string();
            const filledInGlobalVarsPath = BasicBuilder.string();
            isReferenceLinePlotPathType.mockImplementation(() => false);
            parseMessagePath.mockImplementation(() => parsedPath);
            fillInGlobalVariablesInPath.mockImplementation(() => filledInGlobalVarsPath);
            pathToSubscribePayload.mockImplementation(() => "");
            const { subscriberId, config } = setup({
                config: {
                    paths: [],
                    xAxisVal: "currentCustom",
                },
            });
            expect(parseMessagePath).toHaveBeenCalledTimes(1);
            expect(parseMessagePath).toHaveBeenCalledWith(config.xAxisPath?.value);
            expect(fillInGlobalVariablesInPath).toHaveBeenCalledTimes(1);
            expect(fillInGlobalVariablesInPath).toHaveBeenCalledWith(parsedPath, globalVariables);
            expect(pathToSubscribePayload).toHaveBeenCalledTimes(1);
            expect(pathToSubscribePayload).toHaveBeenCalledWith(filledInGlobalVarsPath, "partial");
            expect(setSubscriptions).toHaveBeenCalledWith(subscriberId, expect.any(Array));
        });
        it("should set subscriptions when xAxisVal is currentCustom and parsedPath is undefined", () => {
            const parsedPath = undefined;
            const filledInGlobalVarsPath = BasicBuilder.string();
            isReferenceLinePlotPathType.mockImplementation(() => false);
            parseMessagePath.mockImplementation(() => parsedPath);
            fillInGlobalVariablesInPath.mockImplementation(() => filledInGlobalVarsPath);
            pathToSubscribePayload.mockImplementation(() => "");
            const { subscriberId, config } = setup({
                config: {
                    paths: [],
                    xAxisVal: "currentCustom",
                },
            });
            expect(parseMessagePath).toHaveBeenCalledTimes(1);
            expect(parseMessagePath).toHaveBeenCalledWith(config.xAxisPath?.value);
            expect(fillInGlobalVariablesInPath).not.toHaveBeenCalled();
            expect(pathToSubscribePayload).not.toHaveBeenCalled();
            expect(setSubscriptions).toHaveBeenCalledWith(subscriberId, expect.any(Array));
        });
    });
    describe("Unsubscribing", () => {
        it("unsubscribes on unmount", () => {
            const { unmount, subscriberId } = setup();
            unmount();
            expect(setSubscriptions).toHaveBeenCalledWith(subscriberId, []);
        });
    });
    describe("Handling invalid paths", () => {
        it("does not set subscriptions for invalid paths", () => {
            const { subscriberId } = setup({
                config: {
                    xAxisVal: BasicBuilder.string(),
                },
            });
            expect(setSubscriptions).toHaveBeenCalledWith(subscriberId, []);
        });
        it("should not handle paths when isReferenceLinePlotPathType is true", () => {
            isReferenceLinePlotPathType.mockImplementation(() => true);
            const { subscriberId } = setup({
                config: {
                    paths: PlotBuilder.paths(1),
                    xAxisPath: undefined,
                },
            });
            expect(isReferenceLinePlotPathType).toHaveBeenCalledTimes(1);
            expect(parseMessagePath).not.toHaveBeenCalled();
            expect(fillInGlobalVariablesInPath).not.toHaveBeenCalled();
            expect(pathToSubscribePayload).not.toHaveBeenCalled();
            expect(setSubscriptions).toHaveBeenCalledWith(subscriberId, expect.any(Array));
        });
        it("should not handle paths when parsedPath is undefined", () => {
            isReferenceLinePlotPathType.mockImplementation(() => false);
            parseMessagePath.mockImplementation(() => undefined);
            const { subscriberId } = setup({
                config: {
                    paths: PlotBuilder.paths(1),
                    xAxisPath: undefined,
                },
            });
            expect(isReferenceLinePlotPathType).toHaveBeenCalledTimes(1);
            expect(parseMessagePath).toHaveBeenCalledTimes(1);
            expect(fillInGlobalVariablesInPath).not.toHaveBeenCalled();
            expect(pathToSubscribePayload).not.toHaveBeenCalled();
            expect(setSubscriptions).toHaveBeenCalledWith(subscriberId, expect.any(Array));
        });
    });
});
