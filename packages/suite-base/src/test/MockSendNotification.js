// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
let currentHandler = undefined;
const mockSendNotification = jest.fn();
const mockSetNotificationHandler = (handler) => {
    currentHandler = handler;
};
// The sendNotification function is monkey-patched with "expectCalledDuringTest"
// Our jest mock doesn't have such a property and typescript complains
mockSendNotification.expectCalledDuringTest =
    () => {
        if (mockSendNotification.mock.calls.length === 0) {
            throw new Error("Expected sendNotification to have been called during the test, but it was never called!");
        }
        mockSendNotification.mockClear();
        // Reset the error handler to the default (no error handler).
        mockSetNotificationHandler();
    };
function setupMockSendNotification() {
    mockSendNotification.mockImplementation((...args) => {
        if (currentHandler) {
            currentHandler(...args);
        }
    });
}
export { mockSendNotification, mockSetNotificationHandler, setupMockSendNotification };
