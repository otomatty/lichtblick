export declare const DIAGNOSTIC_SEVERITY: {
    Hint: number;
    Info: number;
    Warning: number;
    Error: number;
};
export declare const SOURCES: {
    Typescript: string;
    DatatypeExtraction: string;
    InputTopicsChecker: string;
    OutputTopicChecker: string;
    Runtime: string;
};
export declare const ERROR_CODES: {
    RUNTIME: number;
    DatatypeExtraction: {
        NO_DEFAULT_EXPORT: number;
        NON_FUNC_DEFAULT_EXPORT: number;
        NO_TYPE_RETURN: number;
        BAD_TYPE_RETURN: number;
        UNKNOWN_ERROR: number;
        NO_UNIONS: number;
        NO_FUNCTIONS: number;
        NO_CLASSES: number;
        NO_TYPE_LITERALS: number;
        NO_TUPLES: number;
        NO_INTERSECTION_TYPES: number;
        NO_TYPEOF: number;
        PREFER_ARRAY_LITERALS: number;
        STRICT_MARKERS_RETURN_TYPE: number;
        LIMITED_UNIONS: number;
        NO_NESTED_ANY: number;
        NO_MAPPED_TYPES: number;
        INVALID_PROPERTY: number;
        INVALID_INDEXED_ACCESS: number;
    };
    InputTopicsChecker: {
        NO_TOPIC_AVAIL: number;
        NO_INPUTS_EXPORT: number;
        EMPTY_INPUTS_EXPORT: number;
        BAD_INPUTS_TYPE: number;
    };
    OutputTopicChecker: {
        NO_OUTPUTS: number;
        NOT_UNIQUE: number;
        EXISTING_TOPIC: number;
    };
};
