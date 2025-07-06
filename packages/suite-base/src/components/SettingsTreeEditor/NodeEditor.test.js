import { jsx as _jsx } from "react/jsx-runtime";
/** @jest-environment jsdom */
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { NodeEditor } from "@lichtblick/suite-base/components/SettingsTreeEditor/NodeEditor";
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
let capturedActionHandler;
jest.mock("@lichtblick/suite-base/components/SettingsTreeEditor/FieldEditor", () => ({
    FieldEditor: (props) => {
        capturedActionHandler = props.actionHandler;
        return _jsx("div", {}); // Simple mock because UI does not matter here
    },
}));
const changeVisibilityFilter = (visibility) => {
    capturedActionHandler({
        action: "update",
        payload: { input: "select", value: visibility, path: ["topics", "visibilityFilter"] },
    });
};
describe("NodeEditor childNodes filtering", () => {
    const nodes = BasicBuilder.strings({ count: 3 });
    const tree = {
        enableVisibilityFilter: true,
        children: {
            [nodes[0]]: { visible: true, label: nodes[0] },
            [nodes[1]]: { visible: false, label: nodes[1] },
            [nodes[2]]: { label: nodes[2] }, // undefined visibility is always shown
        },
    };
    const renderComponent = async () => {
        const ui = (_jsx(NodeEditor, { actionHandler: () => undefined, path: [], settings: tree }));
        return {
            ...render(ui),
            user: userEvent.setup(),
        };
    };
    it("all nodes should be visible at start", async () => {
        await renderComponent();
        expect(screen.queryByText(nodes[0])).toBeInTheDocument();
        expect(screen.queryByText(nodes[1])).toBeInTheDocument();
        expect(screen.queryByText(nodes[2])).toBeInTheDocument();
    });
    it("should list only the selected option filter", async () => {
        await renderComponent();
        expect(screen.queryByText(nodes[0])).toBeInTheDocument();
        expect(screen.queryByText(nodes[1])).toBeInTheDocument();
        expect(screen.queryByText(nodes[2])).toBeInTheDocument();
        act(() => {
            changeVisibilityFilter("visible");
        });
        expect(screen.queryByText(nodes[0])).toBeInTheDocument();
        expect(screen.queryByText(nodes[1])).not.toBeInTheDocument();
        expect(screen.queryByText(nodes[2])).toBeInTheDocument();
        act(() => {
            changeVisibilityFilter("invisible");
        });
        expect(screen.queryByText(nodes[0])).not.toBeInTheDocument();
        expect(screen.queryByText(nodes[1])).toBeInTheDocument();
        expect(screen.queryByText(nodes[2])).toBeInTheDocument();
        act(() => {
            changeVisibilityFilter("all");
        });
        expect(screen.queryByText(nodes[0])).toBeInTheDocument();
        expect(screen.queryByText(nodes[1])).toBeInTheDocument();
        expect(screen.queryByText(nodes[2])).toBeInTheDocument();
    });
});
