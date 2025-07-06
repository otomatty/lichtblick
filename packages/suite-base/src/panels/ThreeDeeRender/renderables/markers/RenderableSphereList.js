// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { RenderableMarker } from "./RenderableMarker";
import { createGeometry as createSphereGeometry } from "./RenderableSphere";
import { markerHasTransparency, makeStandardInstancedMaterial } from "./materials";
import { DynamicInstancedMesh } from "../../DynamicInstancedMesh";
export class RenderableSphereList extends RenderableMarker {
    #mesh;
    constructor(topic, marker, receiveTime, renderer) {
        super(topic, marker, receiveTime, renderer);
        // Sphere instanced mesh
        const geometry = renderer.sharedGeometry.getGeometry(`RenderableSphere-${renderer.maxLod}`, () => createSphereGeometry(renderer.maxLod));
        const material = makeStandardInstancedMaterial(marker);
        this.#mesh = new DynamicInstancedMesh(geometry, material, marker.points.length);
        this.#mesh.castShadow = true;
        this.#mesh.receiveShadow = true;
        this.add(this.#mesh);
        this.update(marker, receiveTime);
    }
    dispose() {
        this.#mesh.material.dispose();
    }
    update(newMarker, receiveTime) {
        const prevMarker = this.userData.marker;
        super.update(newMarker, receiveTime);
        const marker = this.userData.marker;
        const transparent = markerHasTransparency(marker);
        if (transparent !== markerHasTransparency(prevMarker)) {
            this.#mesh.material.transparent = transparent;
            this.#mesh.material.depthWrite = !transparent;
            this.#mesh.material.needsUpdate = true;
        }
        this.#mesh.set(marker.points, marker.scale, marker.colors, marker.color);
    }
}
