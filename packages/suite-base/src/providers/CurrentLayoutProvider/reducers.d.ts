import { LayoutData, PanelsActions } from "@lichtblick/suite-base/context/CurrentLayoutContext/actions";
import { PlaybackConfig } from "@lichtblick/suite-base/types/panels";
/**
 * レイアウト管理システムのreducers
 *
 * このファイルは、Lichtblick Suiteのレイアウト管理システムの中核を担う
 * reducers関数群を定義しています。React Mosaicベースの複雑なレイアウト操作を
 * 関数型プログラミングのパターンで実装し、予測可能で安全な状態更新を提供します。
 *
 * ## アーキテクチャ概要
 * - **React Mosaic**: 分割可能なレイアウトシステム
 * - **タブパネル**: 複数パネルをタブで切り替え
 * - **ドラッグ&ドロップ**: 直感的なパネル配置
 * - **設定管理**: パネル個別設定の永続化
 * - **immutable更新**: 状態の不変性保証
 *
 * ## 主要機能
 * 1. **パネル操作**: 追加、削除、分割、交換
 * 2. **タブ管理**: タブ作成、移動、設定変更
 * 3. **ドラッグ処理**: 開始、終了、位置変更
 * 4. **設定保存**: パネル設定の管理
 * 5. **レイアウト変更**: 構造の動的変更
 *
 * ## 設計原則
 * - **純粋関数**: 副作用なしの状態変換
 * - **不変性**: 既存状態を変更せず新しい状態を返却
 * - **型安全**: TypeScriptによる厳密な型チェック
 * - **パフォーマンス**: 参照等価性による最適化
 *
 * @see PanelsActions - 実行可能なアクション定義
 * @see LayoutData - レイアウトデータの型定義
 * @see React Mosaic - 基盤となるレイアウトライブラリ
 */
/**
 * デフォルト再生設定
 *
 * アプリケーション全体で使用される標準的な再生設定です。
 * 新しいレイアウトやリセット時のベースライン値として使用されます。
 */
export declare const defaultPlaybackConfig: PlaybackConfig;
/**
 * レイアウト管理システムのメインreducer
 *
 * すべてのレイアウト操作を統一的に処理する中央集権的なreducerです。
 * Redux パターンに従い、アクションタイプに基づいて適切な処理関数を呼び出します。
 *
 * ## アクション処理
 * - **CHANGE_PANEL_LAYOUT**: レイアウト構造の変更
 * - **SAVE_PANEL_CONFIGS**: パネル設定の保存
 * - **SAVE_FULL_PANEL_CONFIG**: 特定タイプの全パネル設定更新
 * - **CREATE_TAB_PANEL**: タブパネルの作成
 * - **OVERWRITE_GLOBAL_DATA**: グローバル変数の完全上書き
 * - **SET_GLOBAL_DATA**: グローバル変数の部分更新
 * - **SET_USER_NODES**: ユーザースクリプトの設定
 * - **SET_PLAYBACK_CONFIG**: 再生設定の更新
 * - **CLOSE_PANEL**: パネルの削除
 * - **SPLIT_PANEL**: パネルの分割
 * - **SWAP_PANEL**: パネルの交換
 * - **MOVE_TAB**: タブの移動
 * - **ADD_PANEL**: パネルの追加
 * - **DROP_PANEL**: パネルのドロップ
 * - **START_DRAG**: ドラッグ開始
 * - **END_DRAG**: ドラッグ終了
 *
 * ## 設計原則
 * - **純粋関数**: 副作用なしの状態変換
 * - **不変性**: 元の状態を変更せず新しい状態を返却
 * - **型安全**: 未知のアクションタイプでエラー
 * - **パフォーマンス**: 変更がない場合は同じオブジェクトを返却
 *
 * ## エラーハンドリング
 * - 未知のアクションタイプでエラーを投げる
 * - 各処理関数内での適切なエラーハンドリング
 * - 状態の整合性保証
 *
 * @param panelsState - 現在のレイアウト状態（読み取り専用）
 * @param action - 実行するアクション
 * @returns 新しいレイアウト状態
 * @throws {Error} 未知のアクションタイプの場合
 *
 * @example
 * ```typescript
 * // パネルを追加
 * const newState = reducer(currentState, {
 *   type: "ADD_PANEL",
 *   payload: { id: "panel1", config: {} }
 * });
 *
 * // パネルを削除
 * const newState = reducer(currentState, {
 *   type: "CLOSE_PANEL",
 *   payload: { root: layout, path: [0] }
 * });
 * ```
 */
export default function (panelsState: Readonly<LayoutData>, action: PanelsActions): LayoutData;
