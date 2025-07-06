import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Button, Link, Tab, Tabs, Typography, Divider } from "@mui/material";
import DOMPurify from "dompurify";
import { useSnackbar } from "notistack";
import { useCallback, useState } from "react";
import { useAsync, useMountedState } from "react-use";
import { makeStyles } from "tss-react/mui";
import Stack from "@lichtblick/suite-base/components/Stack";
import TextContent from "@lichtblick/suite-base/components/TextContent";
import { useAnalytics } from "@lichtblick/suite-base/context/AnalyticsContext";
import { useExtensionCatalog } from "@lichtblick/suite-base/context/ExtensionCatalogContext";
import { useExtensionMarketplace, } from "@lichtblick/suite-base/context/ExtensionMarketplaceContext";
import { AppEvent } from "@lichtblick/suite-base/services/IAnalytics";
import isDesktopApp from "@lichtblick/suite-base/util/isDesktopApp";
import { isValidUrl } from "@lichtblick/suite-base/util/isValidURL";
const useStyles = makeStyles()((theme) => ({
    backButton: {
        marginLeft: theme.spacing(-1.5),
        marginBottom: theme.spacing(1),
    },
    installButton: {
        minWidth: 100,
    },
}));
var OperationStatus;
(function (OperationStatus) {
    OperationStatus["IDLE"] = "idle";
    OperationStatus["INSTALLING"] = "installing";
    OperationStatus["UNINSTALLING"] = "uninstalling";
})(OperationStatus || (OperationStatus = {}));
/**
 * ExtensionDetails component displays detailed information about a specific extension.
 * It allows users to install, uninstall, and view the README and CHANGELOG of the extension.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.installed - Indicates if the extension is already installed.
 * @param {Immutable<ExtensionMarketplaceDetail>} props.extension - The extension details.
 * @param {Function} props.onClose - Callback function to close the details view.
 * @returns {React.ReactElement} The rendered component.
 */
