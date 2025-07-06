import { Metadata } from "@lichtblick/suite";
/**
 * Freezes an array of metadata objects and all their internal properties,
 * making them completely immutable.
 *
 * @param {readonly Metadata[]} metadataObject - A readonly array of Metadata objects.
 * This function uses Object.freeze to prevent modifications to the metadata array,
 * as well as to each object and their 'name' and 'metadata' properties within the array.
 *
 * This function is useful for ensuring the immutability of critical data that should not be altered
 * during the execution of the program, helping to maintain data integrity and consistency.
 */
export declare const freezeMetadata: (metadataObject: readonly Metadata[]) => void;
