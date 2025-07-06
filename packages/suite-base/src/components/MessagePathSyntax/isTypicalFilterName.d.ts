/**
 * 典型的なフィルタ名のリスト
 *
 * メッセージパスクエリでフィルタとして一般的に使用される名前のリストです。
 * これらの名前は、ROSメッセージ内でオブジェクトの識別や検索に頻繁に使用されるため、
 * 自動補完やフィルタ候補の優先表示に活用されます。
 *
 * 含まれる名前：
 * - "id": 一般的な識別子
 * - "_id": アンダースコア付き識別子
 * - "ID": 大文字の識別子
 * - "Id": パスカルケースの識別子
 * - "key": キー値
 *
 * @example
 * ```typescript
 * // フィルタ候補の生成時に使用
 * const filterSuggestions = messageFields.filter(field =>
 *   TypicalFilterNames.includes(field.name)
 * );
 * ```
 */
export declare const TypicalFilterNames: string[];
/**
 * 指定された名前が典型的なフィルタ名かどうかを判定する関数
 *
 * メッセージパスの自動補完機能で、フィルタとして適切な候補を
 * 優先的に表示するために使用されます。事前に定義された
 * 典型的なフィルタ名のパターンに対して高速な正規表現マッチングを行います。
 *
 * @param name - 判定対象の名前文字列
 * @returns 典型的なフィルタ名の場合はtrue、そうでなければfalse
 *
 * @example
 * ```typescript
 * // 基本的な使用例
 * console.log(isTypicalFilterName("id"));    // true
 * console.log(isTypicalFilterName("_id"));   // true
 * console.log(isTypicalFilterName("ID"));    // true
 * console.log(isTypicalFilterName("Id"));    // true
 * console.log(isTypicalFilterName("key"));   // true
 * console.log(isTypicalFilterName("name"));  // false
 * console.log(isTypicalFilterName("value")); // false
 * ```
 *
 * @example
 * ```typescript
 * // フィルタ候補の優先順位付けでの使用例
 * const sortedFields = messageFields.sort((a, b) => {
 *   const aIsTypical = isTypicalFilterName(a.name);
 *   const bIsTypical = isTypicalFilterName(b.name);
 *   if (aIsTypical && !bIsTypical) return -1;
 *   if (!aIsTypical && bIsTypical) return 1;
 *   return a.name.localeCompare(b.name);
 * });
 * ```
 */
export declare function isTypicalFilterName(name: string): boolean;
