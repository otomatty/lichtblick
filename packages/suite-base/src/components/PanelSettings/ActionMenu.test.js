import { jsx as _jsx } from "react/jsx-runtime";
/** @jest-environment jsdom */
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { userEvent } from "@storybook/testing-library";
import { render, screen } from "@testing-library/react";
import { ActionMenu } from "./ActionMenu";
jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key) => key,
    }),
}));
describe("ActionMenu", () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => { });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    const renderComponent = (propsOverride = {}) => {
        const props = {
            allowShare: true,
            onReset: jest.fn(),
            onShare: jest.fn(),
            ...propsOverride,
        };
        const ui = _jsx(ActionMenu, { ...props });
        return {
            ...render(ui),
            props,
            user: userEvent.setup(),
        };
    };
    it("should render the button and open the menu when clicked", async () => {
        const { user } = renderComponent();
        await user.click(screen.getByTestId("basic-button"));
        expect(screen.getByRole("menu")).toBeTruthy();
    });
    it("should call onShare when clicking the share item", async () => {
        const { user, props } = renderComponent();
        await user.click(screen.getByTestId("basic-button"));
        await user.click(screen.getByText("importOrExportSettingsWithEllipsis"));
        expect(props.onShare).toHaveBeenCalled();
    });
    it("should call onReset when clicking the reset item", async () => {
        const { user, props } = renderComponent();
        await user.click(screen.getByTestId("basic-button"));
        await user.click(screen.getByText("resetToDefaults"));
        expect(props.onReset).toHaveBeenCalled();
    });
    it("should disable the share item if allowShare is false", async () => {
        const { user, props } = renderComponent({ allowShare: false });
        await user.click(screen.getByTestId("basic-button"));
        const shareItem = screen.getByText("importOrExportSettingsWithEllipsis");
        // Ignore error if click is not possible
        await user.click(shareItem).catch(() => { });
        expect(props.onShare).not.toHaveBeenCalled();
    });
});
