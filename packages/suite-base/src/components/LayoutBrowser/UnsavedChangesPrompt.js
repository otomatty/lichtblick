import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Radio, RadioGroup, TextField, Typography, } from "@mui/material";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLatest, useUnmount } from "react-use";
import Stack from "@lichtblick/suite-base/components/Stack";
import { useLayoutManager } from "@lichtblick/suite-base/context/LayoutManagerContext";
export function UnsavedChangesPrompt({ layout, isOnline, onComplete, defaultSelectedKey = "discard", defaultPersonalCopyName, }) {
    const [selectedKey, setSelectedKey] = useState(defaultSelectedKey);
    const handleChoiceGroupChange = React.useCallback((event) => {
        setSelectedKey(event.target.value);
    }, []);
    const [personalCopyName, setPersonalCopyName] = useState(defaultPersonalCopyName ?? `${layout.name} copy`);
    const personalCopyNameRef = useLatest(personalCopyName);
    const handleNameChange = useCallback((event) => {
        setPersonalCopyName(event.target.value);
    }, []);
    const nameError = useMemo(() => (personalCopyName.length === 0 ? "Name cannot be empty" : undefined), [personalCopyName]);
    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        switch (selectedKey) {
            case "discard":
                onComplete({ type: "discard" });
                break;
            case "overwrite":
                onComplete({ type: "overwrite" });
                break;
            case "makePersonal":
                onComplete({ type: "makePersonal", name: personalCopyNameRef.current });
                break;
        }
    }, [onComplete, personalCopyNameRef, selectedKey]);
    const handleCancel = useCallback(() => {
        onComplete({ type: "cancel" });
    }, [onComplete]);
    return (_jsx(Dialog, { open: true, onClose: handleCancel, maxWidth: "xs", fullWidth: true, children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(DialogTitle, { children: `“${layout.name}” has unsaved changes` }), _jsx(DialogContent, { children: _jsxs(Stack, { gap: 2, style: { minHeight: 180 }, children: [_jsxs(RadioGroup, { defaultValue: "discard", onChange: handleChoiceGroupChange, children: [_jsx(FormControlLabel, { value: "discard", label: "Discard changes", control: _jsx(Radio, {}) }), _jsx(FormControlLabel, { value: "overwrite", label: [
                                            `Update shared layout “${layout.name}”`,
                                            !isOnline && "(unavailable while offline)",
                                        ]
                                            .filter(Boolean)
                                            .join(" "), control: _jsx(Radio, {}), disabled: !isOnline }), _jsx(FormControlLabel, { value: "makePersonal", label: "Save a personal copy", control: _jsx(Radio, {}) })] }), selectedKey === "discard" && (_jsx(Typography, { variant: "body2", color: "error.main", children: "Your changes will be permantly deleted. This cannot be undone." })), selectedKey === "makePersonal" && (_jsx(TextField, { autoFocus: true, variant: "outlined", label: "Layout name", value: personalCopyName, onChange: handleNameChange, error: nameError != undefined, helperText: nameError, FormHelperTextProps: {
                                    variant: "standard",
                                } }))] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { variant: "outlined", size: "large", color: "inherit", onClick: handleCancel, children: "Cancel" }), _jsx(Button, { type: "submit", size: "large", variant: "contained", color: selectedKey === "discard" ? "error" : "primary", disabled: selectedKey === "makePersonal" && nameError != undefined, children: selectedKey === "discard" ? "Discard changes" : "Save" })] })] }) }));
}
export function useUnsavedChangesPrompt() {
    const [layout, setLayout] = useState();
    const resolveRef = useRef();
    const layoutManager = useLayoutManager();
    const [isOnline, setIsOnline] = useState(layoutManager.isOnline);
    useLayoutEffect(() => {
        const onlineListener = () => {
            setIsOnline(layoutManager.isOnline);
        };
        onlineListener();
        layoutManager.on("onlinechange", onlineListener);
        return () => {
            layoutManager.off("onlinechange", onlineListener);
        };
    }, [layoutManager]);
    const unsavedChangesPrompt = useMemo(() => {
        if (!layout) {
            return undefined;
        }
        return (_jsx(UnsavedChangesPrompt, { layout: layout, isOnline: isOnline, onComplete: (value) => {
                resolveRef.current?.(value);
                resolveRef.current = undefined;
                setLayout(undefined);
            } }));
    }, [isOnline, layout]);
    const openUnsavedChangesPrompt = useCallback(async (item) => {
        setLayout(item);
        return await new Promise((resolve) => {
            resolveRef.current?.({ type: "cancel" });
            resolveRef.current = resolve;
        });
    }, []);
    // Close automatically when unmounted
    useUnmount(() => {
        resolveRef.current?.({ type: "cancel" });
    });
    return { unsavedChangesPrompt, openUnsavedChangesPrompt };
}
