import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { Stack } from "@mui/material";
import { useState } from "react";
import { AppSetting } from "@lichtblick/suite-base/AppSetting";
import Timestamp from "@lichtblick/suite-base/components/Timestamp";
import AppConfigurationContext from "@lichtblick/suite-base/context/AppConfigurationContext";
import { makeMockAppConfiguration } from "@lichtblick/suite-base/util/makeMockAppConfiguration";
const ABSOLUTE_TIME = { sec: 1643800942, nsec: 222222222 };
const RELATIVE_TIME = { sec: 630720000, nsec: 597648236 };
export default {
    component: Timestamp,
    title: "components/Timestamp",
};
function TimestampStory(props) {
    const { config, time } = props;
    const [value] = useState(() => makeMockAppConfiguration(config));
    return (_jsx(AppConfigurationContext.Provider, { value: value, children: _jsxs(Stack, { padding: 2, spacing: 2, children: [_jsx(Timestamp, { horizontal: true, time: time }), _jsx(Timestamp, { time: time }), _jsx(Timestamp, { disableDate: true, time: time })] }) }));
}
export const Default = {
    render: () => {
        return _jsx(TimestampStory, { config: [[AppSetting.TIMEZONE, "UTC"]], time: ABSOLUTE_TIME });
    },
};
export const TimeFormatSeconds = {
    render: () => {
        return (_jsx(TimestampStory, { config: [
                [AppSetting.TIME_FORMAT, "SEC"],
                [AppSetting.TIMEZONE, "UTC"],
            ], time: ABSOLUTE_TIME }));
    },
};
export const TimeFormatTOD = {
    render: () => {
        return (_jsx(TimestampStory, { config: [
                [AppSetting.TIME_FORMAT, "TOD"],
                [AppSetting.TIMEZONE, "UTC"],
            ], time: ABSOLUTE_TIME }));
    },
};
export const TimeFormatRelative = {
    render: () => {
        return (_jsx(TimestampStory, { config: [
                [AppSetting.TIME_FORMAT, "TOD"],
                [AppSetting.TIMEZONE, "UTC"],
            ], time: RELATIVE_TIME }));
    },
};
