/**
 * @fileoverview AppSettingsDialog - アプリケーション設定ダイアログのエントリーポイント
 *
 * 【概要】
 * Lichtblickアプリケーションの設定ダイアログコンポーネントのエクスポート定義。
 * このファイルは、設定ダイアログの公開APIとして機能し、
 * 外部からのインポートを簡潔にするためのバレル（barrel）エクスポートを提供します。
 *
 * 【使用方法】
 * ```typescript
 * import { AppSettingsDialog } from "@lichtblick/suite-base/components/AppSettingsDialog";
 *
 * // 設定ダイアログを表示
 * <AppSettingsDialog
 *   open={isOpen}
 *   onClose={handleClose}
 *   activeTab="general"
 * />
 * ```
 *
 * 【機能】
 * - 設定ダイアログコンポーネントの単一エクスポート
 * - インポート文の簡潔化
 * - 内部実装の隠蔽化
 *
 * 【関連ファイル】
 * - `AppSettingsDialog.tsx` - 実際のコンポーネント実装
 * - `types.ts` - 型定義
 * - `constants.ts` - 定数定義
 */
export { AppSettingsDialog } from "./AppSettingsDialog";
