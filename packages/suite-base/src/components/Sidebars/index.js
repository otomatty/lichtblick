import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
/**
 * Sidebars: サイドバーシステム全体の管理
 *
 * 主な機能:
 * - MosaicWithoutDragDropContextによる3分割レイアウト (leftbar/children/rightbar)
 * - NewSidebar: 新UI形式のタブ付きサイドバー
 * - 旧形式のタブナビゲーション (enableNewTopNavが無効時)
 * - 各サイドバーアイテムはErrorBoundaryでラップ
 * - リサイズ可能なサイドバー幅制御
 * - ヘルプメニューとメモリ使用量インジケータ
 */
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Badge, Paper, Tab, Tabs } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MosaicWithoutDragDropContext } from "react-mosaic-component";
import { makeStyles } from "tss-react/mui";
import { AppSetting } from "@lichtblick/suite-base/AppSetting";
import { HelpMenu } from "@lichtblick/suite-base/components/AppBar/HelpMenu";
import { BuiltinIcon } from "@lichtblick/suite-base/components/BuiltinIcon";
import ErrorBoundary from "@lichtblick/suite-base/components/ErrorBoundary";
import { MemoryUseIndicator } from "@lichtblick/suite-base/components/MemoryUseIndicator";
import Stack from "@lichtblick/suite-base/components/Stack";
import { useAppConfigurationValue } from "@lichtblick/suite-base/hooks";
import isDesktopApp from "@lichtblick/suite-base/util/isDesktopApp";
import "react-mosaic-component/react-mosaic-component.css";
import { NewSidebar } from "./NewSidebar";
import { TabSpacer } from "./TabSpacer";
function Noop() {
    return ReactNull;
}
const useStyles = makeStyles()((theme) => ({
    leftNav: {
        boxSizing: "content-box",
        borderRight: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
    },
    tabs: {
        flexGrow: 1,
        ".MuiTabs-flexContainerVertical": {
            height: "100%",
        },
    },
    tab: {
        padding: theme.spacing(1.625),
        minWidth: 50,
    },
    badge: {
        "> *:not(.MuiBadge-badge)": {
            width: "1.5rem",
            height: "1.5rem",
            fontSize: "1.5rem",
            display: "flex",
            ".root-span": {
                display: "contents",
            },
            svg: {
                fontSize: "inherit",
                width: "auto",
                height: "auto",
            },
        },
    },
    mosaicWrapper: {
        flex: "1 1 100%",
        // Root drop targets in this top level sidebar mosaic interfere with drag/mouse events from the
        // PanelList. We don't allow users to edit the mosaic since it's just used for the sidebar, so we
        // can hide the drop targets.
        "& > .mosaic > .drop-target-container": {
            display: "none !important",
        },
    },
}));
/**
 * Extract existing left split percentage from a layout node or return the default.
 */
function mosaicLeftSidebarSplitPercentage(node) {
    if (typeof node !== "object") {
        return undefined;
    }
    if (node.first === "leftbar") {
        return node.splitPercentage;
    }
    else {
        return (mosaicLeftSidebarSplitPercentage(node.first) ?? mosaicLeftSidebarSplitPercentage(node.second));
    }
}
/**
 * Extract existing right split percentage from a layout node or return the default.
 */
