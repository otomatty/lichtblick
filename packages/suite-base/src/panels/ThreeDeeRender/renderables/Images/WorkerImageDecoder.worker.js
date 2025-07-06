// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import * as Comlink from "@lichtblick/comlink";
import { decodeRawImage } from "./decodeImage";
function decode(image, options) {
    const result = new ImageData(image.width, image.height);
    decodeRawImage(image, options, result.data);
    return Comlink.transfer(result, [result.data.buffer]);
}
export const service = {
    decode,
};
Comlink.expose(service);
