import { Initialization } from "@lichtblick/suite-base/players/IterablePlayer/IIterableSource";
/**
 * Validates that topics maintain a consistent datatype across all MCAPs.
 *
 * - If a topic already exists in `accumulated` but has a different datatype,
 *   a warning is added to `accumulated.alerts`.
 * - If the topic is new, it is safe to add it to the `accumulated` map.
 */
export declare const validateAndAddNewDatatypes: (accumulated: Initialization, current: Initialization) => void;
/**
 * Validates and accumulates topics, ensuring unique topic names with consistent schemaNames.
 */
export declare const validateAndAddNewTopics: (accumulated: Initialization, current: Initialization) => void;
