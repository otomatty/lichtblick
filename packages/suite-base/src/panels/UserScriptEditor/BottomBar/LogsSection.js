import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { Link, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Tree from "react-json-tree";
import { makeStyles } from "tss-react/mui";
import Stack from "@lichtblick/suite-base/components/Stack";
import { useJsonTreeTheme } from "@lichtblick/suite-base/util/globalConstants";
const useStyles = makeStyles()({
    list: {
        height: "100%",
        overflowY: "auto",
    },
});
const LogsSection = ({ logs }) => {
    // Manage auto-scroll behavior when user is also manually scrolling the list.
    const [autoScroll, setAutoScroll] = useState(true);
    const { classes } = useStyles();
    const listRef = useRef(ReactNull);
    useEffect(() => {
        if (autoScroll) {
            if (listRef.current) {
                listRef.current.scrollTop = listRef.current.scrollHeight;
            }
        }
    }, [autoScroll, logs]);
    useEffect(() => {
        const ref = listRef.current;
        function listener(event) {
            if (event.deltaY < 0) {
                setAutoScroll(false);
            }
            else {
                const scrolledUp = ref != undefined && ref.scrollHeight - ref.scrollTop > ref.clientHeight;
                if (scrolledUp) {
                    setAutoScroll(true);
                }
            }
        }
        ref?.addEventListener("wheel", listener);
        return () => {
            ref?.removeEventListener("wheel", listener);
        };
    }, []);
    const jsonTreeTheme = useJsonTreeTheme();
    const valueColorMap = {
        string: jsonTreeTheme.base0B,
        number: jsonTreeTheme.base09,
        boolean: jsonTreeTheme.base09,
        object: jsonTreeTheme.base08, // null
        undefined: jsonTreeTheme.base08,
    };
    if (logs.length === 0) {
        return (_jsxs(Stack, { gap: 0.5, padding: 2, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "No logs to display." }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["Invoke ", _jsx("code", { children: "log(someValue)" }), " in your Lichtblick Suite node code to see data printed here."] })] }));
    }
    return (_jsx(List, { dense: true, disablePadding: true, ref: listRef, className: classes.list, children: logs.map(({ source, value }, idx) => {
            const renderTreeObj = value != undefined && typeof value === "object";
            return (_jsx(ListItem, { disablePadding: true, secondaryAction: _jsx(Link, { underline: "always", variant: "body2", color: "text.secondary", children: source }), children: _jsx(ListItemButton, { children: renderTreeObj ? (_jsx(Tree, { hideRoot: true, data: value, invertTheme: false, theme: jsonTreeTheme })) : (_jsx(ListItemText, { primary: value == undefined || value === false
                            ? String(value)
                            : value, primaryTypographyProps: {
                            color: valueColorMap[typeof value] ?? "text.primary",
                        } })) }) }, `${idx}${source}`));
        }) }));
};
export default LogsSection;
