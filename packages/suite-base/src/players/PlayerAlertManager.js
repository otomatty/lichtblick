// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
/**
 * Manages a set of PlayerAlerts keyed by ID. Calls to alerts() will return the same object as
 * long as alerts have not been added/removed; this helps the player pipeline to know when it
 * needs to re-process alert alerts.
 */
export default class PlayerAlertManager {
    #alertsById = new Map();
    #alerts;
    /**
     * Returns the current set of alerts. Subsequent calls will return the same object as long as
     * alerts have not been added/removed.
     */
    alerts() {
        return (this.#alerts ??= Array.from(this.#alertsById.values()));
    }
    addAlert(id, alert) {
        console[alert.severity].call(console, "Player alert", id, alert);
        this.#alertsById.set(id, alert);
        this.#alerts = undefined;
    }
    hasAlert(id) {
        return this.#alertsById.has(id);
    }
    removeAlert(id) {
        const changed = this.#alertsById.delete(id);
        if (changed) {
            this.#alerts = undefined;
        }
        return changed;
    }
    removeAlerts(predicate) {
        let changed = false;
        for (const [id, alert] of this.#alertsById) {
            if (predicate(id, alert)) {
                if (this.#alertsById.delete(id)) {
                    changed = true;
                }
            }
        }
        if (changed) {
            this.#alerts = undefined;
        }
        return changed;
    }
    clear() {
        this.#alertsById.clear();
        this.#alerts = undefined;
    }
}
