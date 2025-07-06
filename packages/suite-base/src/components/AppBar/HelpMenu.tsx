// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

/**
 * HelpMenu - ヘルプメニューコンポーネント
 *
 * AppBarに表示されるヘルプ・サポート関連のメニューを提供します。
 * 外部リソースへのアクセスとアナリティクス追跡機能を統合し、
 * ユーザーサポートとマーケティング要素を組み合わせています。
 *
 * 主な機能：
 * - Data Platformへの外部リンク
 * - アナリティクス追跡（クリックイベント）
 * - ユーザータイプ別の行動分析
 * - アイコンとテキストによる視覚的な情報提示
 *
 * @example
 * ```typescript
 * <HelpMenu
 *   open={isHelpMenuOpen}
 *   handleClose={handleHelpMenuClose}
 *   anchorEl={helpButtonElement}
 * />
 * ```
 */

import { Cloud24Regular } from "@fluentui/react-icons";
import {
  ListItemText,
  Menu,
  MenuItem,
  PopoverOrigin,
  PopoverPosition,
  PopoverReference,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";

import { useAnalytics } from "@lichtblick/suite-base/context/AnalyticsContext";
import { useCurrentUserType } from "@lichtblick/suite-base/context/CurrentUserContext";
import { AppEvent } from "@lichtblick/suite-base/services/IAnalytics";

/**
 * HelpMenuスタイル定義
 *
 * ヘルプメニューの外観とレイアウトを最適化：
 * - 幅の固定によるレイアウト安定性
 * - アイコンの色とサイズ調整
 * - テキストの折り返し設定
 * - 要素間のスペーシング
 */
const useStyles = makeStyles()((theme) => ({
  /** メニューペーパーの幅 */
  paper: {
    width: 280,
  },
  /** アイコンのスタイル */
  icon: {
    color: theme.palette.primary.main,
    flex: "none",
  },
  /** メニューアイテムのレイアウト */
  menuItem: {
    gap: theme.spacing(1),
  },
  /** メニューテキストの表示設定 */
  menuText: {
    whiteSpace: "normal",
    flex: "0 1 auto",
  },
}));

/**
 * HelpMenu Props - ヘルプメニューコンポーネントのプロパティ
 *
 * Material-UIのMenuコンポーネントの標準プロパティを継承し、
 * ポップオーバーの詳細な位置制御を可能にします。
 */
type HelpMenuProps = {
  /** メニューのアンカー要素 */
  anchorEl?: HTMLElement;
  /** アンカーの原点位置 */
  anchorOrigin?: PopoverOrigin;
  /** アンカーの位置座標 */
  anchorPosition?: PopoverPosition;
  /** アンカーの参照方法 */
  anchorReference?: PopoverReference;
  /** ポータルの無効化フラグ */
  disablePortal?: boolean;
  /** メニューを閉じるためのイベントハンドラー */
  handleClose: () => void;
  /** メニューの開閉状態 */
  open: boolean;
  /** 変換の原点位置 */
  transformOrigin?: PopoverOrigin;
};

/**
 * HelpMenu - ヘルプメニューコンポーネント
 *
 * ユーザーサポートとマーケティング要素を組み合わせたメニューコンポーネント。
 * 外部リソースへのアクセスを提供し、ユーザーの行動をアナリティクスで追跡します。
 *
 * 特徴：
 * - Data Platformへの誘導（マーケティング要素）
 * - アナリティクス追跡による行動分析
 * - ユーザータイプ別のイベント記録
 * - 視覚的に魅力的なアイコンとテキストの組み合わせ
 *
 * アナリティクス：
 * - イベント: HELP_MENU_CLICK_CTA
 * - 追跡データ: ユーザータイプ、CTAの種類
 *
 * @param props - コンポーネントのプロパティ
 * @returns HelpMenuのJSX要素
 */
export function HelpMenu(props: HelpMenuProps): React.JSX.Element {
  const {
    anchorEl,
    anchorOrigin,
    anchorPosition,
    anchorReference,
    disablePortal,
    handleClose,
    open,
    transformOrigin,
  } = props;
  const { classes } = useStyles();

  /** 現在のユーザータイプ（アナリティクス用） */
  const currentUserType = useCurrentUserType();
  /** アナリティクス追跡サービス */
  const analytics = useAnalytics();

  return (
    <Menu
      classes={{ paper: classes.paper }}
      id="help-menu"
      anchorEl={anchorEl}
      anchorOrigin={anchorOrigin}
      anchorReference={anchorReference}
      anchorPosition={anchorPosition}
      disablePortal={disablePortal}
      open={open}
      onClose={handleClose}
      transformOrigin={transformOrigin}
      MenuListProps={{
        "aria-labelledby": "help-button",
      }}
    >
      {/* Data Platformへのリンクメニューアイテム */}
      <MenuItem
        href="https://foxglove.dev/docs/data-platform"
        className={classes.menuItem}
        component="a"
        target="_blank"
        onClick={() => {
          // アナリティクスイベントの記録
          void analytics.logEvent(AppEvent.HELP_MENU_CLICK_CTA, {
            user: currentUserType,
            cta: "docs-data-platform",
          });
          handleClose();
        }}
      >
        {/* クラウドアイコン */}
        <Cloud24Regular className={classes.icon} />

        {/* メニューテキスト（プライマリ + セカンダリ） */}
        <ListItemText
          primary="Data Platform"
          secondary="Scalable data management platform"
          secondaryTypographyProps={{ className: classes.menuText }}
        />
      </MenuItem>
    </Menu>
  );
}
