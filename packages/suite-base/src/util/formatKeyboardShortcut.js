// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
export function formatKeyboardShortcut(key, modifiers) {
    const isMac = navigator.userAgent.includes("Mac");
    return [
        ...modifiers.map((modifier) => {
            switch (modifier) {
                case "Meta":
                    return isMac ? "⌘" : "Ctrl";
                case "Control":
                    return isMac ? "⌃" : "Ctrl";
                case "Alt":
                    return isMac ? "⌥" : "Alt";
                case "Shift":
                    return isMac ? "⇧" : "Shift";
            }
        }),
        key,
    ].join(isMac ? "" : "+");
}
