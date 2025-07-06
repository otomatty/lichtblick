import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import CloseIcon from "@mui/icons-material/Close";
import { Badge, Divider, IconButton, Tab, Tabs } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useStyles } from "@lichtblick/suite-base/components/Sidebars/NewSidebar.style";
import Stack from "@lichtblick/suite-base/components/Stack";
function Noop() {
    return undefined;
}
export function NewSidebar({ items, anchor, onClose, activeTab, setActiveTab, }) {
    const { classes, cx } = useStyles();
    const handleTabChange = useCallback((_ev, newValue) => {
        if (newValue !== activeTab) {
            setActiveTab(newValue);
        }
    }, [activeTab, setActiveTab]);
    const SelectedComponent = useMemo(() => {
        return (activeTab != undefined && items.get(activeTab)?.component) ?? Noop;
    }, [activeTab, items]);
    const memoizedTabs = useMemo(() => {
        return Array.from(items.entries(), ([key, item]) => (_jsx(Tab, { label: _jsx(Badge, { invisible: !item.badge, badgeContent: item.badge?.count, color: item.badge?.color, classes: {
                    root: classes.badgeRoot,
                    badge: classes.badge,
                    invisible: classes.badgeInvisible,
                }, children: item.title }), value: key, "data-testid": `${key}-${anchor}` }, key)));
    }, [items, classes.badgeRoot, classes.badge, classes.badgeInvisible, anchor]);
    return (_jsxs(Stack, { className: cx(classes.root, {
            [classes.anchorLeft]: anchor === "left",
            [classes.anchorRight]: anchor === "right",
        }), flexShrink: 0, overflow: "hidden", "data-tourid": `sidebar-${anchor}`, "data-testid": `sidebar-${anchor}`, children: [_jsxs(Stack, { direction: "row", justifyContent: "space-between", alignItems: "center", children: [_jsx(Tabs, { className: classes.tabs, textColor: "inherit", value: activeTab ?? false, onChange: handleTabChange, children: memoizedTabs }), _jsx(IconButton, { className: classes.iconButton, onClick: onClose, size: "small", "data-testid": `sidebar-close-${anchor}`, children: _jsx(CloseIcon, { fontSize: "inherit" }) })] }), _jsx(Divider, {}), activeTab != undefined && (_jsx("div", { className: classes.tabContent, children: SelectedComponent !== false ? _jsx(SelectedComponent, {}) : _jsx(_Fragment, {}) }))] }));
}
