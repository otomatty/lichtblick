import { MessageDefinition } from "@lichtblick/message-definition";
import { Immutable } from "@lichtblick/suite";
import { Topic } from "@lichtblick/suite-base/src/players/types";
/**
 * Message Path Suffix - メッセージパスサフィックス
 *
 * 特定のスキーマ内でのメッセージパスを表現するデータ構造。
 * トピック名に追加される形でフルパスを構成します。
 *
 * 用途：
 * - ネストされたフィールドへのアクセスパス表現
 * - 型情報の保持とUI表示
 * - 検索結果のハイライト表示
 * - パス補完機能のサポート
 *
 * @example
 * ```typescript
 * // 例：geometry_msgs/PoseStampedの場合
 * {
 *   pathSuffix: ".pose.position.x",
 *   type: "float64",
 *   isLeaf: true
 * }
 * ```
 */
type MessagePathSuffix = Immutable<{
    /**
     * Message Path Suffix - メッセージパスサフィックス
     *
     * トピック名に追加されるパス部分。ドット記法で表現されます。
     *
     * 形式：
     * - 単純フィールド: `.field_name`
     * - ネストフィールド: `.parent.child.grandchild`
     * - 配列要素: `.array_field[:]`
     * - 引用符付きフィールド: `.["special-field"]`
     *
     * @example ".header.stamp", ".pose.position.x", ".data[:]"
     */
    pathSuffix: string;
    /**
     * Value Type - 値の型
     *
     * このパスが指す値またはサブメッセージの人間可読型名。
     * UI表示やツールチップでの型情報提供に使用されます。
     *
     * 型表現：
     * - プリミティブ型: `string`, `float64`, `bool`
     * - 配列型: `string[]`, `geometry_msgs/Point[]`
     * - 複合型: `geometry_msgs/Pose`, `foxglove.Point2`
     *
     * @example "float64", "string[]", "geometry_msgs/Point"
     */
    type: string;
    /**
     * Is Leaf Node - リーフノード判定
     *
     * このパスが末端の値（子要素を持たない）かどうかを示します。
     * 検索結果の表示制御や、さらなる展開可能性の判定に使用されます。
     *
     * - `true`: プリミティブ値（int32, string等）
     * - `false`: 複合型（サブメッセージ、配列等）
     */
    isLeaf: boolean;
}>;
/**
 * Message Path Search Item - メッセージパス検索アイテム
 *
 * ファジー検索（fzf）で使用される個別の検索対象アイテム。
 * トピックとメッセージパスの組み合わせを表現し、検索結果の
 * 表示とナビゲーションに必要な全情報を含みます。
 *
 * 構造：
 * - topic: 対象トピックの完全情報
 * - suffix: メッセージパスサフィックス情報
 * - fullPath: 完全なメッセージパス文字列
 * - offset: ハイライト表示用のオフセット情報
 *
 * 用途：
 * - fzfライブラリでの検索対象
 * - 検索結果のハイライト表示
 * - 選択されたパスの解析・実行
 * - UI表示用の型情報提供
 *
 * @example
 * ```typescript
 * {
 *   topic: { name: "/robot/pose", schemaName: "geometry_msgs/PoseStamped" },
 *   suffix: { pathSuffix: ".pose.position.x", type: "float64", isLeaf: true },
 *   fullPath: "/robot/pose.pose.position.x",
 *   offset: 11  // ".pose.position.x"の開始位置
 * }
 * ```
 */
