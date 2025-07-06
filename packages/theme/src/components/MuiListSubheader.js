// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
export const MuiListSubheader = {
    defaultProps: {
        disableSticky: true,
    },
    styleOverrides: {
        root: ({ theme }) => ({
            fontFamily: theme.typography.overline.fontFamily,
            fontWeight: 400,
            fontSize: theme.typography.overline.fontSize,
            lineHeight: 3,
            letterSpacing: theme.typography.overline.letterSpacing,
            textTransform: "uppercase",
        }),
        sticky: ({ theme }) => ({
            backgroundColor: theme.palette.background.paper,
        }),
    },
};
