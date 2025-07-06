import { ReactNode } from "react";
/**
 * @fileoverview JsonTree - タイムゾーン対応JSON表示カスタムフック
 *
 * このファイルは、react-json-treeライブラリで使用するカスタムフックを提供します。
 * 主な機能：
 * - アプリケーション設定からタイムゾーン情報を取得
 * - JSON表示時にタイムゾーンを考慮したアイテム文字列生成
 * - パフォーマンス最適化のためのuseCallback使用
 *
 * 使用場面：
 * - JSONデータの視覚化
 * - ログデータの表示
 * - デバッグ情報の表示
 * - タイムスタンプを含むデータの表示
 */
/**
 * タイムゾーン対応のJSON表示用カスタムフック
 *
 * react-json-treeライブラリのgetItemStringプロパティに渡すコールバック関数を生成します。
 * アプリケーション設定からタイムゾーン情報を取得し、JSON表示時にタイムゾーンを
 * 考慮したアイテム文字列を生成します。
 *
 * @returns {function} react-json-tree用のgetItemString関数
 *   - type: string - JSON値の型（'Object', 'Array', 'String', etc.）
 *   - data: unknown - 実際のJSON値
 *   - itemType: ReactNode - react-json-treeが提供する型表示要素
 *   - itemString: string - デフォルトのアイテム文字列
 *   - returns: ReactNode - 表示用のReact要素
 *
 * @example
 * ```tsx
 * import JSONTree from 'react-json-tree';
 * import useGetItemStringWithTimezone from './useGetItemStringWithTimezone';
 *
 * function MyJsonViewer({ data }) {
 *   const getItemString = useGetItemStringWithTimezone();
 *
 *   return (
 *     <JSONTree
 *       data={data}
 *       getItemString={getItemString}
 *       theme="monokai"
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * タイムスタンプを含むデータの表示例：
 * ```tsx
 * const data = {
 *   timestamp: { sec: 1640995200, nsec: 0 },
 *   message: "Hello World"
 * };
 * // タイムゾーン設定に基づいて適切な時刻表示が行われる
 * ```
 */
export default function useGetItemStringWithTimezone(): (type: string, data: unknown, itemType: ReactNode, itemString: string) => ReactNode;
