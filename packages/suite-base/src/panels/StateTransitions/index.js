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
import * as _ from "lodash-es";
import { useCallback, useMemo, useState } from "react";
import { add as addTimes, fromSec } from "@lichtblick/rostime";
import useMessagesByPath from "@lichtblick/suite-base/components/MessagePathSyntax/useMessagesByPath";
import { useMessagePipelineGetter } from "@lichtblick/suite-base/components/MessagePipeline";
import Panel from "@lichtblick/suite-base/components/Panel";
import PanelToolbar from "@lichtblick/suite-base/components/PanelToolbar";
import Stack from "@lichtblick/suite-base/components/Stack";
import TimeBasedChart from "@lichtblick/suite-base/components/TimeBasedChart";
import { PathLegend } from "@lichtblick/suite-base/panels/StateTransitions/PathLegend";
import { useStateTransitionsStyles } from "@lichtblick/suite-base/panels/StateTransitions/StateTransitions.style";
import { EMPTY_ITEMS_BY_PATH, STATE_TRANSITION_PLUGINS, } from "@lichtblick/suite-base/panels/StateTransitions/constants";
import useChartScalesAndBounds from "@lichtblick/suite-base/panels/StateTransitions/hooks/useChartScalesAndBounds";
import { useDecodedBlocks } from "@lichtblick/suite-base/panels/StateTransitions/hooks/useDecodedBlocks";
import useMessagePathDropConfig from "@lichtblick/suite-base/panels/StateTransitions/hooks/useMessagePathDropConfig";
import { usePanelSettings } from "@lichtblick/suite-base/panels/StateTransitions/hooks/usePanelSettings";
import useStateTransitionsData from "@lichtblick/suite-base/panels/StateTransitions/hooks/useStateTransitionsData";
import useStateTransitionsTime from "@lichtblick/suite-base/panels/StateTransitions/hooks/useStateTransitionsTime";
function StateTransitions(props) {
    const { config, saveConfig } = props;
    const { paths } = config;
    const { classes } = useStateTransitionsStyles();
    const pathStrings = useMemo(() => paths.map(({ value }) => value), [paths]);
    const [focusedPath, setFocusedPath] = useState(undefined);
    useMessagePathDropConfig(saveConfig);
    const { startTime, currentTimeSinceStart, endTimeSinceStart } = useStateTransitionsTime();
    const itemsByPath = useMessagesByPath(pathStrings);
    const decodedBlocks = useDecodedBlocks(paths);
    const { height, heightPerTopic } = useMemo(() => {
        const onlyTopicsHeight = paths.length * 64;
        const xAxisHeight = 30;
        return {
            height: Math.max(80, onlyTopicsHeight + xAxisHeight),
            heightPerTopic: paths.length === 0 ? 0 : onlyTopicsHeight / paths.length,
        };
    }, [paths.length]);
    // If our blocks data covers all paths in the chart then ignore the data in itemsByPath
    // since it's not needed to render the chart and would just cause unnecessary re-renders
    // if included in the dataset.
    const newItemsByPath = useMemo(() => {
        const newItemsNotInBlocks = _.pickBy(itemsByPath, (_items, path) => !decodedBlocks.some((block) => block[path]));
        return _.isEmpty(newItemsNotInBlocks) ? EMPTY_ITEMS_BY_PATH : newItemsNotInBlocks;
    }, [decodedBlocks, itemsByPath]);
    const showPoints = config.showPoints === true;
    const { pathState, data, minY } = useStateTransitionsData(paths, startTime, newItemsByPath, decodedBlocks, showPoints);
    const { yScale, xScale, databounds, width, sizeRef } = useChartScalesAndBounds(minY, currentTimeSinceStart, endTimeSinceStart, config);
    const messagePipeline = useMessagePipelineGetter();
    const onClick = useCallback(({ x: seekSeconds }) => {
        const { seekPlayback, playerState: { activeData: { startTime: start } = {} }, } = messagePipeline();
        if (!seekPlayback || seekSeconds == undefined || start == undefined) {
            return;
        }
        const seekTime = addTimes(start, fromSec(seekSeconds));
        seekPlayback(seekTime);
    }, [messagePipeline]);
    usePanelSettings(config, saveConfig, pathState, focusedPath);
    return (_jsxs(Stack, { flexGrow: 1, overflow: "hidden", style: { zIndex: 0 }, children: [_jsx(PanelToolbar, {}), _jsx(Stack, { fullWidth: true, fullHeight: true, flex: "auto", overflowX: "hidden", overflowY: "auto", children: _jsxs("div", { className: classes.chartWrapper, ref: sizeRef, children: [_jsx(TimeBasedChart, { zoom: true, isSynced: config.isSynced, showXAxisLabels: true, width: width ?? 0, height: height, data: data, dataBounds: databounds, resetButtonPaddingBottom: 2, type: "scatter", xAxes: xScale, xAxisIsPlaybackTime: true, yAxes: yScale, plugins: STATE_TRANSITION_PLUGINS, 
                            // storybookの修正箇所
                            interactionMode: "x", 
                            // ここまで修正
                            onClick: onClick, currentTime: currentTimeSinceStart }), _jsx(PathLegend, { paths: paths, heightPerTopic: heightPerTopic, setFocusedPath: setFocusedPath, saveConfig: saveConfig })] }) })] }));
}
const defaultConfig = {
    paths: [],
    isSynced: true,
};
export default Panel(Object.assign(StateTransitions, {
    panelType: "StateTransitions",
    defaultConfig,
}));
