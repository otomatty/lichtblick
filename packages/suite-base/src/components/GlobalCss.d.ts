/// <reference types="react" />
/**
 * GlobalCss - DOM要素レベルのグローバルスタイル適用コンポーネント
 *
 * このコンポーネントは、Material-UIの`GlobalStyles`を使用して
 * アプリケーションの最上位レベルのDOM要素（html、body、#root）に
 * 直接的なスタイルを適用する。
 *
 * ## 役割と責任
 *
 * ### 1. DOM基盤要素のスタイル設定
 * - `html`、`body`要素のリセット・正規化
 * - アプリケーションルート要素（#root）の基本レイアウト
 * - ブラウザデフォルトスタイルの統一
 *
 * ### 2. Material-UIテーマとの統合
 * - `useTheme`による動的テーマ値の取得
 * - ダーク/ライトモードに対応した色彩設定
 * - テーマのタイポグラフィ設定の適用
 *
 * ### 3. アプリケーション全体のレイアウト基盤
 * - flexboxによる全画面レイアウト
 * - オーバーフロー制御
 * - z-index管理
 *
 * ## CssBaselineとの違い
 *
 * - **GlobalCss**: DOM要素への直接的なスタイル適用（Material-UI GlobalStyles使用）
 * - **CssBaseline**: ラッパーコンポーネントによるスタイル適用（tss-react使用）
 *
 * GlobalCssは最上位レベルのDOM構造を設定し、CssBaselineは
 * その上でアプリケーション固有のスタイルを提供する。
 *
 * ## 使用方法
 *
 * ```tsx
 * function App() {
 *   return (
 *     <ThemeProvider theme={theme}>
 *       <GlobalCss />
 *       <CssBaseline>
 *         <AppContent />
 *       </CssBaseline>
 *     </ThemeProvider>
 *   );
 * }
 * ```
 *
 * ## 適用されるスタイル
 *
 * ### html, body要素
 * - ボックスモデルの統一（box-sizing: border-box）
 * - マージン・パディングのリセット
 * - 全画面サイズの設定
 * - normalize.css準拠の行間設定
 *
 * ### 全要素（*, *:before, *:after）
 * - ボックスモデルの継承設定
 *
 * ### body要素
 * - テーマカラーの適用（背景色・文字色）
 * - フォント設定の適用
 * - スクロールバウンス防止
 * - オーバーフロー制御
 *
 * ### #root要素
 * - flexboxレイアウトの設定
 * - 全画面サイズの確保
 * - z-index管理
 * - フォーカス制御
 *
 * @returns Material-UI GlobalStylesコンポーネント
 *
 * @example
 * ```tsx
 * // アプリケーションのエントリーポイントで使用
 * function App() {
 *   return (
 *     <ThemeProvider theme={createTheme()}>
 *       <GlobalCss />
 *       <MyApplication />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 *
 * @see {@link CssBaseline} - アプリケーション固有のスタイル管理
 * @see {@link https://mui.com/material-ui/api/global-styles/} - Material-UI GlobalStyles
 *
 * @author Lichtblick Team
 * @since 2023
 */
export default function GlobalCss(): React.JSX.Element;
