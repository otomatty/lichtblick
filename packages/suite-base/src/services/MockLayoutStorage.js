// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// ts-prune-ignore-next
export default class MockLayoutStorage {
    #layoutsByIdByNamespace;
    constructor(namespace, layouts = []) {
        this.#layoutsByIdByNamespace = new Map([
            [namespace, new Map(layouts.map((layout) => [layout.id, layout]))],
        ]);
    }
    async list(namespace) {
        return Array.from(this.#layoutsByIdByNamespace.get(namespace)?.values() ?? []);
    }
    async get(namespace, id) {
        return this.#layoutsByIdByNamespace.get(namespace)?.get(id);
    }
    async put(namespace, layout) {
        let layoutsById = this.#layoutsByIdByNamespace.get(namespace);
        if (!layoutsById) {
            layoutsById = new Map();
            this.#layoutsByIdByNamespace.set(namespace, layoutsById);
        }
        layoutsById.set(layout.id, layout);
        return layout;
    }
    async delete(namespace, id) {
        this.#layoutsByIdByNamespace.get(namespace)?.delete(id);
    }
    async importLayouts() { }
}
