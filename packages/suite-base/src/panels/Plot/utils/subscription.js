// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
const typeIsName = (part) => part.type === "name";
export function pathToSubscribePayload(path, preloadType) {
    const { messagePath: parts, topicName: topic } = path;
    const firstField = parts.find(typeIsName);
    if (firstField == undefined || firstField.type !== "name" || firstField.name.length === 0) {
        return undefined;
    }
    // Always subscribe to the header so it is available for header stamp mode
    const fields = new Set(["header", firstField.name]);
    for (const part of parts) {
        // We want to take _all_ of the filters that start the path, since these can
        // be chained
        if (part.type !== "filter") {
            break;
        }
        const { path: filterPath } = part;
        const field = filterPath[0];
        if (field == undefined) {
            continue;
        }
        fields.add(field);
    }
    return {
        topic,
        preloadType,
        fields: Array.from(fields),
    };
}
