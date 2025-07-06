// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { v4 as uuidv4 } from "uuid";
import { debouncePromise } from "@lichtblick/den/async";
import { Sockets } from "@lichtblick/electron-socket/renderer";
import Logger from "@lichtblick/log";
import { fromMillis, add as addTimes, toDate, fromDate, fromMicros, } from "@lichtblick/rostime";
import { PlayerPresence, } from "@lichtblick/suite-base/players/types";
import { Model, RawPacket, ReturnMode, packetRate } from "@lichtblick/velodyne-cloud";
const log = Logger.getLogger(__filename);
const DEFAULT_VELODYNE_PORT = 2369;
const RPM = 600;
const PROBLEM_SOCKET_ERROR = "SOCKET_ERROR";
const TOPIC_NAME = "/velodyne_points";
const TOPIC = { name: TOPIC_NAME, schemaName: "velodyne_msgs/VelodyneScan" };
const DATATYPES = new Map(Object.entries({
    "velodyne_msgs/VelodyneScan": {
        name: "velodyne_msgs/VelodyneScan",
        definitions: [
            { type: "std_msgs/Header", name: "header", isArray: false, isComplex: true },
            { type: "velodyne_msgs/VelodynePacket", name: "packets", isArray: true, isComplex: true },
        ],
    },
    "velodyne_msgs/VelodynePacket": {
        name: "velodyne_msgs/VelodynePacket",
        definitions: [
            { type: "time", name: "stamp", isArray: false, isComplex: false },
            { type: "uint8", name: "data", isArray: true, arrayLength: 1206, isComplex: false },
        ],
    },
    "std_msgs/Header": {
        name: "std_msgs/Header",
        definitions: [
            { name: "seq", type: "uint32", isArray: false },
            { name: "stamp", type: "time", isArray: false },
            { name: "frame_id", type: "string", isArray: false },
        ],
    },
}));
const CAPABILITIES = [];
export default class VelodynePlayer {
    #id = uuidv4(); // Unique ID for this player
    #port; // Listening UDP port
    #listener; // Listener for _emitState()
    #socket;
    #seq = 0;
    #totalBytesReceived = 0;
    #closed = false; // Whether the player has been completely closed using close()
    #topic = { ...TOPIC }; // The one topic we are "subscribed" to
    #topics = [this.#topic]; // Stable list of all topics
    #topicStats = new Map(); // Message count and timestamps for our single topic
    #start; // The time at which we started playing
    #packets = []; // Queue of packets that will form the next parsed message
    #parsedMessages = []; // Queue of messages that we'll send in next _emitState() call
    #metricsCollector;
    #presence = PlayerPresence.INITIALIZING;
    #emitTimer;
    // track issues within the player
    #alerts = [];
    #alertsById = new Map();
    constructor({ port, metricsCollector }) {
        this.#port = port ?? DEFAULT_VELODYNE_PORT;
        log.info(`initializing VelodynePlayer on port ${this.#port}`);
        this.#metricsCollector = metricsCollector;
        this.#start = fromMillis(Date.now());
        this.#metricsCollector.playerConstructed();
        void this.#open();
    }
    #open = async () => {
        if (this.#closed) {
            return;
        }
        this.#presence = PlayerPresence.PRESENT;
        this.#emitState();
        if (this.#socket == undefined) {
            const net = await Sockets.Create();
            this.#socket = await net.createUdpSocket();
            this.#socket.on("error", (error) => {
                this.#addAlert(PROBLEM_SOCKET_ERROR, {
                    message: "Networking error listening for Velodyne data",
                    severity: "error",
                    error,
                    tip: "Check that your are connected to the same local network (subnet) as the Velodyne sensor",
                });
            });
            this.#socket.on("message", this.#handleMessage);
        }
        else {
            try {
                await this.#socket.close();
            }
            catch (err) {
                log.error(`Failed to close socket: ${err}`);
            }
        }
        try {
            await this.#socket.bind({ address: "0.0.0.0", port: this.#port });
            log.debug(`Bound Velodyne UDP listener socket to port ${this.#port}`);
        }
        catch (error) {
            this.#addAlert(PROBLEM_SOCKET_ERROR, {
                message: "Could not bind to the Velodyne UDP data port",
                severity: "error",
                error,
                tip: `Check that port ${this.#port} is not in use by another application`,
            });
        }
    };
    #handleMessage = (data, rinfo) => {
        const receiveTime = fromMillis(Date.now());
        const date = toDate(receiveTime);
        date.setMinutes(0, 0, 0);
        const topOfHour = fromDate(date);
        this.#totalBytesReceived += data.byteLength;
        this.#presence = PlayerPresence.PRESENT;
        this.#clearAlert(PROBLEM_SOCKET_ERROR, { skipEmit: true });
        if (this.#seq === 0) {
            // this.#metricsCollector.recordTimeToFirstMsgs();
        }
        const rawPacket = new RawPacket(data);
        const frequency = RPM / 60.0;
        const rate = rawPacket.returnMode === ReturnMode.DualReturn
            ? packetRate(rawPacket.inferModel() ?? Model.HDL64E) * 2
            : packetRate(rawPacket.inferModel() ?? Model.HDL64E);
        const numPackets = Math.ceil(rate / frequency);
        this.#packets.push(rawPacket);
        if (this.#packets.length >= numPackets) {
            const message = {
                header: { seq: this.#seq++, stamp: receiveTime, frame_id: rinfo.address },
                packets: this.#packets.map((raw) => rawPacketToRos(raw, topOfHour)),
            };
            const sizeInBytes = this.#packets.reduce((acc, packet) => acc + packet.data.byteLength, 0);
            const msg = {
                topic: TOPIC_NAME,
                receiveTime,
                message,
                sizeInBytes,
                schemaName: TOPIC.schemaName ?? "",
            };
            this.#parsedMessages.push(msg);
            this.#packets = [];
            // Update the message count
            let stats = this.#topicStats.get(TOPIC_NAME);
            if (!stats) {
                stats = { numMessages: 0 };
                this.#topicStats.set(TOPIC_NAME, stats);
            }
            stats.numMessages++;
            stats.firstMessageTime ??= receiveTime;
            stats.lastMessageTime = receiveTime;
            this.#emitState();
        }
    };
    #addAlert(id, alert, { skipEmit = false } = {}) {
        this.#alertsById.set(id, alert);
        this.#alerts = Array.from(this.#alertsById.values());
        if (!skipEmit) {
            this.#emitState();
        }
    }
    #clearAlert(id, { skipEmit = false } = {}) {
        if (!this.#alertsById.delete(id)) {
            return;
        }
        this.#alerts = Array.from(this.#alertsById.values());
        if (!skipEmit) {
            this.#emitState();
        }
    }
    // Potentially performance-sensitive; await can be expensive
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    #emitState = debouncePromise(() => {
        if (!this.#listener || this.#closed) {
            return Promise.resolve();
        }
        // Time is always moving forward even if we don't get messages from the device.
        // If we are not connected, don't emit updates since we are not longer getting new data
        if (this.#presence === PlayerPresence.PRESENT) {
            if (this.#emitTimer != undefined) {
                clearTimeout(this.#emitTimer);
            }
            this.#emitTimer = setTimeout(this.#emitState, 100);
        }
        const currentTime = fromMillis(Date.now());
        const messages = this.#parsedMessages;
        this.#parsedMessages = [];
        return this.#listener({
            name: "Velodyne",
            presence: this.#presence,
            progress: {},
            capabilities: CAPABILITIES,
            profile: "velodyne",
            playerId: this.#id,
            alerts: this.#alerts,
            activeData: {
                messages,
                totalBytesReceived: this.#totalBytesReceived,
                startTime: this.#start,
                endTime: currentTime,
                currentTime,
                isPlaying: true,
                speed: 1,
                // We don't support seeking, so we need to set this to any fixed value. Just avoid 0 so
                // that we don't accidentally hit falsy checks.
                lastSeekTime: 1,
                topics: this.#topics,
                topicStats: new Map(this.#topicStats),
                datatypes: DATATYPES,
                publishedTopics: undefined,
                subscribedTopics: undefined,
                services: undefined,
                parameters: undefined,
            },
        });
    });
    setListener(listener) {
        this.#listener = listener;
        this.#emitState();
    }
    close() {
        this.#closed = true;
        if (this.#socket) {
            void this.#socket.dispose();
            this.#socket = undefined;
        }
        if (this.#emitTimer != undefined) {
            clearTimeout(this.#emitTimer);
            this.#emitTimer = undefined;
        }
        // this.#metricsCollector.close();
        this.#totalBytesReceived = 0;
        this.#seq = 0;
        this.#packets = [];
        this.#parsedMessages = [];
    }
    setSubscriptions(_subscriptions) { }
    setPublishers(_publishers) {
        // no-op
    }
    // Modify a remote parameter such as a rosparam.
    setParameter(_key, _value) {
        throw new Error(`Parameter modification is not supported for VelodynePlayer`);
    }
    publish(_request) {
        throw new Error(`Publishing is not supported for VelodynePlayer`);
    }
    async callService() {
        throw new Error("Service calls are not supported for VelodynePlayer");
    }
    setGlobalVariables(_globalVariables) {
        // no-op
    }
}
function rawPacketToRos(packet, topOfHour) {
    const microSecSinceTopOfHour = packet.gpsTimestamp;
    const stamp = addTimes(topOfHour, fromMicros(microSecSinceTopOfHour));
    return { stamp, data: packet.data };
}
