import { jsx as _jsx } from "react/jsx-runtime";
import { fireEvent, screen, userEvent, within } from "@storybook/testing-library";
import { useMemo, useState } from "react";
import { AppSetting } from "@lichtblick/suite-base/AppSetting";
import AppConfigurationContext from "@lichtblick/suite-base/context/AppConfigurationContext";
import CurrentUserContext from "@lichtblick/suite-base/context/CurrentUserContext";
import LayoutStorageContext from "@lichtblick/suite-base/context/LayoutStorageContext";
import { UserProfileStorageContext } from "@lichtblick/suite-base/context/UserProfileStorageContext";
import CurrentLayoutProvider from "@lichtblick/suite-base/providers/CurrentLayoutProvider";
import { defaultPlaybackConfig } from "@lichtblick/suite-base/providers/CurrentLayoutProvider/reducers";
import LayoutManagerProvider from "@lichtblick/suite-base/providers/LayoutManagerProvider";
import WorkspaceContextProvider from "@lichtblick/suite-base/providers/WorkspaceContextProvider";
import LayoutManager from "@lichtblick/suite-base/services/LayoutManager/LayoutManager";
import MockLayoutStorage from "@lichtblick/suite-base/services/MockLayoutStorage";
import { makeMockAppConfiguration } from "@lichtblick/suite-base/util/makeMockAppConfiguration";
import LayoutBrowser from "./index";
const DEFAULT_LAYOUT_FOR_TESTS = {
    configById: {},
    globalVariables: {},
    userNodes: {},
    playbackConfig: defaultPlaybackConfig,
};
const exampleCurrentLayout = {
    id: "test-id",
    name: "Current Layout",
    baseline: {
        data: DEFAULT_LAYOUT_FOR_TESTS,
        savedAt: new Date(10).toISOString(),
    },
    permission: "CREATOR_WRITE",
    working: undefined,
    syncInfo: undefined,
};
const notCurrentLayout = {
    id: "not-current",
    name: "Another Layout",
    baseline: {
        data: DEFAULT_LAYOUT_FOR_TESTS,
        savedAt: new Date(10).toISOString(),
    },
    permission: "CREATOR_WRITE",
    working: undefined,
    syncInfo: undefined,
};
const shortLayout = {
    id: "short-id",
    name: "Short",
    baseline: {
        data: DEFAULT_LAYOUT_FOR_TESTS,
        savedAt: new Date(10).toISOString(),
    },
    permission: "CREATOR_WRITE",
    working: undefined,
    syncInfo: undefined,
};
function makeUnsavedLayout(id) {
    return {
        id: `unsaved-id-${id}`,
        name: `Unsaved Layout ${id}`,
        baseline: {
            data: DEFAULT_LAYOUT_FOR_TESTS,
            savedAt: new Date(10).toISOString(),
        },
        permission: "CREATOR_WRITE",
        working: { data: DEFAULT_LAYOUT_FOR_TESTS, savedAt: undefined },
        syncInfo: undefined,
    };
}
async function clickMenuButtonAction(index) {
    const actions = await screen.findAllByTestId("layout-actions");
    const action = actions[index];
    if (action != undefined) {
        fireEvent.click(action);
    }
}
async function deleteLayoutInteraction(index) {
    await clickMenuButtonAction(index);
    const deleteButton = await screen.findByText("Delete");
    fireEvent.click(deleteButton);
    const confirmButton = await screen.findByText("Delete");
    fireEvent.click(confirmButton);
}
async function doMultiAction(action) {
    await selectAllAction();
    await clickMenuButtonAction(0);
    const button = await screen.findByText(action);
    fireEvent.click(button);
}
async function selectAllAction() {
    const layouts = await screen.findAllByTestId("layout-list-item");
    layouts.forEach((layout) => fireEvent.click(layout, { ctrlKey: true }));
}
function WithSetup(Child, ctx) {
    const storage = useMemo(() => new MockLayoutStorage(LayoutManager.LOCAL_STORAGE_NAMESPACE, ctx.parameters.mockLayouts ?? [
        notCurrentLayout,
        exampleCurrentLayout,
        shortLayout,
    ]), [ctx.parameters.mockLayouts]);
    const userProfile = useMemo(() => ({
        getUserProfile: async () => ({ currentLayoutId: "test-id" }),
        setUserProfile: async () => { },
    }), []);
    const [appConfig] = useState(() => makeMockAppConfiguration([[AppSetting.ENABLE_NEW_TOPNAV, false]]));
    return (_jsx("div", { style: { display: "flex", height: "100%", width: 320 }, children: _jsx(AppConfigurationContext.Provider, { value: appConfig, children: _jsx(UserProfileStorageContext.Provider, { value: userProfile, children: _jsx(LayoutStorageContext.Provider, { value: storage, children: _jsx(LayoutManagerProvider, { children: _jsx(CurrentLayoutProvider, { children: _jsx(Child, {}) }) }) }) }) }) }));
}
export default {
    title: "components/LayoutBrowser",
    component: LayoutBrowser,
    decorators: [WithSetup],
};
export const Empty = {
    render: function Story() {
        return _jsx(LayoutBrowser, {});
    },
    parameters: { mockLayouts: [] },
};
export const LayoutList = {
    render: () => {
        return _jsx(LayoutBrowser, {});
    },
};
export const MultiSelect = {
    render: function Story() {
        return _jsx(LayoutBrowser, {});
    },
    parameters: {
        colorScheme: "dark",
        mockLayouts: Array(8)
            .fill(undefined)
            .map((_, idx) => ({
            id: `layout-${idx + 1}`,
            name: `Layout ${idx + 1}`,
            baseline: { data: DEFAULT_LAYOUT_FOR_TESTS, updatedAt: new Date(10).toISOString() },
        })),
    },
    play: async ({ canvasElement }) => {
        const layouts = await within(canvasElement).findAllByTestId("layout-list-item");
        await userEvent.click(layouts[0]);
        await userEvent.click(layouts[1]);
        await userEvent.click(layouts[3]);
        await userEvent.click(layouts[6]);
        await userEvent.click(layouts[4]);
    },
};
export const MultiDelete = {
    render: function Story() {
        return _jsx(LayoutBrowser, {});
    },
    parameters: { colorScheme: "dark" },
    play: async () => {
        await doMultiAction("Delete");
        const confirmButton = await screen.findByText("Delete");
        fireEvent.click(confirmButton);
    },
};
export const MultiDuplicate = {
    render: function Story() {
        return _jsx(LayoutBrowser, {});
    },
    parameters: {
        colorScheme: "dark",
        mockLayouts: [exampleCurrentLayout, makeUnsavedLayout(1), shortLayout],
    },
    play: async () => {
        await doMultiAction("Duplicate");
    },
};
export const MultiRevert = {
    render: function Story() {
        return _jsx(LayoutBrowser, {});
    },
    parameters: {
        colorScheme: "dark",
        mockLayouts: [makeUnsavedLayout(1), makeUnsavedLayout(2), makeUnsavedLayout(3)],
    },
    play: async () => {
        await doMultiAction("Revert");
        const revertButton = await screen.findByText("Discard changes");
        fireEvent.click(revertButton);
    },
};
export const MultiSave = {
    render: function Story() {
        return _jsx(LayoutBrowser, {});
    },
    parameters: {
        colorScheme: "dark",
        mockLayouts: [makeUnsavedLayout(1), makeUnsavedLayout(2), makeUnsavedLayout(3)],
    },
    play: async () => {
        await doMultiAction("Save changes");
    },
};
export const TruncatedLayoutName = {
    render: () => {
        return _jsx(LayoutBrowser, {});
    },
    parameters: {
        mockLayouts: [
            {
                id: "not-current",
                name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
                baseline: { data: DEFAULT_LAYOUT_FOR_TESTS, updatedAt: new Date(10).toISOString() },
            },
        ],
    },
};
export const TruncatedLayoutNameSelected = {
    render: () => {
        return _jsx(LayoutBrowser, {});
    },
    parameters: {
        mockLayouts: [
            {
                id: "test-id",
                name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
                baseline: { data: DEFAULT_LAYOUT_FOR_TESTS, updatedAt: new Date(10).toISOString() },
            },
        ],
    },
};
export const AddLayout = {
    render: function Story() {
        return (_jsx(LayoutBrowser, { currentDateForStorybook: useMemo(() => new Date("2021-06-16T04:28:33.549Z"), []) }));
    },
    parameters: { colorScheme: "dark" },
    play: async () => {
        const button = await screen.findByTestId("add-layout");
        fireEvent.click(button);
    },
};
export const MenuOpen = {
    render: function Story() {
        return _jsx(LayoutBrowser, {});
    },
    parameters: { colorScheme: "dark" },
    play: async () => {
        const actions = await screen.findAllByTestId("layout-actions");
        if (actions[1]) {
            fireEvent.click(actions[1]);
        }
    },
};
export const MenuOpenLight = {
    ...MenuOpen,
    parameters: { colorScheme: "light" },
    play: async () => {
        const actions = await screen.findAllByTestId("layout-actions");
        if (actions[1]) {
            fireEvent.click(actions[1]);
        }
    },
};
export const EditingName = {
    render: function Story() {
        return _jsx(LayoutBrowser, {});
    },
    parameters: { colorScheme: "dark" },
    play: async () => {
        const actions = await screen.findAllByTestId("layout-actions");
        if (actions[1]) {
            fireEvent.click(actions[1]);
        }
        const button = await screen.findByText("Rename");
        fireEvent.click(button);
    },
};
export const CancelRenameWithEscape = {
    render: function Story() {
        return _jsx(LayoutBrowser, {});
    },
    parameters: { colorScheme: "dark" },
    play: async () => {
        const actions = await screen.findAllByTestId("layout-actions");
        if (actions[1]) {
            fireEvent.click(actions[1]);
        }
        const button = await screen.findByText("Rename");
        fireEvent.click(button);
        fireEvent.keyDown(document.activeElement, { key: "Escape" });
    },
};
export const CommitRenameWithTab = {
    render: function Story() {
        return _jsx(LayoutBrowser, {});
    },
    parameters: { colorScheme: "dark" },
    play: async () => {
        const actions = await screen.findAllByTestId("layout-actions");
        if (actions[1]) {
            fireEvent.click(actions[1]);
        }
        const button = await screen.findByText("Rename");
        fireEvent.click(button);
        fireEvent.change(document.activeElement, { target: { value: "New name" } });
        fireEvent.focusOut(document.activeElement);
    },
};
export const Duplicate = {
    render: function Story() {
        return _jsx(LayoutBrowser, {});
    },
    parameters: { colorScheme: "dark" },
    play: async () => {
        const actions = await screen.findAllByTestId("layout-actions");
        if (actions[1]) {
            fireEvent.click(actions[1]);
        }
        const button = await screen.findByText("Duplicate");
        fireEvent.click(button);
    },
};
export const DeleteLayout = {
    render: function Story() {
        return _jsx(LayoutBrowser, {});
    },
    parameters: { colorScheme: "dark" },
    play: async () => {
        await deleteLayoutInteraction(0);
    },
};
export const DeleteSelectedLayout = {
    render: function Story() {
        return _jsx(LayoutBrowser, {});
    },
    play: async () => {
        const layouts = await screen.findAllByTestId("layout-list-item");
        if (layouts[1]) {
            fireEvent.click(layouts[1]);
        }
        await deleteLayoutInteraction(1);
        if (layouts[0]) {
            fireEvent.click(layouts[0]);
        }
    },
    parameters: { colorScheme: "dark" },
};
export const DeleteLastLayout = {
    render: function Story() {
        return _jsx(LayoutBrowser, {});
    },
    parameters: {
        mockLayouts: [exampleCurrentLayout],
        colorScheme: "dark",
    },
    play: async () => {
        await deleteLayoutInteraction(0);
    },
};
export const SignInPrompt = {
    render: function Story() {
        return (_jsx(CurrentUserContext.Provider, { value: {
                currentUser: undefined,
                signIn: () => undefined,
                signOut: async () => undefined,
            }, children: _jsx(WorkspaceContextProvider, { children: _jsx(LayoutBrowser, {}) }) }));
    },
    parameters: {
        colorScheme: "light",
    },
};
