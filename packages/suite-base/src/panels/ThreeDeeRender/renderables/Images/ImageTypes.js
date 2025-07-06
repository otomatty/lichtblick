// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { CAMERA_CALIBRATION_DATATYPES } from "@lichtblick/suite-base/panels/ThreeDeeRender/foxglove";
import { CAMERA_INFO_DATATYPES, } from "../../ros";
export const ALL_CAMERA_INFO_SCHEMAS = new Set([
    ...CAMERA_INFO_DATATYPES,
    ...CAMERA_CALIBRATION_DATATYPES,
]);
export function getFrameIdFromImage(image) {
    if ("header" in image) {
        return image.header.frame_id;
    }
    else {
        return image.frame_id;
    }
}
export function getTimestampFromImage(image) {
    if ("header" in image) {
        return image.header.stamp;
    }
    else {
        return image.timestamp;
    }
}