function mosaicRightSidebarSplitPercentage(node) {
    if (typeof node !== "object") {
        return undefined;
    }
    if (node.second === "rightbar") {
        return node.splitPercentage;
    }
    else {
        return (mosaicRightSidebarSplitPercentage(node.first) ??
            mosaicRightSidebarSplitPercentage(node.second));
    }
}
export default function Sidebars(props) {
    const { children, items, bottomItems, selectedKey, onSelectKey, leftItems, selectedLeftKey, onSelectLeftKey, leftSidebarSize, setLeftSidebarSize, rightItems, selectedRightKey, onSelectRightKey, rightSidebarSize, setRightSidebarSize, } = props;
    const [enableMemoryUseIndicator = false] = useAppConfigurationValue(AppSetting.ENABLE_MEMORY_USE_INDICATOR);
    // Since we can't toggle the title bar on an electron window, keep the setting at its initial
    // value until the app is reloaded/relaunched.
    const [currentEnableNewTopNav = true] = useAppConfigurationValue(AppSetting.ENABLE_NEW_TOPNAV);
    const [initialEnableNewTopNav] = useState(currentEnableNewTopNav);
    const enableNewTopNav = isDesktopApp() ? initialEnableNewTopNav : currentEnableNewTopNav;
    const [mosaicValue, setMosaicValue] = useState("children");
    const { classes } = useStyles();
    const allOldLeftItems = useMemo(() => {
        return new Map([...items, ...bottomItems]);
    }, [bottomItems, items]);
    const [helpAnchorEl, setHelpAnchorEl] = useState(undefined);
    const helpMenuOpen = Boolean(helpAnchorEl);
    const handleHelpClick = (event) => {
        setHelpAnchorEl(event.currentTarget);
    };
    const handleHelpClose = () => {
        setHelpAnchorEl(undefined);
    };
    const oldLeftSidebarOpen = !enableNewTopNav
        ? selectedKey != undefined && allOldLeftItems.has(selectedKey)
        : false;
    const leftSidebarOpen = enableNewTopNav && selectedLeftKey != undefined && leftItems.has(selectedLeftKey);
    const rightSidebarOpen = enableNewTopNav && selectedRightKey != undefined && rightItems.has(selectedRightKey);
    useEffect(() => {
        const leftTargetWidth = enableNewTopNav ? 320 : 384;
        const rightTargetWidth = 320;
        const defaultLeftPercentage = 100 * (leftTargetWidth / window.innerWidth);
        const defaultRightPercentage = 100 * (1 - rightTargetWidth / window.innerWidth);
        setMosaicValue((oldValue) => {
            let node = "children";
            if (rightSidebarOpen) {
                node = {
                    direction: "row",
                    first: node,
                    second: "rightbar",
                    splitPercentage: rightSidebarSize ??
                        mosaicRightSidebarSplitPercentage(oldValue) ??
                        defaultRightPercentage,
                };
            }
            if (oldLeftSidebarOpen || leftSidebarOpen) {
                node = {
                    direction: "row",
                    first: "leftbar",
                    second: node,
                    splitPercentage: leftSidebarSize ?? mosaicLeftSidebarSplitPercentage(oldValue) ?? defaultLeftPercentage,
                };
            }
            return node;
        });
    }, [
        enableNewTopNav,
        leftSidebarSize,
        oldLeftSidebarOpen,
        rightSidebarSize,
        leftSidebarOpen,
        rightSidebarOpen,
    ]);
    const SelectedLeftComponent = (selectedKey != undefined && allOldLeftItems.get(selectedKey)?.component) ?? Noop;
    const onClickTabAction = useCallback((key) => {
        // toggle tab selected/unselected on click
        if (selectedKey === key) {
            onSelectKey(undefined);
        }
        else {
            onSelectKey(key);
        }
    }, [selectedKey, onSelectKey]);
    const topTabs = useMemo(() => {
        return [...items.entries()].map(([key, item]) => (_jsx(Tab, { "data-sidebar-key": key, className: classes.tab, value: key, title: item.title, onClick: () => {
                onClickTabAction(key);
            }, icon: _jsx(Badge, { className: classes.badge, badgeContent: item.badge?.count, invisible: item.badge == undefined, color: "error", anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "right",
                }, children: _jsx(BuiltinIcon, { name: item.iconName }) }) }, key)));
    }, [classes, items, onClickTabAction]);
    const bottomTabs = useMemo(() => {
        return [...bottomItems.entries()].map(([key, item]) => (_jsx(Tab, { className: classes.tab, value: key, title: item.title, onClick: () => {
                onClickTabAction(key);
            }, icon: _jsx(Badge, { className: classes.badge, badgeContent: item.badge?.count, invisible: item.badge == undefined, color: "error", anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "right",
                }, children: _jsx(BuiltinIcon, { name: item.iconName }) }) }, key)));
    }, [bottomItems, classes, onClickTabAction]);
    const onChangeMosaicValue = useCallback((newValue) => {
        if (newValue != undefined) {
            setMosaicValue(newValue);
            setLeftSidebarSize(mosaicLeftSidebarSplitPercentage(newValue));
            setRightSidebarSize(mosaicRightSidebarSplitPercentage(newValue));
        }
    }, [setLeftSidebarSize, setRightSidebarSize]);
    return (_jsxs(Stack, { direction: "row", fullHeight: true, overflow: "hidden", children: [!enableNewTopNav && (_jsxs(Stack, { className: classes.leftNav, flexShrink: 0, justifyContent: "space-between", children: [_jsxs(Tabs, { className: classes.tabs, orientation: "vertical", variant: "scrollable", value: selectedKey ?? false, scrollButtons: false, children: [topTabs, _jsx(TabSpacer, {}), enableMemoryUseIndicator && _jsx(MemoryUseIndicator, {}), _jsx(Tab, { className: classes.tab, color: "inherit", id: "help-button", "aria-label": "Help menu button", "aria-controls": helpMenuOpen ? "help-menu" : undefined, "aria-haspopup": "true", "aria-expanded": helpMenuOpen ? "true" : undefined, onClick: (event) => {
                                    handleHelpClick(event);
                                }, icon: _jsx(HelpOutlineIcon, { color: helpMenuOpen ? "primary" : "inherit" }) }), bottomTabs] }), _jsx(HelpMenu, { anchorEl: helpAnchorEl, open: helpMenuOpen, handleClose: handleHelpClose, anchorOrigin: {
                            horizontal: "right",
                            vertical: "bottom",
                        }, transformOrigin: {
                            vertical: "bottom",
                            horizontal: "left",
                        } })] })), _jsx("div", { className: classes.mosaicWrapper, children: _jsx(MosaicWithoutDragDropContext, { className: "", value: mosaicValue, onChange: onChangeMosaicValue, renderTile: (id) => {
                        switch (id) {
                            case "children":
                                return _jsx(ErrorBoundary, { children: children });
                            case "leftbar":
                                return (_jsx(ErrorBoundary, { children: enableNewTopNav ? (_jsx(NewSidebar, { anchor: "left", onClose: () => {
                                            onSelectLeftKey(undefined);
                                        }, items: leftItems, activeTab: selectedLeftKey, setActiveTab: onSelectLeftKey })) : (_jsx(Paper, { square: true, elevation: 0, children: SelectedLeftComponent !== false ? _jsx(SelectedLeftComponent, {}) : _jsx(_Fragment, {}) })) }));
                            case "rightbar":
                                return (_jsx(ErrorBoundary, { children: _jsx(NewSidebar, { anchor: "right", onClose: () => {
                                            onSelectRightKey(undefined);
                                        }, items: rightItems, activeTab: selectedRightKey, setActiveTab: onSelectRightKey }) }));
                        }
                    }, resize: { minimumPaneSizePercentage: 10 } }) })] }));
}
