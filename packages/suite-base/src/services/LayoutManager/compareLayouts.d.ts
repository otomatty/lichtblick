import { LayoutData } from "@lichtblick/suite-base/context/CurrentLayoutContext/actions";
/**
 * isLayoutEqual compares two LayoutData instances for "equality". If the two instances are
 * considered "equal" then the function returns true. If the two instances are not equal it returns
 * false.
 *
 * Layout instances are considered equal if they have all of the same fields and all of the same
 * values in those fields - recursively. An exception is made for where _b_ only differes from _a_
 * by introducing new fields which are _undefined_. If _b_ has an extra field with value undefined,
 * it will still be considered equal to _a_.
 */
export declare function isLayoutEqual(a: LayoutData, b: LayoutData): boolean;
