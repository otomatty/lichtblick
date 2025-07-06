import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { Alert, AlertTitle, Button } from "@mui/material";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ExtensionDetails } from "@lichtblick/suite-base/components/ExtensionDetails";
import useExtensionSettings from "@lichtblick/suite-base/components/ExtensionsSettings/hooks/useExtensionSettings";
import SearchBar from "@lichtblick/suite-base/components/SearchBar/SearchBar";
import Stack from "@lichtblick/suite-base/components/Stack";
import ExtensionList from "./components/ExtensionList/ExtensionList";
import { useStyles } from "./index.style";
export default function ExtensionsSettings() {
    const { t } = useTranslation("extensionsSettings");
    const { classes } = useStyles();
    const [focusedExtension, setFocusedExtension] = useState();
    const { setUndebouncedFilterText, marketplaceEntries, refreshMarketplaceEntries, undebouncedFilterText, namespacedData, groupedMarketplaceData, debouncedFilterText, } = useExtensionSettings();
    const onClear = () => {
        setUndebouncedFilterText("");
    };
    const selectFocusedExtension = useCallback((newFocusedExtension) => {
        setFocusedExtension(newFocusedExtension);
    }, [setFocusedExtension]);
    if (focusedExtension != undefined) {
        return (_jsx(ExtensionDetails, { installed: focusedExtension.installed, extension: focusedExtension.entry, onClose: () => {
                setFocusedExtension(undefined);
            } }));
    }
    return (_jsxs(Stack, { gap: 1, children: [marketplaceEntries.error && (_jsxs(Alert, { severity: "error", action: _jsx(Button, { color: "inherit", onClick: async () => await refreshMarketplaceEntries(), children: "Retry" }), children: [_jsx(AlertTitle, { children: t("failedToRetrieveMarketplaceExtensions") }), t("checkInternetConnection")] })), _jsx("div", { className: classes.searchBarDiv, children: _jsx(SearchBar, { "data-testid": "SearchBarComponent", className: classes.searchBarPadding, id: "extension-filter", placeholder: t("searchExtensions"), variant: "outlined", onChange: (event) => {
                        setUndebouncedFilterText(event.target.value);
                    }, value: undebouncedFilterText, showClearIcon: !!debouncedFilterText, onClear: onClear }) }), namespacedData.map(({ namespace, entries }) => (_jsx(ExtensionList, { filterText: debouncedFilterText, entries: entries, namespace: namespace, selectExtension: selectFocusedExtension }, namespace))), groupedMarketplaceData.map(({ namespace, entries }) => (_jsx(ExtensionList, { filterText: debouncedFilterText, entries: entries, namespace: namespace, selectExtension: selectFocusedExtension }, namespace)))] }));
}
