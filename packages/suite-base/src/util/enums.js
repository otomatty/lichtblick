// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// Exported for tests
export const constantsByDatatype = (datatypes) => {
    const results = {};
    for (const [datatype, value] of datatypes) {
        const result = (results[datatype] = {});
        for (const field of value.definitions) {
            if (field.isConstant === true &&
                field.value != undefined &&
                typeof field.value !== "boolean") {
                if (result[field.value.toString()] != undefined) {
                    result[field.value.toString()] = "<multiple constants match>";
                }
                else {
                    result[field.value.toString()] = field.name;
                }
            }
        }
    }
    return results;
};
const extractTypeFromStudioEnumAnnotationRegex = /(.*)__(foxglove|webviz)_enum$/;
// Lichtblick enum annotations are of the form: "Foo__foxglove_enum" (notice double underscore)
// This method returns type name from "Foo" or undefined name doesn't match this format
export function extractTypeFromStudioEnumAnnotation(name) {
    const match = extractTypeFromStudioEnumAnnotationRegex.exec(name);
    return match?.[1];
}
// Returns a nested record of the form {datatype -> {field -> {value -> name}}}.
export const enumValuesByDatatypeAndField = (datatypes) => {
    const datatypeConstants = constantsByDatatype(datatypes);
    const results = {};
    for (const [datatype, value] of datatypes) {
        const currentResult = {};
        // keep track of parsed constants
        let constants = {};
        // constants' types
        let lastType;
        for (const field of value.definitions) {
            if (lastType != undefined && field.type !== lastType) {
                // encountering new type resets the accumulated constants
                constants = {};
                lastType = undefined;
            }
            if (field.isConstant === true &&
                field.value != undefined &&
                typeof field.value !== "boolean") {
                lastType = field.type;
                if (constants[field.value.toString()] != undefined) {
                    constants[field.value.toString()] = "<multiple constants match>";
                }
                else {
                    constants[field.value.toString()] = field.name;
                }
                continue;
            }
            // check if current field is annotation of the form: "Foo bar__foxglove_enum"
            // This means that "bar" is enum of type "Foo"
            const fieldName = extractTypeFromStudioEnumAnnotation(field.name);
            if (fieldName != undefined) {
                // associate all constants of type field.type with the annotated field
                const fieldConstants = datatypeConstants[field.type];
                if (fieldConstants) {
                    currentResult[fieldName] = fieldConstants;
                }
                continue;
            }
            // this field was already covered by annotation, skip it
            if (currentResult[field.name]) {
                continue;
            }
            // otherwise assign accumulated constants for that field
            if (Object.keys(constants).length > 0) {
                currentResult[field.name] = constants;
            }
            // and start over - reset constants
            constants = {};
        }
        // only assign result if we found non-empty mapping into constants
        if (Object.keys(currentResult).length > 0) {
            results[datatype] = currentResult;
        }
    }
    return results;
};
