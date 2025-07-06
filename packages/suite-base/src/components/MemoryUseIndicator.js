import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { Tooltip, Typography } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { useMemoryInfo } from "@lichtblick/hooks";
import { AppSetting } from "@lichtblick/suite-base/AppSetting";
import { useAppConfigurationValue } from "@lichtblick/suite-base/hooks";
const useStyles = makeStyles()((theme) => ({
    root: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        position: "relative",
        width: 50,
        flex: "1 0 50px",
        fontSize: theme.typography.caption.fontSize,
        overflow: "hidden",
    },
    label: {
        fontWeight: "bold",
    },
    text: {
        lineHeight: 1.1,
    },
}));
function toMB(bytes) {
    return bytes / 1024 / 1024;
}
function MemoryUseIndicator() {
    const memoryInfo = useMemoryInfo({ refreshIntervalMs: 5000 });
    const { classes, cx } = useStyles();
    const [enableNewTopNav = true] = useAppConfigurationValue(AppSetting.ENABLE_NEW_TOPNAV);
    // If we can't load memory info (maybe not supported) then we don't show any indicator
    if (!memoryInfo) {
        return _jsx(_Fragment, {});
    }
    const usedPercent = (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100;
    const usedMb = toMB(memoryInfo.usedJSHeapSize).toLocaleString();
    const limitMb = toMB(memoryInfo.jsHeapSizeLimit).toLocaleString();
    return (_jsx(Tooltip, { arrow: false, title: `Used (MB): ${usedMb} / ${limitMb}`, placement: enableNewTopNav ? "bottom" : "right", children: _jsxs("div", { className: classes.root, children: [_jsx(Typography, { className: cx(classes.label, classes.text), variant: "caption", children: "MEM" }), _jsxs(Typography, { className: classes.text, variant: "caption", children: [usedPercent.toFixed(2), "%"] })] }) }));
}
export { MemoryUseIndicator };
