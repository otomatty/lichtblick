/// <reference types="react" />
/**
 * @fileoverview SettingsTreeEditor用の表示切り替えトグルコンポーネント
 *
 * 設定ツリーのノードやフィールドの表示/非表示を切り替えるための
 * カスタムチェックボックスコンポーネントです。
 *
 * 主な機能：
 * - 目のアイコンによる直感的な表示状態の表現
 * - チェック状態：目が開いている（表示）
 * - 未チェック状態：目が閉じている（非表示）
 * - ホバー効果とサイズ調整
 * - アクセシビリティ対応（適切なタイトル属性）
 * - フォーカス管理（変更後の自動ブラー）
 *
 * 使用例：
 * ```tsx
 * <VisibilityToggle
 *   size="small"
 *   checked={isVisible}
 *   onChange={(event, checked) => setIsVisible(checked)}
 *   disabled={!canToggle}
 * />
 * ```
 */
import { CheckboxProps, IconButtonProps } from "@mui/material";
/**
 * 表示切り替えトグルコンポーネント
 *
 * 目のアイコンを使用した直感的な表示/非表示切り替えチェックボックスです。
 * 標準のCheckboxコンポーネントをベースに、カスタムアイコンとスタイルを適用しています。
 *
 * @param props - CheckboxPropsと追加のsizeプロパティ
 * @returns 表示切り替えトグルコンポーネント
 */
export declare function VisibilityToggle(props: CheckboxProps & {
    size: IconButtonProps["size"];
}): React.JSX.Element;
