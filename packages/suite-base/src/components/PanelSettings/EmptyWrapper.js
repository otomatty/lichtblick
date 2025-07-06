import { jsx as _jsx } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import EmptyState from "@lichtblick/suite-base/components/EmptyState";
import { SidebarContent } from "@lichtblick/suite-base/components/SidebarContent";
export const EmptyWrapper = ({ children, enableNewTopNav, }) => {
    const { t } = useTranslation("panelSettings");
    if (enableNewTopNav) {
        return _jsx(EmptyState, { children: children });
    }
    return (_jsx(SidebarContent, { title: t("panelSettings"), children: _jsx(Typography, { variant: "body2", color: "text.secondary", children: children }) }));
};
