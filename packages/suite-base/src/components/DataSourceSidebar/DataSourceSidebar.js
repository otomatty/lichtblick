import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
/* eslint-disable @lichtblick/no-restricted-imports */
import AddIcon from "@mui/icons-material/Add";
import { CircularProgress, Divider, IconButton, Tab, Tabs, styled as muiStyled, } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "tss-react/mui";
import { AppSetting } from "@lichtblick/suite-base/AppSetting";
import { EventsList } from "@lichtblick/suite-base/components/EventsList";
import { useMessagePipeline, } from "@lichtblick/suite-base/components/MessagePipeline";
import { SidebarContent } from "@lichtblick/suite-base/components/SidebarContent";
import Stack from "@lichtblick/suite-base/components/Stack";
import { TopicList } from "@lichtblick/suite-base/components/TopicList";
import WssErrorModal from "@lichtblick/suite-base/components/WssErrorModal";
import { useCurrentUser } from "@lichtblick/suite-base/context/CurrentUserContext";
import { useEvents } from "@lichtblick/suite-base/context/EventsContext";
import { useWorkspaceActions } from "@lichtblick/suite-base/context/Workspace/useWorkspaceActions";
import { useAppConfigurationValue } from "@lichtblick/suite-base/hooks/useAppConfigurationValue";
import { PlayerPresence } from "@lichtblick/suite-base/players/types";
import { AlertsList } from "../AlertsList";
import { DataSourceInfoView } from "../DataSourceInfoView";
const useStyles = makeStyles()({
    tabContent: {
        flex: "auto",
    },
});
const StyledTab = muiStyled(Tab)(({ theme }) => ({
    minHeight: 30,
    minWidth: theme.spacing(8),
    padding: theme.spacing(0, 1.5),
    color: theme.palette.text.secondary,
    fontSize: "0.6875rem",
    "&.Mui-selected": {
        color: theme.palette.text.primary,
    },
}));
const StyledTabs = muiStyled(Tabs)({
    minHeight: "auto",
    ".MuiTabs-indicator": {
        transform: "scaleX(0.5)",
        height: 2,
    },
});
const AlertCount = muiStyled("div")(({ theme }) => ({
    backgroundColor: theme.palette.error.main,
    fontSize: theme.typography.caption.fontSize,
    color: theme.palette.error.contrastText,
    padding: theme.spacing(0.125, 0.75),
    borderRadius: 8,
}));
const selectPlayerPresence = ({ playerState }) => playerState.presence;
const selectPlayerAlerts = ({ playerState }) => playerState.alerts;
const selectSelectedEventId = (store) => store.selectedEventId;
const selectEventsSupported = (store) => store.eventsSupported;
export default function DataSourceSidebar(props) {
    const { disableToolbar = false } = props;
    const playerPresence = useMessagePipeline(selectPlayerPresence);
    const playerAlerts = useMessagePipeline(selectPlayerAlerts) ?? [];
    const { currentUser } = useCurrentUser();
    const selectedEventId = useEvents(selectSelectedEventId);
    const [activeTab, setActiveTab] = useState("topics");
    const { classes } = useStyles();
    const { t } = useTranslation("dataSourceInfo");
    const { dialogActions } = useWorkspaceActions();
    const [enableNewTopNav = true] = useAppConfigurationValue(AppSetting.ENABLE_NEW_TOPNAV);
    const eventsSupported = useEvents(selectEventsSupported);
    const showEventsTab = !enableNewTopNav && currentUser != undefined && eventsSupported;
    const isLoading = useMemo(() => playerPresence === PlayerPresence.INITIALIZING ||
        playerPresence === PlayerPresence.RECONNECTING, [playerPresence]);
    useEffect(() => {
        if (playerPresence === PlayerPresence.ERROR || playerPresence === PlayerPresence.RECONNECTING) {
            setActiveTab("alerts");
        }
        else if (showEventsTab && selectedEventId != undefined) {
            setActiveTab("events");
        }
    }, [playerPresence, showEventsTab, selectedEventId]);
    return (_jsxs(SidebarContent, { disablePadding: true, disableToolbar: disableToolbar, overflow: "auto", title: t("dataSource"), trailingItems: [
            isLoading && (_jsx(Stack, { alignItems: "center", justifyContent: "center", padding: 1, children: _jsx(CircularProgress, { size: 18, variant: "indeterminate" }) }, "loading")),
            _jsx(IconButton, { color: "primary", title: "New connection", onClick: () => {
                    dialogActions.dataSource.open("start");
                }, children: _jsx(AddIcon, {}) }, "add-connection"),
        ].filter(Boolean), children: [_jsxs(Stack, { fullHeight: true, children: [!disableToolbar && (_jsx(Stack, { paddingX: 2, paddingBottom: 2, children: _jsx(DataSourceInfoView, {}) })), playerPresence !== PlayerPresence.NOT_PRESENT && (_jsx(_Fragment, { children: _jsxs(Stack, { flex: 1, children: [!disableToolbar && (_jsxs(_Fragment, { children: [_jsxs(StyledTabs, { value: activeTab, onChange: (_ev, newValue) => {
                                                setActiveTab(newValue);
                                            }, textColor: "inherit", children: [_jsx(StyledTab, { disableRipple: true, label: "Topics", value: "topics" }), showEventsTab && _jsx(StyledTab, { disableRipple: true, label: "Events", value: "events" }), _jsx(StyledTab, { disableRipple: true, label: _jsxs(Stack, { direction: "row", alignItems: "baseline", gap: 1, children: ["Alerts", playerAlerts.length > 0 && (_jsx(AlertCount, { children: playerAlerts.length }))] }), value: "alerts" })] }), _jsx(Divider, {})] })), activeTab === "topics" && (_jsx("div", { className: classes.tabContent, children: _jsx(TopicList, {}) })), activeTab === "events" && (_jsx("div", { className: classes.tabContent, children: _jsx(EventsList, {}) })), activeTab === "alerts" && (_jsx("div", { className: classes.tabContent, children: _jsx(AlertsList, {}) }))] }) }))] }), _jsx(WssErrorModal, { playerAlerts: playerAlerts })] }));
}
