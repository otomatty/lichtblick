import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Stack from "@lichtblick/suite-base/components/Stack";
import { useExtensionCatalog } from "@lichtblick/suite-base/context/ExtensionCatalogContext";
import ExtensionListEntry from "../ExtensionListEntry/ExtensionListEntry";
export function displayNameForNamespace(namespace) {
    if (namespace === "org") {
        return "Organization";
    }
    else {
        return namespace;
    }
}
export function generatePlaceholderList(message) {
    return (_jsx(List, { children: _jsx(ListItem, { children: _jsx(ListItemText, { primary: message }) }) }));
}
export default function ExtensionList({ namespace, entries, filterText, selectExtension, }) {
    const { t } = useTranslation("extensionsSettings");
    const installedExtensions = useExtensionCatalog((state) => state.installedExtensions);
    const renderComponent = () => {
        if (entries.length === 0 && filterText) {
            return generatePlaceholderList(t("noExtensionsFound"));
        }
        else if (entries.length === 0) {
            return generatePlaceholderList(t("noExtensionsAvailable"));
        }
        return (_jsx(_Fragment, { children: entries.map((entry) => {
                const isInstalled = installedExtensions
                    ? installedExtensions.some((installed) => installed.id === entry.id)
                    : false;
                return (_jsx(ExtensionListEntry, { entry: entry, onClick: () => {
                        selectExtension({ installed: isInstalled, entry });
                    }, searchText: filterText }, entry.id));
            }) }));
    };
    return (_jsxs(List, { children: [_jsx(Stack, { paddingY: 0, paddingX: 2, children: _jsx(Typography, { component: "li", variant: "overline", color: "text.secondary", children: displayNameForNamespace(namespace) }) }), renderComponent()] }, namespace));
}
