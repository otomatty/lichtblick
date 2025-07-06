import { MessagePathPart, MessagePathStructureItem, MessagePathStructureItemMessage } from "@lichtblick/message-path";
import { Immutable } from "@lichtblick/suite";
import { RosDatatypes } from "@lichtblick/suite-base/types/RosDatatypes";
/**
 * ROSデータ型定義から簡単にナビゲート可能な平坦な構造を生成する
 *
 * ROSメッセージの複雑な階層構造を、メッセージパスの自動補完や検証に
 * 適した平坦な構造に変換する。この関数は、データ型定義から以下のような
 * 構造を生成する：
 *
 * ```
 * {
 *   "geometry_msgs/Pose": {
 *     structureType: "message",
 *     nextByName: {
 *       "position": {
 *         structureType: "message",
 *         nextByName: {
 *           "x": { structureType: "primitive", primitiveType: "float64" },
 *           "y": { structureType: "primitive", primitiveType: "float64" },
 *           "z": { structureType: "primitive", primitiveType: "float64" }
 *         }
 *       },
 *       "orientation": { ... }
 *     }
 *   }
 * }
 * ```
 *
 * データ型はプレイヤー接続後に変更されないため、この結果は緩くキャッシュされる。
 * 循環参照を持つデータ型（自己参照型）も適切に処理される。
 *
 * @param datatypes - ROSデータ型定義のマップ
 * @returns データ型名をキーとする構造アイテムのレコード
 *
 * @example
 * ```typescript
 * const structures = messagePathStructures(datatypes);
 * const poseStructure = structures["geometry_msgs/Pose"];
 * console.log(poseStructure.nextByName.position.structureType); // "message"
 *
 * // 配列型の場合
 * const arrayStructure = structures["sensor_msgs/PointCloud2"];
 * console.log(arrayStructure.nextByName.data.structureType); // "array"
 * ```
 */
export declare function messagePathStructures(datatypes: Immutable<RosDatatypes>): Record<string, MessagePathStructureItemMessage>;
/**
 * 指定された構造アイテムが有効な終端として使用できるかどうかを判定する
 *
 * メッセージパスの自動補完において、特定の型制約（validTypes）に基づいて
 * パスの終端として適切かどうかを判定する。例えば、プリミティブ型のみを
 * 許可する場合、メッセージ型や配列型は無効な終端となる。
 *
 * @param structureItem - 判定対象の構造アイテム
 * @param validTypes - 有効な型のリスト（未指定の場合は全て有効）
 * @returns 有効な終端の場合はtrue、そうでなければfalse
 *
 * @example
 * ```typescript
 * const primitiveItem = { structureType: "primitive", primitiveType: "float64" };
 * validTerminatingStructureItem(primitiveItem, ["primitive"]) // true
 * validTerminatingStructureItem(primitiveItem, ["message"])   // false
 *
 * const messageItem = { structureType: "message", nextByName: {} };
 * validTerminatingStructureItem(messageItem, ["message"])     // true
 * validTerminatingStructureItem(messageItem, ["primitive"])   // false
 * ```
 */
