// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { create } from "zustand";
export const useInstallingExtensionsStore = create((set) => ({
    installingProgress: { installed: 0, total: 0, inProgress: false },
    setInstallingProgress: (progress) => {
        set((state) => ({
            installingProgress: progress(state.installingProgress),
        }));
    },
    startInstallingProgress: (extensionsToBeInstalled) => {
        set((state) => ({
            installingProgress: {
                ...state.installingProgress,
                total: extensionsToBeInstalled,
                installed: 0,
                inProgress: true,
            },
        }));
    },
    resetInstallingProgress: () => {
        set(() => ({
            installingProgress: {
                total: 0,
                installed: 0,
                inProgress: false,
            },
        }));
    },
}));
