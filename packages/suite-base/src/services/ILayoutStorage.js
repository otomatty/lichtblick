// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
export function layoutPermissionIsShared(permission) {
    return permission !== "CREATOR_WRITE";
}
export function layoutIsShared(layout) {
    return layoutPermissionIsShared(layout.permission);
}
export function layoutAppearsDeleted(layout) {
    return (layout.syncInfo?.status === "locally-deleted" ||
        (layout.syncInfo?.status === "remotely-deleted" && layout.working == undefined));
}
