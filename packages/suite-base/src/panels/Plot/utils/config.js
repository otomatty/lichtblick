// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { PANEL_TITLE_CONFIG_KEY } from "@lichtblick/suite-base/util/layout";
/**
 * A "reference line" plot path is a numeric value. It creates a horizontal line on the plot at the
 * specified value.
 * @returns true if the series config is a reference line
 */
export function isReferenceLinePlotPathType(path) {
    return !isNaN(Number.parseFloat(path.value));
}
/**
 * Coalesces null, undefined and empty string to undefined.
 */
function presence(value) {
    if (value === "") {
        return undefined;
    }
    return value ?? undefined;
}
export function plotPathDisplayName(path, index) {
    return presence(path.label) ?? presence(path.value) ?? `Series ${index + 1}`;
}
