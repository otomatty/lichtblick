// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import * as THREE from "three";
export class InstancedLineMaterial extends THREE.LineBasicMaterial {
    constructor(...args) {
        super(...args);
        this.defines ??= {};
        this.defines.USE_INSTANCING = true;
    }
}
