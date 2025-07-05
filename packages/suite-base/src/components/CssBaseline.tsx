// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { alpha } from "@mui/material";
import { PropsWithChildren } from "react";
import tinycolor from "tinycolor2";
import { makeStyles } from "tss-react/mui";

import "@lichtblick/suite-base/styles/assets/inter.css";
import "@lichtblick/suite-base/styles/assets/plex-mono.css";

/**
 * CssBaseline - アプリケーション全体のベースラインCSS管理コンポーネント
 *
 * このコンポーネントは従来の「リセットCSS」を超えた包括的なスタイル管理システムで、
 * 以下の3つの重要な役割を担っている：
 *
 * 1. **ベースラインスタイリング（リセットCSS的機能）**
 *    - ブラウザ間のデフォルトスタイル差異を統一
 *    - アプリケーション全体の基本レイアウト設定
 *    - フォント、色、サイズの統一設定
 *
 * 2. **グローバルスタイル定義**
 *    - アプリ全体で使用される要素のスタイル統一
 *    - スクロールバー、コードブロック、マークアップ要素等
 *    - Material-UIテーマとの連動
 *
 * 3. **サードパーティライブラリ統合**
 *    - 外部ライブラリ（Mosaic、Leaflet等）のスタイル上書き
 *    - Lichtblickのデザインシステムとの統一
 *    - テーマ切り替え（ダーク/ライトモード）への対応
 *
 * 特徴:
 * - Material-UIのtheme（palette, typography）と完全連動
 * - 動的テーマ切り替えに対応
 * - 外部ライブラリの見た目を統一
 * - パフォーマンス最適化（CSS-in-JS with tss-react）
 *
 * 使用場面:
 * - アプリケーションのルートレベルで適用
 * - 全てのUIコンポーネントの基盤として機能
 * - テーマプロバイダーと連携してデザインシステムを構築
 */

