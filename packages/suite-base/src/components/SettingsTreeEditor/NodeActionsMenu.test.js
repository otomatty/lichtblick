import { jsx as _jsx } from "react/jsx-runtime";
/** @jest-environment jsdom */
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { userEvent } from "@storybook/testing-library";
import { render, screen } from "@testing-library/react";
import SettingsTreeNodeBuilder from "@lichtblick/suite-base/testing/builders/SettingsTreeNodeBuilder";
import { NodeActionsMenu } from "./NodeActionsMenu";
describe("NodeActionsMenu", () => {
    const testIds = {
        menuButton: "node-actions-menu-button",
        divider: "node-actions-menu-divider",
        iconPrefix: "node-actions-menu-item-icon-",
    };
    const mockOnSelectAction = jest.fn();
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => { });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    const renderComponent = (propsOverride = {}) => {
        const props = {
            actions: SettingsTreeNodeBuilder.nodeActions(),
            onSelectAction: mockOnSelectAction,
            ...propsOverride,
        };
        const ui = _jsx(NodeActionsMenu, { ...props });
        return {
            ...render(ui),
            props,
            user: userEvent.setup(),
        };
    };
    it("should render the menu button", () => {
        renderComponent();
        expect(screen.getByTestId(testIds.menuButton)).toBeTruthy();
    });
    it("should open the menu when button is clicked", async () => {
        const { user } = renderComponent();
        await user.click(screen.getByTestId(testIds.menuButton));
        expect(screen.getByRole("menu")).toBeTruthy();
    });
    it("should render all actions and a divider in the menu", async () => {
        const { user, props } = renderComponent({
            actions: [
                SettingsTreeNodeBuilder.nodeAction(),
                SettingsTreeNodeBuilder.nodeDivider(),
                SettingsTreeNodeBuilder.nodeAction(),
            ],
        });
        const { actions } = props;
        await user.click(screen.getByTestId(testIds.menuButton));
        expect(screen.getByText(actions[0].label)).toBeTruthy();
        expect(screen.getByTestId(testIds.divider)).toBeTruthy();
        expect(screen.getByText(actions[2].label)).toBeTruthy();
    });
    it("should call onSelectAction with correct action id when an action is clicked", async () => {
        const { user, props } = renderComponent();
        const { actions } = props;
        const firstMenuItem = actions[0];
        await user.click(screen.getByTestId(testIds.menuButton));
        await user.click(screen.getByText(firstMenuItem.label));
        expect(mockOnSelectAction).toHaveBeenCalledWith(firstMenuItem.id);
    });
    it("should close the menu after an action is selected", async () => {
        const { user, props } = renderComponent();
        const { actions } = props;
        const firstMenuItem = actions[0];
        await user.click(screen.getByTestId(testIds.menuButton));
        await user.click(screen.getByText(firstMenuItem.label));
        expect(screen.queryByRole("menu")).not.toBeTruthy();
    });
    it("should render icons correctly if action has an icon", async () => {
        const { user, props } = renderComponent();
        const { actions } = props;
        const firstActionItem = actions[0];
        await user.click(screen.getByTestId(testIds.menuButton));
        expect(screen.queryByTestId(`${testIds.iconPrefix}${firstActionItem.id}`)).toBeTruthy();
    });
    it("should not render ListItemIcon if action has no icon", async () => {
        const { user, props } = renderComponent({
            actions: [
                SettingsTreeNodeBuilder.nodeAction(),
                {
                    ...SettingsTreeNodeBuilder.nodeAction(),
                    icon: undefined,
                },
                SettingsTreeNodeBuilder.nodeAction(),
            ],
        });
        const { actions } = props;
        const secondActionItem = actions[1];
        await user.click(screen.getByTestId(testIds.menuButton));
        expect(screen.queryByTestId(`${testIds.iconPrefix}${secondActionItem.id}`)).toBeNull();
    });
});
