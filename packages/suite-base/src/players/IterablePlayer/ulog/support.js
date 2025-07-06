// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { LogLevel } from "@lichtblick/ulog";
export function messageIdToTopic(msgId, ulog) {
    return ulog.subscriptions.get(msgId)?.name;
}
export function messageDefinitionToRos(msgDef) {
    const definitions = [];
    for (const field of msgDef.fields) {
        const isString = field.type === "char";
        definitions.push({
            name: field.name,
            type: typeToRos(field.type),
            isArray: field.arrayLength != undefined && !isString,
            arrayLength: isString ? undefined : field.arrayLength,
            upperBound: isString ? field.arrayLength ?? 1 : undefined,
            isComplex: field.isComplex,
        });
    }
    return { name: msgDef.name, definitions };
}
export function logLevelToRosout(level) {
    switch (level) {
        case LogLevel.Emerg:
        case LogLevel.Alert:
        case LogLevel.Crit:
            return 16; // fatal/critical
        case LogLevel.Err:
            return 8; // error
        case LogLevel.Warning:
            return 4; // warning
        case LogLevel.Notice:
        case LogLevel.Info:
            return 2; // info
        case LogLevel.Debug:
        default:
            return 1; // debug
    }
}
function typeToRos(type) {
    switch (type) {
        case "int8_t":
            return "int8";
        case "uint8_t":
            return "uint8";
        case "int16_t":
            return "int16";
        case "uint16_t":
            return "uint16";
        case "int32_t":
            return "int32";
        case "uint32_t":
            return "uint32";
        case "int64_t":
            return "int64";
        case "uint64_t":
            return "uint64";
        case "float":
            return "float32";
        case "double":
            return "float64";
        case "bool":
            return "bool";
        case "char":
            return "string";
        default:
            return type;
    }
}
