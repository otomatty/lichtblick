// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
export class JsonMessageWriter {
    writeMessage(message) {
        return new Uint8Array(Buffer.from(JSON.stringify(message) ?? ""));
    }
}
