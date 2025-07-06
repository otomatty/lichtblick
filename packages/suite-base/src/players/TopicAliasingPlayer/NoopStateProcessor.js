// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
/**
 * Overrides the process method of StateProcessor to be a passthrough.
 *
 * Useful if there is no processing to perform.
 */
export class NoopStateProcessor {
    process(playerState) {
        return playerState;
    }
    aliasSubscriptions(subs) {
        return subs;
    }
}
