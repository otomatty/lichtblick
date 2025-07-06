import { PlayerAlert } from "@lichtblick/suite-base/players/types";
/**
 * Manages a set of PlayerAlerts keyed by ID. Calls to alerts() will return the same object as
 * long as alerts have not been added/removed; this helps the player pipeline to know when it
 * needs to re-process alert alerts.
 */
export default class PlayerAlertManager {
    #private;
    /**
     * Returns the current set of alerts. Subsequent calls will return the same object as long as
     * alerts have not been added/removed.
     */
    alerts(): PlayerAlert[];
    addAlert(id: string, alert: PlayerAlert): void;
    hasAlert(id: string): boolean;
    removeAlert(id: string): boolean;
    removeAlerts(predicate: (id: string, alert: PlayerAlert) => boolean): boolean;
    clear(): void;
}
