/// <reference types="react" />
/**
 * ## LinkHandlerContext
 *
 * **リンククリック処理のContext**
 *
 * ### 概要
 * - リンククリック時のカスタム処理を提供
 * - アプリ内リンクのモーダル表示などに使用
 * - 外部ナビゲーションの代替手段
 *
 * ### 使用例
 * ```typescript
 * const linkHandler = useContext(LinkHandlerContext);
 *
 * const handleClick = (event: React.MouseEvent) => {
 *   linkHandler(event, "https://example.com");
 * };
 * ```
 *
 * @param event - マウスクリックイベント
 * @param href - リンクURL
 */
declare const LinkHandlerContext: import("react").Context<(event: React.MouseEvent, href: string) => void>;
export default LinkHandlerContext;
