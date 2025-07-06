// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
export const MuiDialogActions = {
    styleOverrides: {
        root: ({ theme }) => ({
            gap: theme.spacing(1),
            padding: theme.spacing(3),
            "& > :not(:first-of-type)": {
                marginLeft: "inherit",
            },
        }),
    },
};
