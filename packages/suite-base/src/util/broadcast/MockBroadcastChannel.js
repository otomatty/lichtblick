// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { BROADCAST_CHANNEL_NAME } from "@lichtblick/suite-base/util/broadcast/constants";
// Mock implementation of BroadcastChannel
export default class MockBroadcastChannel {
    name = BROADCAST_CHANNEL_NAME;
    onmessage;
    postedMessages = [];
    isClosed = false;
    postMessage(message) {
        this.postedMessages.push(message);
    }
    close() {
        this.isClosed = true;
    }
    // Helper to simulate receiving a message
    simulateIncomingMessage(message) {
        this.onmessage?.({ data: message });
    }
}
