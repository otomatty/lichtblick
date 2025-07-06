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
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, CircularProgress, Container, Divider, IconButton, Link, Typography, } from "@mui/material";
import { Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { PanelGroup, PanelResizeHandle, Panel as ResizablePanel, } from "react-resizable-panels";
import tc from "tinycolor2";
import { makeStyles } from "tss-react/mui";
import { v4 as uuidv4 } from "uuid";
import EmptyState from "@lichtblick/suite-base/components/EmptyState";
import Panel from "@lichtblick/suite-base/components/Panel";
import PanelToolbar from "@lichtblick/suite-base/components/PanelToolbar";
import Stack from "@lichtblick/suite-base/components/Stack";
import { useCurrentLayoutActions, useCurrentLayoutSelector, } from "@lichtblick/suite-base/context/CurrentLayoutContext";
import { useUserScriptState, } from "@lichtblick/suite-base/context/UserScriptStateContext";
import BottomBar from "@lichtblick/suite-base/panels/UserScriptEditor/BottomBar";
import { Sidebar } from "@lichtblick/suite-base/panels/UserScriptEditor/Sidebar";
import { usePanelSettingsTreeUpdate } from "@lichtblick/suite-base/providers/PanelStateContextProvider";
const Editor = React.lazy(async () => await import("@lichtblick/suite-base/panels/UserScriptEditor/Editor"));
const skeletonBody = `\
// The ./types module provides helper types for your Input events and messages.
import { Input, Message } from "./types";

// Your script can output well-known message types, any of your custom message types, or
// complete custom message types.
//
// Use \`Message\` to access types from the schemas defined in your data source:
// type Twist = Message<"geometry_msgs/Twist">;
//
// Import from the @foxglove/schemas package to use foxglove schema types:
// import { Pose, LocationFix } from "@foxglove/schemas";
//
// Conventionally, it's common to make a _type alias_ for your script's output type
// and use that type name as the return type for your script function.
// Here we've called the type \`Output\` but you can pick any type name.
type Output = {
  hello: string;
};

// These are the topics your script "subscribes" to. Studio will invoke your script function
// when any message is received on one of these topics.
export const inputs = ["/input/topic"];

// Any output your script produces is "published" to this topic. Published messages are only visible within Studio, not to your original data source.
export const output = "/studio_script/output_topic";

// This function is called with messages from your input topics.
// The first argument is an event with the topic, receive time, and message.
// Use the \`Input<...>\` helper to get the correct event type for your input topic messages.
export default function script(event: Input<"/input/topic">): Output {
  return {
    hello: "world!",
  };
};`;
const useStyles = makeStyles()((theme) => ({
    emptyState: {
        backgroundColor: theme.palette.background.default,
    },
    resizeHandle: {
        position: "relative",
        height: 10,
        marginTop: -10,
        ":hover": {
            backgroundPosition: "50% 0",
            backgroundSize: "100% 50px",
            backgroundImage: `radial-gradient(${[
                "at center center",
                `${theme.palette.action.focus} 0%`,
                "transparent 70%",
                "transparent 100%",
            ].join(",")})`,
            boxShadow: `0 2px 0 0 ${theme.palette.mode === "dark"
                ? tc(theme.palette.divider).lighten().toString()
                : tc(theme.palette.divider).darken().toString()}`,
        },
    },
}));
function buildSettingsTree(config) {
    return {
        general: {
            fields: {
                autoFormatOnSave: {
                    input: "boolean",
                    label: "Auto-format on save",
                    value: config.autoFormatOnSave,
                },
            },
        },
    };
}
const WelcomeScreen = ({ addNewNode }) => {
    const { classes } = useStyles();
    return (_jsx(EmptyState, { className: classes.emptyState, children: _jsx(Container, { maxWidth: "xs", children: _jsxs(Stack, { justifyContent: "center", alignItems: "center", gap: 1, fullHeight: true, children: [_jsxs(Typography, { variant: "inherit", gutterBottom: true, children: ["Welcome to User Scripts!", _jsx("br", {}), "Get started by reading the", " ", _jsx(Link, { color: "primary", underline: "hover", href: "https://foxglove.dev/docs/studio/panels/user-scripts", target: "_blank", children: "docs" }), ", or just create a new script."] }), _jsx(Button, { color: "inherit", variant: "contained", onClick: () => {
                            addNewNode();
                        }, startIcon: _jsx(AddIcon, {}), children: "New script" })] }) }) }));
};
const EMPTY_USER_NODES = Object.freeze({});
const selectUserScripts = (state) => state.selectedLayout?.data?.userNodes ?? EMPTY_USER_NODES;
const selectState = (store) => store.state;
function UserScriptEditor(props) {
    const { config, saveConfig } = props;
    const { classes, theme } = useStyles();
    const { autoFormatOnSave = false, selectedNodeId, editorForStorybook } = config;
    const updatePanelSettingsTree = usePanelSettingsTreeUpdate();
    const userScripts = useCurrentLayoutSelector(selectUserScripts);
    const { scriptStates: userScriptStates, rosLib, typesLib } = useUserScriptState(selectState);
    const { setUserScripts } = useCurrentLayoutActions();
    const selectedNodeDiagnostics = (selectedNodeId != undefined ? userScriptStates[selectedNodeId]?.diagnostics : undefined) ?? [];
    const selectedScript = selectedNodeId != undefined ? userScripts[selectedNodeId] : undefined;
    const [scriptBackStack, setScriptBackStack] = useState([]);
    // Holds the currently active script
    const currentScript = scriptBackStack.length > 0 ? scriptBackStack[scriptBackStack.length - 1] : undefined;
    const isCurrentScriptSelectedNode = !!selectedScript && !!currentScript && currentScript.filePath === selectedScript.name;
    const isNodeSaved = !isCurrentScriptSelectedNode || currentScript.code === selectedScript.sourceCode;
    const selectedNodeLogs = (selectedNodeId != undefined ? userScriptStates[selectedNodeId]?.logs : undefined) ?? [];
    // The current node name is editable via the "tab". The tab uses a controlled input. React requires
    // that we render the new text on the next render for the controlled input to retain the cursor position.
    // For this we use setInputTitle within the onChange event of the input control.
    //
    // We also update the input title when the script changes using a layout effect below.
    const [inputTitle, setInputTitle] = useState(() => {
        return currentScript
            ? currentScript.filePath + (currentScript.readOnly ? " (READONLY)" : "")
            : "script name";
    });
    const prefersDarkMode = theme.palette.mode === "dark";
    const actionHandler = useCallback((action) => {
        if (action.action !== "update") {
            return;
        }
        const { input, value, path } = action.payload;
        if (input === "boolean" && path[1] === "autoFormatOnSave") {
            saveConfig({ autoFormatOnSave: value });
        }
    }, [saveConfig]);
    useEffect(() => {
        updatePanelSettingsTree({
            actionHandler,
            nodes: buildSettingsTree(config),
        });
    }, [actionHandler, config, updatePanelSettingsTree]);
    useLayoutEffect(() => {
        if (selectedScript) {
            const testItems = props.config.additionalBackStackItems ?? [];
            setScriptBackStack([
                { filePath: selectedScript.name, code: selectedScript.sourceCode, readOnly: false },
                ...testItems,
            ]);
        }
    }, [props.config.additionalBackStackItems, selectedScript]);
    useLayoutEffect(() => {
        setInputTitle(() => {
            return currentScript
                ? currentScript.filePath + (currentScript.readOnly ? " (READONLY)" : "")
                : "script name";
        });
    }, [currentScript]);
    const saveCurrentNode = useCallback(() => {
        if (selectedNodeId != undefined &&
            selectedScript &&
            currentScript &&
            isCurrentScriptSelectedNode) {
            setUserScripts({
                [selectedNodeId]: { ...selectedScript, sourceCode: currentScript.code },
            });
        }
    }, [currentScript, isCurrentScriptSelectedNode, selectedScript, selectedNodeId, setUserScripts]);
    const addNewNode = useCallback((code) => {
        saveCurrentNode();
        const newScriptId = uuidv4();
        const sourceCode = code ?? skeletonBody;
        setUserScripts({
            [newScriptId]: {
                sourceCode,
                name: `${newScriptId.split("-")[0]}`,
            },
        });
        saveConfig({ selectedNodeId: newScriptId });
    }, [saveConfig, saveCurrentNode, setUserScripts]);
    const saveNode = useCallback((script) => {
        if (selectedNodeId == undefined || script == undefined || script === "" || !selectedScript) {
            return;
        }
        setUserScripts({ [selectedNodeId]: { ...selectedScript, sourceCode: script } });
    }, [selectedScript, selectedNodeId, setUserScripts]);
    const setScriptOverride = useCallback((script, maxDepth) => {
        if (maxDepth != undefined && maxDepth > 0 && scriptBackStack.length >= maxDepth) {
            setScriptBackStack([...scriptBackStack.slice(0, maxDepth - 1), script]);
        }
        else {
            setScriptBackStack([...scriptBackStack, script]);
        }
    }, [scriptBackStack]);
    const goBack = useCallback(() => {
        setScriptBackStack(scriptBackStack.slice(0, scriptBackStack.length - 1));
    }, [scriptBackStack]);
    const setScriptCode = useCallback((code) => {
        // update code at top of backstack
        const backStack = [...scriptBackStack];
        if (backStack.length > 0) {
            const script = backStack.pop();
            if (script && !script.readOnly) {
                setScriptBackStack([...backStack, { ...script, code }]);
            }
        }
    }, [scriptBackStack]);
    const saveOnLeave = useCallback(() => {
        if (isNodeSaved) {
            return;
        }
        // automatically save script on panel leave
        saveCurrentNode();
    }, [isNodeSaved, saveCurrentNode]);
    // The cleanup function below should only run when this component unmounts.
    // We're using a ref here so that the cleanup useEffect doesn't run whenever one of the callback
    // dependencies changes, only when the component unmounts and with the most up-to-date callback.
    const saveOnLeaveRef = useRef(saveOnLeave);
    saveOnLeaveRef.current = saveOnLeave;
    useEffect(() => {
        return () => {
            saveOnLeaveRef.current();
        };
    }, []);
    const bottomBarRef = useRef(ReactNull);
    const onChangeBottomBarTab = useCallback(() => {
        bottomBarRef.current?.expand();
    }, []);
    return (_jsxs(Stack, { fullHeight: true, children: [_jsx(PanelToolbar, {}), _jsx(Divider, {}), _jsxs(Stack, { direction: "row", fullHeight: true, overflow: "hidden", children: [_jsx(Sidebar, { selectScript: (scriptId) => {
                            saveCurrentNode();
                            saveConfig({ selectedNodeId: scriptId });
                        }, deleteScript: (scriptId) => {
                            setUserScripts({ ...userScripts, [scriptId]: undefined });
                            saveConfig({
                                selectedNodeId: Object.keys(userScripts).length > 1 ? Object.keys(userScripts)[0] : undefined,
                            });
                        }, selectedScriptId: selectedNodeId, userScripts: userScripts, script: currentScript, setScriptOverride: setScriptOverride, setUserScripts: setUserScripts, selectedScript: selectedScript, addNewScript: addNewNode }), _jsxs(Stack, { flexGrow: 1, fullHeight: true, overflow: "hidden", style: {
                            backgroundColor: theme.palette.background[prefersDarkMode ? "paper" : "default"],
                        }, children: [scriptBackStack.length > 1 && (_jsxs(Stack, { direction: "row", alignItems: "center", gap: 1, children: [scriptBackStack.length > 1 && (_jsx(IconButton, { title: "Go back", "data-testid": "go-back", size: "small", onClick: goBack, children: _jsx(ArrowBackIcon, {}) })), selectedNodeId != undefined && selectedScript && (_jsx("div", { style: { position: "relative" }, children: inputTitle }))] })), _jsxs(PanelGroup, { direction: "vertical", children: [selectedNodeId == undefined && _jsx(WelcomeScreen, { addNewNode: addNewNode }), _jsx(ResizablePanel, { children: _jsx(Suspense, { fallback: _jsx(Stack, { direction: "row", flex: "auto", alignItems: "center", justifyContent: "center", fullHeight: true, fullWidth: true, style: {
                                                    backgroundColor: theme.palette.background[prefersDarkMode ? "default" : "paper"],
                                                }, children: _jsx(CircularProgress, { size: 28 }) }), children: editorForStorybook ?? (_jsx(Editor, { autoFormatOnSave: autoFormatOnSave, script: currentScript, setScriptCode: setScriptCode, setScriptOverride: setScriptOverride, rosLib: rosLib, typesLib: typesLib, save: saveNode })) }) }), _jsx(PanelResizeHandle, { className: classes.resizeHandle }), _jsx(ResizablePanel, { collapsible: true, collapsedSize: 0, defaultSize: 30, style: { minHeight: "38px" }, ref: bottomBarRef, children: _jsx(BottomBar, { diagnostics: selectedNodeDiagnostics, isSaved: isNodeSaved, logs: selectedNodeLogs, scriptId: selectedNodeId, onChangeTab: onChangeBottomBarTab, save: () => {
                                                saveNode(currentScript?.code);
                                            } }) })] })] })] })] }));
}
const defaultConfig = {
    selectedNodeId: undefined,
    autoFormatOnSave: true,
};
export default Panel(Object.assign(UserScriptEditor, {
    panelType: "NodePlayground",
    defaultConfig,
}));
