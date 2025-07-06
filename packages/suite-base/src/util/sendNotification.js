// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { reportError } from "@lichtblick/suite-base/reportError";
import { AppError } from "@lichtblick/suite-base/util/errors";
import { inWebWorker } from "@lichtblick/suite-base/util/workers";
const defaultNotificationHandler = (message, details, type, severity) => {
    if (inWebWorker()) {
        const webWorkerError = "Web Worker has uninitialized sendNotification function; this means this error message cannot show up in the UI (so we show it here in the console instead).";
        if (process.env.NODE_ENV === "test") {
            throw new Error(webWorkerError);
        }
        else {
            const consoleFn = severity === "error" ? console.error : severity === "warn" ? console.warn : console.info;
            consoleFn(webWorkerError, message, details, type);
        }
        return;
    }
    else if (process.env.NODE_ENV === "test") {
        return;
    }
    console.error("Notification before error display is mounted", message, details, type);
};
let addNotification = defaultNotificationHandler;
export function setNotificationHandler(handler) {
    if (addNotification !== defaultNotificationHandler) {
        throw new Error("Tried to overwrite existing NotificationHandler");
    }
    addNotification = handler;
}
export function unsetNotificationHandler() {
    if (addNotification === defaultNotificationHandler) {
        throw new Error("Tried to unset NotificationHandler but it was already the default");
    }
    addNotification = defaultNotificationHandler;
}
// Call this to add an notification to the application nav bar error component if mounted.
// If the component is not mounted, use the console as a fallback.
export default function sendNotification(message, details, type, severity) {
    // We only want to send non-user errors and warnings to Sentry
    if (type === "app") {
        if (severity === "warn" || severity === "error") {
            reportError(new AppError(details, message));
        }
    }
    addNotification(message, details, type, severity);
}
sendNotification.expectCalledDuringTest = () => {
    throw new Error("Should be overriden in setupTestFramework.ts");
};
