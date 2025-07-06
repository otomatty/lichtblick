// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { formatTime } from "@lichtblick/suite-base/util/formatTime";
import LevelToString from "./LevelToString";
const formattedMessage = (item, timezone) => {
    return `[${LevelToString(item.level)}] [${formatTime(item.stamp, timezone)}] [${item.name}] ${item.message}`;
};
export default function formatMessages(items, timezone) {
    const messages = items.map((item) => formattedMessage(item, timezone));
    return messages;
}
