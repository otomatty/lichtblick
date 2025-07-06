/**
 * KeyListener - グローバル/ローカルキーボードイベントハンドラー
 *
 * このコンポーネントは、アプリケーション内でのキーボードショートカットや
 * キーボードイベントの統一的な処理を提供する。グローバル（document全体）
 * またはローカル（親要素内）でのキーボードイベント監視が可能。
 *
 * ## 主な機能
 *
 * ### 1. 柔軟なイベント監視範囲
 * - **グローバル監視**: `global=true`でdocument全体を監視
 * - **ローカル監視**: `global=false`で親要素内のみを監視
 * - 動的な監視範囲の切り替えが可能
 *
 * ### 2. 三種類のキーボードイベント対応
 * - **keydown**: キー押下時（連続発火あり）
 * - **keypress**: 文字キー押下時（非推奨だが互換性のため対応）
 * - **keyup**: キー離し時（一度のみ発火）
 *
 * ### 3. インテリジェントな入力フィールド除外
 * - `HTMLInputElement`での入力中は無視
 * - `HTMLTextAreaElement`での入力中は無視
 * - `contentEditable`要素での編集中は無視
 * - ユーザーの入力作業を妨げない設計
 *
 * ### 4. 柔軟なキーマッピング
 * - `event.key`（キー名）による指定
 * - `event.code`（物理キー）による指定
 * - 大文字小文字を区別しない`event.key`処理
 * - 国際化対応のキー判定
 *
 * ### 5. デフォルト動作制御
 * - ハンドラーが`false`を返した場合のみブラウザのデフォルト動作を許可
 * - 戻り値が`undefined`または`true`の場合は`preventDefault()`を自動実行
 * - 細かいデフォルト動作制御が可能
 *
 * ## 使用例
 *
 * ### 基本的なグローバルショートカット
 * ```typescript
 * <KeyListener
 *   global={true}
 *   keyDownHandlers={{
 *     // Ctrl+S: 保存
 *     's': (event) => {
 *       if (event.ctrlKey || event.metaKey) {
 *         handleSave();
 *         return true; // preventDefault()を実行
 *       }
 *       return false; // デフォルト動作を許可
 *     },
 *     // Escape: モーダルを閉じる
 *     'Escape': () => {
 *       closeModal();
 *       // undefined を返すため preventDefault() が実行される
 *     },
 *     // F11: フルスクリーン切り替え
 *     'F11': () => {
 *       toggleFullscreen();
 *     }
 *   }}
 * />
 * ```
 *
 * ### ローカルなパネル操作
 * ```typescript
 * <div>
 *   <KeyListener
 *     global={false}
 *     keyDownHandlers={{
 *       // 矢印キーでの移動
 *       'ArrowUp': () => moveUp(),
 *       'ArrowDown': () => moveDown(),
 *       'ArrowLeft': () => moveLeft(),
 *       'ArrowRight': () => moveRight(),
 *       // Deleteキーで削除
 *       'Delete': () => deleteItem(),
 *       'Backspace': () => deleteItem()
 *     }}
 *     keyUpHandlers={{
 *       // スペースキーでの一時停止/再生
 *       ' ': () => togglePlayPause()
 *     }}
 *   />
 *   <PanelContent />
 * </div>
 * ```
 *
 * ### 複数イベントタイプの組み合わせ
 * ```typescript
 * <KeyListener
 *   global={true}
 *   keyDownHandlers={{
 *     // 長押し対応の操作
 *     'Shift': () => {
 *       setShiftPressed(true);
 *     }
 *   }}
 *   keyUpHandlers={{
 *     'Shift': () => {
 *       setShiftPressed(false);
 *     }
 *   }}
 *   keyPressHandlers={{
 *     // 文字入力の監視（非推奨だが互換性のため）
 *     'Enter': () => {
 *       submitForm();
 *     }
 *   }}
 * />
 * ```
 *
 * ## 技術的詳細
 *
 * ### イベント監視の仕組み
 * - グローバルモード: `document`に直接イベントリスナーを登録
 * - ローカルモード: 親要素（`element.current?.parentElement`）に登録
 * - `useEffect`による適切なライフサイクル管理
 * - 依存配列によるイベントハンドラーの動的更新
 *
 * ### 入力フィールド除外の詳細
 * ```typescript
 * // 除外対象の判定
 * if (
 *   target instanceof HTMLInputElement ||
 *   target instanceof HTMLTextAreaElement ||
 *   (target instanceof HTMLElement && target.isContentEditable)
 * ) {
 *   return; // イベントを無視
 * }
 * ```
 *
 * ### キーマッピングの優先順位
 * 1. `event.key.toLowerCase()`での完全一致
 * 2. `event.code`での完全一致
 * 3. 該当するハンドラーがない場合は何もしない
 *
 * ### パフォーマンス最適化
 * - `useCallback`によるイベントハンドラーのメモ化
 * - 不要なイベントリスナーの自動削除
 * - 軽量な隠し要素（`display: none`）の使用
 *
 * ## 注意事項
 *
 * ### 1. イベントの競合
 * - 複数の`KeyListener`が同じキーを監視する場合、すべてが実行される
 * - イベントの伝播を停止したい場合は、ハンドラー内で`event.stopPropagation()`を呼び出す
 *
 * ### 2. 入力フィールドでの使用
 * - 入力フィールド内での編集中は自動的に無視される
 * - 特定の入力フィールドでもショートカットを有効にしたい場合は、別の実装が必要
 *
 * ### 3. ブラウザ互換性
 * - `event.key`は比較的新しいAPI（IE9+）
 * - `event.code`はより新しいAPI（Chrome48+, Firefox38+）
 * - 古いブラウザでは`event.keyCode`の使用を検討
 *
 * ### 4. 国際化対応
 * - `event.key`は入力言語に依存する
 * - 物理キーを識別したい場合は`event.code`を使用
 * - 複数言語対応が必要な場合は両方をサポート
 *
 * ## 実装パターン
 *
 * ### アプリケーション全体のショートカット
 * ```typescript
 * // App.tsx
 * <KeyListener
 *   global={true}
 *   keyDownHandlers={{
 *     'F1': () => openHelp(),
 *     'F5': () => window.location.reload(),
 *     'Escape': () => closeAllModals()
 *   }}
 * />
 * ```
 *
 * ### モーダルダイアログ内での使用
 * ```typescript
 * // Modal.tsx
 * <Dialog open={open}>
 *   <KeyListener
 *     global={false}
 *     keyDownHandlers={{
 *       'Escape': () => onClose(),
 *       'Enter': () => onSubmit()
 *     }}
 *   />
 *   <DialogContent>...</DialogContent>
 * </Dialog>
 * ```
 *
 * ### ゲーム風の操作
 * ```typescript
 * // GamePanel.tsx
 * <KeyListener
 *   global={false}
 *   keyDownHandlers={{
 *     'w': () => moveForward(),
 *     'a': () => moveLeft(),
 *     's': () => moveBackward(),
 *     'd': () => moveRight(),
 *     ' ': () => jump()
 *   }}
 * />
 * ```
 *
 * @author Lichtblick Team
 * @since 2019
 * @version 2.0
 */
