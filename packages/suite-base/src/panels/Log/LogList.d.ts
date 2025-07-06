/// <reference types="react" />
import { NormalizedLogMessage } from "@lichtblick/suite-base/panels/Log/types";
type Props = {
    items: readonly NormalizedLogMessage[];
};
/**
 * List for showing large number of items, which are expected to be appended to the end regularly.
 * Automatically scrolls to the bottom unless you explicitly scroll up.
 */
declare function LogList({ items }: Props): React.JSX.Element;
export default LogList;
