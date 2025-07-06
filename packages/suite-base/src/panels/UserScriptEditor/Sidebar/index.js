import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { DocumentOnePageSparkle24Regular, Script24Regular, Toolbox24Regular, } from "@fluentui/react-icons";
import { Divider, Paper, Tab, Tabs, tabClasses, tabsClasses } from "@mui/material";
import * as monacoApi from "monaco-editor/esm/vs/editor/editor.api";
import { useCallback, useMemo, useState } from "react";
import tc from "tinycolor2";
import { makeStyles } from "tss-react/mui";
import Stack from "@lichtblick/suite-base/components/Stack";
import { ScriptsList } from "./ScriptsList";
import { Templates } from "./Templates";
import { Utilities } from "./Utilities";
const useStyles = makeStyles()((theme) => ({
    tabs: {
        padding: theme.spacing(0.75),
        [`.${tabClasses.root}`]: {
            minWidth: "auto",
            minHeight: 44,
            padding: theme.spacing(1, 1.25),
        },
        [`.${tabsClasses.indicator}`]: {
            backgroundColor: tc(theme.palette.primary.main)
                .setAlpha(theme.palette.action.selectedOpacity)
                .toString(),
            right: 0,
            width: "100%",
            borderRadius: theme.shape.borderRadius,
            transition: "none",
            pointerEvents: "none",
        },
    },
    explorerWrapper: {
        backgroundColor: theme.palette.background.paper,
        width: 350,
        overflow: "auto",
    },
}));
export function Sidebar({ userScripts, selectScript, deleteScript, selectedScriptId, selectedScript, setScriptOverride, setUserScripts, script, addNewScript: addNewNode, }) {
    const { classes } = useStyles();
    const [activeTab, setActiveTab] = useState(false);
    const gotoUtils = useCallback((filePath) => {
        const monacoFilePath = monacoApi.Uri.parse(`file://${filePath}`);
        const requestedModel = monacoApi.editor.getModel(monacoFilePath);
        if (!requestedModel) {
            return;
        }
        setScriptOverride({
            filePath: requestedModel.uri.path,
            code: requestedModel.getValue(),
            readOnly: true,
            selection: undefined,
        }, 2);
    }, [setScriptOverride]);
    const handleClose = () => {
        setActiveTab(false);
    };
    const handleTabSelection = useCallback((_event, newValue) => {
        if (activeTab === newValue) {
            setActiveTab(false);
            return;
        }
        setActiveTab(newValue);
    }, [activeTab]);
    const tabPanels = useMemo(() => ({
        nodes: (_jsx(ScriptsList, { scripts: userScripts, selectScript: selectScript, deleteScript: deleteScript, addNewScript: addNewNode, onClose: handleClose, selectedScriptId: selectedScriptId, selectedScript: selectedScript, setUserScripts: setUserScripts })),
        utils: _jsx(Utilities, { onClose: handleClose, gotoUtils: gotoUtils, script: script }),
        templates: _jsx(Templates, { onClose: handleClose, addNewNode: addNewNode }),
    }), [
        addNewNode,
        deleteScript,
        gotoUtils,
        script,
        selectScript,
        selectedScript,
        selectedScriptId,
        setUserScripts,
        userScripts,
    ]);
    return (_jsx(Paper, { elevation: 0, children: _jsxs(Stack, { direction: "row", fullHeight: true, children: [_jsxs(Tabs, { className: classes.tabs, orientation: "vertical", value: activeTab, onChange: handleTabSelection, children: [_jsx(Tab, { disableRipple: true, value: "nodes", title: `Scripts (${Object.keys(userScripts).length})`, icon: _jsx(Script24Regular, {}), "data-testid": "node-explorer", onClick: activeTab === "nodes" ? handleClose : undefined }), _jsx(Tab, { disableRipple: true, value: "utils", title: "Utilities", icon: _jsx(Toolbox24Regular, {}), "data-testid": "utils-explorer", onClick: activeTab === "utils" ? handleClose : undefined }), _jsx(Tab, { disableRipple: true, value: "templates", title: "Templates", icon: _jsx(DocumentOnePageSparkle24Regular, {}), "data-testid": "templates-explorer", onClick: activeTab === "templates" ? handleClose : undefined })] }), activeTab !== false && (_jsxs(_Fragment, { children: [_jsx(Divider, { flexItem: true, orientation: "vertical" }), _jsx("div", { className: classes.explorerWrapper, children: tabPanels[activeTab] })] })), _jsx(Divider, { flexItem: true, orientation: "vertical" })] }) }));
}
