import { IDataSourceFactory } from "@lichtblick/suite-base/context/PlayerSelectionContext";
/**
 * ファイルオープン機能を提供するカスタムフック
 *
 * ユーザーがファイルを選択してデータソースとして開くための
 * 統合されたファイルオープン機能を提供します。
 *
 * 主な機能:
 * - ファイルピッカーダイアログの表示
 * - 複数ファイルの選択サポート
 * - ファイル拡張子の検証
 * - 適切なデータソースファクトリーの選択
 * - エラーハンドリングとユーザー通知
 *
 * 制限事項:
 * - 現在、複数ファイルはMCAP形式のみサポート
 * - 異なる拡張子のファイルを同時に選択することはできない
 *
 * @param sources 利用可能なデータソースファクトリーのリスト
 * @returns ファイルオープン処理を実行する非同期関数
 *
 * 使用例:
 * ```typescript
 * function FileMenu() {
 *   const { availableSources } = usePlayerSelection();
 *   const openFile = useOpenFile(availableSources);
 *
 *   const handleOpenFile = async () => {
 *     try {
 *       await openFile();
 *     } catch (error) {
 *       // エラーは内部でスナックバーに表示される
 *       console.error('ファイルオープンエラー:', error);
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleOpenFile}>
 *       ファイルを開く
 *     </button>
 *   );
 * }
 * ```
 *
 * エラーケース:
 * - 異なる拡張子のファイルを同時選択
 * - サポートされていない拡張子
 * - 複数のファクトリーが同じ拡張子をサポート
 * - MCAP以外で複数ファイルを選択
 */
export declare function useOpenFile(sources: readonly IDataSourceFactory[]): () => Promise<void>;
