import ts from "typescript/lib/typescript";
import { Diagnostic } from "@lichtblick/suite-base/players/UserScriptPlayer/types";
import type { RosDatatypes } from "@lichtblick/suite-base/types/RosDatatypes";
type TypeParam = {
    parent?: TypeParam;
    current?: ts.TypeParameterDeclaration | ts.TypeNode;
};
type TypeMap = {
    [key: string]: TypeParam;
};
export declare class DatatypeExtractionError extends Error {
    diagnostic: Diagnostic;
    constructor(diagnostic: Diagnostic);
}
export declare const findChild: (node: ts.Node, kind: ts.SyntaxKind[]) => ts.Node | undefined;
export declare const findDeclaration: (symbol: ts.Symbol, kind: ts.SyntaxKind[]) => ts.Node | undefined;
export declare const findDefaultExportFunction: (source: ts.SourceFile, checker: ts.TypeChecker) => ts.Node | undefined;
export declare const findReturnType: (typeChecker: ts.TypeChecker, node: ts.Node) => ts.TypeLiteralNode | ts.InterfaceDeclaration;
/**
 * Create datatypes (and names) from an input node.
 *
 * This function attempts to detect well-known schema names and use those for the datatypes rather
 * than creating fake names. This makes it possible to write scripts that output well-known datatypes
 * for work with panels that expect well-known datatype names.
 */
export declare const constructDatatypes: (checker: ts.TypeChecker, node: ts.TypeLiteralNode | ts.InterfaceDeclaration, currentDatatype: string, messageDefinitionMap: {
    [formattedDatatype: string]: string;
}, sourceDatatypes: RosDatatypes, depth?: number, currentTypeParamMap?: TypeMap) => {
    outputDatatype: string;
    datatypes: RosDatatypes;
};
export {};
