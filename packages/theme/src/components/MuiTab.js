// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
export const MuiTab = {
    styleOverrides: {
        root: ({ theme }) => ({
            opacity: 0.8,
            "&.Mui-selected": {
                opacity: 1,
            },
            "&:not(.Mui-selected):hover": {
                opacity: 1,
                color: theme.palette.text.primary,
            },
        }),
        selected: {},
    },
};
