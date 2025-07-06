import { jsx as _jsx } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { useMemo } from "react";
import { useCrash } from "@lichtblick/hooks";
import { CaptureErrorBoundary } from "@lichtblick/suite-base/components/CaptureErrorBoundary";
import Panel from "@lichtblick/suite-base/components/Panel";
import { PanelExtensionAdapter } from "@lichtblick/suite-base/components/PanelExtensionAdapter";
import { createSyncRoot } from "@lichtblick/suite-base/panels/createSyncRoot";
import ThemeProvider from "@lichtblick/suite-base/theme/ThemeProvider";
import { Gauge } from "./Gauge";
function initPanel(crash, context) {
    return createSyncRoot(_jsx(CaptureErrorBoundary, { onError: crash, children: _jsx(ThemeProvider, { isDark: true, children: _jsx(Gauge, { context: context }) }) }), context.panelElement);
}
function GaugePanelAdapter({ config, saveConfig }) {
    const crash = useCrash();
    const boundInitPanel = useMemo(() => initPanel.bind(undefined, crash), [crash]);
    return (_jsx(PanelExtensionAdapter, { config: config, saveConfig: saveConfig, initPanel: boundInitPanel, highestSupportedConfigVersion: 1 }));
}
GaugePanelAdapter.panelType = "Gauge";
GaugePanelAdapter.defaultConfig = {};
export default Panel(GaugePanelAdapter);
