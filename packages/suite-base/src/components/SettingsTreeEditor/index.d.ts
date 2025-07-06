/// <reference types="react" />
import { Immutable, SettingsTree } from "@lichtblick/suite";
/**
 * 設定ツリーエディターのメインコンポーネント
 *
 * 階層構造を持つ設定項目を表示・編集するためのインターフェースを提供します。
 * パネル設定やログ設定など、様々な設定画面で使用されます。
 *
 * @param props - コンポーネントプロパティ
 * @param props.variant - エディターの表示バリアント（"panel" | "log"）
 * @param props.settings - 設定ツリーデータ（Immutable）
 * @returns {React.JSX.Element} 設定ツリーエディターのJSX要素
 *
 * @example
 * ```tsx
 * // パネル設定での使用例
 * <SettingsTreeEditor
 *   variant="panel"
 *   settings={{
 *     nodes: panelSettingsNodes,
 *     actionHandler: handleSettingsAction,
 *     enableFilter: true,
 *     focusedPath: currentFocusedPath
 *   }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // ログ設定での使用例
 * <SettingsTreeEditor
 *   variant="log"
 *   settings={{
 *     nodes: logSettingsNodes,
 *     actionHandler: handleLogAction,
 *     enableFilter: false
 *   }}
 * />
 * ```
 */
export default function SettingsTreeEditor({ variant, settings, }: {
    variant: "panel" | "log";
    settings: Immutable<SettingsTree>;
}): React.JSX.Element;
