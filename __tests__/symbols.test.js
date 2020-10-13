/**
 * Copyright (c) 2020 Beyond Essential Systems Pty Ltd
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getVariables } from '../src/symbols';

describe('getVariables()', () => {
  const testData = [
    ['single letters', 'a + b', ['a', 'b']],
    ['words', 'alpha + beta', ['alpha', 'beta']],
    ['formula includes numbers', '2 * a + b - 1', ['a', 'b']],
    ["'u' letter", 'a + u', ['a', 'u']],
    ["words containing 'u', 'x'", 'user * experience - ux', ['user', 'experience', 'ux']],
    ['excessive whitespace', ' a  +  b ', ['a', 'b']],
    ['no whitespace', 'a+b', ['a', 'b']],
    ['same variable multiple times', 'a * b + a', ['a', 'b']],
    ['all operators', '(a + -b) / ((2 * c) - 3 x d)', ['a', 'b', 'c', 'd']],
    ['formula includes functions', 'max(1, 2, a)', ['a']],
    ['variable with function name', 'max(1, 2, a, max)', ['a', 'max']],
  ];

  it.each(testData)('%s', (_, formula, expected) => {
    expect(getVariables(formula)).toStrictEqual(expected);
  });
});
