/**
 * Copyright (c) 2020 Beyond Essential Systems Pty Ltd
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getOperands } from '../src/symbols';

describe('getOperands()', () => {
  const testData = [
    ['numbers', '1 + 2', ['1', '2']],
    ['single letters', 'a + b', ['a', 'b']],
    ['words', 'alpha + beta', ['alpha', 'beta']],
    ["'u' letter", 'a + u', ['a', 'u']],
    ["words containing 'u', 'x'", 'user * experience - ux', ['user', 'experience', 'ux']],
    ['excessive whitespace', ' a  +  b ', ['a', 'b']],
    ['no whitespace', 'a+b', ['a', 'b']],
    ['same operand multiple times', 'a * b + a', ['a', 'b']],
    ['all operators', '(a + -b) / ((2 * c) - 3 x d)', ['a', 'b', '2', 'c', '3', 'd']],
  ];

  it.each(testData)('%s', (_, formula, expected) => {
    expect(getOperands(formula)).toStrictEqual(expected);
  });
});
