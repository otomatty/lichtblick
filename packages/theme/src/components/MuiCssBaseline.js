// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
export const MuiCssBaseline = {
    styleOverrides: (theme) => ({
        svg: {
            display: "block",
            maxWidth: "100%",
        },
        a: {
            color: "inherit",
            textDecoration: "none",
        },
        pre: {
            fontFamily: theme.typography.fontMonospace,
            backgroundColor: theme.palette.background.default,
            borderRadius: theme.shape.borderRadius,
            padding: theme.spacing(2),
            overflow: "auto",
            color: theme.palette.text.secondary,
            margin: 0,
        },
        code: {
            fontFamily: theme.typography.fontMonospace,
        },
    }),
};
