import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { Typography } from "@mui/material";
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useState, } from "react";
import { parseMessagePath } from "@lichtblick/message-path";
import Stack from "@lichtblick/suite-base/components/Stack";
import { useStyles } from "@lichtblick/suite-base/panels/Indicator/Indicator.style";
import { DEFAULT_CONFIG } from "@lichtblick/suite-base/panels/Indicator/constants";
import { stateReducer } from "@lichtblick/suite-base/panels/shared/gaugeAndIndicatorStateReducer";
import { getMatchingRule } from "./getMatchingRule";
import { settingsActionReducer, useSettingsTree } from "./settings";
export function Indicator({ context }) {
    // panel extensions must notify when they've completed rendering
    // onRender will setRenderDone to a done callback which we can invoke after we've rendered
    const [renderDone, setRenderDone] = useState(() => () => { });
    const [config, setConfig] = useState(() => ({
        ...DEFAULT_CONFIG,
        ...context.initialState,
    }));
    const { style, rules, fallbackColor, fallbackLabel } = config;
    const [state, dispatch] = useReducer(stateReducer, config, ({ path: statePath }) => ({
        globalVariables: undefined,
        error: undefined,
        latestMatchingQueriedData: undefined,
        latestMessage: undefined,
        parsedPath: parseMessagePath(statePath),
        path: statePath,
        pathParseError: undefined,
    }));
    const { error, latestMatchingQueriedData, parsedPath, pathParseError } = state;
    useLayoutEffect(() => {
        dispatch({ type: "path", path: config.path });
    }, [config.path]);
    useEffect(() => {
        context.saveState(config);
        context.setDefaultPanelTitle(config.path === "" ? undefined : config.path);
    }, [config, context]);
    useEffect(() => {
        context.onRender = (renderState, done) => {
            setRenderDone(() => done);
            if (renderState.variables) {
                dispatch({
                    type: "updateGlobalVariables",
                    globalVariables: Object.fromEntries(renderState.variables),
                });
            }
            if (renderState.didSeek === true) {
                dispatch({ type: "seek" });
            }
            if (renderState.currentFrame) {
                dispatch({ type: "frame", messages: renderState.currentFrame });
            }
        };
        context.watch("currentFrame");
        context.watch("didSeek");
        context.watch("variables");
        return () => {
            context.onRender = undefined;
        };
    }, [context, dispatch]);
    const settingsActionHandler = useCallback((action) => {
        setConfig((prevConfig) => settingsActionReducer(prevConfig, action));
    }, [setConfig]);
    const settingsTree = useSettingsTree(config, pathParseError, error?.message);
    useEffect(() => {
        context.updatePanelSettingsEditor({
            actionHandler: settingsActionHandler,
            nodes: settingsTree,
        });
    }, [context, settingsActionHandler, settingsTree]);
    useEffect(() => {
        if (parsedPath?.topicName != undefined) {
            context.subscribe([{ topic: parsedPath.topicName, preload: false }]);
        }
        return () => {
            context.unsubscribeAll();
        };
    }, [context, parsedPath?.topicName]);
    // Indicate render is complete - the effect runs after the dom is updated
    useEffect(() => {
        renderDone();
    }, [renderDone]);
    const rawValue = useMemo(() => {
        return ["boolean", "number", "bigint", "string"].includes(typeof latestMatchingQueriedData)
            ? latestMatchingQueriedData
            : undefined;
    }, [latestMatchingQueriedData]);
    const matchingRule = useMemo(() => getMatchingRule(rawValue, rules), [rawValue, rules]);
    const bulbColor = matchingRule?.color ?? fallbackColor;
    const { classes, theme: { palette: { augmentColor }, }, } = useStyles({ style, backgroundColor: bulbColor });
    const label = matchingRule?.label ?? fallbackLabel;
    const textColor = useMemo(() => {
        return style === "background"
            ? augmentColor({ color: { main: bulbColor } }).contrastText
            : bulbColor;
    }, [style, bulbColor, augmentColor]);
    return (_jsx(Stack, { fullHeight: true, children: _jsxs(Stack, { className: classes.indicatorStack, children: [style === "bulb" && _jsx(Bulb, { label: label, bulbColor: bulbColor }), style === "background" && _jsx(Background, { label: label, textColor: textColor })] }) }));
}
const Bulb = memo(({ label, bulbColor }) => {
    const { classes } = useStyles({ backgroundColor: bulbColor });
    return (_jsxs(Stack, { className: classes.stack, children: [_jsx("div", { className: classes.bulb, "data-testid": "bulb-indicator" }), _jsx(Typography, { className: classes.typography, children: label })] }));
});
Bulb.displayName = "Bulb";
const Background = memo(({ label, textColor }) => {
    const { classes } = useStyles({});
    return (_jsx(Stack, { className: classes.stack, testId: "background-indicator", children: _jsx(Typography, { className: classes.typography, color: textColor, children: label }) }));
});
Background.displayName = "Background";
