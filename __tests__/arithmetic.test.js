/**
 * Copyright (c) 2020 Beyond Essential Systems Pty Ltd
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { runArithmetic } from '../src/arithmetic';

describe('Arithmetic', () => {
  describe('basics', () => {
    it('should perform an addition', () => {
      const result = runArithmetic('1 + 2');
      expect(result).toEqual(1 + 2);
    });

    it('should perform a subtraction', () => {
      const result = runArithmetic('1 - 2');
      expect(result).toEqual(1 - 2);
    });

    it('should handle double digits', () => {
      const result = runArithmetic('10 - 20');
      expect(result).toEqual(10 - 20);
    });

    it('should handle parentheses', () => {
      const result = runArithmetic('(4 + (1 + 2) + (2 + 5) + 1)');
      expect(result).toEqual(4 + (1 + 2) + (2 + 5) + 1);
    });
  });

  describe('decimals', () => {
    it('should handle adding decimals', () => {
      const result = runArithmetic('5.5 - 1.9');
      expect(result).toEqual(5.5 - 1.9);
    });

    it('should handle multiplying decimals', () => {
      const result = runArithmetic('2.5352 * 102.99');
      expect(result).toEqual(2.5352 * 102.99);
    });
  });

  describe('multiplication', () => {
    it('should handle a simple multiplication', () => {
      const result = runArithmetic('5 * 3');
      expect(result).toEqual(5 * 3);
    });

    it('should handle a bunch of operations', () => {
      const result = runArithmetic('(4 + (1 * 2) / (2 + 5) - 1)');
      expect(result).toEqual(4 + (1 * 2) / (2 + 5) - 1);
    });

    it('should handle putting x instead of *', () => {
      const result = runArithmetic('5 x 3');
      expect(result).toEqual(5 * 3);
    });

    it('should handle putting x in a more complicated expression', () => {
      const result = runArithmetic('(4 + (1 x 2) / (2 + 5) - 1)');
      expect(result).toEqual(4 + (1 * 2) / (2 + 5) - 1);
    });
  });

  describe('unary minus (for eg, -1)', () => {
    it('should handle multiplying by a negative', () => {
      const result = runArithmetic('4 / - 2');
      expect(result).toEqual(4 / -2);
    });

    it('should handle multiple negatives', () => {
      const result = runArithmetic('4 * - 2 * - 2');
      expect(result).toEqual(4 * -2 * -2);
    });

    it('should handle multiplying by a double negative', () => {
      const result = runArithmetic('4 / - - 2');
      expect(result).toEqual(4 / 2);
    });

    it('should handle negating a parenthesized expression', () => {
      const result = runArithmetic('-(4 / 2)');
      expect(result).toEqual(-(4 / 2));
    });

    it('should handle multiplying by a negative', () => {
      const result = runArithmetic('3 * -(4 / 2)');
      expect(result).toEqual(3 * -(4 / 2));
    });

    it('should handle varying whitespace', () => {
      const result = runArithmetic('1+1 - - 5');
      expect(result).toEqual(1 + 1 - -5);
    });
  });

  describe('max function', () => {
    it('should handle max of one number', () => {
      const result = runArithmetic('max(15)');
      expect(result).toEqual(15);
    });

    it('should handle max of two numbers', () => {
      const result = runArithmetic('max(15, 20)');
      expect(result).toEqual(20);
    });

    it('should handle max of more than two numbers', () => {
      const result = runArithmetic('max(15, 12, 15.01, -100)');
      expect(result).toEqual(15.01);
    });

    it('should handle a more complex expression', () => {
      const result = runArithmetic('max(3 - 2, -100) / 2');
      expect(result).toEqual(0.5);
    });

    it('should handle an even more complex expression', () => {
      const result = runArithmetic('max(15, 3 - 2, -100) / 2 + 1 - max(2, 3/2)');
      expect(result).toEqual(Math.max(15, 3 - 2, -100) / 2 + 1 - Math.max(2, 3 / 2));
    });

    it('should handle a yet more complex expression', () => {
      const result = runArithmetic(
        'max(1 + (-max(15, 3 - 2, -100) / 2 + 1 - max(3/2, 2)) /2, -10)',
      );
      expect(result).toEqual(
        Math.max(1 + (-Math.max(15, 3 - 2, -100) / 2 + 1 - Math.max(2, 3 / 2)) / 2, -10),
      );
    });

    it('should be caps insensitive', () => {
      const result = runArithmetic('maX(15)');
      expect(result).toEqual(15);
    });
  });

  describe('substituting values', () => {
    const VALUES = {
      fingers: 10,
      eyes: 2,
      pi: 3.14159,
      sins: 7,
      negative: -5,
      max: 100,
    };

    it('should handle simple value substitution', () => {
      const result = runArithmetic('fingers + eyes', VALUES);
      expect(result).toEqual(10 + 2);
    });

    it('should handle negative value substitution', () => {
      const result = runArithmetic('fingers + negative', VALUES);
      expect(result).toEqual(10 - 5);
    });

    it('should handle a more complicated case', () => {
      const result = runArithmetic('-eyes * (sins - pi * 3) / negative + (sins + 1)', VALUES);
      expect(result).toEqual((-2 * (7 - 3.14159 * 3)) / -5 + (7 + 1));
    });

    it('should handle substitution of a value which is a function name', () => {
      const result = runArithmetic('fingers + max', VALUES);
      expect(result).toEqual(10 + 100);
    });

    it('should be able to substitute values into a function with the same name', () => {
      const result = runArithmetic('max(max, eyes)', VALUES);
      expect(result).toEqual(Math.max(100, 10));
    });
  });

  describe('errors', () => {
    it('should fail on an unexpected token', () => {
      expect(() => runArithmetic('fail')).toThrow();
      expect(() => runArithmetic('1 + fail')).toThrow();
      expect(() => runArithmetic('4 + (1 * fail) / 2')).toThrow();
    });

    it('should fail on an unmatched parenthesis', () => {
      expect(() => runArithmetic(')')).toThrow();
      expect(() => runArithmetic('4 * (1 + 2')).toThrow();
      expect(() => runArithmetic('4 * 1) + 2')).toThrow();
      expect(() => runArithmetic('4 * 1 + 2)')).toThrow();
    });

    it('should fail on incorrect function call', () => {
      expect(() => runArithmetic('max(')).toThrow();
      expect(() => runArithmetic('max())')).toThrow();
      expect(() => runArithmetic('max(()')).toThrow();
      expect(() => runArithmetic('max((1, 2), 3)')).toThrow();
      expect(() => runArithmetic('max(3, (1, 2))')).toThrow();
      expect(() => runArithmetic('max(, 3)')).toThrow();
      expect(() => runArithmetic('max(3, )')).toThrow();
      expect(() => runArithmetic('max(3,,2)')).toThrow();
      expect(() => runArithmetic('max(3-,2)')).toThrow();
    });

    it('should fail if a substitution is not numeric', () => {
      expect(() => runArithmetic('check + 1', { check: 'check' })).toThrow();
      expect(() => runArithmetic('check + 1', { check: '+' })).toThrow();
      expect(() => runArithmetic('check + 1', { check: '' })).toThrow();
    });
  });
});
