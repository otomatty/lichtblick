import { jsx as _jsx } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { useMemo } from "react";
import { useCrash } from "@lichtblick/hooks";
import { CaptureErrorBoundary } from "@lichtblick/suite-base/components/CaptureErrorBoundary";
import { ForwardAnalyticsContextProvider, useForwardAnalytics, } from "@lichtblick/suite-base/components/ForwardAnalyticsContextProvider";
import Panel from "@lichtblick/suite-base/components/Panel";
import { PanelExtensionAdapter, } from "@lichtblick/suite-base/components/PanelExtensionAdapter";
import { INJECTED_FEATURE_KEYS, useAppContext } from "@lichtblick/suite-base/context/AppContext";
import { useExtensionCatalog } from "@lichtblick/suite-base/context/ExtensionCatalogContext";
import { createSyncRoot } from "@lichtblick/suite-base/panels/createSyncRoot";
import { ThreeDeeRender } from "./ThreeDeeRender";
function initPanel(args, context) {
    const { crash, forwardedAnalytics, interfaceMode, testOptions, customSceneExtensions, customCameraModels, } = args;
    return createSyncRoot(_jsx(CaptureErrorBoundary, { onError: crash, children: _jsx(ForwardAnalyticsContextProvider, { forwardedAnalytics: forwardedAnalytics, children: _jsx(ThreeDeeRender, { context: context, interfaceMode: interfaceMode, testOptions: testOptions, customSceneExtensions: customSceneExtensions, customCameraModels: customCameraModels }) }) }), context.panelElement);
}
function ThreeDeeRenderAdapter(interfaceMode, props) {
    const crash = useCrash();
    const customCameraModels = useExtensionCatalog((state) => state.installedCameraModels);
    const forwardedAnalytics = useForwardAnalytics();
    const { injectedFeatures } = useAppContext();
    const customSceneExtensions = useMemo(() => {
        if (injectedFeatures == undefined) {
            return undefined;
        }
        const injectedSceneExtensions = injectedFeatures.availableFeatures[INJECTED_FEATURE_KEYS.customSceneExtensions]
            ?.customSceneExtensions;
        return injectedSceneExtensions;
    }, [injectedFeatures]);
    const boundInitPanel = useMemo(() => initPanel.bind(undefined, {
        crash,
        forwardedAnalytics,
        interfaceMode,
        testOptions: { onDownloadImage: props.onDownloadImage, debugPicking: props.debugPicking },
        customSceneExtensions,
        customCameraModels,
    }), [
        crash,
        forwardedAnalytics,
        interfaceMode,
        props.onDownloadImage,
        props.debugPicking,
        customSceneExtensions,
        customCameraModels,
    ]);
    return (_jsx(PanelExtensionAdapter, { config: props.config, highestSupportedConfigVersion: 1, saveConfig: props.saveConfig, initPanel: boundInitPanel }));
}
/**
 * The Image panel is a special case of the 3D panel with `interfaceMode` set to `"image"`.
 */
export const ImagePanel = Panel(Object.assign(ThreeDeeRenderAdapter.bind(undefined, "image"), {
    panelType: "Image",
    defaultConfig: {},
}));
export default Panel(Object.assign(ThreeDeeRenderAdapter.bind(undefined, "3d"), {
    panelType: "3D",
    defaultConfig: {},
}));
