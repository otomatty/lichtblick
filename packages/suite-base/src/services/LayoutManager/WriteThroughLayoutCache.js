// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { LazilyInitialized } from "@lichtblick/den/async";
/**
 * A view of ILayoutCache which only calls the underlying list() once per namespace, and implements
 * all operations on the cached data in memory as well as writing through to the underlying storage.
 *
 * For this to be useful, we must assume nothing else is accessing the same underlying storage.
 */
export default class WriteThroughLayoutCache {
    storage;
    #cacheByNamespace = new Map();
    constructor(storage) {
        this.storage = storage;
    }
    #getOrCreateCache(namespace) {
        let cache = this.#cacheByNamespace.get(namespace);
        if (!cache) {
            cache = new LazilyInitialized(async () => await this.storage
                .list(namespace)
                .then((layouts) => new Map(layouts.map((layout) => [layout.id, layout]))));
            this.#cacheByNamespace.set(namespace, cache);
        }
        return cache;
    }
    async importLayouts(params) {
        await this.storage.importLayouts(params);
    }
    async migrateUnnamespacedLayouts(namespace) {
        await this.storage.migrateUnnamespacedLayouts?.(namespace);
    }
    async list(namespace) {
        return Array.from((await this.#getOrCreateCache(namespace).get()).values());
    }
    async get(namespace, id) {
        return (await this.#getOrCreateCache(namespace).get()).get(id);
    }
    async put(namespace, layout) {
        const result = await this.storage.put(namespace, layout);
        (await this.#getOrCreateCache(namespace).get()).set(result.id, result);
        return result;
    }
    async delete(namespace, id) {
        await this.storage.delete(namespace, id);
        (await this.#getOrCreateCache(namespace).get()).delete(id);
    }
}
