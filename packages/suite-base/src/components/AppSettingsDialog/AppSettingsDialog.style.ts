// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

/**
 * @fileoverview AppSettingsDialog - スタイル定義
 *
 * 【概要】
 * AppSettingsDialogコンポーネントのスタイリングを定義します。
 * Material-UIのテーマシステムと連動し、レスポンシブデザインに対応した
 * 設定ダイアログの外観を提供します。
 *
 * 【主な機能】
 * - レスポンシブなレイアウトグリッド
 * - タブナビゲーションのスタイリング
 * - フォームコンポーネントのカスタマイズ
 * - ダイアログの構造とスペーシング
 *
 * 【デザイン特徴】
 * - モバイル/デスクトップ対応のレイアウト
 * - Material-UIテーマとの一貫性
 * - アクセシビリティを考慮したコントラスト
 * - 視覚的な階層構造の明確化
 */

import { makeStyles } from "tss-react/mui";

/**
 * AppSettingsDialogスタイルフック
 *
 * tss-react/muiを使用してMaterial-UIテーマと連動したスタイルを定義。
 * レスポンシブデザインとテーマ変数を活用して、
 * 一貫性のあるUIを提供します。
 *
 * @returns スタイルクラスとテーマユーティリティ
 */
export const useStyles = makeStyles()((theme) => ({
  /**
   * レイアウトグリッド
   *
   * 設定ダイアログの主要なレイアウト構造を定義。
   * モバイルでは単一カラム、デスクトップでは2カラムレイアウトを提供。
   *
   * 特徴：
   * - CSS Gridによる柔軟なレイアウト
   * - 固定高さ（70vh）でスクロール可能
   * - レスポンシブブレークポイント対応
   */
  layoutGrid: {
    display: "grid",
    gap: theme.spacing(2),
    height: "70vh", // ビューポート高さの70%
    paddingLeft: theme.spacing(1),
    overflowY: "hidden", // 親要素でのスクロール制御
    [theme.breakpoints.up("sm")]: {
      // デスクトップ: サイドバー + メインコンテンツ
      gridTemplateColumns: "auto minmax(0, 1fr)",
    },
  },

  /**
   * ロゴスタイル
   *
   * Aboutタブで表示されるLichtblickロゴのサイズと配置を定義。
   * ブランディングの一貫性を保ちながら、適切なサイズ感を提供。
   */
  logo: {
    width: 212, // 固定幅でブランドロゴの比率を保持
    height: "auto", // アスペクト比を維持
    marginLeft: theme.spacing(-1), // 左マージンの微調整
  },

  /**
   * タブパネル
   *
   * 各設定セクションのコンテンツ領域を定義。
   * デフォルトでは非表示で、アクティブ時のみ表示される。
   *
   * 特徴：
   * - 初期状態では非表示（display: none）
   * - 幅100%でコンテンツを最大活用
   * - 適切なパディングでコンテンツの可読性を確保
   */
  tabPanel: {
    display: "none", // デフォルトは非表示
    marginRight: "-100%", // レイアウト調整用の負のマージン
    width: "100%",
    padding: theme.spacing(0, 4, 4), // 上0、左右4、下4のスペーシング
  },

  /**
   * アクティブタブパネル
   *
   * 現在選択されているタブのコンテンツを表示するためのスタイル。
   * tabPanelと組み合わせて使用される。
   */
  tabPanelActive: {
    display: "block", // アクティブ時は表示
  },

  /**
   * チェックボックス
   *
   * 設定項目のチェックボックスのスタイルをカスタマイズ。
   * 他のコンポーネントとの整列を改善するためのパディング調整。
   */
  checkbox: {
    "&.MuiCheckbox-root": {
      paddingTop: 0, // 上部パディングを削除して整列改善
    },
  },

  /**
   * ダイアログアクション
   *
   * ダイアログ下部のアクションボタン領域のスタイル。
   * スティッキー配置により、スクロール時も常に表示される。
   *
   * 特徴：
   * - スティッキー配置で常に下部に固定
   * - 背景色でコンテンツとの区別を明確化
   * - ボーダーで視覚的な分離を提供
   */
  dialogActions: {
    position: "sticky",
    backgroundColor: theme.palette.background.paper, // テーマ背景色
    borderTop: `${theme.palette.divider} 1px solid`, // 上部ボーダー
    padding: theme.spacing(1),
    bottom: 0, // 下部に固定
  },

  /**
   * フォームコントロールラベル
   *
   * チェックボックスやラジオボタンのラベル配置を調整。
   * テキストとコントロールの整列を改善。
   */
  formControlLabel: {
    "&.MuiFormControlLabel-root": {
      alignItems: "start", // 上揃えで長いテキストに対応
    },
  },

  /**
   * タブ
   *
   * ナビゲーションタブのスタイルとレイアウトを定義。
   * アイコンとテキストの配置、レスポンシブ対応を含む。
   *
   * 特徴：
   * - アイコンサイズとカラーの統一
   * - デスクトップでの横向きレイアウト
   * - 適切なスペーシングとパディング
   */
  tab: {
    // SVGアイコンのサイズ継承
    svg: {
      fontSize: "inherit",
    },
    // アイコンとテキストのスタイル
    "> span, > .MuiSvgIcon-root": {
      display: "flex",
      color: theme.palette.primary.main, // プライマリカラー
      marginRight: theme.spacing(1.5),
      height: theme.typography.pxToRem(21), // 21pxをremに変換
      width: theme.typography.pxToRem(21),
    },
    // デスクトップ向けのレイアウト調整
    [theme.breakpoints.up("sm")]: {
      textAlign: "right",
      flexDirection: "row", // 横向き配置
      justifyContent: "flex-start",
      alignItems: "center",
      minHeight: "auto",
      paddingTop: theme.spacing(1.5),
      paddingBottom: theme.spacing(1.5),
    },
  },

  /**
   * タブインジケーター
   *
   * アクティブタブを示すインジケーターのスタイル。
   * デスクトップでは背景色による強調表示を提供。
   */
  indicator: {
    [theme.breakpoints.up("sm")]: {
      right: 0,
      width: "100%", // タブ全体を覆う幅
      backgroundColor: theme.palette.action.hover, // ホバー色
      borderRadius: theme.shape.borderRadius, // テーマの角丸設定
    },
  },

  /**
   * ダイアログタイトル
   *
   * ダイアログヘッダーのタイトル部分のレイアウトとスタイル。
   * タイトルテキストと閉じるボタンの配置を管理。
   */
  dialogTitle: {
    display: "flex",
    justifyContent: "space-between", // 両端揃え
    alignItems: "center", // 垂直中央揃え
    fontSize: theme.typography.h3.fontSize, // H3サイズのフォント
  },
}));
