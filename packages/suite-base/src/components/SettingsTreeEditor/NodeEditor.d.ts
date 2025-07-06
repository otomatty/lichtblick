/// <reference types="react" />
import { NodeEditorProps } from "@lichtblick/suite-base/components/SettingsTreeEditor/types";
/**
 * ノード編集コンポーネントのメイン実装
 *
 * 設定ツリーの個別ノード（フォルダ/グループ）を表示・編集するコンポーネントです。
 * 階層構造、展開/折りたたみ、編集機能、アクション実行などを提供します。
 *
 * @param props - NodeEditorProps型のプロパティ
 * @returns {React.JSX.Element} ノード編集UIのJSX要素
 *
 * 主な機能：
 * - ノードの展開/折りたたみ制御
 * - ラベルの編集（リネーム）
 * - 表示/非表示切り替え
 * - 子ノードとフィールドの表示
 * - アクションメニュー
 * - フォーカス制御
 * - エラー表示
 */
declare function NodeEditorComponent(props: NodeEditorProps): React.JSX.Element;
/**
 * パフォーマンス最適化されたNodeEditorコンポーネント
 *
 * React.memoにより、propsが変更されない限り再レンダリングを防ぎます。
 * 大量のノードを扱う設定ツリーでのパフォーマンス向上に寄与します。
 */
export declare const NodeEditor: import("react").MemoExoticComponent<typeof NodeEditorComponent>;
export {};
