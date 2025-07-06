/** @jest-environment jsdom */
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { buildSettingsTree } from "@lichtblick/suite-base/components/PanelSettings/settingsTree";
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import PlayerBuilder from "@lichtblick/suite-base/testing/builders/PlayerBuilder";
import { maybeCast } from "@lichtblick/suite-base/util/maybeCast";
jest.mock("@lichtblick/suite-base/util/maybeCast");
describe("buildSettingsTree", () => {
    function setup() {
        const config = {
            topics: {
                topic1: { someConfig: "valueFromConfig" },
            },
        };
        maybeCast.mockReturnValue(config);
        const settingsTreeNodes = {
            topics: {
                children: {
                    topic1: {},
                },
            },
        };
        const state = {
            settingsTrees: {
                panel1: {
                    nodes: settingsTreeNodes,
                },
            },
        };
        const extensionSettings = {
            myPanelType: {
                schema1: {
                    settings: jest.fn((_config) => ({
                        label: BasicBuilder.string(),
                        children: {},
                    })),
                    handler: jest.fn(),
                },
            },
        };
        const messagePipelineState = jest.fn().mockReturnValue({
            sortedTopics: PlayerBuilder.topics(),
        });
        return {
            state: state,
            extensionSettings,
            messagePipelineState,
            config,
            settingsTreeNodes,
        };
    }
    beforeEach(() => {
        console.error.mockClear();
    });
    it.each([
        { panelType: undefined, selectedPanelId: "value" },
        { panelType: "value", selectedPanelId: undefined },
    ])("should return undefined if selectedPanelId or panelType is undefined", ({ panelType, selectedPanelId }) => {
        const { config, extensionSettings, state, messagePipelineState } = setup();
        const result = buildSettingsTree({
            config,
            extensionSettings,
            panelType,
            selectedPanelId,
            settingsTrees: state.settingsTrees,
            messagePipelineState,
        });
        expect(result).toBeUndefined();
    });
    it("should return undefined if selected panel is not found in state", () => {
        const { config, extensionSettings, state, messagePipelineState } = setup();
        const result = buildSettingsTree({
            config,
            extensionSettings,
            panelType: "myPanelType",
            selectedPanelId: "invalidPanel",
            settingsTrees: state.settingsTrees,
            messagePipelineState,
        });
        expect(result).toBeUndefined();
    });
    it("should return the correct settingsTree when valid panelId and panelType are provided", () => {
        const { config, extensionSettings, state, messagePipelineState, settingsTreeNodes } = setup();
        const result = buildSettingsTree({
            config,
            extensionSettings,
            panelType: "myPanelType",
            selectedPanelId: "panel1",
            settingsTrees: state.settingsTrees,
            messagePipelineState,
        });
        expect(result).toEqual({
            nodes: settingsTreeNodes,
        });
    });
    it("should return the settingsTree even if topics are empty", () => {
        const { config, extensionSettings, messagePipelineState } = setup();
        const { settingsTrees } = {
            settingsTrees: {
                panel1: {
                    nodes: {
                        topics: {
                            children: {},
                        },
                    },
                    actionHandler: jest.fn(),
                },
            },
        };
        const result = buildSettingsTree({
            config,
            extensionSettings,
            panelType: "myPanelType",
            selectedPanelId: "panel1",
            settingsTrees,
            messagePipelineState,
        });
        expect(result).toEqual(settingsTrees.panel1);
    });
    it("should merge topicsSettings with existing children in the settingsTree", () => {
        const { config, extensionSettings, state, messagePipelineState, settingsTreeNodes } = setup();
        const { children: expectedChildren } = settingsTreeNodes.topics;
        const result = buildSettingsTree({
            config,
            extensionSettings,
            messagePipelineState,
            panelType: "myPanelType",
            selectedPanelId: "panel1",
            settingsTrees: state.settingsTrees,
        });
        expect(result?.nodes.topics?.children).toEqual(expectedChildren);
    });
});
