import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { Link } from "@mui/material";
import path from "path";
import { AllowedFileExtensions } from "@lichtblick/suite-base/constants/allowedFileExtensions";
import { IterablePlayer, WorkerIterableSource, } from "@lichtblick/suite-base/players/IterablePlayer";
const initWorkers = {
    ".bag": () => {
        return new Worker(
        // foxglove-depcheck-used: babel-plugin-transform-import-meta
        new URL("@lichtblick/suite-base/players/IterablePlayer/BagIterableSourceWorker.worker", import.meta.url));
    },
    ".mcap": () => {
        return new Worker(
        // foxglove-depcheck-used: babel-plugin-transform-import-meta
        new URL("@lichtblick/suite-base/players/IterablePlayer/Mcap/McapIterableSourceWorker.worker", import.meta.url));
    },
};
const fileTypesAllowed = [
    AllowedFileExtensions.BAG,
    AllowedFileExtensions.MCAP,
];
export function checkExtensionMatch(fileExtension, previousExtension) {
    if (previousExtension != undefined && previousExtension !== fileExtension) {
        throw new Error("All sources need to be from the same type");
    }
    return fileExtension;
}
class RemoteDataSourceFactory {
    id = "remote-file";
    // The remote file feature use to be handled by two separate factories with these IDs.
    // We consolidated this into one factory that appears in the "connection" list and has a `url` field.
    //
    // To keep backwards compatability with deep-link urls that used these ids we provide them as legacy aliases
    legacyIds = ["mcap-remote-file", "ros1-remote-bagfile"];
    type = "connection";
    displayName = "Remote file";
    iconName = "FileASPX";
    supportedFileTypes = fileTypesAllowed;
    description = "Open pre-recorded .bag or .mcap files from a remote location.";
    docsLinks = [
        {
            label: "ROS 1",
            url: "https://docs.foxglove.dev/docs/connecting-to-data/frameworks/ros1#remote-file",
        },
        {
            label: "MCAP",
            url: "https://docs.foxglove.dev/docs/connecting-to-data/frameworks/mcap#remote-file",
        },
    ];
    formConfig = {
        fields: [
            {
                id: "url",
                label: "Remote file URL",
                placeholder: "https://example.com/file.bag",
                validate: (newValue) => {
                    return this.#validateUrl(newValue);
                },
            },
        ],
    };
    warning = (_jsxs(_Fragment, { children: ["Loading large files over HTTP can be slow. For better performance, we recommend", " ", _jsx(Link, { href: "https://foxglove.dev/data-platform", target: "_blank", children: "Foxglove Data Platform" }), "."] }));
    initialize(args) {
        if (args.params?.url == undefined) {
            return;
        }
        const urls = args.params.url.split(",");
        let nextExtension = undefined;
        let extension = "";
        urls.forEach((url) => {
            extension = path.extname(new URL(url).pathname);
            nextExtension = checkExtensionMatch(extension, nextExtension);
        });
        const initWorker = initWorkers[extension];
        const source = new WorkerIterableSource({ initWorker, initArgs: { urls } });
        return new IterablePlayer({
            source,
            name: urls.join(),
            metricsCollector: args.metricsCollector,
            urlParams: { urls },
            sourceId: this.id,
        });
    }
    #validateUrl(newValue) {
        try {
            const url = new URL(newValue);
            const extension = path.extname(url.pathname);
            if (extension.length === 0) {
                return new Error("URL must end with a filename and extension");
            }
            if (!this.supportedFileTypes.includes(extension)) {
                const supportedExtensions = new Intl.ListFormat("en-US", { style: "long" }).format(this.supportedFileTypes);
                return new Error(`Only ${supportedExtensions} files are supported.`);
            }
            return undefined;
        }
        catch (err) {
            console.error(err);
            return new Error("Enter a valid url");
        }
    }
}
export default RemoteDataSourceFactory;
