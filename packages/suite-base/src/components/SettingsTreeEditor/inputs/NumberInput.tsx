// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

/**
 * @fileoverview SettingsTreeEditor用数値入力コンポーネント
 *
 * 高機能な数値入力コンポーネントを提供します。
 * 基本的なテキスト入力に加え、マウスドラッグによる値変更、
 * 増減ボタン、範囲制限、精度制御などの機能を備えています。
 *
 * 主な機能：
 * - **マウスドラッグスクラブ**: 入力フィールド上での水平ドラッグによる値変更
 * - **増減ボタン**: 左右のシェブロンボタンによる値の増減
 * - **範囲制限**: min/maxプロパティによる値の制限
 * - **精度制御**: precisionプロパティによる小数点以下の桁数制御
 * - **ステップ制御**: stepプロパティによる増減単位の指定
 * - **キーボード修飾子**: Shiftキー押下時の10倍速変更
 * - **読み取り専用モード**: readOnlyプロパティによる編集禁止
 *
 * 使用例：
 * ```tsx
 * // 基本的な数値入力
 * <NumberInput
 *   value={speed}
 *   onChange={setSpeed}
 *   min={0}
 *   max={100}
 *   step={1}
 * />
 *
 * // 小数点精度指定
 * <NumberInput
 *   value={ratio}
 *   onChange={setRatio}
 *   precision={2}
 *   step={0.01}
 * />
 * ```
 */

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { IconButton, TextFieldProps, TextField } from "@mui/material";
import * as _ from "lodash-es";
import { ReactNode, useCallback, useRef } from "react";
import { useLatest } from "react-use";
import { makeStyles } from "tss-react/mui";

/**
 * NumberInputコンポーネントで使用される定数
 *
 * @constant
 */
const Constants = {
  /** ドラッグスクラブ時の精度（小数点以下の桁数） */
  ScrubPrecision: 4,
} as const;

/**
 * NumberInputコンポーネントのスタイル定義
 */
