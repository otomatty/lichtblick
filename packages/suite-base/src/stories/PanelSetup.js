import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
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
import { useTheme } from "@mui/material";
import * as _ from "lodash-es";
import { useLayoutEffect, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTranslation } from "react-i18next";
import { Mosaic, MosaicWindow } from "react-mosaic-component";
import { useShallowMemo } from "@lichtblick/hooks";
import MockMessagePipelineProvider from "@lichtblick/suite-base/components/MessagePipeline/MockMessagePipelineProvider";
import SettingsTreeEditor from "@lichtblick/suite-base/components/SettingsTreeEditor";
import AppConfigurationContext from "@lichtblick/suite-base/context/AppConfigurationContext";
import { useCurrentLayoutActions } from "@lichtblick/suite-base/context/CurrentLayoutContext";
import PanelCatalogContext from "@lichtblick/suite-base/context/PanelCatalogContext";
import { usePanelStateStore, } from "@lichtblick/suite-base/context/PanelStateContext";
import { UserScriptStateProvider, useUserScriptState, } from "@lichtblick/suite-base/context/UserScriptStateContext";
import * as panels from "@lichtblick/suite-base/panels";
import MockCurrentLayoutProvider from "@lichtblick/suite-base/providers/CurrentLayoutProvider/MockCurrentLayoutProvider";
import ExtensionCatalogProvider from "@lichtblick/suite-base/providers/ExtensionCatalogProvider";
import { PanelStateContextProvider } from "@lichtblick/suite-base/providers/PanelStateContextProvider";
import TimelineInteractionStateProvider from "@lichtblick/suite-base/providers/TimelineInteractionStateProvider";
import WorkspaceContextProvider from "@lichtblick/suite-base/providers/WorkspaceContextProvider";
import ThemeProvider from "@lichtblick/suite-base/theme/ThemeProvider";
import "react-mosaic-component/react-mosaic-component.css";
function noop() { }
function makeMockPanelCatalog(t) {
    const allPanels = [...panels.getBuiltin(t)];
    const visiblePanels = [...panels.getBuiltin(t)];
    return {
        // storybookの修正箇所
        panels: visiblePanels,
        // ここまで修正
        getPanelByType(type) {
            return allPanels.find((panel) => panel.type === type);
        },
    };
}
export function triggerWheel(target, deltaX) {
    const event = new WheelEvent("wheel", { deltaX, bubbles: true, cancelable: true });
    target.dispatchEvent(event);
}
const MosaicWrapper = ({ children }) => {
    return (_jsx(DndProvider, { backend: HTML5Backend, children: _jsx(Mosaic, { className: "mosaic-foxglove-theme" // prevent the default mosaic theme from being applied
            , initialValue: "mock", renderTile: (_id, path) => {
                return (_jsx(MosaicWindow, { title: "", path: path, renderPreview: () => _jsx("div", {}), children: children }));
            } }) }));
};
const EmptyTree = {
    actionHandler: () => undefined,
    nodes: {},
};
function PanelWrapper({ children, includeSettings = false, settingsWidth, }) {
    const settings = usePanelStateStore((store) => {
        const trees = Object.values(store.settingsTrees);
        if (trees.length > 1) {
            throw new Error(`includeSettings requires there to be at most 1 panel, found ${trees.length}`);
        }
        return trees[0] ?? EmptyTree;
    });
    return (_jsxs(_Fragment, { children: [includeSettings && (_jsx("div", { style: { overflow: "auto", width: settingsWidth }, children: _jsx(SettingsTreeEditor, { variant: "panel", settings: settings }) })), children] }));
}
const defaultFetchAsset = async (uri, options) => {
    const response = await fetch(uri, options);
    return {
        uri,
        data: new Uint8Array(await response.arrayBuffer()),
        mediaType: response.headers.get("content-type") ?? undefined,
    };
};
const selectUserScriptActions = (store) => store.actions;
function UnconnectedPanelSetup(props) {
    const { t } = useTranslation("panels");
    const mockPanelCatalog = useMemo(() => props.panelCatalog ?? makeMockPanelCatalog(t), [props.panelCatalog, t]);
    const [mockAppConfiguration] = useState(() => ({
        get() {
            return undefined;
        },
        async set() { },
        addChangeListener() { },
        removeChangeListener() { },
    }));
    const actions = useCurrentLayoutActions();
    const { setUserScriptDiagnostics, addUserScriptLogs, setUserScriptRosLib } = useUserScriptState(selectUserScriptActions);
    const userScriptActions = useShallowMemo({
        setUserScriptDiagnostics,
        addUserScriptLogs,
        setUserScriptRosLib,
    });
    const [initialized, setInitialized] = useState(false);
    useLayoutEffect(() => {
        if (initialized) {
            return;
        }
        const { globalVariables, userScripts, layout, savedProps, userScriptDiagnostics, userScriptRosLib, userScriptLogs, } = props.fixture ?? {};
        if (globalVariables) {
            actions.overwriteGlobalVariables(globalVariables);
        }
        if (userScripts) {
            actions.setUserScripts(userScripts);
        }
        if (layout != undefined) {
            actions.changePanelLayout({ layout });
        }
        if (userScriptDiagnostics) {
            for (const [scriptId, diagnostics] of Object.entries(userScriptDiagnostics)) {
                userScriptActions.setUserScriptDiagnostics(scriptId, diagnostics);
            }
        }
        if (userScriptLogs) {
            for (const [scriptId, logs] of Object.entries(userScriptLogs)) {
                userScriptActions.addUserScriptLogs(scriptId, logs);
            }
        }
        if (userScriptRosLib != undefined) {
            userScriptActions.setUserScriptRosLib(userScriptRosLib);
        }
        if (savedProps) {
            actions.savePanelConfigs({
                configs: Object.entries(savedProps).map(([id, config]) => ({ id, config })),
            });
        }
        setInitialized(true);
    }, [initialized, props.fixture, actions, userScriptActions]);
    const { frame = {}, topics = [], datatypes, capabilities, profile, activeData, progress, publish, setPublishers, setSubscriptions, setParameter, fetchAsset, callService, } = props.fixture ?? {};
    let dTypes = datatypes;
    if (!dTypes) {
        const dummyDatatypes = new Map();
        for (const { schemaName } of topics) {
            if (schemaName != undefined) {
                dummyDatatypes.set(schemaName, { definitions: [] });
            }
        }
        dTypes = dummyDatatypes;
    }
    const allData = _.flatten(Object.values(frame));
    const inner = (_jsx("div", { style: { width: "100%", height: "100%", display: "flex", ...props.style }, className: props.className, children: _jsx(MockMessagePipelineProvider, { capabilities: capabilities, topics: topics, datatypes: dTypes, messages: allData, pauseFrame: props.pauseFrame, profile: profile, activeData: activeData, progress: progress, publish: publish, startPlayback: noop, pausePlayback: noop, seekPlayback: noop, setPublishers: setPublishers, setSubscriptions: setSubscriptions, setParameter: setParameter, fetchAsset: fetchAsset ?? defaultFetchAsset, callService: callService, children: _jsx(PanelCatalogContext.Provider, { value: mockPanelCatalog, children: _jsx(AppConfigurationContext.Provider, { value: mockAppConfiguration, children: _jsx(PanelWrapper, { includeSettings: props.includeSettings, settingsWidth: props.settingsWidth, children: props.children }) }) }) }) }));
    // Wait to render children until we've initialized state as requested in the fixture
    if (!initialized) {
        return ReactNull;
    }
    const { omitDragAndDrop = false } = props;
    return omitDragAndDrop ? inner : _jsx(MosaicWrapper, { children: inner });
}
export default function PanelSetup(props) {
    const theme = useTheme();
    return (_jsx(WorkspaceContextProvider, { disablePersistenceForStorybook: true, children: _jsx(UserScriptStateProvider, { children: _jsx(TimelineInteractionStateProvider, { children: _jsx(MockCurrentLayoutProvider, { onAction: props.onLayoutAction, children: _jsx(PanelStateContextProvider, { initialState: props.fixture?.panelState, children: _jsx(ExtensionCatalogProvider, { loaders: [], mockMessageConverters: props.fixture?.messageConverters, children: _jsx(ThemeProvider, { isDark: theme.palette.mode === "dark", children: _jsx(UnconnectedPanelSetup, { ...props }) }) }) }) }) }) }) }));
}
