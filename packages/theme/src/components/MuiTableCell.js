// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
export const MuiTableCell = {
    styleOverrides: {
        head: {
            fontWeight: 700,
        },
        stickyHeader: ({ theme }) => ({
            backgroundColor: theme.palette.background.paper,
        }),
    },
};
