// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import GlobalVariableBuilder from "@lichtblick/suite-base/testing/builders/GlobalVariableBuilder";
import { defaults } from "@lichtblick/suite-base/testing/builders/utilities";
export default class LayoutBuilder {
    static playbackConfig(props = {}) {
        return defaults(props, {
            speed: BasicBuilder.float(),
        });
    }
    static userScript(props = {}) {
        return defaults(props, {
            name: BasicBuilder.string(),
            sourceCode: BasicBuilder.string(),
        });
    }
    static userScripts(count = 3) {
        return BasicBuilder.genericDictionary(LayoutBuilder.userScript, { count });
    }
    static data(props = {}) {
        return defaults(props, {
            configById: BasicBuilder.genericDictionary(Object),
            globalVariables: GlobalVariableBuilder.globalVariables(),
            userNodes: LayoutBuilder.userScripts(),
            playbackConfig: LayoutBuilder.playbackConfig(),
        });
    }
    static baseline(props = {}) {
        return defaults(props, {
            data: LayoutBuilder.data(),
            savedAt: new Date(BasicBuilder.number()).toISOString(),
        });
    }
    static syncInfo(props = {}) {
        return defaults(props, {
            status: BasicBuilder.sample([
                "new",
                "updated",
                "tracked",
                "locally-deleted",
                "remotely-deleted",
            ]),
            lastRemoteSavedAt: new Date(BasicBuilder.number()).toISOString(),
        });
    }
    static layout(props = {}) {
        return defaults(props, {
            id: BasicBuilder.string(),
            name: BasicBuilder.string(),
            from: BasicBuilder.string(),
            permission: BasicBuilder.sample([
                "CREATOR_WRITE",
                "ORG_READ",
                "ORG_WRITE",
            ]),
            baseline: LayoutBuilder.baseline(),
            working: LayoutBuilder.baseline(),
            syncInfo: LayoutBuilder.syncInfo(),
        });
    }
}
