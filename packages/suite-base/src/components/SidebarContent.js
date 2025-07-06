import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { Typography } from "@mui/material";
import { Fragment } from "react";
import { makeStyles } from "tss-react/mui";
import Stack from "@lichtblick/suite-base/components/Stack";
const useStyles = makeStyles()((theme) => ({
    leadingItems: {
        display: "flex",
        alignItems: "center",
        marginLeft: theme.spacing(-1),
        gap: theme.spacing(0.5),
    },
    toolbar: {
        minHeight: 56,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(2, 2, 0, 2),
        gap: theme.spacing(0.5),
    },
}));
export function SidebarContent({ disablePadding = false, disableToolbar = false, title, children, leadingItems, overflow = "auto", trailingItems, }) {
    const { classes } = useStyles();
    return (_jsxs(Stack, { overflow: overflow, fullHeight: true, flex: "auto", gap: 1, children: [!disableToolbar && (_jsxs("div", { className: classes.toolbar, children: [leadingItems != undefined && (_jsx("div", { className: classes.leadingItems, children: leadingItems.map((item, i) => (_jsx(Fragment, { children: item }, i))) })), _jsx(Typography, { component: "h2", variant: "h4", fontWeight: 800, flex: "auto", children: title }), trailingItems != undefined && (_jsx(Stack, { direction: "row", alignItems: "center", children: trailingItems.map((item, i) => (_jsx("div", { children: item }, i))) }))] })), _jsx(Stack, { flex: "auto", ...(!disablePadding && { padding: 2 }), children: children })] }));
}
