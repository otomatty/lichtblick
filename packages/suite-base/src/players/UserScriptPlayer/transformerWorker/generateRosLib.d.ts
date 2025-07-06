import ts from "typescript/lib/typescript";
import { Topic } from "@lichtblick/suite-base/players/types";
import { RosDatatypes } from "@lichtblick/suite-base/types/RosDatatypes";
export type InterfaceDeclarations = {
    [datatype: string]: ts.InterfaceDeclaration;
};
export declare const formatInterfaceName: (type: string) => string;
export declare const typedArrayMap: Map<string, string>;
export declare const generateTypeDefs: (datatypes: RosDatatypes) => InterfaceDeclarations;
declare const generateRosLib: ({ topics, datatypes, }: {
    topics: Topic[];
    datatypes: RosDatatypes;
}) => string;
export default generateRosLib;
