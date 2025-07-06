import { jsx as _jsx } from "react/jsx-runtime";
/** @jest-environment jsdom */
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import DiagnosticNodeRow from "@lichtblick/suite-base/panels/DiagnosticSummary/DiagnosticNodeRow";
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import DiagnosticsBuilder from "@lichtblick/suite-base/testing/builders/DiagnosticsBuilder";
describe("DiagnosticNodeRow", () => {
    const onClick = jest.fn();
    const onClickPin = jest.fn();
    let info;
    let isPinned;
    let mockProps;
    beforeEach(() => {
        info = DiagnosticsBuilder.info();
        isPinned = BasicBuilder.boolean();
        mockProps = { info, isPinned, onClick, onClickPin };
    });
    it("renders diagnostic node row and triggers onClick", () => {
        const displayName = info.displayName;
        render(_jsx(DiagnosticNodeRow, { ...mockProps }));
        const rowButton = screen.getByTestId("diagnostic-row-button");
        fireEvent.click(rowButton);
        expect(screen.getByText(displayName)).toBeInTheDocument();
        expect(onClick).toHaveBeenCalledWith(info);
    });
    it("triggers onClickPin when pin button is clicked", () => {
        render(_jsx(DiagnosticNodeRow, { ...mockProps }));
        const pinButton = screen.getByTestId("diagnostic-row-icon");
        fireEvent.click(pinButton);
        expect(onClickPin).toHaveBeenCalledWith(info);
    });
});
