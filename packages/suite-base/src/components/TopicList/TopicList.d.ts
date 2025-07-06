/// <reference types="react" />
/**
 * TopicList - ROSトピックとメッセージパスの階層表示コンポーネント
 *
 * @description
 * このコンポーネントは、データソースから取得したROSトピックとその内部のメッセージパス（スキーマ）を
 * 階層的に表示する仮想化リストコンポーネントです。以下の主要機能を提供します：
 *
 * **主要機能:**
 * - 📋 トピック一覧の表示（名前、型、統計情報）
 * - 🔍 リアルタイム検索・フィルタリング（50msデバウンス）
 * - 📊 メッセージパスの階層表示（スキーマ構造）
 * - 🎯 複数選択（Ctrl/Cmd + クリック、Shift + クリック）
 * - 🖱️ コンテキストメニュー（右クリックメニュー）
 * - 🚀 仮想化による高パフォーマンス描画
 * - 📱 ドラッグ&ドロップ対応
 *
 * **表示状態:**
 * - NOT_PRESENT: データソース未選択
 * - ERROR: エラー発生
 * - INITIALIZING: 初期化中（スケルトン表示）
 * - PRESENT: 通常表示
 * - RECONNECTING: 再接続中
 *
 * **パフォーマンス最適化:**
 * - react-window による仮想化リスト
 * - 可変行高対応（トピック: 50px, メッセージパス: 28px）
 * - デバウンス検索（50ms）
 * - メモ化による不要な再描画防止
 *
 * **依存関係:**
 * - useTopicListSearch: 検索・フィルタリングロジック
 * - useMultiSelection: 複数選択状態管理
 * - TopicRow: トピック行コンポーネント
 * - MessagePathRow: メッセージパス行コンポーネント
 * - ContextMenu: 右クリックメニュー
 * - DirectTopicStatsUpdater: トピック統計更新（6秒間隔）
 *
 * @returns 仮想化されたトピック一覧UI
 */
export declare function TopicList(): React.JSX.Element;
