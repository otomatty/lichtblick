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
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SettingsIcon from "@mui/icons-material/Settings";
import { IconButton, Typography } from "@mui/material";
import Stack from "@lichtblick/suite-base/components/Stack";
export default function TopicLink({ addPanel, onShowTopicSettings, topic, }) {
    const openRawMessages = React.useCallback(() => {
        addPanel({
            position: "sibling",
            type: "RawMessages",
            updateIfExists: true,
            getState: (existingState) => ({
                ...existingState,
                topicPath: topic,
            }),
        });
    }, [addPanel, topic]);
    return (_jsxs(Stack, { direction: "row", alignItems: "center", justifyContent: "space-between", paddingInlineStart: 1, paddingBlock: 0, children: [_jsx(Typography, { variant: "body2", children: topic }), _jsxs(Stack, { direction: "row", padding: 0, children: [onShowTopicSettings && (_jsx(IconButton, { onClick: () => {
                            onShowTopicSettings(topic);
                        }, title: "Show settings", children: _jsx(SettingsIcon, { fontSize: "small", color: "primary" }) })), _jsx(IconButton, { onClick: openRawMessages, title: "Open in Raw Message panel", children: _jsx(OpenInNewIcon, { fontSize: "small", color: "primary" }) })] })] }));
}
