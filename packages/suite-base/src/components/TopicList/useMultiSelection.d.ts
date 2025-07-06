/**
 * 選択イベントのペイロード型定義
 */
export type OnSelectPayload = {
    /** 選択されたアイテムのインデックス */
    index: number;
    /** モディファイヤーキー（Ctrl/Cmd）が押されているか */
    modKey: boolean;
    /** Shiftキーが押されているか */
    shiftKey: boolean;
};
/**
 * useMultiSelection - 複数選択機能を提供するカスタムフック
 *
 * @description
 * このフックは、リストやツリー構造での複数選択機能を提供します。
 * 一般的なOS標準の選択操作（単一選択、追加選択、範囲選択）をサポートします。
 *
 * **主要機能:**
 * - 🎯 単一選択（通常クリック）
 * - ➕ 追加選択（Ctrl/Cmd + クリック）
 * - 📏 範囲選択（Shift + クリック）
 * - 🔄 ソース変更時の自動選択クリア
 * - 📊 選択状態の効率的な管理
 *
 * **選択操作の動作:**
 *
 * **1. 単一選択（通常クリック）:**
 * - 既存の選択をクリアして、クリックしたアイテムのみを選択
 *
 * **2. 追加選択（Ctrl/Cmd + クリック）:**
 * - 既存の選択状態を保持
 * - クリックしたアイテムが選択済みの場合は選択解除
 * - 未選択の場合は選択に追加
 *
 * **3. 範囲選択（Shift + クリック）:**
 * - 最後に選択したアイテムから現在のアイテムまでの範囲を選択
 * - 既存の選択状態を保持
 * - 最後の選択がない場合は単一選択として扱う
 *
 * **状態管理:**
 * - Zustandストアによる効率的な状態管理
 * - useLayoutEffectによるソース変更の即座な検出
 * - Set構造による高速な選択状態の操作
 *
 * **使用例:**
 * ```typescript
 * const items = ['item1', 'item2', 'item3'];
 * const { selectedIndexes, onSelect } = useMultiSelection(items);
 *
 * // 単一選択
 * onSelect({ index: 0, modKey: false, shiftKey: false });
 *
 * // 追加選択
 * onSelect({ index: 1, modKey: true, shiftKey: false });
 *
 * // 範囲選択
 * onSelect({ index: 2, modKey: false, shiftKey: true });
 * ```
 *
 * **パフォーマンス最適化:**
 * - Zustandによる必要最小限の再レンダリング
 * - Set構造による高速な検索・追加・削除
 * - useCallbackによるコールバック関数の安定化
 *
 * @template T - ソース配列のアイテム型
 * @param source - 選択対象のソース配列
 * @returns 複数選択機能のインターフェース
 */
export declare function useMultiSelection<T>(source: readonly T[]): {
    /** 現在選択されているインデックスのセット */
    selectedIndexes: Set<number>;
    /** 選択操作を実行する関数 */
    onSelect: (props: OnSelectPayload) => void;
    /** 現在の選択状態を取得する関数（コールバック内で使用） */
    getSelectedIndexes: () => Set<number>;
};
