import { LayoutLoader } from "@lichtblick/suite-base/services/ILayoutLoader";
import { ILayoutManager } from "@lichtblick/suite-base/services/ILayoutManager";
/**
 * デフォルトレイアウトの読み込みと保存処理
 *
 * 複数のLayoutLoaderからレイアウトを取得し、まだ保存されていない新しいレイアウトのみを
 * LayoutManagerに保存します。エラー処理とログ出力を含む堅牢な実装です。
 *
 * ## 処理フロー
 * 1. 現在保存されているレイアウト一覧を取得
 * 2. 全ローダーから並行してレイアウトを取得
 * 3. 重複チェック（`from`プロパティで判定）
 * 4. 新しいレイアウトのみを保存
 * 5. エラー処理とログ出力
 *
 * ## エラー処理
 * - ローダーからの取得失敗: ログ出力のみ、処理続行
 * - レイアウト保存失敗: ログ出力のみ、他レイアウトの処理続行
 * - 全体的な例外: ログ出力して処理終了
 *
 * ## 重複回避機能
 * `from`プロパティを使用して同一ソースからのレイアウトの重複保存を防止します。
 * これにより、アプリケーション再起動時の重複インポートを回避できます。
 *
 * ## 並行処理
 * - `Promise.allSettled`を使用してローダー実行を並行化
 * - 一部のローダーが失敗しても他の処理を継続
 * - 保存処理も並行実行で効率化
 *
 * ## 使用場面
 * - アプリケーション初期化時
 * - 新しいレイアウトローダーの追加時
 * - 組織固有のデフォルトレイアウト配布
 *
 * @param layoutManager - レイアウト管理サービス
 * @param loaders - レイアウトローダーの配列
 * @returns Promise<void> - 処理完了を示すPromise
 *
 * @example
 * ```typescript
 * // アプリケーション初期化時の使用例
 * const loaders = [
 *   new RemoteLayoutLoader('https://company.com/layouts'),
 *   new LocalFileLayoutLoader('./default-layouts'),
 * ];
 *
 * await loadDefaultLayouts(layoutManager, loaders);
 * console.log('デフォルトレイアウトの読み込み完了');
 * ```
 *
 * @see LayoutLoader - レイアウト読み込みインターフェース
 * @see ILayoutManager - レイアウト管理インターフェース
 */
export declare const loadDefaultLayouts: (layoutManager: ILayoutManager, loaders: readonly LayoutLoader[]) => Promise<void>;
