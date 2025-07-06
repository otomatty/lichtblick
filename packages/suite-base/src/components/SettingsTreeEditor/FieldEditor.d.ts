/// <reference types="react" />
import { Immutable, SettingsTreeAction, SettingsTreeField } from "@lichtblick/suite";
/**
 * フィールドエディターのメインコンポーネント
 *
 * 設定ツリーの個別フィールドを編集するためのコンポーネントです。
 * ラベル、入力コンポーネント、エラー表示、ステータスボタンを統合して表示します。
 *
 * レイアウト構造：
 * - 左側：ラベル、エラーアイコン、ステータスボタン
 * - 右側：入力コンポーネント
 * - 階層に応じたインデント表示
 *
 * @param actionHandler - アクション実行ハンドラー
 * @param field - フィールド定義
 * @param path - フィールドのパス
 * @returns フィールドエディターコンポーネント
 */
declare function FieldEditorComponent({ actionHandler, field, path, }: {
    actionHandler: (action: SettingsTreeAction) => void;
    field: Immutable<SettingsTreeField>;
    path: readonly string[];
}): React.JSX.Element;
/**
 * パフォーマンス最適化されたFieldEditorコンポーネント
 *
 * React.memoにより、propsが変更されない限り再レンダリングを防ぎます。
 * 大量のフィールドを扱う設定ツリーでのパフォーマンス向上に寄与します。
 */
export declare const FieldEditor: import("react").MemoExoticComponent<typeof FieldEditorComponent>;
export {};
