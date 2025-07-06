// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { isTime, toSec } from "@lichtblick/rostime";
export function isChartValue(value) {
    switch (typeof value) {
        case "bigint":
        case "boolean":
        case "number":
        case "string":
            return true;
        case "object":
            if (isTime(value)) {
                return true;
            }
            return false;
        default:
            return false;
    }
}
export function getChartValue(value) {
    switch (typeof value) {
        case "bigint":
            return Number(value);
        case "boolean":
            return Number(value);
        case "number":
            return value;
        case "object":
            if (isTime(value)) {
                return toSec(value);
            }
            return undefined;
        case "string":
            return +value;
        default:
            return undefined;
    }
}
