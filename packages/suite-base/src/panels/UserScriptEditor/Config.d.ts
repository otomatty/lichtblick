/// <reference types="react" />
import { Script } from "./script";
type Config = {
    selectedNodeId?: string;
    editorForStorybook?: React.ReactNode;
    additionalBackStackItems?: Script[];
    autoFormatOnSave?: boolean;
};
export default Config;
