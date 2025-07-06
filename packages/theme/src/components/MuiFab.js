// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
export const MuiFab = {
    defaultProps: {
        color: "inherit",
    },
    styleOverrides: {
        root: ({ theme }) => ({
            boxShadow: theme.shadows[2],
        }),
        colorInherit: ({ theme }) => ({
            backgroundColor: theme.palette.background.paper,
        }),
        extended: ({ theme }) => ({
            gap: theme.spacing(1),
        }),
    },
};
