/**
 * Copyright (c) 2020 Beyond Essential Systems Pty Ltd
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function isOperator(token) {
  return ['+', '-', '/', '*', 'x', 'u'].includes(token);
}

export function getPrecedence(operator) {
  switch (operator) {
    case 'u':
      return 4;
    case '*':
    case 'x':
    case '/':
      return 3;
    case '+':
    case '-':
      return 2;
    default:
      throw new Error('Invalid operator');
  }
}

export function getOperands(formulaText) {
  const codes = formulaText
    // Replace the alternate multiplication symbol 'x' with a non-alphanumeric character
    .replace(/(^|\W)x(\W|$)/, ' ')
    .split(/[+-/*() ]/g)
    .filter(c => c !== '');

  return [...new Set(codes)];
}
