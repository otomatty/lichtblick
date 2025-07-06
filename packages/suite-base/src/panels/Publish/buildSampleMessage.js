// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
export const builtinSampleValues = {
    bool: false,
    int8: 0,
    uint8: 0,
    int16: 0,
    uint16: 0,
    int32: 0,
    uint32: 0,
    int64: 0,
    uint64: 0,
    float32: 0,
    float64: 0,
    string: "",
    time: { sec: 0, nsec: 0 },
    duration: { sec: 0, nsec: 0 },
};
export default function buildSampleMessage(datatypes, datatype) {
    const builtin = builtinSampleValues[datatype];
    if (builtin != undefined) {
        return builtin;
    }
    const fields = datatypes.get(datatype)?.definitions;
    if (!fields) {
        return undefined;
    }
    const obj = {};
    for (const field of fields) {
        if (field.isConstant ?? false) {
            continue;
        }
        const sample = buildSampleMessage(datatypes, field.type);
        if (field.isArray ?? false) {
            if (field.arrayLength != undefined) {
                obj[field.name] = new Array(field.arrayLength).fill(sample);
            }
            else {
                obj[field.name] = [sample];
            }
        }
        else {
            obj[field.name] = sample;
        }
    }
    return obj;
}