const useStyles = makeStyles()(({ palette, typography }) => ({
  root: {
    // === コンテナの基本スタイリング ===
    // アプリケーション全体のレイアウト基盤を設定
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    flex: "1 1 100%",
    overflow: "hidden",
    // Material-UIテーマから動的に色を取得（ダーク/ライトモード対応）
    background: palette.background.default,
    color: palette.text.primary,
    font: "inherit",
    fontSize: typography.body2.fontSize,
    fontFeatureSettings: typography.fontFeatureSettings,
    fontFamily: typography.body2.fontFamily,
    fontWeight: typography.body2.fontWeight,
    zIndex: 0,

    // スクロール「バウンス」を防止（アプリワークスペースはスクロール不可のため）
    // 個別のスクロール可能要素がスクロールイベントでpreventDefaultしなくても
    // ページ全体が動かないようにする
    overscrollBehavior: "none",

    // normalize.cssの基本設定を適用
    // https://github.com/necolas/normalize.css/blob/master/normalize.css#L12
    lineHeight: 1.15,

    /// === 子要素と個別要素のスタイリング ===

    // コードブロック要素の統一スタイル
    "code, pre, tt": {
      fontFamily: typography.fontMonospace, // モノスペースフォント適用
      overflowWrap: "break-word", // 長いコードの改行処理
    },

    // ハイライト（マーク）要素のスタイル
    mark: {
      color: palette.info.main, // テーマ色を使用
      fontWeight: 700,
      backgroundColor: "transparent", // 背景は透明（色のみで強調）
    },

    // === カスタムスクロールバーの設定 ===
    // WebKit系ブラウザ（Chrome、Safari）用のスクロールバーカスタマイズ
    div: {
      "::-webkit-scrollbar": {
        width: 6, // 縦スクロールバーの幅
        height: 6, // 横スクロールバーの高さ
      },
      "::-webkit-scrollbar-corner": {
        background: "transparent", // 角の背景を透明に
      },
      "::-webkit-scrollbar-track": {
        background: "transparent", // トラック（背景）を透明に
      },
      "::-webkit-scrollbar-thumb": {
        background: palette.action.focus, // テーマカラーを使用
        borderRadius: 0, // 角を丸くしない
      },
    },

    // 段落要素のマージン設定（Material-UIクラス以外）
    "p:not([class^='Mui')": {
      margin: "1em 0",

      "&:last-child": {
        marginBottom: 0, // 最後の段落の下マージンを削除
      },
    },

    // 太字要素の統一
    "b, strong": {
      fontWeight: 700,
    },

    // Canvas要素のアウトライン削除（フォーカス時の枠線を非表示）
    canvas: {
      outline: "none",
    },

    // テーブルヘッダーのテキスト配置継承
    th: {
      textAlign: "inherit",
    },

    // === Mosaicライブラリのスタイル統合 ===
    // react-mosaicライブラリ（パネルレイアウト管理）のスタイルを
    // Lichtblickのデザインシステムに合わせて上書き
    ".mosaic": {
      ".mosaic-root": {
        // ルート要素の位置設定
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,

        // ドラッグ&ドロップ時のターゲット表示
        ".drop-target-container .drop-target": {
          backgroundColor: palette.action.hover, // テーマのホバー色
          border: `2px solid ${alpha(palette.divider, 0.5)}`, // 半透明の境界線
        },
        ".drop-target-container .drop-target-hover": {
          opacity: 1, // ホバー時は完全不透明
        },
      },

      // タイル（パネル）のスタイル調整
      ".mosaic-tile": {
        margin: 0,
      },
      ".mosaic-tile:first-of-type": {
        // スプリッター用のスペースを確保 - 背景色が透けて見える可能性があるが、
        // タイル自体に背景色が設定されていても必要
        gap: 1,
      },
      // 最後のタイルには下マージン不要
      ".mosaic-tile:last-child": {
        marginBottom: 0,
      },
      // コンテナに1つのタイルしかない場合はスプリッターがないためマージン不要
      ".mosaic-tile:only-child": {
        margin: 0,
      },
      // 行スプリッター直後のタイルは1px マージンが必要（スプリッターとの重複回避）
      ".-row + .mosaic-tile": {
        gap: 1,
      },
      // 列スプリッター直後のタイルは1px マージンが必要（スプリッターとの重複回避）
      ".-column + .mosaic-tile": {
        gap: 1,
      },

      // ウィンドウ（パネル）のスタイル
      ".mosaic-window": {
        boxShadow: "none", // デフォルトの影を削除
        width: "100%",

        // カスタムツールバーを使用するため、デフォルトツールバーを非表示
        ".mosaic-window-toolbar": {
          display: "none",
        },
        ".mosaic-window-body": {
          flex: "1 1 auto",
          display: "flex",
          background: "unset", // 背景をリセット
          zIndex: "unset", // z-indexをリセット
        },
      },

      // プレビューウィンドウのスタイル
      ".mosaic-preview": {
        maxHeight: "none", // 最大高さ制限を削除

        // カスタムツールバーを使用するため、デフォルトツールバーを非表示
        ".mosaic-window-toolbar": {
          display: "none",
        },
        ".mosaic-window-body": {
          flex: "1 1 auto",
          display: "flex",
          background: "unset",
          zIndex: "unset",
        },
      },

      // 全体的なツールバー非表示設定（念のため重複）
      ".mosaic-window-toolbar": {
        display: "none",
      },
      ".mosaic-window-body": {
        flex: "1 1 auto",
        display: "flex",
        background: "unset",
        zIndex: "unset",
      },

      // ウィンドウタイトルのスタイル
      ".mosaic-window-title": {
        fontSize: 12,
        lineHeight: "30px",
        paddingLeft: 5,
      },

      // スプリッター（分割線）のスタイル
      ".mosaic-split": {
        background: "none !important", // デフォルト背景を強制削除
        zIndex: 99, // 他の要素より前面に表示

        ".mosaic-split-line": {
          // テーマカラーを使用した境界線
          boxShadow: `0 0 0 1px ${palette.divider}`,
        },
        // ホバー時の色変更（ダーク/ライトモードに応じて明度調整）
        "&:hover .mosaic-split-line": {
          boxShadow: `0 0 0 1px ${
            palette.mode === "dark"
              ? tinycolor(palette.divider).lighten().toHexString()
              : tinycolor(palette.divider).darken().toHexString()
          }`,
        },
      },

      // ボーダーレスモード（境界線なし）の設定
      "&.borderless": {
        ".mosaic-split": {
          opacity: 0, // 通常時は非表示

          "&:hover": {
            opacity: 1, // ホバー時のみ表示
          },
        },
        ".mosaic-tile": {
          margin: 0, // マージンをリセット
        },
      },
    },

    // === Leafletライブラリ（地図）のGUIスタイル統合 ===
    // Leaflet地図ライブラリのコントロールバーをテーマに合わせて調整
    ".leaflet-bar": {
      userSelect: "none", // テキスト選択を無効化
      backgroundColor: palette.background.paper, // テーマの紙背景色
      borderRadius: 4, // 角丸設定

      // リンク要素（ボタン）のスタイル
      a: {
        lineHeight: 1.2,
        backgroundColor: "transparent",
        color: palette.text.primary, // テーマのプライマリテキスト色
        borderBottomColor: palette.divider, // 境界線色

        // インタラクション状態のスタイル
        "&:hover": {
          backgroundColor: palette.action.hover, // ホバー時の背景色
          color: palette.text.primary,
          borderBottomColor: palette.divider,
        },
        "&:focus": {
          color: palette.text.primary, // フォーカス時の色
        },
        "&:active": {
          color: palette.text.primary, // アクティブ時の色
        },
      },
    },

    // 無効化されたLeafletボタンのスタイル
    ".leaflet-bar a.leaflet-disabled": {
      backgroundColor: palette.action.disabledBackground, // 無効時の背景色
      color: palette.text.disabled, // 無効時のテキスト色

      "&:hover": {
        backgroundColor: palette.action.disabledBackground, // ホバーしても変化なし
      },
    },
  },
}));

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
export default function CssBaseline(props: PropsWithChildren): React.JSX.Element {
  const { classes } = useStyles();

  return <div className={classes.root}>{props.children}</div>;
}
