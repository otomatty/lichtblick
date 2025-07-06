// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
export function compareTime(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}
export function percentOf(start, end, target) {
    const totalDuration = end - start;
    const targetDuration = target - start;
    return Number(targetDuration) / Number(totalDuration);
}
export function interpolate(start, end, fraction) {
    const duration = Number(end - start);
    return start + BigInt(Math.round(duration * fraction));
}
