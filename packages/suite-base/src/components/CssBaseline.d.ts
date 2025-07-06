import { PropsWithChildren } from "react";
import "@lichtblick/suite-base/styles/assets/inter.css";
import "@lichtblick/suite-base/styles/assets/plex-mono.css";
/**
 * CssBaselineコンポーネント
 *
 * アプリケーション全体のベースラインスタイルを適用するラッパーコンポーネント
 * Material-UIのテーマシステムと連動し、統一されたデザインを提供する
 *
 * 使用方法:
 * ```tsx
 * <ThemeProvider theme={theme}>
 *   <CssBaseline>
 *     <App />
 *   </CssBaseline>
 * </ThemeProvider>
 * ```
 *
 * @param props - 子コンポーネントを含むプロパティ
 * @returns ベースラインスタイルが適用されたコンテナ要素
 */
export default function CssBaseline(props: PropsWithChildren): React.JSX.Element;
