import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import ErrorIcon from "@mui/icons-material/Error";
import HelpIcon from "@mui/icons-material/Help";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import { List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import * as _ from "lodash-es";
import { makeStyles } from "tss-react/mui";
import Stack from "@lichtblick/suite-base/components/Stack";
import { DIAGNOSTIC_SEVERITY } from "@lichtblick/suite-base/players/UserScriptPlayer/constants";
const severityIcons = {
    Hint: _jsx(HelpIcon, { fontSize: "small" }),
    Info: _jsx(InfoIcon, { fontSize: "small", color: "info" }),
    Warning: _jsx(WarningIcon, { fontSize: "small", color: "warning" }),
    Error: _jsx(ErrorIcon, { fontSize: "small", color: "error" }),
};
const useStyles = makeStyles()((theme) => ({
    listItem: {
        paddingTop: 0,
        paddingBottom: 0,
        marginBlock: theme.spacing(0.5),
    },
    listItemText: {
        display: "flex",
        flexDirection: "row",
        margin: 0,
        gap: theme.spacing(1),
    },
    listItemIcon: {
        alignSelf: "flex-start",
        minWidth: theme.spacing(3),
    },
}));
const DiagnosticsSection = ({ diagnostics }) => {
    const { classes } = useStyles();
    if (diagnostics.length === 0) {
        return (_jsx(Stack, { gap: 0.5, padding: 2, children: _jsx(Typography, { variant: "body2", color: "text.secondary", children: "No alerts to display." }) }));
    }
    return (_jsx(List, { dense: true, disablePadding: true, children: diagnostics.map(({ severity, message, source, startColumn, startLineNumber }, i) => {
            const severityLabel = _.invert(DIAGNOSTIC_SEVERITY)[severity] ?? "Error";
            const errorLoc = startLineNumber != undefined && startColumn != undefined
                ? `[${startLineNumber + 1},${startColumn + 1}]`
                : "";
            return (_jsxs(ListItem, { className: classes.listItem, children: [_jsx(ListItemIcon, { className: classes.listItemIcon, children: severityIcons[severityLabel] }), _jsx(ListItemText, { className: classes.listItemText, primary: message, secondary: `${source} ${errorLoc}`, secondaryTypographyProps: {
                            color: "text.secondary",
                        } })] }, `${message}_${i}`));
        }) }));
};
export default DiagnosticsSection;
