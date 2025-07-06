import { PropsWithChildren } from "react";
import { IDataSourceFactory } from "@lichtblick/suite-base/context/PlayerSelectionContext";
/**
 * PlayerManagerコンポーネントのProps型定義
 *
 * @interface PlayerManagerProps
 * @property {readonly IDataSourceFactory[]} playerSources - 利用可能なデータソースファクトリーの配列
 *                                                           readonlyにより不変性を保証
 */
type PlayerManagerProps = {
    playerSources: readonly IDataSourceFactory[];
};
/**
 * PlayerManager - データ処理エンジン管理コンポーネント
 *
 * このコンポーネントは、Lichtblickアプリケーションにおけるデータ処理エンジン（Player）の
 * 管理を担当する。データソースの選択、Player階層化、最近使用したファイルの管理、
 * エラーハンドリングなどを統合的に管理する。
 *
 * ## 主要機能
 *
 * ### 1. Player階層化システム
 * - BasePlayer（データソース読み込み）
 * - TopicAliasingPlayer（トピック名変換）
 * - UserScriptPlayer（ユーザースクリプト実行）
 * の3層構造でデータ処理パイプラインを構築
 *
 * ### 2. データソース管理
 * - 利用可能なデータソースファクトリーの管理
 * - データソース選択とPlayer初期化の制御
 * - サンプルデータ、ファイル、接続データソースの統一インターフェース
 *
 * ### 3. 最近使用したファイル管理
 * - IndexedDBを使用した履歴の永続化
 * - ファイルハンドルとファイルオブジェクトの適切な管理
 * - 接続情報の履歴保存
 *
 * ### 4. 拡張機能連携
 * - ExtensionCatalogからのトピックエイリアス関数の動的取得
 * - 拡張機能の状態変更監視とPlayer更新
 *
 * ### 5. エラーハンドリング
 * - ファイルアクセス権限の適切な要求
 * - 非同期処理のキャンセル対応
 * - ユーザーフレンドリーなエラーメッセージ
 *
 * @param {PropsWithChildren<PlayerManagerProps>} props - コンポーネントのProps
 * @returns {React.JSX.Element} レンダリング結果
 */
export default function PlayerManager(props: PropsWithChildren<PlayerManagerProps>): React.JSX.Element;
export {};
