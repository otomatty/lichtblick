// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import WorkerSocketAdapter from "./WorkerSocketAdapter";
describe("WorkerSocketAdapter", () => {
    let workerMock;
    const wsUrl = "wss://example.com";
    beforeEach(() => {
        workerMock = {
            postMessage: jest.fn(),
            terminate: jest.fn(),
            onmessage: undefined,
        };
        global.Worker = jest.fn(() => workerMock);
        new WorkerSocketAdapter(wsUrl);
    });
    it("WorkerSocketAdapter should close a WebSocket connection", () => {
        workerMock.onmessage?.({ data: { type: "close", data: {} } });
        expect(workerMock.terminate).toHaveBeenCalled();
    });
    it("WorkerSocketAdapter should send a message", () => {
        const socket = new WorkerSocketAdapter(wsUrl);
        const message = BasicBuilder.string();
        socket.send(message);
        expect(workerMock.postMessage).toHaveBeenCalledWith({
            type: "data",
            data: message,
        });
    });
    it("WorkerSocketAdapter should handle an error", () => {
        workerMock.onmessage?.({
            data: { type: "error", error: "Something went wrong" },
        });
        expect(workerMock.postMessage).toHaveBeenCalledWith({
            type: "open",
            data: { wsUrl, protocols: undefined },
        });
    });
    it.each([
        [
            {
                data: { type: "open", protocol: BasicBuilder.string() },
            },
        ],
        [{ data: { type: "message", data: BasicBuilder.string() } }],
        [{ data: { type: "close", data: undefined } }],
    ])("WorkerSocketAdapter should handle '%s' event", (event) => {
        workerMock.onmessage?.(event);
        expect(workerMock.postMessage).toHaveBeenCalledWith({
            type: "open",
            data: { wsUrl, protocols: undefined },
        });
    });
});
