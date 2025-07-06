import { jsx as _jsx } from "react/jsx-runtime";
/** @jest-environment jsdom */
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { userEvent } from "@storybook/testing-library";
import { render, screen, fireEvent } from "@testing-library/react";
import MockPanelContextProvider from "@lichtblick/suite-base/components/MockPanelContextProvider";
import { PanelExtensionAdapter } from "@lichtblick/suite-base/components/PanelExtensionAdapter";
import useGlobalVariables from "@lichtblick/suite-base/hooks/useGlobalVariables";
import { DEFAULT_PLOT_CONFIG } from "@lichtblick/suite-base/panels/Plot/constants";
import usePlotDataHandling from "@lichtblick/suite-base/panels/Plot/hooks/usePlotDataHandling";
import useRenderer from "@lichtblick/suite-base/panels/Plot/hooks/useRenderer";
import PanelSetup from "@lichtblick/suite-base/stories/PanelSetup";
import ThemeProvider from "@lichtblick/suite-base/theme/ThemeProvider";
import Plot from "./Plot";
jest.mock("@lichtblick/suite-base/components/PanelContextMenu", () => ({
    PanelContextMenu: jest.fn(() => _jsx("div", { "data-testid": "panel-context-menu" })),
}));
jest.mock("@lichtblick/suite-base/panels/Plot/PlotLegend", () => ({
    PlotLegend: jest.fn(() => _jsx("div", { "data-testid": "plot-legend" })),
}));
jest.mock("@lichtblick/suite-base/panels/Plot/VerticalBars", () => ({
    VerticalBars: jest.fn(() => _jsx("div", { "data-testid": "vertical-bars" })),
}));
jest.mock("@lichtblick/suite-base/hooks/useGlobalVariables");
jest.mock("@lichtblick/suite-base/panels/Plot/hooks/usePlotDataHandling");
jest.mock("@lichtblick/suite-base/panels/Plot/hooks/useRenderer");
jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key) => key,
    }),
}));
describe("Plot Component", () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => { });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    useGlobalVariables.mockReturnValue({
        globalVariables: {},
        setGlobalVariables: jest.fn(),
    });
    usePlotDataHandling.mockReturnValue({});
    useRenderer.mockReturnValue(undefined);
    function setup(configOverrides = {}) {
        const config = {
            ...DEFAULT_PLOT_CONFIG,
            ...configOverrides,
        };
        const saveConfig = () => { };
        const props = {
            config,
            saveConfig,
        };
        const initPanel = jest.fn();
        const ui = (_jsx(ThemeProvider, { isDark: true, children: _jsx(MockPanelContextProvider, { children: _jsx(PanelSetup, { children: _jsx(PanelExtensionAdapter, { config: config, saveConfig: saveConfig, initPanel: initPanel, children: _jsx(Plot, { ...props }) }) }) }) }));
        return {
            ...render(ui),
            props,
            user: userEvent.setup(),
        };
    }
    it("should render the component correctly", () => {
        setup();
        const panelToolbar = screen.getAllByTestId("mosaic-drag-handle");
        const panelContextMenu = screen.getAllByTestId("panel-context-menu");
        const resetButton = screen.queryByText("Reset view");
        const plotLegend = screen.getByTestId("plot-legend");
        expect(panelToolbar).toBeTruthy();
        expect(panelContextMenu).toBeTruthy();
        expect(plotLegend).toBeTruthy();
        expect(resetButton).not.toBeTruthy();
    });
    it("should call appropriate handlers on user interactions", async () => {
        const { user } = setup();
        const panelContextMenu = screen.getByTestId("panel-context-menu");
        await user.hover(panelContextMenu);
        fireEvent.mouseMove(panelContextMenu);
        fireEvent.wheel(panelContextMenu);
        expect(panelContextMenu).toBeTruthy();
    });
    it("should not display legend when legendDisplay is none", () => {
        setup({ legendDisplay: "none" });
        const plotLegend = screen.queryByTestId("plot-legend");
        expect(plotLegend).not.toBeTruthy();
    });
    it("should display vertical bars", () => {
        setup();
        const verticalBarWrapper = screen.getByTestId("vertical-bar-wrapper");
        const verticalBars = screen.getByTestId("vertical-bars");
        expect(verticalBarWrapper).toBeTruthy();
        expect(verticalBars).toBeTruthy();
    });
});
