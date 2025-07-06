// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
export function makeMockAppConfiguration(entries) {
    const map = new Map(entries);
    const listeners = new Map();
    return {
        get: (key) => map.get(key),
        set: async (key, value) => {
            map.set(key, value);
            [...(listeners.get(key) ?? [])].forEach((listener) => {
                listener(value);
            });
        },
        addChangeListener: (key, cb) => {
            let listenersForKey = listeners.get(key);
            if (!listenersForKey) {
                listenersForKey = new Set();
                listeners.set(key, listenersForKey);
            }
            listenersForKey.add(cb);
        },
        removeChangeListener: (key, cb) => listeners.get(key)?.delete(cb),
    };
}
