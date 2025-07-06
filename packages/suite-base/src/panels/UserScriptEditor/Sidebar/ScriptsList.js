import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import AddIcon from "@mui/icons-material/Add";
import { Button, List } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import Stack from "@lichtblick/suite-base/components/Stack";
import { ScriptListItem } from "./ScriptListItem";
import { SidebarHeader } from "./SidebarHeader";
const useStyles = makeStyles()((theme) => ({
    buttonRow: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1, 1.125),
    },
}));
export function ScriptsList({ scripts, addNewScript, selectScript, deleteScript, onClose, selectedScriptId, selectedScript, setUserScripts, }) {
    const { classes } = useStyles();
    return (_jsxs(Stack, { flex: "auto", children: [_jsx(SidebarHeader, { title: "Scripts", onClose: onClose }), _jsxs(List, { children: [Object.keys(scripts).map((scriptId) => {
                        return (_jsx(ScriptListItem, { title: scripts[scriptId]?.name ?? "Untitled script", selected: selectedScriptId === scriptId, onClick: () => {
                                selectScript(scriptId);
                            }, onDelete: () => {
                                deleteScript(scriptId);
                            }, onRename: (name) => {
                                if (selectedScriptId != undefined && selectedScript != undefined) {
                                    setUserScripts({
                                        ...scripts,
                                        [selectedScriptId]: { ...selectedScript, name },
                                    });
                                }
                            } }, scriptId));
                    }), _jsx("li", { className: classes.buttonRow, children: _jsx(Button, { fullWidth: true, startIcon: _jsx(AddIcon, {}), variant: "contained", color: "inherit", onClick: () => {
                                addNewScript();
                            }, children: "New script" }) })] })] }));
}
