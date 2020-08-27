/**
 * Copyright (c) 2020 Beyond Essential Systems Pty Ltd
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const FORMULA_OPERATORS = ['+', '-', '/', '*', 'x'];

/**
 * Operators used as part of the algorithm, but not supported in the formula input
 */
const INTERNAL_OPERATORS = ['u'];

const OPERATORS = FORMULA_OPERATORS.concat(INTERNAL_OPERATORS);

export function isOperator(token) {
  return OPERATORS.includes(token);
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
  const nonOperandSymbols = FORMULA_OPERATORS.map(s => `\\${s}`)
    .concat(['(', ')', ' '])
    .join('');
  const codes = formulaText.split(new RegExp(`[${nonOperandSymbols}]`, 'g')).filter(c => c !== '');

  return [...new Set(codes)];
}
