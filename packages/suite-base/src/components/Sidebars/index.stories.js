import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AppSetting } from "@lichtblick/suite-base/AppSetting";
import { useAppConfigurationValue } from "@lichtblick/suite-base/hooks";
import Sidebars from ".";
export default {
    title: "components/Sidebar",
    component: Sidebars,
};
const A = () => _jsx(_Fragment, { children: "A" });
const B = () => _jsx(_Fragment, { children: "B" });
const C = () => _jsx(_Fragment, { children: "C" });
const D = () => _jsx(_Fragment, { children: "D" });
const E = () => _jsx(_Fragment, { children: "E" });
const ITEMS = new Map([
    ["a", { title: "A", component: A, iconName: "Add" }],
    ["c", { title: "C", component: C, iconName: "Cancel" }],
    ["d", { title: "D", component: D, iconName: "Delete" }],
    ["e", { title: "E", component: E, badge: { count: 2 }, iconName: "Edit" }],
]);
const BOTTOM_ITEMS = new Map([
    ["b", { title: "B", component: B, iconName: "ErrorBadge" }],
]);
function Story({ clickKey, defaultSelectedKey, enableAppBar, height = 300, }) {
    const [selectedKey, setSelectedKey] = useState(defaultSelectedKey);
    const [, setAppBarEnabled] = useAppConfigurationValue(AppSetting.ENABLE_NEW_TOPNAV);
    useEffect(() => {
        if (enableAppBar === true) {
            void setAppBarEnabled(true);
        }
    }, [enableAppBar, setAppBarEnabled]);
    useEffect(() => {
        if (clickKey != undefined) {
            void (async () => {
                const button = document.querySelector(`button[data-sidebar-key=${clickKey}]`);
                if (button) {
                    button.click();
                    return;
                }
                setSelectedKey(() => {
                    throw new Error("Missing sidebar button");
                });
            })();
        }
    }, [clickKey]);
    return (_jsx(DndProvider, { backend: HTML5Backend, children: _jsx("div", { style: { height }, children: _jsx(Sidebars, { items: ITEMS, bottomItems: BOTTOM_ITEMS, rightItems: new Map(), leftItems: new Map(), selectedKey: selectedKey, onSelectKey: setSelectedKey, selectedRightKey: undefined, onSelectRightKey: () => { }, selectedLeftKey: undefined, onSelectLeftKey: () => { }, leftSidebarSize: undefined, rightSidebarSize: undefined, setLeftSidebarSize: () => { }, setRightSidebarSize: () => { }, children: "Main content" }) }) }));
}
export const Unselected = {
    render: () => _jsx(Story, {}),
};
export const ASelected = { render: () => _jsx(Story, { defaultSelectedKey: "a" }) };
export const BSelected = { render: () => _jsx(Story, { defaultSelectedKey: "b" }) };
export const ClickToSelect = {
    render: () => _jsx(Story, { clickKey: "a" }),
    parameters: { colorScheme: "dark" },
};
export const ClickToDeselect = {
    render: () => _jsx(Story, { defaultSelectedKey: "a", clickKey: "a" }),
    parameters: { colorScheme: "dark" },
};
export const OverflowUnselected = { render: () => _jsx(Story, { height: 200 }) };
export const OverflowCSelected = {
    render: () => _jsx(Story, { height: 200, defaultSelectedKey: "c" }),
};
export const OverflowBSelected = {
    render: () => _jsx(Story, { height: 200, defaultSelectedKey: "b" }),
};
