import { MutableRefObject } from "react";
import { LayoutState, UpdatePanelState } from "@lichtblick/suite-base/context/CurrentLayoutContext";
/**
 * useUpdateSharedPanelStateフックの戻り値型定義
 */
type UseUpdateSharedPanelStateReturn = {
    /** 共有パネル状態を更新する関数 */
    updateSharedPanelState: UpdatePanelState;
};
/**
 * 共有パネル状態更新フック
 *
 * 複数のパネル間で共有される状態（sharedPanelState）を更新するためのカスタムフックです。
 * パネル間でのデータ共有やUI状態の同期に使用されます。
 *
 * ## 共有パネル状態の概念
 * 共有パネル状態は、同じタイプの複数パネル間で共有される設定やUI状態です。
 * 例えば、複数の3Dパネルで同じカメラ設定を共有する場合などに使用されます。
 *
 * ## 状態更新の仕組み
 * 1. 現在のレイアウト状態をrefから取得
 * 2. 既存の共有状態に新しい状態をマージ
 * 3. 更新されたレイアウト状態を設定
 *
 * ## パフォーマンス最適化
 * - `useCallback`による関数メモ化
 * - refを使用した最新状態への直接アクセス
 * - 不要な再レンダリングの防止
 *
 * ## 安全性チェック
 * レイアウトデータが存在しない場合は早期リターンして、
 * 不正な状態更新を防止します。
 *
 * ## 使用場面
 * - パネル間でのカメラ設定同期
 * - 共通のフィルター設定共有
 * - マルチパネルでの選択状態同期
 * - テーマやスタイル設定の共有
 *
 * @param layoutStateRef - レイアウト状態への参照（最新状態への直接アクセス用）
 * @param setLayoutState - レイアウト状態を更新する関数
 * @returns 共有パネル状態更新機能を含むオブジェクト
 *
 * @example
 * ```typescript
 * // CurrentLayoutProvider内での使用例
 * const { updateSharedPanelState } = useUpdateSharedPanelState(
 *   layoutStateRef,
 *   setLayoutState
 * );
 *
 * // パネル内での共有状態更新
 * updateSharedPanelState("3d", {
 *   cameraState: {
 *     position: [0, 0, 10],
 *     target: [0, 0, 0]
 *   }
 * });
 *
 * // 複数の3Dパネルが同じカメラ状態を共有
 * ```
 *
 * @see ICurrentLayout - レイアウトコンテキストのインターフェース
 * @see LayoutState - レイアウト状態の型定義
 * @see UpdatePanelState - パネル状態更新関数の型定義
 */
declare const useUpdateSharedPanelState: (layoutStateRef: MutableRefObject<Readonly<LayoutState>>, setLayoutState: (state: LayoutState) => void) => UseUpdateSharedPanelStateReturn;
export default useUpdateSharedPanelState;
