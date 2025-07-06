// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { extname } from "path";
import { useCallback } from "react";
import Logger from "@lichtblick/log";
import { AllowedFileExtensions } from "@lichtblick/suite-base/constants/allowedFileExtensions";
import { useInstallingExtensionsState } from "@lichtblick/suite-base/hooks/useInstallingExtensionsState";
import { useLayoutTransfer } from "@lichtblick/suite-base/hooks/useLayoutTransfer";
const log = Logger.getLogger(__filename);
export function useHandleFiles({ availableSources, selectSource, isPlaying, playerEvents: { play, pause }, }) {
    const { installFoxeExtensions } = useInstallingExtensionsState({
        isPlaying,
        playerEvents: { play },
    });
    const { parseAndInstallLayout } = useLayoutTransfer();
    const handleFiles = useCallback(async (files) => {
        if (files.length === 0) {
            return;
        }
        const extensionsData = [];
        const otherFiles = [];
        const layoutFiles = [];
        for (const file of files) {
            try {
                if (file.name.endsWith(AllowedFileExtensions.FOXE)) {
                    const buffer = await file.arrayBuffer();
                    extensionsData.push(new Uint8Array(buffer));
                }
                else if (file.name.endsWith(AllowedFileExtensions.JSON)) {
                    layoutFiles.push(file);
                }
                else {
                    otherFiles.push(file);
                }
            }
            catch (error) {
                log.error(`Error reading file ${file.name}`, error);
            }
        }
        if (layoutFiles.length > 0) {
            pause?.();
            layoutFiles.forEach(async (file) => {
                await parseAndInstallLayout(file);
            });
        }
        if (extensionsData.length > 0) {
            pause?.();
            await installFoxeExtensions(extensionsData);
        }
        if (otherFiles.length > 0) {
            const source = availableSources.find((s) => otherFiles.some((file) => s.supportedFileTypes?.includes(extname(file.name)) ?? false));
            if (source) {
                selectSource(source.id, { type: "file", files: otherFiles });
            }
        }
    }, [availableSources, installFoxeExtensions, parseAndInstallLayout, pause, selectSource]);
    return { handleFiles };
}
