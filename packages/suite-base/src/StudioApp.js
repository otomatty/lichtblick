import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { Fragment, Suspense, useEffect, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { IdbLayoutStorage } from "@lichtblick/suite-base/IdbLayoutStorage";
import LayoutStorageContext from "@lichtblick/suite-base/context/LayoutStorageContext";
import NativeAppMenuContext from "@lichtblick/suite-base/context/NativeAppMenuContext";
import NativeWindowContext from "@lichtblick/suite-base/context/NativeWindowContext";
import { useSharedRootContext } from "@lichtblick/suite-base/context/SharedRootContext";
import AlertsContextProvider from "@lichtblick/suite-base/providers/AlertsContextProvider";
import EventsProvider from "@lichtblick/suite-base/providers/EventsProvider";
import LayoutManagerProvider from "@lichtblick/suite-base/providers/LayoutManagerProvider";
import { StudioLogsSettingsProvider } from "@lichtblick/suite-base/providers/StudioLogsSettingsProvider";
import TimelineInteractionStateProvider from "@lichtblick/suite-base/providers/TimelineInteractionStateProvider";
import UserProfileLocalStorageProvider from "@lichtblick/suite-base/providers/UserProfileLocalStorageProvider";
import Workspace from "./Workspace";
import DocumentTitleAdapter from "./components/DocumentTitleAdapter";
import MultiProvider from "./components/MultiProvider";
import PlayerManager from "./components/PlayerManager";
import SendNotificationToastAdapter from "./components/SendNotificationToastAdapter";
import StudioToastProvider from "./components/StudioToastProvider";
import { UserScriptStateProvider } from "./context/UserScriptStateContext";
import CurrentLayoutProvider from "./providers/CurrentLayoutProvider";
import ExtensionCatalogProvider from "./providers/ExtensionCatalogProvider";
import ExtensionMarketplaceProvider from "./providers/ExtensionMarketplaceProvider";
import PanelCatalogProvider from "./providers/PanelCatalogProvider";
import { LaunchPreference } from "./screens/LaunchPreference";
// Suppress context menu for the entire app except on inputs & textareas.
function contextMenuHandler(event) {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
    }
    event.preventDefault();
    return false;
}
// StudioApp: ワークスペースと関連プロバイダーをまとめるメインコンポーネント
export function StudioApp() {
    const { dataSources, extensionLoaders, nativeAppMenu, nativeWindow, deepLinks, enableLaunchPreferenceScreen, extraProviders, appBarLeftInset, customWindowControlProps, onAppBarDoubleClick, AppBarComponent, } = useSharedRootContext();
    const providers = [
        /* eslint-disable react/jsx-key */
        _jsx(TimelineInteractionStateProvider, {}),
        _jsx(ExtensionMarketplaceProvider, {}),
        _jsx(ExtensionCatalogProvider, { loaders: extensionLoaders }),
        _jsx(UserScriptStateProvider, {}),
        _jsx(PlayerManager, { playerSources: dataSources }),
        _jsx(EventsProvider, {}),
        /* eslint-enable react/jsx-key */
    ];
    if (extraProviders) {
        providers.unshift(...extraProviders);
    }
    if (nativeAppMenu) {
        providers.push(_jsx(NativeAppMenuContext.Provider, { value: nativeAppMenu }));
    }
    if (nativeWindow) {
        providers.push(_jsx(NativeWindowContext.Provider, { value: nativeWindow }));
    }
    // The toast and logs provider comes first so they are available to all downstream providers
    providers.unshift(_jsx(StudioToastProvider, {}));
    providers.unshift(_jsx(StudioLogsSettingsProvider, {}));
    // Alerts provider also must come before other, dependent contexts.
    providers.unshift(_jsx(AlertsContextProvider, {}));
    providers.unshift(_jsx(CurrentLayoutProvider, {}));
    providers.unshift(_jsx(UserProfileLocalStorageProvider, {}));
    providers.unshift(_jsx(LayoutManagerProvider, {}));
    const layoutStorage = useMemo(() => new IdbLayoutStorage(), []);
    providers.unshift(_jsx(LayoutStorageContext.Provider, { value: layoutStorage }));
    const MaybeLaunchPreference = enableLaunchPreferenceScreen === true ? LaunchPreference : Fragment;
    useEffect(() => {
        document.addEventListener("contextmenu", contextMenuHandler);
        return () => {
            document.removeEventListener("contextmenu", contextMenuHandler);
        };
    }, []);
    return (_jsx(MaybeLaunchPreference, { children: _jsxs(MultiProvider, { providers: providers, children: [_jsx(DocumentTitleAdapter, {}), _jsx(SendNotificationToastAdapter, {}), _jsx(DndProvider, { backend: HTML5Backend, children: _jsx(Suspense, { fallback: _jsx(_Fragment, {}), children: _jsx(PanelCatalogProvider, { children: _jsx(Workspace, { deepLinks: deepLinks, appBarLeftInset: appBarLeftInset, onAppBarDoubleClick: onAppBarDoubleClick, showCustomWindowControls: customWindowControlProps?.showCustomWindowControls, isMaximized: customWindowControlProps?.isMaximized, initialZoomFactor: customWindowControlProps?.initialZoomFactor, onMinimizeWindow: customWindowControlProps?.onMinimizeWindow, onMaximizeWindow: customWindowControlProps?.onMaximizeWindow, onUnmaximizeWindow: customWindowControlProps?.onUnmaximizeWindow, onCloseWindow: customWindowControlProps?.onCloseWindow, AppBarComponent: AppBarComponent }) }) }) })] }) }));
}
