// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { Divider, Paper } from "@mui/material";
import { makeStyles } from "tss-react/mui";

/**
 * TopicStatsChip用のスタイル定義
 *
 * @description
 * レスポンシブデザインを考慮したコンテナクエリベースのスタイル：
 * - 180px以下: チップ全体を非表示
 * - 280px以下: 頻度のみ表示（メッセージ数は非表示）
 * - 280px以上: 頻度とメッセージ数の両方を表示
 */
const useStyles = makeStyles<void, "selected">()((theme, _props, classes) => ({
  selected: {},
  root: {
    display: "flex",
    borderRadius: "1em",
    color: theme.palette.action.selected,
    borderColor: "currentColor",
    backgroundColor: theme.palette.background.paper,
    cursor: "grab",

    // コンテナクエリ: 幅が狭い場合は非表示
    [`@container (max-width: 180px)`]: {
      display: "none",
    },
    // ダークモードでの選択状態のスタイル
    ...(theme.palette.mode === "dark" && {
      [`&.${classes.selected}`]: { color: theme.palette.primary.main },
    }),
  },
  stat: {
    whiteSpace: "nowrap",
    minWidth: "1em",
    textAlign: "center",
    fontSize: theme.typography.caption.fontSize,
    color: theme.palette.text.secondary,
    paddingBlock: theme.spacing(0.25),
    // 等幅数字フォント機能を有効化
    fontFeatureSettings: `${theme.typography.fontFeatureSettings}, 'tnum'`,

    "&:first-of-type": {
      paddingInlineStart: theme.spacing(0.75),

      // 狭い幅では右パディングも追加
      [`@container (max-width: 280px)`]: {
        paddingInlineEnd: theme.spacing(0.75),
      },
    },
    "&:last-of-type": {
      paddingInlineEnd: theme.spacing(0.75),

      // 狭い幅では2番目の統計を非表示
      [`@container (max-width: 280px)`]: {
        display: "none",
      },
    },
  },
  divider: {
    borderColor: "currentColor",
    marginInline: theme.spacing(0.5),

    // 狭い幅では区切り線も非表示
    [`@container (max-width: 280px)`]: {
      display: "none",
    },
  },
}));

/**
 * TopicStatsChip - トピック統計情報表示チップ
 *
 * @description
 * このコンポーネントは、ROSトピックの統計情報（頻度とメッセージ数）を表示する
 * 小さなチップコンポーネントです。実際の統計データは外部の仕組みによって
 * DOM要素に直接更新されます。
 *
 * **主要機能:**
 * - 📊 トピック頻度の表示（Hz）
 * - 📈 メッセージ数の表示
 * - 📱 レスポンシブデザイン（コンテナクエリ対応）
 * - 🎨 選択状態の視覚的表示
 * - 🔢 等幅数字フォントによる整列表示
 *
 * **データ更新の仕組み:**
 * このコンポーネントは表示のみを担当し、実際の統計データは以下の仕組みで更新されます：
 * - DirectTopicStatsUpdater が定期的に統計を収集
 * - data-topic 属性を持つ要素を検索
 * - data-topic-stat 属性に基づいて適切な統計値を設定
 * - DOM操作による直接的な値更新（React外部）
 *
 * **レスポンシブ表示:**
 * - 幅 < 180px: チップ全体を非表示
 * - 幅 < 280px: 頻度のみ表示
 * - 幅 >= 280px: 頻度とメッセージ数の両方を表示
 *
 * **表示例:**
 * ```
 * [10.2 Hz | 1.2K]  // 通常表示
 * [10.2 Hz]         // 狭い幅
 * (非表示)          // 極狭い幅
 * ```
 *
 * **依存関係:**
 * - DirectTopicStatsUpdater: 統計データの定期更新
 * - Material-UI Paper: チップの外観
 * - tss-react: スタイリング
 *
 * @param props - コンポーネントのプロパティ
 * @param props.topicName - 統計を表示するトピック名（data-topic属性に設定）
 * @param props.selected - 選択状態（スタイル変更用）
 * @returns 統計情報チップのJSX要素
 */
export function TopicStatsChip({
  topicName,
  selected,
}: {
  topicName: string;
  selected: boolean;
}): React.JSX.Element {
  const { classes, cx } = useStyles();

  return (
    <Paper variant="outlined" className={cx(classes.root, { [classes.selected]: selected })}>
      {/* 頻度表示（Hz） */}
      <div className={classes.stat} data-topic={topicName} data-topic-stat="frequency">
        &ndash;
      </div>

      {/* 区切り線 */}
      <Divider className={classes.divider} orientation="vertical" flexItem />

      {/* メッセージ数表示 */}
      <div className={classes.stat} data-topic={topicName} data-topic-stat="count">
        &ndash;
      </div>
    </Paper>
  );
}
