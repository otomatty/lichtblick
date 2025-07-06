import { jsx as _jsx } from "react/jsx-runtime";
/** @jest-environment jsdom */
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { userEvent } from "@storybook/testing-library";
import { render, screen } from "@testing-library/react";
import MockPanelContextProvider from "@lichtblick/suite-base/components/MockPanelContextProvider";
import { PanelExtensionAdapter } from "@lichtblick/suite-base/components/PanelExtensionAdapter";
import Indicator from "@lichtblick/suite-base/panels/Indicator";
import { DEFAULT_CONFIG } from "@lichtblick/suite-base/panels/Indicator/constants";
import { getMatchingRule } from "@lichtblick/suite-base/panels/Indicator/getMatchingRule";
import PanelSetup from "@lichtblick/suite-base/stories/PanelSetup";
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import IndicatorBuilder from "@lichtblick/suite-base/testing/builders/IndicatorBuilder";
import ThemeProvider from "@lichtblick/suite-base/theme/ThemeProvider";
jest.mock("./getMatchingRule", () => ({
    getMatchingRule: jest.fn(),
}));
describe("Indicator Component", () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => { });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    function setup({ contextOverride, configOverride } = {}) {
        const config = {
            ...IndicatorBuilder.config(),
            ...configOverride,
        };
        const props = {
            context: {
                initialState: config,
                layout: {
                    addPanel: jest.fn(),
                },
                onRender: jest.fn(),
                panelElement: document.createElement("div"),
                saveState: jest.fn(),
                setDefaultPanelTitle: jest.fn(),
                setParameter: jest.fn(),
                setPreviewTime: jest.fn(),
                setSharedPanelState: jest.fn(),
                setVariable: jest.fn(),
                subscribe: jest.fn(),
                subscribeAppSettings: jest.fn(),
                unsubscribeAll: jest.fn(),
                updatePanelSettingsEditor: jest.fn(),
                watch: jest.fn(),
                ...contextOverride,
            },
        };
        const saveConfig = () => { };
        const initPanel = jest.fn();
        const ui = (_jsx(ThemeProvider, { isDark: true, children: _jsx(MockPanelContextProvider, { children: _jsx(PanelSetup, { children: _jsx(PanelExtensionAdapter, { config: DEFAULT_CONFIG, saveConfig: saveConfig, initPanel: initPanel, children: _jsx(Indicator, { overrideConfig: config }) }) }) }) }));
        const matchingRule = {
            color: "#68e24a",
            label: BasicBuilder.string(),
        };
        getMatchingRule.mockReturnValue(matchingRule);
        const augmentColor = jest.fn(({ color: { main } }) => ({
            contrastText: `${main}-contrast`,
        }));
        return {
            ...render(ui),
            config,
            matchingRule,
            props,
            user: userEvent.setup(),
            augmentColor,
            saveConfig,
            initPanel,
        };
    }
    it("renders Indicator component", () => {
        const { matchingRule } = setup();
        expect(screen.getByText(matchingRule.label)).toBeTruthy();
    });
    it("renders with custom configuration", () => {
        const customConfig = {
            path: BasicBuilder.string(),
            style: "background",
            fallbackColor: "#ff0000",
        };
        const { config } = setup({ configOverride: customConfig });
        expect(config).toMatchObject(customConfig);
    });
    it.each(["bulb", "background"])("renders with the proper style indicator", (style) => {
        const { matchingRule } = setup({
            configOverride: {
                style,
            },
        });
        expect(screen.getByTestId(`${style}-indicator`)).toBeTruthy();
        expect(screen.getByText(matchingRule.label)).toBeTruthy();
    });
});
