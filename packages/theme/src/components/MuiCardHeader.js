// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
export const MuiCardHeader = {
    defaultProps: {
        titleTypographyProps: {
            variant: "h4",
        },
    },
    styleOverrides: {
        avatar: {
            marginRight: 0,
        },
        action: {
            alignSelf: "auto",
            marginTop: 0,
            marginRight: 0,
        },
        root: ({ theme }) => ({
            gap: theme.spacing(2),
        }),
    },
};
