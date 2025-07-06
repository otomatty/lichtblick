import { TextFieldProps } from "@mui/material";
import { CSSProperties } from "react";
import { MessagePath } from "@lichtblick/message-path";
import { GlobalVariables } from "@lichtblick/suite-base/hooks/useGlobalVariables";
/**
 * グローバル変数のデフォルト値を設定しようと試みる
 *
 * @param variableName - 設定対象の変数名
 * @param setGlobalVariables - グローバル変数設定関数
 * @returns デフォルト値が設定できた場合はtrue、できなかった場合はfalse
 *
 * @example
 * ```typescript
 * const success = tryToSetDefaultGlobalVar("myVar", setGlobalVariables);
 * if (success) {
 *   console.log("デフォルト値を設定しました");
 * }
 * ```
 */
export declare function tryToSetDefaultGlobalVar(variableName: string, setGlobalVariables: (arg0: GlobalVariables) => void): boolean;
/**
 * ROSパスから最初の無効なグローバル変数を検索する
 *
 * メッセージパス内で使用されているグローバル変数のうち、
 * 現在定義されていない最初の変数を返す。
 *
 * @param rosPath - 解析対象のROSメッセージパス
 * @param globalVariables - 現在定義されているグローバル変数
 * @param setGlobalVariables - グローバル変数設定関数
 * @returns 無効な変数の情報（変数名と位置）、または undefined
 *
 * @example
 * ```typescript
 * const invalidVar = getFirstInvalidVariableFromRosPath(
 *   parsedPath,
 *   globalVariables,
 *   setGlobalVariables
 * );
 * if (invalidVar) {
 *   console.log(`無効な変数: ${invalidVar.variableName} at position ${invalidVar.loc}`);
 * }
 * ```
 */
export declare function getFirstInvalidVariableFromRosPath(rosPath: MessagePath, globalVariables: GlobalVariables, setGlobalVariables: (arg0: GlobalVariables) => void): {
    variableName: string;
    loc: number;
} | undefined;
/**
 * MessagePathInputコンポーネントのプロパティ型定義
 *
 * ROSメッセージパスの入力フィールドを提供するコンポーネントの
 * 設定オプションを定義する。
 */
export type MessagePathInputBaseProps = {
    /** 数学修飾子（.@演算子）をサポートするかどうか */
    supportsMathModifiers?: boolean;
    /** 入力されたパス文字列（例: `/topic.some_field[:]{id==42}.x`） */
    path: string;
    /** 複数の入力フィールドを区別するためのオプションインデックス */
    index?: number;
    /** パス変更時のコールバック関数 */
    onChange: (value: string, index?: number) => void;
    /** 有効な型のリスト（"message", "array", "primitive"、またはROSプリミティブ型） */
    validTypes?: readonly string[];
    /** 複数値スライス（[:]）を無効にし、単一値（[0]）のみを許可するかどうか */
    noMultiSlices?: boolean;
    /** プレースホルダーテキスト */
    placeholder?: string;
    /** 入力フィールドのカスタムスタイル */
    inputStyle?: CSSProperties;
    /** 入力フィールドを無効にするかどうか */
    disabled?: boolean;
    /** 自動補完を無効にして通常の入力フィールドとして扱うかどうか */
    disableAutocomplete?: boolean;
    /** 読み取り専用にするかどうか */
    readOnly?: boolean;
    /** 優先されるデータ型（自動補完順序に影響） */
    prioritizedDatatype?: string;
    /** Material-UIのTextFieldバリアント */
    variant?: TextFieldProps["variant"];
};
/**
 * ROSメッセージパス入力コンポーネント
 *
 * ROSトピックとメッセージフィールドへのパスを入力するための
 * 自動補完機能付きの入力フィールドを提供する。
 *
 * ## 主な機能
 * - トピック名の自動補完
 * - メッセージフィールドパスの自動補完
 * - フィルター条件の自動補完
 * - グローバル変数の自動補完
 * - 型制約による候補の絞り込み
 * - 数学修飾子のサポート
 *
 * ## 自動補完の種類
 * 1. **トピック名補完**: `/topic_name` の形式
 * 2. **メッセージパス補完**: `.field_name[0].sub_field` の形式
 * 3. **フィルター補完**: `{field==value}` の形式
 * 4. **グローバル変数補完**: `$variable_name` の形式
 *
 * @example
 * ```typescript
 * // 基本的な使用例
 * <MessagePathInput
 *   path="/robot/pose.position.x"
 *   onChange={(path) => console.log(path)}
 * />
 *
 * // 型制約付きの使用例
 * <MessagePathInput
 *   path="/sensor/data"
 *   validTypes={["primitive", "float64"]}
 *   onChange={(path) => setSelectedPath(path)}
 * />
 *
 * // 複数入力フィールドでの使用例
 * <MessagePathInput
 *   path="/topic.field"
 *   index={0}
 *   onChange={(path, index) => updatePath(index, path)}
 * />
 * ```
 *
 * @param props - コンポーネントのプロパティ
 * @returns 自動補完機能付きの入力フィールド
 */
declare const _default: import("react").NamedExoticComponent<MessagePathInputBaseProps>;
export default _default;
