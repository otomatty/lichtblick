import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { Button, Dialog, DialogActions, DialogContent, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useKeyPressEvent } from "react-use";
import Stack from "@lichtblick/suite-base/components/Stack";
function ModalPrompt({ onComplete: originalOnComplete, title, subText, placeholder, initialValue, label, transformer, }) {
    const [value, setValue] = useState(initialValue ?? "");
    const errorMessage = useMemo(() => {
        if (value === "") {
            return undefined;
        }
        try {
            transformer?.(value);
            return undefined;
        }
        catch (err) {
            return err.toString();
        }
    }, [transformer, value]);
    const onConfirmAction = () => {
        try {
            onComplete(transformer ? transformer(value) : value);
        }
        catch (err) {
            console.error(err);
            onComplete(undefined);
        }
    };
    const onSubmitAction = (event) => {
        event.preventDefault();
        onConfirmAction();
    };
    const completed = useRef(false);
    const onComplete = useCallback((result) => {
        if (!completed.current) {
            completed.current = true;
            originalOnComplete(result);
        }
    }, [originalOnComplete]);
    useKeyPressEvent("Enter", onConfirmAction);
    // Ensure we still call onComplete(undefined) when the component unmounts, if it hasn't been
    // called already
    useEffect(() => {
        return () => {
            onComplete(undefined);
        };
    }, [onComplete]);
    return (_jsx(Dialog, { open: true, maxWidth: "xs", fullWidth: true, onClose: () => {
            onComplete(undefined);
        }, children: _jsxs("form", { onSubmit: onSubmitAction, children: [_jsxs(Stack, { paddingX: 3, paddingTop: 2, children: [_jsx(Typography, { variant: "h4", fontWeight: 600, gutterBottom: true, children: title }), subText && (_jsx(Typography, { variant: "body1", color: "text.secondary", children: subText }))] }), _jsx(DialogContent, { children: _jsx(TextField, { label: label, autoFocus: true, fullWidth: true, placeholder: placeholder, value: value, error: errorMessage != undefined, helperText: errorMessage, FormHelperTextProps: {
                            variant: "standard",
                        }, onChange: (event) => {
                            setValue(event.target.value);
                        } }) }), _jsxs(DialogActions, { children: [_jsx(Button, { color: "inherit", size: "large", variant: "outlined", onClick: () => {
                                onComplete(undefined);
                            }, children: "Cancel" }), _jsx(Button, { type: "submit", variant: "contained", size: "large", disabled: value === "" || errorMessage != undefined, children: "OK" })] })] }) }));
}
// Returns a function that can be used similarly to the DOM prompt(), but
// backed by a React element rather than a native modal, and asynchronous.
export function usePrompt() {
    const [modal, setModal] = useState();
    const runPrompt = useCallback(async (options) => {
        return await new Promise((resolve) => {
            setModal(_jsx(ModalPrompt, { ...options, onComplete: (value) => {
                    resolve(value);
                    setModal(undefined);
                } }));
        });
    }, []);
    return [runPrompt, modal];
}
