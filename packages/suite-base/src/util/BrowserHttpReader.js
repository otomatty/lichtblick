// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import FetchReader from "@lichtblick/suite-base/util/FetchReader";
import isDesktopApp from "@lichtblick/suite-base/util/isDesktopApp";
// A file reader that reads from a remote HTTP URL, for usage in the browser (not for node.js).
export default class BrowserHttpReader {
    #url;
    constructor(url) {
        this.#url = url;
    }
    async open() {
        let response;
        try {
            // Make a GET request and then immediately cancel it. This is more robust than a HEAD request,
            // since the server might not accept HEAD requests (e.g. when using S3 presigned URLs that
            // only work for one particular method like GET).
            // Note that we cannot use `range: "bytes=0-1"` or so, because then we can't get the actual
            // file size without making Content-Range a CORS header, therefore making all this a bit less
            // robust.
            // "no-store" forces an unconditional remote request. When the browser's cache is populated,
            // it may add a `range` header to the request, which causes some servers to omit the
            // `accept-ranges` header in the response.
            const controller = new AbortController();
            response = await fetch(this.#url, { signal: controller.signal, cache: "no-store" });
            controller.abort();
        }
        catch (error) {
            let errMsg = `Fetching remote file failed. ${error}`;
            if (!isDesktopApp()) {
                errMsg +=
                    "\n\nSometimes this is due to a CORS configuration error on the server. Make sure CORS is enabled.";
            }
            throw new Error(errMsg);
        }
        if (!response.ok) {
            throw new Error(`Fetching remote file failed. <${this.#url}> Status code: ${response.status}.`);
        }
        if (response.headers.get("accept-ranges") !== "bytes") {
            let errMsg = "Support for HTTP Range requests was not detected on the remote file.\n\nConfirm the resource has an 'Accept-Ranges: bytes' header.";
            if (!isDesktopApp()) {
                errMsg +=
                    "\n\nSometimes this is due to a CORS configuration error on the server. Make sure CORS is enabled with Access-Control-Allow-Origin, and that Access-Control-Expose-Headers includes Accept-Ranges.";
            }
            throw new Error(errMsg);
        }
        const size = response.headers.get("content-length");
        if (size == undefined) {
            throw new Error(`Remote file is missing file size. <${this.#url}>`);
        }
        return {
            size: parseInt(size),
            identifier: response.headers.get("etag") ?? response.headers.get("last-modified") ?? undefined,
        };
    }
    fetch(offset, length) {
        const headers = new Headers({ range: `bytes=${offset}-${offset + (length - 1)}` });
        const reader = new FetchReader(this.#url, { headers });
        reader.read();
        return reader;
    }
}
