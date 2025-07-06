// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
let ws = undefined;
const send = self.postMessage;
const sendWithTransfer = self.postMessage;
self.onmessage = (event) => {
    const { type, data } = event.data;
    switch (type) {
        case "open":
            try {
                ws = new WebSocket(data.wsUrl, data.protocols);
                ws.binaryType = "arraybuffer";
                ws.onerror = (wsEvent) => {
                    send({
                        type: "error",
                        error: wsEvent.error,
                    });
                };
                ws.onopen = (_event) => {
                    send({
                        type: "open",
                        protocol: ws.protocol,
                    });
                };
                ws.onclose = (wsEvent) => {
                    send({ type: "close", data: JSON.parse(JSON.stringify(wsEvent) ?? "{}") });
                };
                ws.onmessage = (wsEvent) => {
                    if (wsEvent.data instanceof ArrayBuffer) {
                        sendWithTransfer({
                            type: "message",
                            data: wsEvent.data,
                        }, [wsEvent.data]);
                    }
                    else {
                        send({
                            type: "message",
                            data: wsEvent.data,
                        });
                    }
                };
            }
            catch (err) {
                // try-catch is needed to catch `Mixed Content` errors in Chrome, where the client
                // attempts to load `ws://` from `https://`. (Safari would catch these in `ws.onerror`
                // but with `undefined` as an error.)
                send({
                    type: "error",
                    error: err ?? { message: "Insecure WebSocket connection" },
                });
            }
            break;
        case "close":
            ws?.close();
            break;
        case "data":
            ws?.send(data);
            break;
    }
};
export {};