export declare function validTerminatingStructureItem(structureItem?: MessagePathStructureItem, validTypes?: readonly string[]): boolean;
/**
 * 指定された構造からすべての可能なメッセージパスを生成する
 *
 * ROSメッセージの構造を再帰的に走査し、アクセス可能なすべてのフィールドパスを
 * 生成する。自動補完の候補として使用される。型制約やスライス制御オプションに
 * 基づいて、適切なパスのみを生成する。
 *
 * 生成されるパスの例：
 * - "": ルートメッセージ
 * - ".position": 単一フィールド
 * - ".position.x": ネストされたフィールド
 * - ".points[:]": 配列全体
 * - ".points[0]": 配列の特定要素
 * - ".objects[:]{id==0}": フィルター付き配列
 *
 * 配列内のメッセージ型の場合、典型的なフィルター名（id、name等）を持つフィールドを
 * 検索し、適切なフィルター条件を自動生成する。既存のメッセージパスにフィルターが
 * 含まれている場合は、それを保持する。
 *
 * @param structure - 走査対象のメッセージ構造
 * @param options - 生成オプション
 * @param options.validTypes - 有効な型のリスト
 * @param options.noMultiSlices - 複数値スライス（[:]）を無効にするかどうか
 * @param options.messagePath - 既存のメッセージパス（フィルター保持用）
 * @returns パス文字列と終端構造アイテムのペアの配列（自然順でソート済み）
 *
 * @example
 * ```typescript
 * const structure = structures["geometry_msgs/Pose"];
 * const paths = messagePathsForStructure(structure, {
 *   validTypes: ["primitive"],
 *   noMultiSlices: true
 * });
 *
 * // 結果例:
 * // [
 * //   { path: ".position.x", terminatingStructureItem: { structureType: "primitive", primitiveType: "float64" } },
 * //   { path: ".position.y", terminatingStructureItem: { structureType: "primitive", primitiveType: "float64" } },
 * //   { path: ".position.z", terminatingStructureItem: { structureType: "primitive", primitiveType: "float64" } },
 * //   ...
 * // ]
 * ```
 */
export declare function messagePathsForStructure(structure: MessagePathStructureItemMessage, { validTypes, noMultiSlices, messagePath, }?: {
    validTypes?: readonly string[];
    noMultiSlices?: boolean;
    messagePath?: MessagePathPart[];
}): {
    path: string;
    terminatingStructureItem: MessagePathStructureItem;
}[];
/**
 * 構造走査の結果を表す型定義
 *
 * メッセージパスの検証時に、走査の結果として返される情報を定義する。
 * 無効なパスの場合、問題のある部分と到達した構造アイテムを含む。
 */
export type StructureTraversalResult = {
    /** パスが有効かどうか */
    valid: boolean;
    /** 無効だった場合の問題のあるメッセージパス部分 */
    msgPathPart?: MessagePathPart;
    /** 走査結果の構造アイテム */
    structureItem?: MessagePathStructureItem;
};
/**
 * 指定されたメッセージパスに沿って構造を走査し、有効性を検証する
 *
 * メッセージパスの各部分（フィールドアクセス、配列インデックス、フィルター）を
 * 順次処理し、構造的に有効かどうかを判定する。無効な場合は、問題のある部分と
 * その時点での構造アイテムを返す。
 *
 * 処理されるパス要素：
 * - name: フィールド名によるアクセス（メッセージ型でのみ有効）
 * - slice: 配列インデックスによるアクセス（配列型でのみ有効）
 * - filter: フィルター条件による絞り込み（メッセージ型でのみ有効、値が定義されている必要がある）
 *
 * この関数はmemoizeWeakを使用して最適化されており、複数の引数に対応し、
 * WeakMapを使用してオブジェクトを強く保持しない。
 *
 * @param initialStructureItem - 走査開始点の構造アイテム
 * @param messagePath - 走査対象のメッセージパス
 * @returns 走査結果（有効性、問題部分、到達構造アイテム）
 *
 * @example
 * ```typescript
 * const structure = structures["geometry_msgs/Pose"];
 * const path = [
 *   { type: "name", name: "position", repr: "position" },
 *   { type: "name", name: "x", repr: "x" }
 * ];
 *
 * const result = traverseStructure(structure, path);
 * // result.valid === true
 * // result.structureItem.structureType === "primitive"
 * // result.structureItem.primitiveType === "float64"
 *
 * // 無効なパスの例
 * const invalidPath = [
 *   { type: "name", name: "invalid_field", repr: "invalid_field" }
 * ];
 * const invalidResult = traverseStructure(structure, invalidPath);
 * // invalidResult.valid === false
 * // invalidResult.msgPathPart.name === "invalid_field"
 * ```
 */
export declare const traverseStructure: (initialStructureItem: MessagePathStructureItem | undefined, messagePath: MessagePathPart[]) => StructureTraversalResult;
