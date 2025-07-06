// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
export default class MockLayoutManager {
    supportsSharing = false;
    isBusy = false;
    isOnline = false;
    error = undefined;
    on = jest.fn();
    off = jest.fn();
    setError = jest.fn();
    setOnline = jest.fn();
    getLayouts = jest.fn().mockResolvedValue([]);
    getLayout = jest.fn();
    saveNewLayout = jest.fn();
    updateLayout = jest.fn();
    deleteLayout = jest.fn();
    overwriteLayout = jest.fn();
    revertLayout = jest.fn();
    makePersonalCopy = jest.fn();
    syncWithRemote = jest.fn();
}
