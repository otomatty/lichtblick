// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { ComlinkWrap } from "@lichtblick/den/worker";
export class WorkerImageDecoder {
    #remote;
    #dispose;
    constructor() {
        const { remote, dispose } = ComlinkWrap(new Worker(
        // foxglove-depcheck-used: babel-plugin-transform-import-meta
        new URL("./WorkerImageDecoder.worker", import.meta.url)));
        this.#remote = remote;
        this.#dispose = dispose;
    }
    /**
     * Copies `image` to the worker, and transfers the decoded result back to the main thread.
     */
    async decode(image, options) {
        return await this.#remote.decode(image, options);
    }
    terminate() {
        this.#dispose();
    }
}
