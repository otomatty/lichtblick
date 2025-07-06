import { Topic } from "@lichtblick/suite-base/players/types";
import { RosDatatypes } from "@lichtblick/suite-base/types/RosDatatypes";
type Args = {
    topics: Topic[];
    datatypes: RosDatatypes;
};
type LibGeneratorFn = (args: Args) => Promise<string>;
/**
 * LibGenerator memoizes generating a library from topics and datatypes.
 *
 * Calling `update` returns a boolean to indicate if the library was re-generated and the
 * library source code.
 *
 * If the args to update are unchanged (same topics and datatyes), then the previously
 * generated value from `fn` is returned.
 */
declare class MemoizedLibGenerator {
    #private;
    constructor(fn: LibGeneratorFn);
    /**
     * Update the library with new args.
     * If the arg fields have changed, the generator function is run to make a new library.
     *
     * Return whether the cached value was updated and the cached value.
     */
    update(args: Args): Promise<{
        didUpdate: boolean;
        lib: string;
    }>;
}
export { MemoizedLibGenerator };