import { ReactElement } from "react";
/**
 * キーボードイベントハンドラーの型定義
 *
 * @param event - キーボードイベント
 * @returns
 * - `true` または `undefined`: preventDefault()を実行
 * - `false`: ブラウザのデフォルト動作を許可
 */
type KeyHandlers = Record<string, (event: KeyboardEvent) => void | boolean | undefined>;
/**
 * KeyListenerコンポーネントのプロパティ型定義
 */
type Props = {
    /** グローバル監視の有効/無効 */
    global?: boolean;
    /** キー押下時のハンドラー群 */
    keyDownHandlers?: KeyHandlers;
    /** キー押下時のハンドラー群（非推奨、互換性のため） */
    keyPressHandlers?: KeyHandlers;
    /** キー離し時のハンドラー群 */
    keyUpHandlers?: KeyHandlers;
};
/**
 * KeyListenerコンポーネント
 *
 * キーボードイベントの統一的な処理を提供するコンポーネント。
 * グローバル（document全体）またはローカル（親要素内）での
 * キーボードイベント監視が可能。
 *
 * ## 主な責任
 *
 * ### 1. イベント監視の管理
 * - グローバル/ローカルモードの切り替え
 * - 適切なイベントリスナーの登録/削除
 * - イベントハンドラーの動的更新
 *
 * ### 2. 入力フィールドの除外
 * - テキスト入力中のイベントを自動的に無視
 * - ユーザーの入力作業を妨げない
 * - contentEditable要素への対応
 *
 * ### 3. イベントの分類と処理
 * - keydown/keypress/keyup イベントの適切な分類
 * - 各イベントタイプに対応するハンドラーの実行
 * - デフォルト動作の制御
 *
 * ### 4. パフォーマンス最適化
 * - useCallbackによるイベントハンドラーのメモ化
 * - 不要なイベントリスナーの自動削除
 * - 軽量な実装による最小限のオーバーヘッド
 *
 * ## 使用例
 *
 * ```typescript
 * // グローバルショートカット
 * <KeyListener
 *   global={true}
 *   keyDownHandlers={{
 *     'Escape': () => closeModal(),
 *     'Enter': () => submitForm(),
 *     'F11': () => toggleFullscreen()
 *   }}
 * />
 *
 * // ローカルなパネル操作
 * <KeyListener
 *   global={false}
 *   keyDownHandlers={{
 *     'ArrowUp': () => moveUp(),
 *     'ArrowDown': () => moveDown(),
 *     'Delete': () => deleteItem()
 *   }}
 *   keyUpHandlers={{
 *     ' ': () => togglePlayPause()
 *   }}
 * />
 * ```
 *
 * ## 技術的詳細
 *
 * - **隠し要素**: `display: none`の軽量な要素を使用
 * - **親要素検索**: `element.current?.parentElement`で監視対象を決定
 * - **イベント分類**: `event.type`による適切なハンドラー選択
 * - **入力除外**: 入力フィールドでの編集中は自動的に無視
 *
 * @param props - コンポーネントプロパティ
 * @returns 隠し要素（div）を含むReactElement
 *
 * @author Lichtblick Team
 * @since 2019
 * @version 2.0
 */
export default function KeyListener(props: Props): ReactElement;
export {};
