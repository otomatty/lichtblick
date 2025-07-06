// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import JSZip from "jszip";
import Log from "@lichtblick/log";
import { IdbExtensionStorage } from "./IdbExtensionStorage";
const log = Log.getLogger(__filename);
export var ALLOWED_FILES;
(function (ALLOWED_FILES) {
    ALLOWED_FILES["EXTENSION"] = "dist/extension.js";
    ALLOWED_FILES["PACKAGE"] = "package.json";
    ALLOWED_FILES["README"] = "README.md";
    ALLOWED_FILES["CHANGELOG"] = "CHANGELOG.md";
})(ALLOWED_FILES || (ALLOWED_FILES = {}));
function parsePackageName(name) {
    const match = new RegExp(/^@([^/]+)\/(.+)/).exec(name);
    if (!match) {
        return { name };
    }
    return { publisher: match[1], name: match[2] };
}
function qualifiedName(namespace, publisher, info) {
    switch (namespace) {
        case "local":
            // For local namespace we follow the legacy naming convention of using displayName
            // in order to stay compatible with existing layouts.
            return info.displayName;
        case "org":
            // For private registry we use namespace and package name.
            return [namespace, publisher, info.name].join(":");
    }
}
export function validatePackageInfo(info) {
    if (!info.name || info.name.length === 0) {
        throw new Error("Invalid extension: missing name");
    }
    const { publisher: parsedPublisher, name } = parsePackageName(info.name);
    const publisher = info.publisher ?? parsedPublisher;
    if (!publisher || publisher.length === 0) {
        throw new Error("Invalid extension: missing publisher");
    }
    return { ...info, publisher, name: name.toLowerCase() };
}
async function getFileContent(foxeFileData, allowedFile) {
    const zip = new JSZip();
    const content = await zip.loadAsync(foxeFileData);
    const extractedContent = await content.file(allowedFile)?.async("string");
    return extractedContent;
}
export class IdbExtensionLoader {
    #storage;
    namespace;
    constructor(namespace) {
        this.namespace = namespace;
        this.#storage = new IdbExtensionStorage(namespace);
    }
    async getExtension(id) {
        log.debug("Get extension", id);
        const storedExtension = await this.#storage.get(id);
        return storedExtension?.info;
    }
    async getExtensions() {
        log.debug("Listing extensions");
        return await this.#storage.list();
    }
    async loadExtension(id) {
        log.debug("Loading extension", id);
        const extension = await this.#storage.get(id);
        if (!extension) {
            throw new Error("Extension not found");
        }
        const content = await new JSZip().loadAsync(extension.content);
        const rawContent = await content.file(ALLOWED_FILES.EXTENSION)?.async("string");
        if (!rawContent) {
            throw new Error(`Extension is corrupted: missing ${ALLOWED_FILES.EXTENSION}`);
        }
        return rawContent;
    }
    async installExtension(foxeFileData) {
        log.debug("Installing extension");
        const pkgInfoText = await getFileContent(foxeFileData, ALLOWED_FILES.PACKAGE);
        if (!pkgInfoText) {
            throw new Error(`Corrupted extension. File "${ALLOWED_FILES.PACKAGE}" is missing in the extension source.`);
        }
        const readme = (await getFileContent(foxeFileData, ALLOWED_FILES.README)) ?? "";
        const changelog = (await getFileContent(foxeFileData, ALLOWED_FILES.CHANGELOG)) ?? "";
        const rawInfo = validatePackageInfo(JSON.parse(pkgInfoText));
        const normalizedPublisher = rawInfo.publisher.replace(/[^A-Za-z0-9_\s]+/g, "");
        const info = {
            ...rawInfo,
            id: `${normalizedPublisher}.${rawInfo.name}`,
            namespace: this.namespace,
            qualifiedName: qualifiedName(this.namespace, normalizedPublisher, rawInfo),
            readme,
            changelog,
        };
        await this.#storage.put({
            content: foxeFileData,
            info,
        });
        return info;
    }
    async uninstallExtension(id) {
        log.debug("Uninstalling extension", id);
        await this.#storage.delete(id);
    }
}
