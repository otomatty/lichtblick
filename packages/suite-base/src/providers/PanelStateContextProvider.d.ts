import { PropsWithChildren } from "react";
import { ImmutableSettingsTree, PanelStateStore } from "@lichtblick/suite-base/context/PanelStateContext";
/**
 * 現在のパネルの設定ツリーを更新するためのフック
 *
 * パネルコンテキストから現在のパネルIDを取得し、そのパネル専用の
 * 設定ツリー更新関数を返します。アンマウント時の自動クリーンアップも提供します。
 *
 * ## メモリリーク対策
 * `actionHandler`がクロージャコンテキストでパネル変数をキャプチャし、
 * アンマウント後もメモリに保持される問題を防ぐため、アンマウント時に
 * panelSettingsTreeエントリをundefinedに設定してガベージコレクションを促進します。
 *
 * @returns 設定ツリー更新関数
 *
 * @example
 * ```typescript
 * function MyPanel() {
 *   const updateSettingsTree = usePanelSettingsTreeUpdate();
 *
 *   const handleSettingChange = (newTree) => {
 *     updateSettingsTree(newTree);
 *   };
 *
 *   return <PanelSettings onChange={handleSettingChange} />;
 * }
 * ```
 */
export declare function usePanelSettingsTreeUpdate(): (newTree: ImmutableSettingsTree) => void;
/**
 * パネルのデフォルトタイトルを読み取り・更新するためのフック
 *
 * 現在のパネルのデフォルトタイトルの状態と更新関数を提供します。
 * React.useStateのような[state, setState]形式のAPIを提供します。
 *
 * @returns [現在のデフォルトタイトル, タイトル更新関数]のタプル
 *
 * @example
 * ```typescript
 * function PanelHeader() {
 *   const [defaultTitle, setDefaultTitle] = useDefaultPanelTitle();
 *
 *   const handleTitleChange = (newTitle: string) => {
 *     setDefaultTitle(newTitle);
 *   };
 *
 *   return (
 *     <input
 *       value={defaultTitle || ''}
 *       onChange={(e) => handleTitleChange(e.target.value)}
 *     />
 *   );
 * }
 * ```
 */
export declare function useDefaultPanelTitle(): [
    string | undefined,
    (defaultTitle: string | undefined) => void
];
/**
 * PanelStateContextProviderのプロパティ型定義
 */
type Props = PropsWithChildren<{
    /** ストアの初期状態（オプション） */
    initialState?: Partial<PanelStateStore>;
}>;
/**
 * PanelStateContextProvider
 *
 * パネルの状態管理を行うProviderコンポーネントです。
 * 各パネルのシーケンス番号、設定ツリー、デフォルトタイトルを
 * アプリケーション全体で管理し、パネル間での状態共有を可能にします。
 *
 * ## 主な機能
 * - パネルごとの独立した状態管理
 * - 設定ツリーの管理と更新
 * - デフォルトタイトルの管理
 * - シーケンス番号による更新検知
 * - メモリリーク防止のための自動クリーンアップ
 *
 * ## 管理される状態
 * - **sequenceNumbers**: パネルの更新検知用カウンター
 * - **settingsTrees**: パネルの設定UI構造
 * - **defaultTitles**: パネルのデフォルトタイトル
 *
 * ## 使用場面
 * - パネルの設定UI管理
 * - パネルタイトルのカスタマイズ
 * - パネルの状態同期
 * - 動的パネル設定の管理
 *
 * ## パフォーマンス最適化
 * - Zustandによる効率的な状態管理
 * - セレクターによる必要な部分のみの再レンダリング
 * - アンマウント時の自動メモリクリーンアップ
 *
 * @param props - コンポーネントのプロパティ
 * @param props.children - 子コンポーネント
 * @param props.initialState - ストアの初期状態
 * @returns React.JSX.Element
 *
 * @example
 * ```typescript
 * // アプリケーションでの使用
 * <PanelStateContextProvider initialState={{ defaultTitles: { 'panel-1': 'My Panel' } }}>
 *   <PanelLayout />
 *   <PanelSettings />
 * </PanelStateContextProvider>
 *
 * // 子コンポーネントでの使用
 * function MyPanel() {
 *   const updateSettingsTree = usePanelSettingsTreeUpdate();
 *   const [defaultTitle, setDefaultTitle] = useDefaultPanelTitle();
 *
 *   // 設定を更新
 *   updateSettingsTree(newSettingsTree);
 *
 *   // タイトルを更新
 *   setDefaultTitle('New Title');
 * }
 * ```
 */
export declare function PanelStateContextProvider(props: Props): React.JSX.Element;
export {};
