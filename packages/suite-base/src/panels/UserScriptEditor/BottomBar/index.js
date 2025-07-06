import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
//
// This file incorporates work covered by the following copyright and
// permission notice:
//
//   Copyright 2019-2021 Cruise LLC
//
//   This source code is licensed under the Apache License, Version 2.0,
//   found at http://www.apache.org/licenses/LICENSE-2.0
//   You may not use this file except in compliance with the License.
//
import { Badge, Button, Divider, Paper, Tab, Tabs, badgeClasses, tabClasses } from "@mui/material";
import { useState } from "react";
import { makeStyles } from "tss-react/mui";
import Stack from "@lichtblick/suite-base/components/Stack";
import { useUserScriptState, } from "@lichtblick/suite-base/context/UserScriptStateContext";
import DiagnosticsSection from "@lichtblick/suite-base/panels/UserScriptEditor/BottomBar/DiagnosticsSection";
import LogsSection from "@lichtblick/suite-base/panels/UserScriptEditor/BottomBar/LogsSection";
const TAB_HEIGHT = 36;
const useStyles = makeStyles()((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflowY: "hidden",
    },
    badge: {
        alignItems: "center",
        [`.${badgeClasses.badge}`]: {
            margin: theme.spacing(-0.25, 0, -0.25, 1),
            position: "relative",
            transform: "none",
            [`&.${badgeClasses.invisible}`]: {
                display: "none",
            },
        },
    },
    tabs: {
        minHeight: TAB_HEIGHT,
        position: "relative",
        bottom: -1,
        [`.${tabClasses.root}`]: {
            minHeight: "auto",
            minWidth: theme.spacing(8),
            padding: theme.spacing(1.5, 2),
            color: theme.palette.text.secondary,
            "&.Mui-selected": {
                color: theme.palette.text.primary,
            },
        },
    },
}));
const selectUserScriptActions = (store) => store.actions;
const BottomBar = ({ diagnostics, isSaved, logs, scriptId, onChangeTab, save, }) => {
    const { classes } = useStyles();
    const [bottomBarDisplay, setBottomBarDisplay] = useState("diagnostics");
    const { clearUserScriptLogs } = useUserScriptState(selectUserScriptActions);
    const handleChange = (_event, value) => {
        setBottomBarDisplay(value);
    };
    const handleClick = () => {
        onChangeTab();
    };
    return (_jsx(_Fragment, { children: _jsxs(Paper, { elevation: 0, className: classes.root, children: [_jsx(Divider, {}), _jsxs(Stack, { direction: "row", alignItems: "center", justifyContent: "space-between", gap: 1, paddingRight: 1, children: [_jsxs(Tabs, { className: classes.tabs, textColor: "inherit", value: bottomBarDisplay, onChange: handleChange, children: [_jsx(Tab, { label: _jsx(Badge, { color: "error", badgeContent: diagnostics.length, invisible: diagnostics.length === 0, className: classes.badge, children: "Alerts" }), value: "diagnostics", "data-testid": "np-errors", onClick: () => {
                                        handleClick();
                                    } }), _jsx(Tab, { label: _jsx(Badge, { color: "error", className: classes.badge, badgeContent: logs.length, invisible: logs.length === 0, children: "Logs" }), value: "logs", "data-testid": "np-logs", onClick: () => {
                                        handleClick();
                                    } })] }), _jsxs(Stack, { direction: "row", alignItems: "center", gap: 0.5, fullHeight: true, children: [bottomBarDisplay === "logs" && (_jsx(Button, { size: "small", color: "primary", variant: "contained", "data-testid": "np-logs-clear", disabled: logs.length === 0, onClick: () => {
                                        if (scriptId != undefined) {
                                            clearUserScriptLogs(scriptId);
                                        }
                                    }, children: "Clear logs" })), _jsx(Button, { size: "small", color: "primary", variant: "contained", disabled: isSaved, title: "Ctrl/Cmd + S", onClick: () => {
                                        if (scriptId != undefined) {
                                            save();
                                            clearUserScriptLogs(scriptId);
                                        }
                                    }, children: isSaved ? "Saved" : "Save" })] })] }), _jsx(Divider, {}), bottomBarDisplay === "diagnostics" && _jsx(DiagnosticsSection, { diagnostics: diagnostics }), bottomBarDisplay === "logs" && _jsx(LogsSection, { logs: logs })] }) }));
};
export default BottomBar;
