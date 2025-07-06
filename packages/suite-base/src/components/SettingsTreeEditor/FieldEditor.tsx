// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

/**
 * @fileoverview SettingsTreeEditor用のフィールドエディターコンポーネント
 *
 * 設定ツリーの個別フィールド（設定項目）を編集するためのコンポーネント群です。
 * 様々な入力タイプ（文字列、数値、選択、色、ベクトル等）に対応し、
 * 統一されたUIでフィールドの編集機能を提供します。
 *
 * 主な機能：
 * - 12種類の入力タイプサポート（string, number, boolean, select, autocomplete, rgb, rgba, messagepath, gradient, vec2, vec3, toggle）
 * - エラー表示とバリデーション
 * - 読み取り専用モードと無効化状態
 * - カスタムステータスボタン対応
 * - 階層に応じたインデント表示
 * - パフォーマンス最適化（React.memo）
 *
 * 使用例：
 * ```tsx
 * <FieldEditor
 *   field={{
 *     input: "string",
 *     label: "名前",
 *     value: "デフォルト値",
 *     placeholder: "名前を入力してください"
 *   }}
 *   path={["settings", "general", "name"]}
 *   actionHandler={handleAction}
 * />
 * ```
 */

import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from "@mui/icons-material/Error";
import {
  Autocomplete,
  MenuItem,
  MenuList,
  MenuListProps,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { v4 as uuid } from "uuid";

import { Immutable, SettingsTreeAction, SettingsTreeField } from "@lichtblick/suite";
import MessagePathInput from "@lichtblick/suite-base/components/MessagePathSyntax/MessagePathInput";
import { useStyles } from "@lichtblick/suite-base/components/SettingsTreeEditor/FieldEditor.style";
import Stack from "@lichtblick/suite-base/components/Stack";
import { useAppContext } from "@lichtblick/suite-base/context/AppContext";

import { ColorGradientInput, ColorPickerInput, NumberInput, Vec2Input, Vec3Input } from "./inputs";

/**
 * select入力でundefinedと空文字列を区別するためのセンチネル値
 * UUIDを使用してユニークな値を保証します
 */
const UNDEFINED_SENTINEL_VALUE = uuid();

/**
 * select入力で無効なオプションが選択された際のMUIエラーを回避するためのセンチネル値
 * UUIDを使用してユニークな値を保証します
 */
const INVALID_SENTINEL_VALUE = uuid();

/**
 * フィールドの入力コンポーネントを生成する関数
 *
 * フィールドの入力タイプに応じて適切な入力コンポーネントを返します。
 * 12種類の入力タイプをサポートし、それぞれに特化した設定とイベントハンドリングを提供します。
 *
 * サポートする入力タイプ：
 * - autocomplete: 自動補完付きテキスト入力
 * - number: 数値入力（範囲、精度、ステップ指定可能）
 * - toggle: 複数選択肢のトグルボタン
 * - string: 文字列入力
 * - boolean: ON/OFF切り替え
 * - rgb: RGB色選択
 * - rgba: RGBA色選択（透明度付き）
 * - messagepath: メッセージパス入力
 * - select: ドロップダウン選択
 * - gradient: グラデーション色設定
 * - vec3: 3次元ベクトル入力
 * - vec2: 2次元ベクトル入力
 *
 * @param actionHandler - アクション実行ハンドラー
 * @param field - フィールド定義
 * @param path - フィールドのパス
 * @returns 入力コンポーネント
 */
function FieldInput({
  actionHandler,
  field,
  path,
}: {
  actionHandler: (action: SettingsTreeAction) => void;
  field: Immutable<SettingsTreeField>;
  path: readonly string[];
}): React.JSX.Element {
  const { classes, cx } = useStyles();

  switch (field.input) {
    case "autocomplete":
      // 自動補完付きテキスト入力
      return (
        <Autocomplete
          className={classes.autocomplete}
          size="small"
          freeSolo={true} // 自由入力を許可
          value={field.value}
          disabled={field.disabled}
          readOnly={field.readonly}
          ListboxComponent={MenuList}
          ListboxProps={{ dense: true } as Partial<MenuListProps>}
          renderOption={(props, option, { selected }) => (
            <MenuItem selected={selected} {...props}>
              {option}
            </MenuItem>
          )}
          componentsProps={{
            clearIndicator: {
              size: "small",
              className: classes.clearIndicator,
            },
          }}
          clearIcon={<CancelIcon fontSize="small" />}
          renderInput={(params) => (
            <TextField {...params} variant="filled" size="small" placeholder={field.placeholder} />
          )}
          onInputChange={(_event, value, reason) => {
            // 入力による変更のみ処理（選択による変更は除外）
            if (reason === "input") {
              actionHandler({ action: "update", payload: { path, input: "autocomplete", value } });
            }
          }}
          onChange={(_event, value) => {
            // 選択による変更を処理
            actionHandler({
              action: "update",
              payload: { path, input: "autocomplete", value: value ?? undefined },
            });
          }}
          options={field.items}
        />
      );
    case "number":
      // 数値入力（範囲、精度、ステップ指定可能）
      return (
        <NumberInput
          size="small"
          variant="filled"
          value={field.value}
          disabled={field.disabled}
          readOnly={field.readonly}
          placeholder={field.placeholder}
          fullWidth
          max={field.max} // 最大値制限
          min={field.min} // 最小値制限
          precision={field.precision} // 小数点精度
          step={field.step} // 増減ステップ
          onChange={(value) => {
            actionHandler({ action: "update", payload: { path, input: "number", value } });
          }}
        />
      );
    case "toggle":
      // 複数選択肢のトグルボタン
      return (
        <ToggleButtonGroup
          className={classes.styledToggleButtonGroup}
          fullWidth
          value={field.value ?? UNDEFINED_SENTINEL_VALUE}
          exclusive // 単一選択モード
          disabled={field.disabled}
          size="small"
          onChange={(_event, value) => {
            if (value != undefined && field.readonly !== true) {
              actionHandler({
                action: "update",
                payload: {
                  path,
                  input: "toggle",
                  value: value === UNDEFINED_SENTINEL_VALUE ? undefined : value,
                },
              });
            }
          }}
        >
          {field.options.map((opt) => (
            <ToggleButton
              key={(typeof opt === "object" ? opt.value : opt) ?? UNDEFINED_SENTINEL_VALUE}
              value={(typeof opt === "object" ? opt.value : opt) ?? UNDEFINED_SENTINEL_VALUE}
            >
              {typeof opt === "object" ? opt.label : opt}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      );
    case "string":
      // 文字列入力
      return (
        <TextField
          variant="filled"
          size="small"
          fullWidth
          disabled={field.disabled}
          value={field.value ?? ""} // undefinedの場合は空文字列
          placeholder={field.placeholder}
          InputProps={{
            readOnly: field.readonly,
          }}
          onChange={(event) => {
            actionHandler({
              action: "update",
              payload: { path, input: "string", value: event.target.value },
            });
          }}
        />
      );
    case "boolean":
      // ON/OFF切り替え
      return (
        <ToggleButtonGroup
          className={classes.styledToggleButtonGroup}
          fullWidth
          value={field.value ?? false} // undefinedの場合はfalse
          exclusive
          disabled={field.disabled}
          size="small"
          onChange={(_event, value) => {
            if (value != undefined && field.readonly !== true) {
              actionHandler({
                action: "update",
                payload: { path, input: "boolean", value },
              });
            }
          }}
        >
          <ToggleButton value={false}>Off</ToggleButton>
          <ToggleButton value={true}>On</ToggleButton>
        </ToggleButtonGroup>
      );
    case "rgb":
      // RGB色選択（透明度なし）
      return (
        <ColorPickerInput
          alphaType="none" // 透明度なし
          disabled={field.disabled}
          readOnly={field.readonly}
          placeholder={field.placeholder}
          value={field.value?.toString()}
          onChange={(value) => {
            actionHandler({
              action: "update",
              payload: { path, input: "rgb", value },
            });
          }}
          hideClearButton={field.hideClearButton}
        />
      );
    case "rgba":
      // RGBA色選択（透明度付き）
      return (
        <ColorPickerInput
          alphaType="alpha" // 透明度付き
          disabled={field.disabled}
          readOnly={field.readonly}
          placeholder={field.placeholder}
          value={field.value?.toString()}
          onChange={(value) => {
            actionHandler({
              action: "update",
              payload: { path, input: "rgba", value },
            });
          }}
        />
      );
    case "messagepath":
      // メッセージパス入力（ROSメッセージのパス指定）
      return (
        <MessagePathInput
          variant="filled"
          path={field.value ?? ""}
          disabled={field.disabled}
          readOnly={field.readonly}
          supportsMathModifiers={field.supportsMathModifiers} // 数学演算子サポート
          onChange={(value) => {
            actionHandler({
              action: "update",
              payload: { path, input: "messagepath", value },
            });
          }}
          validTypes={field.validTypes} // 有効な型の制限
        />
      );
    case "select": {
      // ドロップダウン選択
      // findIndexを使用してTypeScriptの配列union型の混乱を回避
      const selectedOptionIndex = field.options.findIndex((option) => option.value === field.value);
      const selectedOption = field.options[selectedOptionIndex];

      const isEmpty = field.options.length === 0;
      let selectValue = field.value;
      if (!selectedOption) {
        selectValue = INVALID_SENTINEL_VALUE;
      } else if (selectValue == undefined) {
        // value={undefined}を渡すとReactエラー「コンポーネントが非制御から制御に変更されています」が発生するため、
        // センチネル値を使用
        selectValue = UNDEFINED_SENTINEL_VALUE;
      }

      const hasError = !selectedOption && (!isEmpty || field.value != undefined);
      return (
        <Select
          className={cx({ [classes.error]: hasError })}
          size="small"
          displayEmpty
          fullWidth
          disabled={field.disabled}
          readOnly={field.readonly}
          variant="filled"
          value={selectValue}
          renderValue={(_value) => {
            // オプションリストにない値でも表示できるよう、field.valueを直接使用
            const value = field.value;
            for (const option of field.options) {
              if (option.value === value) {
                return option.label.trim();
              }
            }
            return value;
          }}
          onChange={(event) => {
            actionHandler({
              action: "update",
              payload: {
                path,
                input: "select",
                value:
                  event.target.value === UNDEFINED_SENTINEL_VALUE
                    ? undefined
                    : (event.target.value as undefined | string | string[]),
              },
            });
          }}
          MenuProps={{ MenuListProps: { dense: true } }}
        >
          {field.options.map(({ label, value = UNDEFINED_SENTINEL_VALUE, disabled }) => (
            <MenuItem key={value} value={value} disabled={disabled}>
              {label}
            </MenuItem>
          ))}
          {isEmpty && <MenuItem disabled>No options</MenuItem>}
          {!selectedOption && (
            <MenuItem style={{ display: "none" }} value={INVALID_SENTINEL_VALUE} />
          )}
        </Select>
      );
    }
    case "gradient":
      // グラデーション色設定
      return (
        <ColorGradientInput
          colors={field.value}
          disabled={field.disabled}
          readOnly={field.readonly}
          onChange={(value) => {
            actionHandler({ action: "update", payload: { path, input: "gradient", value } });
          }}
        />
      );
    case "vec3":
      // 3次元ベクトル入力（X, Y, Z）
      return (
        <Vec3Input
          step={field.step}
          placeholder={field.placeholder}
          value={field.value}
          precision={field.precision}
          disabled={field.disabled}
          readOnly={field.readonly}
          min={field.min}
          max={field.max}
          onChange={(value) => {
            actionHandler({ action: "update", payload: { path, input: "vec3", value } });
          }}
        />
      );
    case "vec2":
      // 2次元ベクトル入力（X, Y）
      return (
        <Vec2Input
          step={field.step}
          value={field.value}
          placeholder={field.placeholder}
          precision={field.precision}
          disabled={field.disabled}
          readOnly={field.readonly}
          min={field.min}
          max={field.max}
          onChange={(value) => {
            actionHandler({ action: "update", payload: { path, input: "vec2", value } });
          }}
        />
      );
  }
}

/**
 * フィールドのラベル表示コンポーネント
 *
 * フィールドの入力タイプに応じて適切なラベル表示を行います。
 * ベクトル入力（vec2, vec3）の場合は、各軸のラベルも表示します。
 *
 * @param field - フィールド定義
 * @returns ラベル表示コンポーネント
 */
function FieldLabel({ field }: { field: Immutable<SettingsTreeField> }): React.JSX.Element {
  const { classes } = useStyles();

  if (field.input === "vec2") {
    // 2次元ベクトル用のマルチラベル表示（X, Y）
    const labels = field.labels ?? ["X", "Y"];
    return (
      <>
        <div className={classes.multiLabelWrapper}>
          <Typography
            title={field.label}
            variant="subtitle2"
            color="text.secondary"
            noWrap
            flex="auto"
          >
            {field.label}
          </Typography>
          {labels.map((label, index) => (
            <Typography
              key={label}
              title={field.label}
              variant="subtitle2"
              color="text.secondary"
              noWrap
              style={{ gridColumn: index === 0 ? "span 1" : "2 / span 1" }}
              flex="auto"
            >
              {label}
            </Typography>
          ))}
        </div>
      </>
    );
  } else if (field.input === "vec3") {
    // 3次元ベクトル用のマルチラベル表示（X, Y, Z）
    const labels = field.labels ?? ["X", "Y", "Z"];
    return (
      <>
        <div className={classes.multiLabelWrapper}>
          <Typography
            title={field.label}
            variant="subtitle2"
            color="text.secondary"
            noWrap
            flex="auto"
          >
            {field.label}
          </Typography>
          {labels.map((label, index) => (
            <Typography
              key={label}
              title={field.label}
              variant="subtitle2"
              color="text.secondary"
              noWrap
              style={{ gridColumn: index === 0 ? "span 1" : "2 / span 1" }}
              flex="auto"
            >
              {label}
            </Typography>
          ))}
        </div>
      </>
    );
  } else {
    // 通常のシングルラベル表示
    return (
      <>
        <Typography
          className={classes.fieldLabel}
          title={field.help ?? field.label} // ヘルプがある場合はツールチップに表示
          variant="subtitle2"
        >
          {field.label}
        </Typography>
      </>
    );
  }
}

/**
 * フィールドエディターのメインコンポーネント
 *
 * 設定ツリーの個別フィールドを編集するためのコンポーネントです。
 * ラベル、入力コンポーネント、エラー表示、ステータスボタンを統合して表示します。
 *
 * レイアウト構造：
 * - 左側：ラベル、エラーアイコン、ステータスボタン
 * - 右側：入力コンポーネント
 * - 階層に応じたインデント表示
 *
 * @param actionHandler - アクション実行ハンドラー
 * @param field - フィールド定義
 * @param path - フィールドのパス
 * @returns フィールドエディターコンポーネント
 */
function FieldEditorComponent({
  actionHandler,
  field,
  path,
}: {
  actionHandler: (action: SettingsTreeAction) => void;
  field: Immutable<SettingsTreeField>;
  path: readonly string[];
}): React.JSX.Element {
  // インデント計算（最大4階層まで）
  const indent = Math.min(path.length, 4);
  const paddingLeft = 0.75 + 2 * (indent - 1);
  const { classes, cx } = useStyles();

  // カスタムステータスボタンの取得
  const { renderSettingsStatusButton } = useAppContext();
  const statusButton = renderSettingsStatusButton ? renderSettingsStatusButton(field) : undefined;

  return (
    <>
      {/* ラベル部分（左側） */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        gap={0.5}
        paddingLeft={paddingLeft} // 階層に応じたインデント
        fullHeight
      >
        {statusButton}
        {/* エラーアイコン */}
        {field.error && (
          <Tooltip
            arrow
            placement="top"
            title={<Typography variant="subtitle2">{field.error}</Typography>}
          >
            <ErrorIcon color="error" fontSize="small" />
          </Tooltip>
        )}
        <FieldLabel field={field} />
      </Stack>

      {/* 入力コンポーネント部分（右側） */}
      <div className={cx(classes.fieldWrapper, { [classes.error]: field.error != undefined })}>
        <FieldInput actionHandler={actionHandler} field={field} path={path} />
      </div>

      {/* 下部スペーサー */}
      <Stack paddingBottom={0.25} style={{ gridColumn: "span 2" }} />
    </>
  );
}

/**
 * パフォーマンス最適化されたFieldEditorコンポーネント
 *
 * React.memoにより、propsが変更されない限り再レンダリングを防ぎます。
 * 大量のフィールドを扱う設定ツリーでのパフォーマンス向上に寄与します。
 */
export const FieldEditor = React.memo(FieldEditorComponent);
