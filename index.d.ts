/**
 * Copyright (c) 2020 Beyond Essential Systems Pty Ltd
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function getVariables(formulaText: string): string[];
export function runArithmetic(
  formulaText: string,
  values?: Record<string, string | number>,
): number;
