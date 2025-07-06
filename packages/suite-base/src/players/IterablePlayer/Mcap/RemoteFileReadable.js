// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import BrowserHttpReader from "@lichtblick/suite-base/util/BrowserHttpReader";
import CachedFilelike from "@lichtblick/suite-base/util/CachedFilelike";
export class RemoteFileReadable {
    #remoteReader;
    constructor(url) {
        const fileReader = new BrowserHttpReader(url);
        this.#remoteReader = new CachedFilelike({
            fileReader,
            cacheSizeInBytes: 1024 * 1024 * 500, // 500MiB
        });
    }
    async open() {
        await this.#remoteReader.open(); // Important that we call this first, because it might throw an error if the file can't be read.
    }
    async size() {
        return BigInt(this.#remoteReader.size());
    }
    async read(offset, size) {
        if (offset + size > Number.MAX_SAFE_INTEGER) {
            throw new Error(`Read too large: offset ${offset}, size ${size}`);
        }
        return await this.#remoteReader.read(Number(offset), Number(size));
    }
}
