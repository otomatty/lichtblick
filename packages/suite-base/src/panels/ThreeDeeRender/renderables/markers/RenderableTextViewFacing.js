// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { RenderableMarker } from "./RenderableMarker";
import { getLuminance, SRGBToLinear } from "../../color";
export class RenderableTextViewFacing extends RenderableMarker {
    #label;
    constructor(topic, marker, receiveTime, renderer) {
        super(topic, marker, receiveTime, renderer);
        this.#label = renderer.labelPool.acquire();
        this.#label.setBillboard(true);
        this.add(this.#label);
        this.update(marker, receiveTime);
    }
    dispose() {
        this.renderer.labelPool.release(this.#label);
    }
    update(newMarker, receiveTime) {
        super.update(newMarker, receiveTime);
        const marker = this.userData.marker;
        this.#label.setText(marker.text);
        const alpha = marker.color.a;
        this.#label.setColor(SRGBToLinear(marker.color.r), SRGBToLinear(marker.color.g), SRGBToLinear(marker.color.b), alpha);
        const foregroundIsDark = getLuminance(marker.color.r, marker.color.g, marker.color.b) < 0.5;
        if (foregroundIsDark) {
            this.#label.setBackgroundColor(1, 1, 1, alpha);
        }
        else {
            this.#label.setBackgroundColor(0, 0, 0, alpha);
        }
        this.#label.setLineHeight(marker.scale.z);
        this.#label.userData.pose = marker.pose;
    }
}
