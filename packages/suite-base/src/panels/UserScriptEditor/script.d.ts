import { IRange } from "monaco-editor/esm/vs/editor/editor.api";
export type Script = {
    filePath: string;
    code: string;
    readOnly: boolean;
    selection?: IRange;
};
