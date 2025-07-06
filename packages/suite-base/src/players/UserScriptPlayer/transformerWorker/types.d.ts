import { Topic } from "@lichtblick/suite-base/players/types";
import { RosDatatypes } from "@lichtblick/suite-base/types/RosDatatypes";
export type TransformArgs = {
    name: string;
    sourceCode: string;
    topics: Topic[];
    rosLib: string;
    typesLib: string;
    datatypes: RosDatatypes;
};
