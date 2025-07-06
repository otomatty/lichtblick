import { jsx as _jsx } from "react/jsx-runtime";
import { action } from "storybook/actions";
import { UnsavedChangesPrompt } from "@lichtblick/suite-base/components/LayoutBrowser/UnsavedChangesPrompt";
import { defaultPlaybackConfig } from "@lichtblick/suite-base/providers/CurrentLayoutProvider/reducers";
export default {
    title: "components/LayoutBrowser/UnsavedChangesPrompt",
    component: UnsavedChangesPrompt,
    parameters: { colorScheme: "dark" },
};
const dummyLayout = {
    id: "dummy-id",
    name: "Example layout",
    permission: "ORG_WRITE",
    baseline: {
        savedAt: new Date(10).toISOString(),
        data: {
            configById: {},
            globalVariables: {},
            userNodes: {},
            playbackConfig: defaultPlaybackConfig,
        },
    },
    working: undefined,
    syncInfo: undefined,
};
export const Default = {
    render: () => {
        return _jsx(UnsavedChangesPrompt, { isOnline: true, layout: dummyLayout, onComplete: action("onComplete") });
    },
};
export const DefaultLight = { ...Default, parameters: { colorScheme: "light" } };
export const Offline = {
    render: () => {
        return (_jsx(UnsavedChangesPrompt, { isOnline: false, layout: dummyLayout, onComplete: action("onComplete") }));
    },
};
export const Overwrite = {
    render: () => {
        return (_jsx(UnsavedChangesPrompt, { isOnline: true, layout: dummyLayout, onComplete: action("onComplete"), defaultSelectedKey: "overwrite" }));
    },
};
export const MakePersonal = {
    render: () => {
        return (_jsx(UnsavedChangesPrompt, { isOnline: true, layout: dummyLayout, onComplete: action("onComplete"), defaultSelectedKey: "makePersonal" }));
    },
};
export const MakePersonalWithEmptyField = {
    render: () => {
        return (_jsx(UnsavedChangesPrompt, { isOnline: true, layout: dummyLayout, onComplete: action("onComplete"), defaultSelectedKey: "makePersonal", defaultPersonalCopyName: "" }));
    },
};
