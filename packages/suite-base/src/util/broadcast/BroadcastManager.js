// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { BROADCAST_CHANNEL_NAME } from "./constants";
export default class BroadcastManager {
    static instance;
    static shouldSync = false;
    channel;
    listeners;
    constructor() {
        this.channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        this.listeners = new Set();
        this.channel.onmessage = (event) => {
            if (!BroadcastManager.shouldSync) {
                return;
            }
            for (const listener of this.listeners) {
                listener(event.data);
            }
        };
    }
    postMessage(message) {
        if (!BroadcastManager.shouldSync) {
            return;
        }
        this.channel.postMessage(message);
    }
    addListener(listener) {
        this.listeners.add(listener);
    }
    removeListener(listener) {
        this.listeners.delete(listener);
    }
    close() {
        this.channel.close();
        BroadcastManager.instance = undefined;
    }
    static getInstance() {
        BroadcastManager.instance ??= new BroadcastManager();
        return BroadcastManager.instance;
    }
    static setShouldSync({ shouldSync }) {
        BroadcastManager.shouldSync = shouldSync;
    }
}
