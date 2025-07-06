import * as monacoApi from "monaco-editor/esm/vs/editor/editor.api";
type Theme = {
    name: string;
    theme: monacoApi.editor.IStandaloneThemeData;
};
declare const themes: readonly Theme[];
export { themes };
