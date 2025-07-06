// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { migrateLegacyToNew3DPanels } from "./migrateLayout/migrateLegacyToNew3DPanels";
/**
 * Perform any necessary migrations on old layout data.
 */
export function migratePanelsState(data) {
    let result = { ...data, configById: data.configById ?? {} };
    result = migrateLegacyToNew3DPanels(result);
    return result;
}
/**
 * Import a layout from storage, transferring old properties to the current expected format.
 *
 * Layouts created before we stored both working/baseline copies were stored with a "data" field;
 * migrate this to a baseline layout.
 */
export function migrateLayout(value) {
    if (typeof value !== "object" || value == undefined) {
        throw new Error("Invariant violation - layout item is not an object");
    }
    const layout = value;
    if (!("id" in layout) || !layout.id) {
        throw new Error("Invariant violation - layout item is missing an id");
    }
    const now = new Date().toISOString();
    let baseline = layout.baseline;
    if (!baseline) {
        if (layout.working) {
            baseline = layout.working;
        }
        else if (layout.baseline?.data) {
            baseline = { data: layout.baseline.data, savedAt: now };
        }
        else {
            throw new Error("Invariant violation - layout item is missing data");
        }
    }
    return {
        id: layout.id,
        from: layout.from,
        name: layout.name ?? `Unnamed (${now})`,
        permission: layout.permission?.toUpperCase() ?? "CREATOR_WRITE",
        working: layout.working
            ? { ...layout.working, data: migratePanelsState(layout.working.data) }
            : undefined,
        baseline: { ...baseline, data: migratePanelsState(baseline.data) },
        syncInfo: layout.syncInfo,
    };
}
