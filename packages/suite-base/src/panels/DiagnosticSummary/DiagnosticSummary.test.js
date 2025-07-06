import { jsx as _jsx } from "react/jsx-runtime";
/** @jest-environment jsdom */
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import DiagnosticSummary from "@lichtblick/suite-base/panels/DiagnosticSummary";
import { DEFAULT_CONFIG } from "@lichtblick/suite-base/panels/DiagnosticSummary/constants";
import useDiagnostics from "@lichtblick/suite-base/panels/DiagnosticSummary/hooks/useDiagnostics";
import PanelSetup from "@lichtblick/suite-base/stories/PanelSetup";
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import DiagnosticsBuilder from "@lichtblick/suite-base/testing/builders/DiagnosticsBuilder";
jest.mock("@lichtblick/suite-base/panels/DiagnosticSummary/hooks/useDiagnostics");
jest.mock("react-virtualized-auto-sizer", () => ({
    __esModule: true,
    default: ({ children, }) => children({ height: 500, width: 500 }),
}));
describe("DiagnosticSummary", () => {
    const mockSaveConfig = jest.fn();
    const mockOpenSiblingPanel = jest.fn();
    jest.mock("@lichtblick/suite-base/PanelAPI", () => ({
        useDataSourceInfo: jest.fn(() => ({
            topics: [],
        })),
    }));
    jest.mock("@lichtblick/suite-base/components/PanelContext", () => ({
        usePanelContext: jest.fn(() => ({
            openSiblingPanel: mockOpenSiblingPanel,
        })),
    }));
    jest.mock("@lichtblick/suite-base/providers/PanelStateContextProvider", () => ({
        usePanelSettingsTreeUpdate: jest.fn(),
    }));
    beforeEach(() => {
        jest.clearAllMocks();
    });
    function setup(overrideConfig = {}) {
        const config = DiagnosticsBuilder.summaryConfig({
            ...DEFAULT_CONFIG,
            ...overrideConfig,
        });
        const props = {
            config,
            saveConfig: mockSaveConfig,
        };
        const ui = (_jsx("div", { style: { width: 800, height: 500 }, children: _jsx(PanelSetup, { children: _jsx(DiagnosticSummary, { ...props }) }) }));
        return {
            ...render(ui),
            ...props,
        };
    }
    it("renders empty state when no diagnostics are available", () => {
        const diagnosticResult = new Map();
        useDiagnostics.mockReturnValueOnce(diagnosticResult);
        const { config } = setup();
        expect(screen.getByText(/waiting for messages/i)).toBeInTheDocument();
        expect(screen.getByText(new RegExp(config.topicToRender, "i"))).toBeInTheDocument();
    });
    it("renders diagnostics and pinned items", () => {
        const hardwareId = BasicBuilder.string();
        const diagnosticId = BasicBuilder.string();
        const diagnosticInfo = DiagnosticsBuilder.info();
        const diagnosticResult = new Map([
            [hardwareId, new Map([[diagnosticId, diagnosticInfo]])],
        ]);
        useDiagnostics.mockReturnValue(diagnosticResult);
        setup({
            pinnedIds: [`1|${hardwareId}|${diagnosticId}`],
        });
        expect(screen.getByTestId("diagnostic-summary-node-row-0")).toBeInTheDocument();
        expect(screen.getByTestId("diagnostic-summary-node-row-1")).toBeInTheDocument();
        expect(screen.getAllByText(new RegExp(diagnosticInfo.displayName, "i")).length).toBe(2);
    });
});
