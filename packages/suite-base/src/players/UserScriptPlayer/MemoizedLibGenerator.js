// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
/**
 * LibGenerator memoizes generating a library from topics and datatypes.
 *
 * Calling `update` returns a boolean to indicate if the library was re-generated and the
 * library source code.
 *
 * If the args to update are unchanged (same topics and datatyes), then the previously
 * generated value from `fn` is returned.
 */
class MemoizedLibGenerator {
    #datatypes;
    #topics;
    #fn;
    #cached;
    constructor(fn) {
        this.#fn = fn;
    }
    /**
     * Update the library with new args.
     * If the arg fields have changed, the generator function is run to make a new library.
     *
     * Return whether the cached value was updated and the cached value.
     */
    async update(args) {
        if (args.topics === this.#topics &&
            args.datatypes === this.#datatypes &&
            this.#cached != undefined) {
            return { didUpdate: false, lib: this.#cached };
        }
        const lib = await this.#fn(args);
        this.#topics = args.topics;
        this.#datatypes = args.datatypes;
        this.#cached = lib;
        return { didUpdate: true, lib };
    }
}
export { MemoizedLibGenerator };
