/// <reference types="react" />
import { DialogProps } from "@mui/material";
import { AppSettingsTab } from "@lichtblick/suite-base/components/AppSettingsDialog/types";
/**
 * AppSettingsDialog Props
 *
 * Material-UIのDialogPropsを継承し、追加でactiveTabプロパティを提供。
 *
 * @interface
 * @extends DialogProps
 */
interface AppSettingsDialogProps extends DialogProps {
    /** 初期表示するタブ（オプション） */
    activeTab?: AppSettingsTab;
}
/**
 * AppSettingsDialog - アプリケーション設定ダイアログ
 *
 * アプリケーション全体の設定を管理するメインダイアログコンポーネント。
 * タブベースのインターフェースで、カテゴリ別に設定項目を整理して表示します。
 *
 * 【主な特徴】
 * - **レスポンシブデザイン**: モバイル/デスクトップに対応
 * - **国際化対応**: react-i18nextによる多言語サポート
 * - **プラットフォーム対応**: Web/Desktop固有機能の条件分岐
 * - **状態管理**: Zustandによるワークスペース状態連携
 * - **設定永続化**: 設定値の自動保存と復元
 *
 * 【タブ構成】
 * - **General**: 基本設定（テーマ、言語、タイムゾーンなど）
 * - **Extensions**: 拡張機能の管理
 * - **Experimental Features**: 実験的機能の制御
 * - **About**: アプリケーション情報とリンク
 *
 * 【使用例】
 * ```typescript
 * // 基本的な使用
 * <AppSettingsDialog
 *   open={isSettingsOpen}
 *   onClose={handleSettingsClose}
 * />
 *
 * // 特定のタブを指定して開く
 * <AppSettingsDialog
 *   open={true}
 *   activeTab="extensions"
 *   onClose={handleClose}
 * />
 * ```
 *
 * @param props - コンポーネントのプロパティ
 * @returns AppSettingsDialogのJSX要素
 */
export declare function AppSettingsDialog(props: AppSettingsDialogProps): React.JSX.Element;
export {};
