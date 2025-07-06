import { jsx as _jsx } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { Dismiss20Filled } from "@fluentui/react-icons";
import { CardHeader, IconButton } from "@mui/material";
export const SidebarHeader = ({ title, subheader, onClose, }) => (_jsx(CardHeader, { title: title, titleTypographyProps: {
        variant: "subtitle1",
        fontWeight: "600",
    }, subheader: subheader, subheaderTypographyProps: {
        variant: "body2",
        color: "text.secondary",
    }, action: _jsx(IconButton, { size: "small", onClick: onClose, title: "Collapse", children: _jsx(Dismiss20Filled, {}) }) }));
