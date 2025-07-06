import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import GlobalCss from "@lichtblick/suite-base/components/GlobalCss";
import { SharedRootContext, } from "@lichtblick/suite-base/context/SharedRootContext";
import AppParametersProvider from "@lichtblick/suite-base/providers/AppParametersProvider";
import { ColorSchemeThemeProvider } from "./components/ColorSchemeThemeProvider";
import CssBaseline from "./components/CssBaseline";
import ErrorBoundary from "./components/ErrorBoundary";
import AppConfigurationContext from "./context/AppConfigurationContext";
// SharedRoot: テーマや各種 ContextProvider でアプリ全体をラップするルートコンポーネント
export function SharedRoot(props) {
    const { appBarLeftInset, appConfiguration, onAppBarDoubleClick, AppBarComponent, children, customWindowControlProps, dataSources, deepLinks, enableGlobalCss = false, enableLaunchPreferenceScreen, extensionLoaders, extraProviders, } = props;
    return (_jsx(AppConfigurationContext.Provider, { value: appConfiguration, children: _jsx(AppParametersProvider, { children: _jsxs(ColorSchemeThemeProvider, { children: [enableGlobalCss && _jsx(GlobalCss, {}), _jsx(CssBaseline, { children: _jsx(ErrorBoundary, { children: _jsx(SharedRootContext.Provider, { value: {
                                    appBarLeftInset,
                                    AppBarComponent,
                                    appConfiguration,
                                    customWindowControlProps,
                                    dataSources,
                                    deepLinks,
                                    enableLaunchPreferenceScreen,
                                    extensionLoaders,
                                    extraProviders,
                                    onAppBarDoubleClick,
                                }, children: children }) }) })] }) }) }));
}
