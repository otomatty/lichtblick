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
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, } from "@mui/material";
import * as _ from "lodash-es";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { useDebouncedCallback } from "use-debounce";
import CopyButton from "@lichtblick/suite-base/components/CopyButton";
import EmptyState from "@lichtblick/suite-base/components/EmptyState";
import JsonInput from "@lichtblick/suite-base/components/JsonInput";
import { useMessagePipeline, } from "@lichtblick/suite-base/components/MessagePipeline";
import Panel from "@lichtblick/suite-base/components/Panel";
import PanelToolbar from "@lichtblick/suite-base/components/PanelToolbar";
import Stack from "@lichtblick/suite-base/components/Stack";
import { PLAYER_CAPABILITIES } from "@lichtblick/suite-base/players/constants";
// The minimum amount of time to wait between showing the parameter update animation again
const ANIMATION_RESET_DELAY_MS = 3000;
function isActiveElementEditable() {
    const activeEl = document.activeElement;
    return (activeEl != undefined &&
        (activeEl.isContentEditable ||
            activeEl.tagName === "INPUT" ||
            activeEl.tagName === "TEXTAREA"));
}
// Keep a single empty map so selector return value is reference-equal
const EMPTY_PARAMETERS = new Map();
function selectCapabilities(ctx) {
    return ctx.playerState.capabilities;
}
function selectSetParameter(ctx) {
    return ctx.setParameter;
}
function selectParameters(ctx) {
    return ctx.playerState.activeData?.parameters ?? EMPTY_PARAMETERS;
}
const useStyles = makeStyles()((_theme, _params, classes) => ({
    tableRow: {
        [`&:hover .${classes.copyIcon}`]: {
            visibility: "visible",
        },
    },
    copyIcon: {
        visibility: "hidden",
        "&:hover": {
            backgroundColor: "transparent",
        },
    },
}));
/**
 * Converts a parameter value into a value that can be edited in the JsonInput. Wraps
 * any value JsonInput can't handle in JSON.stringify.
 */
function editableValue(value) {
    if (value instanceof Uint8Array) {
        return Array.from(value);
    }
    else if (typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        Array.isArray(value) ||
        _.isObject(value)) {
        return value;
    }
    else {
        return JSON.stringify(value) ?? "";
    }
}
/**
 * Converts a parameter value into a string we can display value or use as a title.
 */
function displayableValue(value) {
    if (value == undefined) {
        return "";
    }
    if (value instanceof Date) {
        return value.toISOString();
    }
    else if (value instanceof Uint8Array) {
        return JSON.stringify(Array.from(value)) ?? "";
    }
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        return String(value);
    }
    else {
        return JSON.stringify(value) ?? "";
    }
}
function SubmittableJsonInput(props) {
    const [value, setValue] = useState(editableValue(props.value));
    return (_jsxs(Stack, { direction: "row", children: [_jsx(JsonInput, { value: value, onChange: (newVal) => {
                    setValue(newVal);
                } }), !_.isEqual(editableValue(value), editableValue(props.value)) && [
                _jsx(Tooltip, { title: "Submit change", children: _jsx(IconButton, { onClick: () => {
                            if (props.value instanceof Uint8Array) {
                                props.onSubmit(new Uint8Array(value));
                            }
                            else {
                                props.onSubmit(value);
                            }
                        }, children: _jsx(CheckIcon, {}) }) }, "submit"),
                _jsx(Tooltip, { title: "Reset", children: _jsx(IconButton, { onClick: () => {
                            setValue(editableValue(props.value));
                        }, children: _jsx(ClearIcon, {}) }, "reset") }, "reset"),
            ]] }));
}
function Parameters() {
    const { classes } = useStyles();
    const capabilities = useMessagePipeline(selectCapabilities);
    const setParameterUnbounced = useMessagePipeline(selectSetParameter);
    const parameters = useMessagePipeline(selectParameters);
    const setParameter = useDebouncedCallback(useCallback((name, value) => {
        setParameterUnbounced(name, value);
    }, [setParameterUnbounced]), 500);
    const [changedParameters, setChangedParameters] = useState([]);
    const canGetParams = capabilities.includes(PLAYER_CAPABILITIES.getParameters);
    const canSetParams = capabilities.includes(PLAYER_CAPABILITIES.setParameters);
    const parameterNames = useMemo(() => Array.from(parameters.keys()), [parameters]);
    // Don't run the animation when the Table first renders
    const skipAnimation = useRef(true);
    const previousParametersRef = useRef(parameters);
    useEffect(() => {
        const timeoutId = setTimeout(() => (skipAnimation.current = false), ANIMATION_RESET_DELAY_MS);
        return () => {
            clearTimeout(timeoutId);
        };
    }, []);
    useEffect(() => {
        if (skipAnimation.current || isActiveElementEditable()) {
            previousParametersRef.current = parameters;
            return;
        }
        const newChangedParameters = _.union(Array.from(parameters.keys()), Array.from(previousParametersRef.current?.keys() ?? [])).filter((name) => {
            const previousValue = previousParametersRef.current?.get(name);
            return !_.isEqual(previousValue, parameters.get(name));
        });
        setChangedParameters(newChangedParameters);
        previousParametersRef.current = parameters;
        const timerId = setTimeout(() => {
            setChangedParameters([]);
        }, ANIMATION_RESET_DELAY_MS);
        return () => {
            clearTimeout(timerId);
        };
    }, [parameters, skipAnimation]);
    if (!canGetParams) {
        return (_jsxs(Stack, { fullHeight: true, children: [_jsx(PanelToolbar, {}), _jsx(EmptyState, { children: "Connect to a ROS source to view parameters" })] }));
    }
    return (_jsxs(Stack, { fullHeight: true, children: [_jsx(PanelToolbar, {}), _jsx(TableContainer, { style: { flex: 1 }, children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Parameter" }), _jsx(TableCell, { children: "Value" }), _jsx(TableCell, { children: "\u00A0" })] }) }), _jsx(TableBody, { children: parameterNames.map((name) => {
                                const displayValue = displayableValue(parameters.get(name));
                                return (_jsxs(TableRow, { hover: true, className: classes.tableRow, selected: !skipAnimation.current && changedParameters.includes(name), children: [_jsx(TableCell, { variant: "head", children: _jsx(Typography, { noWrap: true, title: name, variant: "inherit", children: name }) }), canSetParams ? (_jsx(TableCell, { padding: "none", children: _jsx(SubmittableJsonInput, { value: parameters.get(name), onSubmit: (newVal) => {
                                                    setParameter(name, newVal);
                                                } }) })) : (_jsx(TableCell, { children: _jsx(Typography, { noWrap: true, title: displayValue, variant: "inherit", color: "text.secondary", children: displayValue }) })), _jsx(TableCell, { padding: "none", align: "center", children: _jsx(CopyButton, { className: classes.copyIcon, edge: "end", size: "small", iconSize: "small", getText: () => `${name}: ${displayValue}` }) })] }, `parameter-${name}-${displayValue}`));
                            }) })] }) })] }));
}
Parameters.panelType = "Parameters";
Parameters.defaultConfig = {
    title: "Parameters",
};
export default Panel(Parameters);
