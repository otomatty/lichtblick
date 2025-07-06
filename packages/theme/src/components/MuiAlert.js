import { jsx as _jsx } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { ErrorCircle20Regular, Info20Regular, CheckmarkCircle20Regular, Warning20Regular, } from "@fluentui/react-icons";
export const MuiAlert = {
    defaultProps: {
        iconMapping: {
            error: _jsx(ErrorCircle20Regular, {}),
            info: _jsx(Info20Regular, {}),
            success: _jsx(CheckmarkCircle20Regular, {}),
            warning: _jsx(Warning20Regular, {}),
        },
    },
    styleOverrides: {
        message: {
            lineHeight: "1.5",
        },
        standard: {
            border: "1px solid",
        },
        standardWarning: ({ theme }) => ({
            borderColor: theme.palette.warning.main,
        }),
        standardError: ({ theme }) => ({
            borderColor: theme.palette.error.main,
        }),
        standardInfo: ({ theme }) => ({
            borderColor: theme.palette.info.main,
        }),
        standardSuccess: ({ theme }) => ({
            borderColor: theme.palette.success.main,
        }),
    },
};
