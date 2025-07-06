// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import { defaults } from "@lichtblick/suite-base/testing/builders/utilities";
export default class ExtensionBuilder {
    static extensionInfo(props = {}) {
        return defaults(props, {
            description: BasicBuilder.string(),
            displayName: BasicBuilder.string(),
            homepage: BasicBuilder.string(),
            id: BasicBuilder.string(),
            keywords: BasicBuilder.strings(),
            license: BasicBuilder.string(),
            name: BasicBuilder.string(),
            namespace: BasicBuilder.sample(["local", "org"]),
            publisher: BasicBuilder.string(),
            qualifiedName: BasicBuilder.string(),
            version: BasicBuilder.string(),
            readme: BasicBuilder.string(),
            changelog: BasicBuilder.string(),
        });
    }
    static extensionMarketplaceDetail(props = {}) {
        return defaults(props, {
            ...this.extensionInfo(props),
            foxe: BasicBuilder.string(),
            sha256sum: BasicBuilder.string(),
            time: BasicBuilder.genericDictionary(String),
        });
    }
}
