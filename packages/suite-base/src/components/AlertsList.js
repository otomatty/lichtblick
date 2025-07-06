import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { ErrorCircle16Regular, Info16Regular, Warning16Regular } from "@fluentui/react-icons";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Accordion, AccordionDetails, AccordionSummary, Divider, Typography, accordionSummaryClasses, useTheme, } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "tss-react/mui";
import EmptyState from "@lichtblick/suite-base/components/EmptyState";
import { useMessagePipeline, } from "@lichtblick/suite-base/components/MessagePipeline";
import Stack from "@lichtblick/suite-base/components/Stack";
import { useAlertsStore } from "@lichtblick/suite-base/context/AlertsContext";
const useStyles = makeStyles()((theme) => ({
    acccordion: {
        background: "none",
        boxShadow: "none",
        borderBottom: `1px solid ${theme.palette.divider}`,
        "&:before": {
            display: "none",
        },
        "&.Mui-expanded": {
            margin: 0,
        },
    },
    accordionDetails: {
        display: "flex",
        flexDirection: "column",
        fontFamily: theme.typography.fontMonospace,
        fontSize: "0.6875rem",
        padding: theme.spacing(1.125),
        gap: theme.spacing(1),
    },
    acccordionSummary: {
        height: 30,
        minHeight: "auto",
        padding: theme.spacing(0, 0.5, 0, 0.75),
        fontWeight: 500,
        "&:hover": {
            backgroundColor: theme.palette.action.hover,
        },
        "&.Mui-expanded": {
            minHeight: "auto",
        },
        [`& .${accordionSummaryClasses.content}`]: {
            gap: theme.spacing(0.5),
            overflow: "hidden",
            alignItems: "center",
            margin: "0 !important",
        },
        [`& .${accordionSummaryClasses.expandIconWrapper}`]: {
            transform: "rotate(-90deg)",
        },
        [`& .${accordionSummaryClasses.expandIconWrapper}.Mui-expanded`]: {
            transform: "rotate(0deg)",
        },
    },
    detailsText: {
        color: theme.palette.text.primary,
        fontSize: theme.typography.caption.fontSize,
        lineHeight: 1.5,
        whiteSpace: "pre-wrap",
        maxHeight: "30vh",
        overflow: "auto",
        flex: 1,
        backgroundColor: theme.palette.action.hover,
        padding: theme.spacing(1),
    },
    icon: {
        flex: "none",
    },
}));
const EMPTY_PLAYER_ALERTS = [];
const selectPlayerAlerts = ({ playerState }) => playerState.alerts ?? EMPTY_PLAYER_ALERTS;
const selectAlerts = (store) => store.alerts;
function AlertIcon({ severity }) {
    const { palette } = useTheme();
    const { classes } = useStyles();
    switch (severity) {
        case "warn":
            return _jsx(Warning16Regular, { className: classes.icon, primaryFill: palette.warning.main });
        case "error":
            return _jsx(ErrorCircle16Regular, { className: classes.icon, primaryFill: palette.error.main });
        case "info":
            return _jsx(Info16Regular, { className: classes.icon, primaryFill: palette.info.main });
        default:
            return _jsx(_Fragment, {});
    }
}
function AlertDetails(props) {
    const { t } = useTranslation("alertsList");
    const { details, tip } = props;
    const { classes } = useStyles();
    const content = useMemo(() => {
        if (details instanceof Error) {
            return _jsx("div", { className: classes.detailsText, children: details.message });
        }
        else if (details != undefined && details !== "") {
            return (_jsx(Typography, { style: { whiteSpace: "pre-line" /* allow newlines in the details message */ }, children: details }));
        }
        else if (tip != undefined && tip !== "") {
            return undefined;
        }
        return t("noDetailsProvided");
    }, [classes, details, tip, t]);
    return (_jsxs(AccordionDetails, { className: classes.accordionDetails, children: [tip && _jsx("div", { children: tip }), content] }));
}
export function AlertsList() {
    const { t } = useTranslation("alertsList");
    const { classes } = useStyles();
    const playerAlerts = useMessagePipeline(selectPlayerAlerts);
    const sessionAlerts = useAlertsStore(selectAlerts);
    const allAlerts = useMemo(() => {
        return [...sessionAlerts, ...playerAlerts];
    }, [sessionAlerts, playerAlerts]);
    if (allAlerts.length === 0) {
        return _jsx(EmptyState, { children: t("noAlertsFound") });
    }
    return (_jsx(Stack, { fullHeight: true, flex: "auto", overflow: "auto", children: allAlerts.map((alert, idx) => (_jsxs(Accordion, { className: classes.acccordion, TransitionProps: { unmountOnExit: true }, defaultExpanded: true, children: [_jsxs(AccordionSummary, { className: classes.acccordionSummary, expandIcon: _jsx(ArrowDropDownIcon, {}), title: alert.message, children: [_jsx(AlertIcon, { severity: alert.severity }), _jsx(Typography, { variant: "inherit", noWrap: true, children: alert.message })] }), _jsx(Divider, {}), _jsx(AlertDetails, { details: alert.error, tip: alert.tip })] }, `${idx}.${alert.severity}.${alert.message}`))) }));
}