export type MessagePathSearchItem = {
    /** Topic Information - トピック情報 */
    topic: Topic;
    /** Path Suffix Information - パスサフィックス情報 */
    suffix: MessagePathSuffix;
    /**
     * Full Message Path - 完全メッセージパス
     *
     * トピック名とパスサフィックスを結合した完全なメッセージパス。
     * 実際のデータアクセスや表示に使用される最終的なパス文字列です。
     *
     * 形式：
     * - 通常: `/topic_name.field.subfield`
     * - 引用符付き: `/["topic-name"].field.subfield`
     * - 配列: `/topic_name.array_field[:].element`
     *
     * @example "/robot/pose.pose.position.x", "/my-topic.data[0].value"
     */
    fullPath: string;
    /**
     * Suffix Offset - サフィックスオフセット
     *
     * fullPath内でのsuffix.pathSuffixの開始位置。
     * 検索結果のハイライト表示で、トピック名部分と
     * パス部分を区別するために使用されます。
     *
     * 計算：
     * - 通常: topic.name.length
     * - 引用符付きトピック名の場合: 引用符処理後の長さ
     *
     * 用途：
     * - 検索結果のハイライト表示
     * - UI上でのトピック名/パス部分の色分け
     * - 検索マッチ位置の正確な特定
     */
    offset: number;
};
/**
 * Get Message Path Search Items - メッセージパス検索アイテム取得
 *
 * TopicListで使用する全メッセージパス検索アイテムのリストを生成します。
 * 各トピックの下にネストされた全メッセージパスを含む包括的な検索対象を構築し、
 * ファジー検索（fzf）での高速検索を可能にします。
 *
 * 処理フロー：
 * 1. スキーマ名でトピックをグループ化
 * 2. 各スキーマのメッセージパスサフィックスを生成
 * 3. 各トピックとパスサフィックスの組み合わせでアイテム作成
 * 4. トピック別インデックスの構築
 * 5. 検索最適化用データ構造の返却
 *
 * パフォーマンス特性：
 * - 時間計算量: O(T × S × D) (T:トピック数, S:スキーマ数, D:最大深度)
 * - 空間計算量: O(T × P) (P:平均パス数)
 * - 遅延評価による効率的なメモリ使用
 * - lodashによる高速グルーピング
 *
 * 生成例：
 * ```
 * トピック: /robot/pose (geometry_msgs/PoseStamped)
 * 生成アイテム:
 * - /robot/pose.header
 * - /robot/pose.header.seq
 * - /robot/pose.header.stamp
 * - /robot/pose.header.stamp.sec
 * - /robot/pose.header.stamp.nsec
 * - /robot/pose.header.frame_id
 * - /robot/pose.pose
 * - /robot/pose.pose.position
 * - /robot/pose.pose.position.x
 * - /robot/pose.pose.position.y
 * - /robot/pose.pose.position.z
 * - /robot/pose.pose.orientation
 * - /robot/pose.pose.orientation.x
 * - /robot/pose.pose.orientation.y
 * - /robot/pose.pose.orientation.z
 * - /robot/pose.pose.orientation.w
 * ```
 *
 * @param allTopics - 解析対象の全トピックリスト
 * @param schemasByName - スキーマ名をキーとする全スキーマ定義のマップ
 *
 * @returns 検索アイテムリストとトピック別インデックス
 * - items: fzfに渡される全検索アイテムの配列
 * - itemsByTopicName: トピック名をキーとするアイテムマップ（高速アクセス用）
 *
 * @example
 * ```typescript
 * const topics = [
 *   { name: "/robot/pose", schemaName: "geometry_msgs/PoseStamped" },
 *   { name: "/robot/twist", schemaName: "geometry_msgs/Twist" }
 * ];
 *
 * const { items, itemsByTopicName } = getMessagePathSearchItems(topics, schemas);
 *
 * // 全検索アイテム（fzf用）
 * console.log(items.length); // 例: 42個のパス
 *
 * // 特定トピックのアイテム取得
 * const poseItems = itemsByTopicName.get("/robot/pose");
 * console.log(poseItems?.length); // 例: 18個のパス
 * ```
 */
export declare function getMessagePathSearchItems(allTopics: readonly Topic[], schemasByName: Immutable<Map<string, MessageDefinition>>): {
    items: MessagePathSearchItem[];
    itemsByTopicName: Map<string, MessagePathSearchItem[]>;
};
export {};
