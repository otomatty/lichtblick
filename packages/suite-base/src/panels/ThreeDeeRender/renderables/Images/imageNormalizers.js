// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { normalizeByteArray, normalizeHeader, normalizeTime } from "../../normalizeMessages";
function normalizeImageData(data) {
    if (data == undefined) {
        return new Uint8Array(0);
    }
    else if (data instanceof Int8Array || data instanceof Uint8Array) {
        return data;
    }
    else {
        return new Uint8Array(0);
    }
}
export function normalizeRosImage(message) {
    return {
        header: normalizeHeader(message.header),
        height: message.height ?? 0,
        width: message.width ?? 0,
        encoding: message.encoding ?? "",
        is_bigendian: message.is_bigendian ?? false,
        step: message.step ?? 0,
        data: normalizeImageData(message.data),
    };
}
export function normalizeRosCompressedImage(message) {
    return {
        header: normalizeHeader(message.header),
        format: message.format ?? "",
        data: normalizeByteArray(message.data),
    };
}
export function normalizeRawImage(message) {
    return {
        timestamp: normalizeTime(message.timestamp),
        frame_id: message.frame_id ?? "",
        height: message.height ?? 0,
        width: message.width ?? 0,
        encoding: message.encoding ?? "",
        step: message.step ?? 0,
        data: normalizeImageData(message.data),
    };
}
function normalizeCompressedMedia(message) {
    return {
        timestamp: normalizeTime(message.timestamp),
        frame_id: message.frame_id ?? "",
        format: message.format ?? "",
        data: normalizeByteArray(message.data),
    };
}
export function normalizeCompressedImage(message) {
    return normalizeCompressedMedia(message);
}
export function normalizeCompressedVideo(message) {
    return normalizeCompressedMedia(message);
}
