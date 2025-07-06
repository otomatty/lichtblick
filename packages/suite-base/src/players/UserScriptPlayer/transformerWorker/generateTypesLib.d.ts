import { Topic } from "@lichtblick/suite-base/players/types";
import { RosDatatypes } from "@lichtblick/suite-base/types/RosDatatypes";
type Args = {
    topics: Topic[];
    datatypes: RosDatatypes;
};
export declare const typedArrayMap: Map<string, string>;
export declare const generateTypesInterface: (datatypes: RosDatatypes) => string;
declare function generateTypesLib(args: Args): string;
declare function generateEmptyTypesLib(): string;
export { generateEmptyTypesLib, generateTypesLib };
