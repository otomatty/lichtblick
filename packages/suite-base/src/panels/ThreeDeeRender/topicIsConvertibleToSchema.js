// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
/**
 * Determines whether `topic` has a supported schema from the set of `supportedSchemaNames`, either
 * as the original schema or one of the `convertibleTo` schemas.
 */
export function topicIsConvertibleToSchema(topic, supportedSchemaNames) {
    return (supportedSchemaNames.has(topic.schemaName) ||
        (topic.convertibleTo?.some((name) => supportedSchemaNames.has(name)) ?? false));
}
