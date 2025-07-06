// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
export const MuiAvatar = {
    defaultProps: {
        variant: "rounded",
    },
    styleOverrides: {
        colorDefault: ({ theme }) => ({
            color: "currentColor",
            backgroundColor: theme.palette.action.hover,
        }),
    },
};
