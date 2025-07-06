// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
export var PlayerPresence;
(function (PlayerPresence) {
    PlayerPresence["NOT_PRESENT"] = "NOT_PRESENT";
    PlayerPresence["INITIALIZING"] = "INITIALIZING";
    PlayerPresence["RECONNECTING"] = "RECONNECTING";
    PlayerPresence["BUFFERING"] = "BUFFERING";
    PlayerPresence["PRESENT"] = "PRESENT";
    PlayerPresence["ERROR"] = "ERROR";
})(PlayerPresence || (PlayerPresence = {}));
