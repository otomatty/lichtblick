// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
export const validationErrorToString = (validationResult) => typeof validationResult === "string"
    ? validationResult
    : Object.keys(validationResult)
        .map((key) => `${key}: ${validationResult[key]}`)
        .join(", ");
