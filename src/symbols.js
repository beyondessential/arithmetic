/**
 * Copyright (c) 2020 Beyond Essential Systems Pty Ltd
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function isOperator(token) {
  return ['+', '-', '/', '*', 'x', 'u', 'm'].includes(token);
}

export function getPrecedence(operator) {
  switch (operator) {
    case 'm':
      return 5;
    case 'u':
      return 4;
    case '*':
    case 'x':
    case '/':
      return 3;
    case '+':
    case '-':
      return 2;
    case ',':
      return 1;
    default:
      throw new Error('Invalid operator');
  }
}

export function getVariables(formulaText) {
  const variables = formulaText
    // Replace the alternate multiplication symbol 'x' with a non-alphanumeric character
    .replace(/(^|\W)x(\W|$)/, ' ')
    .replace(/(^|\W)max(\W|$)/, ' ')
    .split(/[+-/*() ]/g)
    .filter((v) => v !== '' && Number.isNaN(Number(v)));

  return [...new Set(variables)];
}
