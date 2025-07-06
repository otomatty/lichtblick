/// <reference types="react" />
/**
 * DataSource - データソース表示コンポーネント
 *
 * 現在のデータソースの状態と情報を表示するメインコンポーネント。
 * プレイヤーの接続状態に応じて適切な表示を行い、エラー時にはユーザーが
 * 詳細情報にアクセスできるようにします。
 *
 * 表示パターン：
 * - データソース未接続: "No data source" メッセージ
 * - 初期化中: "Initializing…" + ローディングスピナー
 * - 再接続中: データソース名 + ローディングスピナー
 * - エラー状態: データソース名 + エラーアイコン（クリック可能）
 * - 正常状態: データソース名 + 終了タイムスタンプ（ライブ接続時）
 *
 * ライブ接続の判定：
 * - seekPlayback が undefined の場合はライブ接続とみなす
 * - この判定は現在のアーキテクチャにおける暫定的な実装
 *
 * @returns DataSourceのJSX要素
 */
export declare function DataSource(): React.JSX.Element;
