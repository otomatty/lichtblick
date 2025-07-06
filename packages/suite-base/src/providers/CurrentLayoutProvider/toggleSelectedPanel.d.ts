import { SavedProps } from "@lichtblick/suite-base/types/panels";
/**
 * パネル選択状態の切り替え処理
 *
 * 複雑なタブパネル階層構造において、パネルの選択状態を適切に管理するための関数です。
 * タブパネルとその子パネル間の選択状態の競合を解決し、一貫性のある選択状態を維持します。
 *
 * ## 選択ルール
 * 1. **タブパネル選択時**: そのタブ内の全子パネルを自動的に選択解除
 * 2. **子パネル選択時**: 親タブパネルを自動的に選択解除
 * 3. **階層的選択解除**: 複数レベルの親タブパネルも連鎖的に選択解除
 *
 * ## 処理フロー
 * ```
 * 1. 対象パネルがタブパネルか判定
 *    ↓ Yes
 * 2. アクティブタブ内の全子パネルIDを取得
 *    ↓
 * 3. 子パネルを選択解除リストに追加
 *
 * 4. 対象パネルに親タブパネルがあるか判定
 *    ↓ Yes
 * 5. 親タブパネルの階層を辿る
 *    ↓
 * 6. 全親タブパネルを選択解除リストに追加
 *
 * 7. XOR演算で選択状態を切り替え
 *    ↓
 * 8. 選択解除リストのパネルを除外
 * ```
 *
 * ## 使用場面
 * - パネル右クリックメニューからの選択切り替え
 * - キーボードショートカットによる複数選択
 * - ドラッグ&ドロップ操作での選択管理
 * - レイアウトエディターでの選択状態管理
 *
 * ## タブパネル階層の例
 * ```
 * TabPanel A
 * ├─ Tab 1 (active)
 * │  ├─ Panel X
 * │  └─ TabPanel B
 * │     ├─ Tab 1
 * │     │  └─ Panel Y  ← これを選択
 * │     └─ Tab 2
 * └─ Tab 2
 * ```
 * Panel Yを選択すると、TabPanel BとTabPanel Aが自動的に選択解除されます。
 *
 * @param panelId - 選択状態を切り替える対象パネルのID
 * @param containingTabId - 対象パネルを含むタブパネルのID（存在する場合）
 * @param configById - 全パネルの設定情報マップ
 * @param selectedPanelIds - 現在選択されているパネルIDの配列
 * @returns 新しい選択パネルIDの配列
 *
 * @example
 * ```typescript
 * // 単一パネルの選択切り替え
 * const newSelection = toggleSelectedPanel(
 *   "Image!abc123",
 *   undefined,
 *   configById,
 *   ["3D!def456"]
 * );
 * // 結果: ["3D!def456", "Image!abc123"]
 *
 * // タブパネル選択時（子パネルが自動選択解除）
 * const newSelection = toggleSelectedPanel(
 *   "Tab!xyz789",
 *   undefined,
 *   configById,
 *   ["ChildPanel!abc123", "OtherPanel!def456"]
 * );
 * // 結果: ["OtherPanel!def456", "Tab!xyz789"]
 * ```
 *
 * @see TabPanelConfig - タブパネル設定の型定義
 * @see SavedProps - パネル設定の型定義
 * @see getAllPanelIds - レイアウトから全パネルIDを取得
 * @see getParentTabPanelByPanelId - 親タブパネルの検索
 * @see isTabPanel - タブパネル判定
 */
export default function toggleSelectedPanel(panelId: string, containingTabId: string | undefined, configById: SavedProps, selectedPanelIds: readonly string[]): string[];
