import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
//
// This file incorporates work covered by the following copyright and
// permission notice:
//
//   Copyright 2018-2021 Cruise LLC
//
//   This source code is licensed under the Apache License, Version 2.0,
//   found at http://www.apache.org/licenses/LICENSE-2.0
//   You may not use this file except in compliance with the License.
import { InputBase, MenuItem, Select, Typography } from "@mui/material";
import { produce } from "immer";
import * as _ from "lodash-es";
import { useCallback, useEffect, useMemo } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { filterMap } from "@lichtblick/den/collection";
import { useDataSourceInfo } from "@lichtblick/suite-base/PanelAPI";
import EmptyState from "@lichtblick/suite-base/components/EmptyState";
import { usePanelContext } from "@lichtblick/suite-base/components/PanelContext";
import PanelToolbar from "@lichtblick/suite-base/components/PanelToolbar";
import Stack from "@lichtblick/suite-base/components/Stack";
import DiagnosticNodeRow from "@lichtblick/suite-base/panels/DiagnosticSummary/DiagnosticNodeRow";
import { useStyles } from "@lichtblick/suite-base/panels/DiagnosticSummary/DiagnosticSummary.style";
import { ALLOWED_DATATYPES, DEFAULT_SECONDS_UNTIL_STALE, KNOWN_LEVELS, LEVEL_NAMES, MESSAGE_COLORS, } from "@lichtblick/suite-base/panels/DiagnosticSummary/constants";
import useDiagnostics from "@lichtblick/suite-base/panels/DiagnosticSummary/hooks/useDiagnostics";
import useStaleTime from "@lichtblick/suite-base/panels/DiagnosticSummary/hooks/useStaleTime";
import { getDiagnosticsWithStales } from "@lichtblick/suite-base/panels/DiagnosticSummary/utils/getDiagnosticsWithStales";
import { usePanelSettingsTreeUpdate } from "@lichtblick/suite-base/providers/PanelStateContextProvider";
import toggle from "@lichtblick/suite-base/util/toggle";
import { buildSettingsTree } from "./utils/buildSettingsTree";
import { filterAndSortDiagnostics, getDiagnosticsByLevel } from "./utils/util";
const DiagnosticSummary = (props) => {
    const { config, saveConfig } = props;
    const { classes } = useStyles();
    const { topics } = useDataSourceInfo();
    const { minLevel, topicToRender, pinnedIds, hardwareIdFilter, sortByLevel = true, secondsUntilStale = DEFAULT_SECONDS_UNTIL_STALE, } = config;
    const { openSiblingPanel } = usePanelContext();
    const updatePanelSettingsTree = usePanelSettingsTreeUpdate();
    const staleTime = useStaleTime(secondsUntilStale);
    const togglePinned = useCallback((info) => {
        saveConfig({ pinnedIds: toggle(pinnedIds, info.id) });
    }, [pinnedIds, saveConfig]);
    const showDetails = useCallback((info) => {
        openSiblingPanel({
            panelType: "DiagnosticStatusPanel",
            siblingConfigCreator: () => ({
                selectedHardwareId: info.status.hardware_id,
                selectedName: info.status.name,
                topicToRender,
                collapsedSections: [],
            }),
            updateIfExists: true,
        });
    }, [topicToRender, openSiblingPanel]);
    const renderRow = useCallback((renderProps) => {
        const item = renderProps.data[renderProps.index];
        return (_jsx("div", { style: { ...renderProps.style }, "data-testid": `diagnostic-summary-node-row-${renderProps.index}`, children: _jsx(DiagnosticNodeRow, { info: item, isPinned: pinnedIds.includes(item.id), onClick: showDetails, onClickPin: togglePinned }, item.id) }));
    }, [pinnedIds, showDetails, togglePinned]);
    // Filter down all topics to those that conform to our supported datatypes
    const availableTopics = useMemo(() => {
        const filtered = topics
            .filter((topic) => topic.schemaName != undefined && ALLOWED_DATATYPES.includes(topic.schemaName))
            .map((topic) => topic.name);
        // Keeps only the first occurrence of each topic.
        return _.uniq([...filtered]);
    }, [topics]);
    // If the topicToRender is not in the availableTopics, then we should not try to use it
    const diagnosticTopic = useMemo(() => {
        return availableTopics.includes(topicToRender) ? topicToRender : undefined;
    }, [availableTopics, topicToRender]);
    const diagnostics = useDiagnostics(diagnosticTopic);
    const diagnosticsWithOldMarkedAsStales = useMemo(() => {
        return staleTime ? getDiagnosticsWithStales(diagnostics, staleTime) : diagnostics;
    }, [diagnostics, staleTime]);
    const summary = useMemo(() => {
        if (diagnosticsWithOldMarkedAsStales.size === 0) {
            return (_jsxs(EmptyState, { children: ["Waiting for ", _jsx("code", { children: topicToRender }), " messages"] }));
        }
        const pinnedNodes = filterMap(pinnedIds, (id) => {
            const [, trimmedHardwareId, name] = id.split("|");
            if (name == undefined || trimmedHardwareId == undefined) {
                return;
            }
            const diagnosticsByName = diagnosticsWithOldMarkedAsStales.get(trimmedHardwareId);
            return diagnosticsByName?.get(name);
        });
        const nodesByLevel = getDiagnosticsByLevel(diagnosticsWithOldMarkedAsStales);
        const levels = Array.from(nodesByLevel.keys()).sort().reverse();
        const sortedNodes = sortByLevel
            ? [].concat(...levels.map((level) => filterAndSortDiagnostics(nodesByLevel.get(level) ?? [], hardwareIdFilter, pinnedIds)))
            : filterAndSortDiagnostics([].concat(...nodesByLevel.values()), hardwareIdFilter, pinnedIds);
        const nodes = [..._.compact(pinnedNodes), ...sortedNodes].filter(({ status }) => status.level >= minLevel);
        if (nodes.length === 0) {
            return ReactNull;
        }
        return (_jsx(AutoSizer, { children: ({ height, width }) => (_jsx(List, { width: width, height: height, style: { outline: "none" }, itemSize: 30, itemData: nodes, itemCount: nodes.length, overscanCount: 10, children: renderRow })) }));
    }, [
        diagnosticsWithOldMarkedAsStales,
        hardwareIdFilter,
        pinnedIds,
        renderRow,
        sortByLevel,
        minLevel,
        topicToRender,
    ]);
    const actionHandler = useCallback((action) => {
        if (action.action !== "update") {
            return;
        }
        const { path, value } = action.payload;
        saveConfig(produce((draft) => _.set(draft, path.slice(1), value)));
    }, [saveConfig]);
    useEffect(() => {
        updatePanelSettingsTree({
            actionHandler,
            nodes: buildSettingsTree({ config, topicToRender, availableTopics }),
        });
    }, [actionHandler, availableTopics, config, topicToRender, updatePanelSettingsTree]);
    return (_jsxs(Stack, { flex: "auto", children: [_jsx(PanelToolbar, { children: _jsxs(Stack, { flex: "auto", direction: "row", gap: 1, children: [_jsx(Select, { className: classes.select, value: minLevel, id: "status-filter-menu", color: "secondary", size: "small", onChange: (event) => {
                                saveConfig({ minLevel: event.target.value });
                            }, MenuProps: { MenuListProps: { dense: true } }, children: KNOWN_LEVELS.map((level) => (_jsx(MenuItem, { value: level, children: _jsx(Typography, { variant: "inherit", color: MESSAGE_COLORS[level], children: LEVEL_NAMES[level]?.toUpperCase() }) }, level))) }), _jsx(InputBase, { value: hardwareIdFilter, placeholder: "Filter", onChange: (e) => {
                                saveConfig({ hardwareIdFilter: e.target.value });
                            }, style: { flex: "auto", font: "inherit" } })] }) }), _jsx(Stack, { flex: "auto", children: summary })] }));
};
export default DiagnosticSummary;
