// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
export const PRECISION_DISTANCE = 3; // [1mm]
export const PRECISION_DEGREES = 1;
export function fieldSize(label, value, placeholder) {
    return {
        label,
        input: "number",
        min: 0,
        step: 0.5,
        precision: PRECISION_DISTANCE,
        value,
        placeholder: String(placeholder),
    };
}
export function fieldScaleVec3(label, value) {
    return {
        label,
        input: "vec3",
        labels: ["X", "Y", "Z"],
        step: 0.5,
        precision: PRECISION_DISTANCE,
        value,
    };
}
export function fieldLineWidth(label, value, placeholder) {
    return {
        label,
        input: "number",
        min: 0,
        step: 0.005,
        precision: 4,
        value,
        placeholder: String(placeholder),
    };
}
export function fieldGradient(label, value) {
    return { label, input: "gradient", value };
}
