import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { Delete20Regular, Edit20Regular } from "@fluentui/react-icons";
import { IconButton, InputBase, ListItem, ListItemButton, ListItemText, inputBaseClasses, listItemSecondaryActionClasses, } from "@mui/material";
import { useCallback, useState } from "react";
import { makeStyles } from "tss-react/mui";
const useStyles = makeStyles()((theme) => ({
    input: {
        font: "inherit",
        padding: theme.spacing(1, 6, 1, 2),
        flexGrow: 1,
        overflow: "hidden",
        [`.${inputBaseClasses.input}`]: {
            padding: 0,
        },
    },
    listItem: {
        [`:not(:hover) .${listItemSecondaryActionClasses.root}`]: {
            visibility: "hidden",
        },
        [`:focus-within`]: {
            backgroundColor: theme.palette.action.selected,
        },
    },
}));
export function ScriptListItem({ onClick, onDelete, onRename, title, selected, }) {
    const { classes } = useStyles();
    const [label, setLabel] = useState(title);
    const [editMode, setEditMode] = useState(false);
    const onChange = useCallback((event) => {
        const name = event.target.value;
        setLabel(name);
    }, []);
    const onDoubleClick = useCallback(() => {
        setEditMode(true);
    }, []);
    const onFocus = useCallback((event) => {
        event.target.select();
    }, []);
    const onKeyDown = useCallback((event) => {
        if (label === "") {
            return;
        }
        if (event.key === "Escape") {
            setLabel(title);
            setEditMode(false);
        }
        else if (event.key === "Enter") {
            setEditMode(false);
            onRename(label);
        }
    }, [label, onRename, title]);
    const onBlur = useCallback(() => {
        if (label !== "") {
            setEditMode(false);
            onRename(label);
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        }
    }, [label, onRename]);
    const onButtonKeyDown = useCallback((event) => {
        if (event.key === "Enter") {
            setEditMode(true);
        }
    }, []);
    return (_jsx(ListItem, { className: classes.listItem, disablePadding: true, secondaryAction: _jsxs(_Fragment, { children: [!editMode && (_jsx(IconButton, { size: "small", "aria-title": "rename", title: "Rename", onClick: () => {
                        setEditMode(true);
                    }, children: _jsx(Edit20Regular, {}) })), _jsx(IconButton, { size: "small", "aria-title": "delete", title: "Delete", color: "error", onClick: onDelete, children: _jsx(Delete20Regular, {}) })] }), children: editMode ? (_jsx(ListItemText, { primaryTypographyProps: { variant: "body2" }, children: _jsx(InputBase, { autoFocus: true, fullWidth: true, onBlur: onBlur, onChange: onChange, onFocus: onFocus, onKeyDown: onKeyDown, value: label, className: classes.input }) })) : (_jsx(ListItemButton, { selected: selected, onClick: onClick, onKeyDown: onButtonKeyDown, onDoubleClick: onDoubleClick, children: _jsx(ListItemText, { primary: title, primaryTypographyProps: { variant: "body2", noWrap: true } }) })) }));
}
