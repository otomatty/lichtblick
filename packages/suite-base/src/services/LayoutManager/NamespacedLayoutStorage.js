// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import Logger from "@lichtblick/log";
const log = Logger.getLogger(__filename);
/**
 * A wrapper around ILayoutStorage for a particular namespace.
 */
export class NamespacedLayoutStorage {
    storage;
    namespace;
    #migration;
    constructor(storage, namespace, { migrateUnnamespacedLayouts, importFromNamespace, }) {
        this.storage = storage;
        this.namespace = namespace;
        this.#migration = (async function () {
            if (migrateUnnamespacedLayouts) {
                await storage.migrateUnnamespacedLayouts?.(namespace).catch((error) => {
                    log.error("Migration failed:", error);
                });
            }
            if (importFromNamespace != undefined) {
                await storage
                    .importLayouts({
                    fromNamespace: importFromNamespace,
                    toNamespace: namespace,
                })
                    .catch((error) => {
                    log.error("Import failed:", error);
                });
            }
        })();
    }
    async list() {
        await this.#migration;
        return await this.storage.list(this.namespace);
    }
    async get(id) {
        await this.#migration;
        return await this.storage.get(this.namespace, id);
    }
    async put(layout) {
        await this.#migration;
        return await this.storage.put(this.namespace, layout);
    }
    async delete(id) {
        await this.#migration;
        await this.storage.delete(this.namespace, id);
    }
}