export function ExtensionDetails({ extension, onClose, installed, }) {
    const { classes } = useStyles();
    const [isInstalled, setIsInstalled] = useState(installed);
    const [operationStatus, setOperationStatus] = useState(OperationStatus.IDLE);
    const [activeTab, setActiveTab] = useState(0);
    const isMounted = useMountedState();
    const downloadExtension = useExtensionCatalog((state) => state.downloadExtension);
    const installExtensions = useExtensionCatalog((state) => state.installExtensions);
    const uninstallExtension = useExtensionCatalog((state) => state.uninstallExtension);
    const marketplace = useExtensionMarketplace();
    const { enqueueSnackbar } = useSnackbar();
    const readme = extension.readme;
    const changelog = extension.changelog;
    const canInstall = extension.foxe != undefined;
    const canUninstall = extension.namespace !== "org";
    const { value: readmeContent } = useAsync(async () => readme != undefined && isValidUrl(readme)
        ? await marketplace.getMarkdown(readme)
        : DOMPurify.sanitize(readme ?? "No readme found."), [marketplace, readme]);
    const { value: changelogContent } = useAsync(async () => changelog != undefined && isValidUrl(changelog)
        ? await marketplace.getMarkdown(changelog)
        : DOMPurify.sanitize(changelog ?? "No changelog found."), [marketplace, changelog]);
    const analytics = useAnalytics();
    /**
     * Handles the download and installation of the extension.
     *
     * @async
     * @function downloadAndInstall
     * @returns {Promise<void>}
     */
    const downloadAndInstall = useCallback(async () => {
        if (!isDesktopApp()) {
            enqueueSnackbar("Download the desktop app to use marketplace extensions.", {
                variant: "error",
            });
            return;
        }
        const url = extension.foxe;
        try {
            if (url == undefined) {
                throw new Error(`Cannot install extension ${extension.id}, "foxe" URL is missing`);
            }
            setOperationStatus(OperationStatus.INSTALLING);
            const data = await downloadExtension(url);
            await installExtensions("local", [data]);
            enqueueSnackbar(`${extension.name} installed successfully`, { variant: "success" });
            if (isMounted()) {
                setIsInstalled(true);
                setOperationStatus(OperationStatus.IDLE);
                void analytics.logEvent(AppEvent.EXTENSION_INSTALL, { type: extension.id });
            }
        }
        catch (e) {
            const err = e;
            enqueueSnackbar(`Failed to install extension ${extension.id}. ${err.message}`, {
                variant: "error",
            });
            setOperationStatus(OperationStatus.IDLE);
        }
    }, [
        analytics,
        downloadExtension,
        enqueueSnackbar,
        extension.foxe,
        extension.id,
        installExtensions,
        isMounted,
        extension.name,
    ]);
    /**
     * Handles the uninstallation of the extension.
     *
     * @async
     * @function uninstall
     * @returns {Promise<void>}
     */
    const uninstall = useCallback(async () => {
        try {
            setOperationStatus(OperationStatus.UNINSTALLING);
            // UX - Avoids the button from blinking when operation completes too fast
            await new Promise((resolve) => setTimeout(resolve, 200));
            await uninstallExtension(extension.namespace ?? "local", extension.id);
            enqueueSnackbar(`${extension.name} uninstalled successfully`, { variant: "success" });
            if (isMounted()) {
                setIsInstalled(false);
                setOperationStatus(OperationStatus.IDLE);
                void analytics.logEvent(AppEvent.EXTENSION_UNINSTALL, { type: extension.id });
            }
        }
        catch (e) {
            const err = e;
            enqueueSnackbar(`Failed to uninstall extension ${extension.id}. ${err.message}`, {
                variant: "error",
            });
            setOperationStatus(OperationStatus.IDLE);
        }
    }, [
        analytics,
        extension.id,
        extension.namespace,
        isMounted,
        uninstallExtension,
        enqueueSnackbar,
        extension.name,
    ]);
    return (_jsxs(Stack, { fullHeight: true, flex: "auto", gap: 1, children: [_jsxs("div", { children: [_jsx(Button, { className: classes.backButton, onClick: onClose, size: "small", startIcon: _jsx(ChevronLeftIcon, {}), children: "Back" }), _jsx(Typography, { variant: "h3", fontWeight: 500, children: extension.name })] }), _jsxs(Stack, { gap: 1, alignItems: "flex-start", children: [_jsxs(Stack, { gap: 0.5, paddingBottom: 1, children: [_jsxs(Stack, { direction: "row", gap: 1, alignItems: "baseline", children: [_jsx(Link, { variant: "body2", color: "primary", href: extension.homepage, target: "_blank", underline: "hover", children: extension.id }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: `v${extension.version}` }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: extension.license })] }), _jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: extension.publisher }), _jsx(Typography, { variant: "body2", gutterBottom: true, children: extension.description })] }), isInstalled && canUninstall ? (_jsx(Button, { className: classes.installButton, size: "small", color: "inherit", variant: "contained", onClick: uninstall, disabled: operationStatus !== OperationStatus.IDLE, children: operationStatus === OperationStatus.UNINSTALLING ? "Uninstalling..." : "Uninstall" }, "uninstall")) : (canInstall && (_jsx(Button, { className: classes.installButton, size: "small", color: "inherit", variant: "contained", onClick: downloadAndInstall, disabled: operationStatus !== "idle", children: operationStatus === OperationStatus.INSTALLING ? "Installing..." : "Install" }, "install")))] }), _jsxs(Stack, { paddingTop: 2, style: { marginLeft: -16, marginRight: -16 }, children: [_jsxs(Tabs, { textColor: "inherit", value: activeTab, onChange: (_event, newValue) => {
                            setActiveTab(newValue);
                        }, children: [_jsx(Tab, { disableRipple: true, label: "README", value: 0 }), _jsx(Tab, { disableRipple: true, label: "CHANGELOG", value: 1 })] }), _jsx(Divider, {})] }), _jsxs(Stack, { flex: "auto", paddingY: 2, children: [activeTab === 0 && _jsx(TextContent, { children: readmeContent }), activeTab === 1 && _jsx(TextContent, { children: changelogContent })] })] }));
}
