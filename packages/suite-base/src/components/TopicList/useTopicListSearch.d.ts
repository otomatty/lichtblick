import { FzfResultItem } from "fzf";
import { MessageDefinition } from "@lichtblick/message-definition";
import { Immutable } from "@lichtblick/suite";
import { Topic } from "@lichtblick/suite-base/players/types";
import { MessagePathSearchItem } from "./getMessagePathSearchItems";
/**
 * TopicListで表示される項目の型定義
 * - topic: ROSトピック項目
 * - schema: メッセージパス（スキーマフィールド）項目
 */
export type TopicListItem = {
    type: "topic";
    item: FzfResultItem<Topic>;
} | {
    type: "schema";
    item: FzfResultItem<MessagePathSearchItem>;
};
/**
 * useTopicListSearchフックのパラメータ型定義
 */
export type UseTopicListSearchParams = {
    topics: Immutable<Topic[]>;
    datatypes: Immutable<Map<string, MessageDefinition>>;
    filterText: string;
};
/**
 * useTopicListSearch - トピックとメッセージパスの検索・フィルタリングフック
 *
 * @description
 * このフックは、TopicListコンポーネントで使用される検索・フィルタリング機能を提供します。
 * FZF（Fuzzy Finder）アルゴリズムを使用して、高性能なファジー検索を実現しています。
 *
 * **主要機能:**
 * - 🔍 トピック名とスキーマ名での検索
 * - 🔍 メッセージパス（フィールド）での検索
 * - 📊 スコアベースのソート
 * - 🎯 ハイライト位置の計算
 * - 🌳 階層的な結果構造
 *
 * **検索対象:**
 * 1. **トピック検索**: `トピック名|スキーマ名` の形式で検索
 * 2. **メッセージパス検索**: フルパス（例: `/odom.pose.position.x`）で検索
 *
 * **検索ロジック:**
 * - フィルターテキストが空の場合: 全トピックを表示
 * - フィルターテキストがある場合: FZFによるファジー検索を実行
 * - メッセージパス検索では、トピック名のみにマッチした場合は除外
 *
 * **結果のソート順:**
 * 1. 最大スコア順（降順）
 * 2. 直接マッチしたトピック優先
 * 3. トピック名のアルファベット順
 *
 * **結果構造:**
 * ```
 * トピック1 (直接マッチ)
 *   ├─ メッセージパス1 (マッチ)
 *   └─ メッセージパス2 (マッチ)
 * トピック2 (パスマッチのみ)
 *   └─ メッセージパス3 (マッチ)
 * ```
 *
 * **パフォーマンス最適化:**
 * - useMemoによる計算結果のキャッシュ
 * - FZFインスタンスの再利用
 * - 依存関係の最小化
 *
 * **使用例:**
 * ```typescript
 * const treeItems = useTopicListSearch({
 *   topics: [{ name: "/odom", schemaName: "nav_msgs/Odometry" }],
 *   datatypes: new Map([["nav_msgs/Odometry", definition]]),
 *   filterText: "position"
 * });
 * ```
 *
 * **依存関係:**
 * - FZF: ファジー検索エンジン
 * - getMessagePathSearchItems: メッセージパス検索項目の生成
 * - lodash-es: グループ化処理
 *
 * @param params - 検索パラメータ
 * @param params.topics - 検索対象のトピック一覧
 * @param params.datatypes - メッセージ定義のマップ
 * @param params.filterText - フィルター文字列
 * @returns 検索・フィルタリングされたトピックリスト項目
 */
export declare function useTopicListSearch(params: UseTopicListSearchParams): TopicListItem[];
