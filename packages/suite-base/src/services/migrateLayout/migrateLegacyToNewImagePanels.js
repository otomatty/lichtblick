// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { DEFAULT_CAMERA_STATE } from "@lichtblick/suite-base/panels/ThreeDeeRender/camera";
import { DEFAULT_PUBLISH_SETTINGS } from "@lichtblick/suite-base/panels/ThreeDeeRender/renderables/PublishSettings";
import { getAllPanelIds, getPanelIdForType, getPanelTypeFromId, } from "@lichtblick/suite-base/util/layout";
import { replacePanel } from "./replacePanel";
function migrateLegacyToNewImageConfig(legacyConfig) {
    return {
        cameraState: DEFAULT_CAMERA_STATE,
        followMode: "follow-pose",
        followTf: undefined,
        scene: {},
        transforms: {},
        topics: {},
        layers: {},
        publish: DEFAULT_PUBLISH_SETTINGS,
        imageMode: {
            imageTopic: legacyConfig.cameraTopic,
            calibrationTopic: undefined,
            synchronize: legacyConfig.synchronize,
            rotation: legacyConfig.rotation != undefined && [0, 90, 180, 270].includes(legacyConfig.rotation)
                ? legacyConfig.rotation
                : 0,
            flipHorizontal: legacyConfig.flipHorizontal,
            flipVertical: legacyConfig.flipVertical,
            minValue: legacyConfig.minValue,
            maxValue: legacyConfig.maxValue,
            annotations: Object.fromEntries((legacyConfig.enabledMarkerTopics ?? []).map((topicName) => [topicName, { visible: true }])),
        },
    };
}
export function migrateLegacyToNewImagePanels(layoutData) {
    if (layoutData.layout == undefined) {
        return layoutData;
    }
    const legacyImagePanels = getAllPanelIds(layoutData.layout, layoutData.configById).filter((id) => getPanelTypeFromId(id) === "ImageViewPanel");
    let newState = layoutData;
    for (const id of legacyImagePanels) {
        const legacyConfig = layoutData.configById[id];
        if (legacyConfig != undefined) {
            newState = replacePanel(newState, id, getPanelIdForType("Image"), migrateLegacyToNewImageConfig(legacyConfig));
        }
    }
    return newState;
}
