// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// http://wiki.ros.org/msg
const rosPrimitiveToTypescriptTypeMap = new Map([
    ["uint8", "number"],
    ["int8", "number"],
    ["uint16", "number"],
    ["int16", "number"],
    ["uint32", "number"],
    ["int32", "number"],
    ["float32", "number"],
    ["float64", "number"],
    ["int64", "bigint"],
    ["uint64", "bigint"],
    ["string", "string"],
    ["bool", "boolean"],
    ["time", "Time"],
    ["duration", "Duration"],
]);
export const typedArrayMap = new Map([
    ["uint8", "Uint8Array"],
    ["int8", "Int8Array"],
    ["int16", "Int16Array"],
    ["uint16", "Uint16Array"],
    ["int32", "Int32Array"],
    ["uint32", "Uint32Array"],
    ["int64", "BigInt64Array"],
    ["uint64", "BigUint64Array"],
    ["float32", "Float32Array"],
    ["float64", "Float64Array"],
]);
function safeString(str) {
    return JSON.stringify(str);
}
export const generateTypesInterface = (datatypes) => {
    const seenDatatypes = new Set();
    let src = `
    /**
     * MessageTypeBySchemaName enumerates the message types for for all the schema names
     * in the current data source.
     *
     * You probably want to use Message<...> instead.
     */
    export type MessageTypeBySchemaName = {
  `;
    for (const [datatype, definition] of datatypes) {
        // Avoid adding a repeating datatype name again.
        // We shouldn't have this happen so we add a comment indicating it happened.
        if (seenDatatypes.has(datatype)) {
            src += `\n// ${datatype} appeared multiple times`;
            continue;
        }
        seenDatatypes.add(datatype);
        src += `\n${safeString(datatype)}: {`;
        for (const field of definition.definitions) {
            const { type, isConstant, isArray } = field;
            const typedArray = typedArrayMap.get(type);
            const rosPrimitive = rosPrimitiveToTypescriptTypeMap.get(type);
            const fieldName = safeString(field.name);
            const sigil = field.optional === true ? "?" : "";
            if (isConstant === true) {
                src += `\n // ${field.name} = ${field.valueText}`;
            }
            else if (isArray === true) {
                if (typedArray) {
                    src += `\n${fieldName}${sigil}: ${typedArray},`;
                }
                else if (rosPrimitive) {
                    src += `\n${fieldName}${sigil}: ${rosPrimitive}[],`;
                }
                else {
                    src += `\n${fieldName}${sigil}: MessageTypeBySchemaName[${safeString(type)}][],`;
                }
            }
            else {
                if (rosPrimitive) {
                    src += `\n${fieldName}${sigil}: ${rosPrimitive},`;
                }
                else {
                    src += `\n${fieldName}${sigil}: MessageTypeBySchemaName[${safeString(type)}],`;
                }
            }
        }
        src += "\n},";
    }
    src += "\n};";
    return src;
};
function generateTypesByTopicInterface(topics) {
    let src = `
    /**
     * MessageTypeByTopic enumerates the Messages types for all the topics in
     * the current data source.
     *
     * You probably want to use Input<"/my-topic"> instead of MessageTypeByTopic.
     */
    export type MessageTypeByTopic = {`;
    for (const topic of topics) {
        src += `${safeString(topic.name)}: MessageTypeBySchemaName[${safeString(topic.schemaName ?? "")}]\n`;
    }
    src += "\n};";
    return src;
}
function generateTypesLib(args) {
    const typesByTopic = generateTypesByTopicInterface(args.topics);
    // A topic may reference a datatype that we don't have in args.datatypes.
    // This happens for some data sources if nothing's subscribe to a topic and we never get info
    // about the specific datatype.
    //
    // We want the types library to still generate and compile so we use empty placeholders for such datatypes.
    const allDatatypes = new Map(args.datatypes);
    for (const topic of args.topics) {
        if (topic.schemaName == undefined || !allDatatypes.has(topic.schemaName)) {
            allDatatypes.set(topic.schemaName ?? "", {
                name: topic.schemaName,
                definitions: [],
            });
        }
    }
    const typesBySchemaName = generateTypesInterface(allDatatypes);
    const src = `
// NOTE:
// This file is generated from the current data source.
// It contains helper types for looking up message definitions by schema name or topic.
//
// You likely want to use the higher-level types in \`./types\` rather than the types in this file directly.

type Time = {
  sec: number,
  nsec: number,
};

type Duration = Time;

${typesBySchemaName}

${typesByTopic}
`;
    return src;
}
let emptyLib;
function generateEmptyTypesLib() {
    return (emptyLib ??= generateTypesLib({ topics: [], datatypes: new Map() }));
}
export { generateEmptyTypesLib, generateTypesLib };
