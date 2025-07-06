// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
/**
 * Helper function for generating mock messages for tests and stories.
 *
 * @param message the message body
 * @param fields fields in the message object to override
 * @returns a MessageEvent
 */
export function mockMessage(message, fields) {
    return {
        topic: "topic",
        schemaName: "schema",
        receiveTime: { sec: 0, nsec: 0 },
        message,
        sizeInBytes: 1,
        ...fields,
    };
}
