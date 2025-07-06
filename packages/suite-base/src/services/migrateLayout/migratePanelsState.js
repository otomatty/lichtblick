// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { migrateLegacyToNew3DPanels } from "./migrateLegacyToNew3DPanels";
import { migrateLegacyToNewImagePanels } from "./migrateLegacyToNewImagePanels";
/**
 * Perform any necessary migrations on old layout data.
 */
export function migratePanelsState(data) {
    let result = { ...data, configById: data.configById ?? {} };
    result = migrateLegacyToNew3DPanels(result);
    result = migrateLegacyToNewImagePanels(result);
    return result;
}