const useStyles = makeStyles()((theme) => ({
  iconButton: {
    "&.MuiIconButton-edgeStart": {
      marginLeft: theme.spacing(-0.75),
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    "&.MuiIconButton-edgeEnd": {
      marginRight: theme.spacing(-0.75),
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
  },

  textField: {
    ".MuiInputBase-formControl.MuiInputBase-root": {
      paddingTop: 0,
      paddingBottom: 0,
    },
    ".MuiInputBase-input": {
      textAlign: "center",
      fontFamily: theme.typography.fontMonospace,
      cursor: "ew-resize",

      "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
        appearance: "none",
        margin: 0,
      },
    },
    "@media (pointer: fine)": {
      ".MuiIconButton-root": {
        visibility: "hidden",
      },
      "&:hover .MuiIconButton-root": {
        visibility: "visible",
      },
    },
  },
  textFieldReadonly: {
    ".MuiInputBase-input": {
      cursor: "auto",
    },
  },
}));

/**
 * 高機能数値入力コンポーネント
 *
 * マウスドラッグによる値変更、増減ボタン、範囲制限などの機能を持つ数値入力フィールドです。
 * SettingsTreeEditorの数値フィールドで使用されます。
 *
 * @param props - コンポーネントプロパティ
 * @param props.iconUp - 増加ボタンのカスタムアイコン（省略時はChevronRightIcon）
 * @param props.iconDown - 減少ボタンのカスタムアイコン（省略時はChevronLeftIcon）
 * @param props.max - 最大値制限
 * @param props.min - 最小値制限
 * @param props.precision - 小数点以下の桁数（丸め精度）
 * @param props.readOnly - 読み取り専用モード
 * @param props.step - 増減ステップ値
 * @param props.value - 現在の数値
 * @param props.onChange - 値変更時のコールバック
 * @returns NumberInputコンポーネント
 *
 * @example
 * ```tsx
 * // 基本的な使用例
 * <NumberInput
 *   value={temperature}
 *   onChange={(value) => setTemperature(value)}
 *   min={-273.15}
 *   max={1000}
 *   step={0.1}
 *   precision={1}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // カスタムアイコンを使用
 * <NumberInput
 *   value={volume}
 *   onChange={setVolume}
 *   iconUp={<VolumeUpIcon />}
 *   iconDown={<VolumeDownIcon />}
 *   min={0}
 *   max={100}
 * />
 * ```
 */
export function NumberInput(
  props: {
    iconUp?: ReactNode;
    iconDown?: ReactNode;
    max?: number;
    min?: number;
    precision?: number;
    readOnly?: boolean;
    step?: number;
    value?: number;
    onChange: (value: undefined | number) => void;
  } & Omit<TextFieldProps, "onChange">,
): React.JSX.Element {
  const { classes, cx } = useStyles();
  const {
    value,
    iconDown,
    iconUp,
    step = 1,
    min,
    max,
    onChange,
    disabled,
    readOnly,
    precision = 100,
  } = props;

  const inputRef = useRef<HTMLInputElement>(ReactNull);

  // Maintain our own internal scrub value during the scrub to prevent jitter.
  const scrubValue = useRef(0);

  const latestValue = useLatest(value);

  const placeHolderValue = _.isFinite(Number(props.placeholder))
    ? Number(props.placeholder)
    : undefined;

  const updateValue = useCallback(
    (newValue: undefined | number) => {
      if (disabled === true || readOnly === true) {
        return;
      }

      const clampedValue =
        newValue == undefined
          ? undefined
          : _.clamp(newValue, min ?? Number.NEGATIVE_INFINITY, max ?? Number.POSITIVE_INFINITY);
      onChange(clampedValue != undefined ? _.round(clampedValue, precision) : clampedValue);
    },
    [disabled, readOnly, min, max, onChange, precision],
  );

  const isDragging = useRef(false);
  const onPointerDown = useCallback(
    (event: React.PointerEvent) => {
      isDragging.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      const scrubStart = latestValue.current ?? placeHolderValue ?? 0;
      scrubValue.current = _.isFinite(scrubStart) ? scrubStart : 0;
    },
    [latestValue, placeHolderValue],
  );

  const onPointerUp = useCallback((event: React.PointerEvent) => {
    isDragging.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLInputElement>) => {
      if (event.buttons !== 1 || !isDragging.current) {
        return;
      }
      event.preventDefault();
      event.currentTarget.blur();
      const scale = event.shiftKey ? 10 : 1;
      const delta =
        Math.sign(event.movementX) * Math.pow(Math.abs(event.movementX), 1.5) * 0.1 * step * scale;
      scrubValue.current = _.round(scrubValue.current + delta, Constants.ScrubPrecision);
      updateValue(scrubValue.current);
    },
    [step, updateValue],
  );

  const displayValue =
    inputRef.current === document.activeElement
      ? value
      : value != undefined
        ? _.round(value, precision)
        : undefined;

  return (
    <TextField
      {...props}
      value={displayValue ?? ""}
      onChange={(event) => {
        updateValue(event.target.value.length > 0 ? Number(event.target.value) : undefined);
      }}
      type="number"
      className={cx(classes.textField, { [classes.textFieldReadonly]: readOnly })}
      inputProps={{
        ref: inputRef,
        step,
        onPointerDown,
        onPointerUp,
        onPointerMove,
      }}
      InputProps={{
        readOnly,
        startAdornment: (
          <IconButton
            className={classes.iconButton}
            size="small"
            edge="start"
            tabIndex={-1} // Disable tabbing to the step buttons.
            onClick={(event: React.MouseEvent) => {
              updateValue((value ?? placeHolderValue ?? 0) - (event.shiftKey ? step * 10 : step));
            }}
          >
            {iconDown ?? <ChevronLeftIcon fontSize="small" />}
          </IconButton>
        ),
        endAdornment: (
          <IconButton
            className={classes.iconButton}
            size="small"
            edge="end"
            tabIndex={-1} // Disable tabbing to the step buttons.
            onClick={(event: React.MouseEvent) => {
              updateValue((value ?? placeHolderValue ?? 0) + (event.shiftKey ? step * 10 : step));
            }}
          >
            {iconUp ?? <ChevronRightIcon fontSize="small" />}
          </IconButton>
        ),
      }}
    />
  );
}
