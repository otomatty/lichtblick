// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { SvgIcon, SvgIconProps } from "@mui/material";

/**
 * A filled event icon component that displays a marker or event indicator.
 * Uses Material-UI's SvgIcon as the base component.
 *
 * @component
 * @param props - Standard SvgIcon props for styling and behavior
 * @returns A React element representing the event icon
 *
 * @example
 * ```tsx
 * <EventIcon fontSize="large" color="primary" />
 * ```
 */
export default function EventIcon(props: SvgIconProps): React.JSX.Element {
  return (
    <SvgIcon {...props}>
      <path d="M18.03,3.03H6.03c-.55,0-1,.45-1,1v3h0v9.42c0,.36,.18,.69,.5,.87l6.5,3.71,6.5-3.71c.31-.18,.5-.51,.5-.87V4.03c0-.55-.45-1-1-1Z" />
    </SvgIcon>
  );
}
