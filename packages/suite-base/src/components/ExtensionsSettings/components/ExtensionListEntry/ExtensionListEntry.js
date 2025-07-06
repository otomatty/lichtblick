import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import Stack from "@lichtblick/suite-base/components/Stack";
import TextHighlight from "@lichtblick/suite-base/components/TextHighlight";
import { useStyles } from "./ExtensionListEntry.style";
export default function ExtensionListEntry({ entry: { id, description, name, publisher, version }, searchText, onClick, }) {
    const { classes } = useStyles();
    return (_jsx(ListItem, { disablePadding: true, "data-testid": "extension-list-entry", children: _jsx(ListItemButton, { className: classes.listItemButton, onClick: onClick, children: _jsx(ListItemText, { disableTypography: true, primary: _jsxs(Stack, { direction: "row", alignItems: "baseline", gap: 0.5, children: [_jsx(Typography, { variant: "subtitle2", fontWeight: 600, children: _jsx(TextHighlight, { targetStr: name, searchText: searchText }) }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: version })] }), secondary: _jsxs(Stack, { gap: 0.5, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: description }), _jsx(Typography, { color: "text.primary", variant: "body2", children: publisher })] }) }) }) }, id));
}
