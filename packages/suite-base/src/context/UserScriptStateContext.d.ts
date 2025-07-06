/// <reference types="react" />
import { Diagnostic, UserScriptLog } from "@lichtblick/suite-base/players/UserScriptPlayer/types";
/**
 * ユーザースクリプト状態
 *
 * ユーザースクリプトの実行に必要な状態を管理します。
 * 型ライブラリ、診断情報、ログなどが含まれます。
 */
type UserScriptState = {
    /** ROSライブラリの型定義 */
    rosLib: string;
    /** 型ライブラリの定義 */
    typesLib: string;
    /** スクリプトごとの状態管理 */
    scriptStates: {
        [scriptId: string]: {
            /** スクリプトの診断情報（エラー、警告など） */
            diagnostics: readonly Diagnostic[];
            /** スクリプトの実行ログ */
            logs: readonly UserScriptLog[];
        };
    };
};
/**
 * UserScriptStore - ユーザースクリプト状態管理ストア
 *
 * ユーザースクリプトの実行状態、診断情報、ログを管理します。
 * TypeScriptトランスパイラーやワーカーとの連携に使用されます。
 *
 * 主な責任:
 * - スクリプトの診断情報管理（エラー、警告）
 * - スクリプトの実行ログ管理
 * - ROSライブラリと型ライブラリの管理
 * - スクリプトごとの状態分離
 */
export type UserScriptStore = {
    /** ユーザースクリプトの状態 */
    state: UserScriptState;
    /** ユーザースクリプト操作アクション */
    actions: {
        /** スクリプトの診断情報を設定する */
        setUserScriptDiagnostics: (scriptId: string, diagnostics: readonly Diagnostic[]) => void;
        /** スクリプトのログを追加する */
        addUserScriptLogs: (scriptId: string, logs: readonly UserScriptLog[]) => void;
        /** スクリプトのログをクリアする */
        clearUserScriptLogs: (scriptId: string) => void;
        /** ROSライブラリを設定する */
        setUserScriptRosLib: (rosLib: string) => void;
        /** 型ライブラリを設定する */
        setUserScriptTypesLib: (lib: string) => void;
    };
};
/**
 * UserScriptStateProvider - ユーザースクリプト状態プロバイダー
 *
 * ユーザースクリプト状態管理のコンテキストプロバイダーです。
 * アプリケーションのルートレベルで使用されます。
 *
 * @param children 子コンポーネント
 * @returns JSX.Element プロバイダーコンポーネント
 *
 * 使用例:
 * ```typescript
 * <UserScriptStateProvider>
 *   <App />
 * </UserScriptStateProvider>
 * ```
 */
export declare function UserScriptStateProvider({ children }: React.PropsWithChildren): React.JSX.Element;
/**
 * useUserScriptState - ユーザースクリプト状態を取得するカスタムフック
 *
 * @param selector ストアから値を選択するセレクター関数
 * @returns T セレクターが選択した値
 *
 * 使用例:
 * ```typescript
 * // 特定のスクリプトの診断情報を取得
 * const diagnostics = useUserScriptState(
 *   (store) => store.state.scriptStates["my-script"]?.diagnostics ?? []
 * );
 *
 * // 特定のスクリプトのログを取得
 * const logs = useUserScriptState(
 *   (store) => store.state.scriptStates["my-script"]?.logs ?? []
 * );
 *
 * // アクションを取得
 * const { addUserScriptLogs, clearUserScriptLogs } = useUserScriptState(
 *   (store) => store.actions
 * );
 *
 * // ROSライブラリを取得
 * const rosLib = useUserScriptState((store) => store.state.rosLib);
 * ```
 */
export declare function useUserScriptState<T>(selector: (arg: UserScriptStore) => T): T;
export {};
