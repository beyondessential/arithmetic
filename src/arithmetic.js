/**
 * Copyright (c) 2020 Beyond Essential Systems Pty Ltd
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This module is responsible for taking a string, interpreting it as an
// arithmetic expression, substituting in some provided values,
// and then calculating the result of that expression.
//
// runArithmetic("5 + (apples * 2)", { apples: 10 })
// => 25
//
// It handles parentheses and +, -, * and /. It doesn't do powers.
// It also handles the unary minus (for eg the "-" in "4 * -2").
// It also accommodates using 'x' instead of '*' just because that's bound
// to happen eventually.
//
// It uses an algorithm called the shunting-yard algorithm to parse the
// expression into a postfix operator queue. If you're not familiar with
// that, don't sweat! There're unit tests and you can validate that things
// work over there.

import { isOperator, getPrecedence, FUNCTION_NAMES, isFunctionToken } from './symbols';

const unaryRegex = /(^|[*x/+\-u,(])-/g;
function replaceUnaryMinus(text) {
  const replaced = text.replace(unaryRegex, (match, p1) => `${p1}u`);
  if (replaced !== text) {
    // if we made a changed, do another pass - this is because the regex
    // won't catch consecutive unaries (it detects them correctly but the
    // restrictions on replacing partial matches means it's difficult to
    // actually sub them all out in one pass - this is the least complicated
    // way to achieve it)
    return replaceUnaryMinus(replaced);
  }
  return replaced;
}

function shouldPopOperator(token, topOfStack) {
  if (!topOfStack) return false;
  if (topOfStack === '(') return false;
  const topPrecedence = getPrecedence(topOfStack);
  const tokenPrecedence = getPrecedence(token);
  if (topPrecedence < tokenPrecedence) return false;
  return true;
}

const tokenizer = new RegExp(`(${FUNCTION_NAMES.join('|')}|[+\\-*/()ux,])`, 'g');

function shuntingYard(text) {
  const stack = [];
  const queue = [];

  const tokens = text.split(tokenizer);

  while (tokens.length > 0) {
    const token = tokens.shift();
    if (!token) continue;

    if (isOperator(token)) {
      while (shouldPopOperator(token, stack[0])) {
        queue.push(stack.shift());
      }
      stack.unshift(token);
      if (isFunctionToken(token)) queue.push('END_ARGS');
      continue;
    }
    if (token === '(') {
      stack.unshift(token);
      continue;
    }
    if (token === ',') {
      while (stack.length && stack[0] !== '(') {
        queue.push(stack.shift());
      }
      if (!(stack[0] === '(' && isFunctionToken(stack[1]))) {
        // A comma is ONLY valid when the next thing in the stack is the function call
        throw new Error('Incorrect function call');
      }
      continue;
    }
    if (token === ')') {
      while (stack.length > 0 && stack[0] !== '(') {
        queue.push(stack.shift());
      }
      if (stack[0] === '(') {
        stack.shift();
        if (isFunctionToken(stack[0])) {
          queue.push(stack.shift());
        }
      } else {
        throw new Error('Unmatched parenthesis');
      }
      continue;
    }

    const float = parseFloat(token);
    if (!Number.isNaN(float)) {
      queue.push(float);
      continue;
    }

    throw new Error(`Unrecognised token: ${token}`);
  }

  while (stack.length > 0) {
    queue.push(stack.shift());
  }

  return queue;
}

function processQueue(queue) {
  const stack = [];
  const operations = {
    '+': () => stack.pop() + stack.pop(),
    '-': () => -stack.pop() + stack.pop(),
    '*': () => stack.pop() * stack.pop(),
    '/': () => (1 / stack.pop()) * stack.pop(),
    u: () => -stack.pop(),

    // alias just in case
    x: () => operations['*'](),

    // functions
    max: () => {
      let val = stack.pop();
      let max = -Infinity;
      while (val !== 'END_ARGS') {
        max = Math.max(max, val);
        if (stack.length === 0) throw new Error('No END_ARGS for function "max"');
        val = stack.pop();
      }
      return max;
    },
  };

  while (queue.length > 0) {
    const item = queue.shift();
    if (typeof item === 'number' || item === 'END_ARGS') {
      stack.push(item);
      continue;
    }
    if (operations[item]) {
      stack.push(operations[item]());
      continue;
    }
    throw new Error('Unexpected token', item);
  }

  return stack[0];
}

const noWhitespace = /\s/g;

// Names with a '(' after them are function calls, not variables
// e.g. max(5 + max)
// the first max would not be replaced
const buildVariableReplacer = key => new RegExp(`${key}(?!\\s*\\()`, 'g');

export function runArithmetic(formulaText, values = {}) {
  // first replace variables with their actual values
  // (we do this here rather than treating the variable names as tokens,
  // so that the tokeniser doesn't get confused by variable names with
  // u and x in them)
  let valuedText = formulaText;
  Object.entries(values).forEach(([key, value]) => {
    if (Number.isNaN(parseFloat(value))) {
      throw new Error('Invalid value substitution');
    }

    valuedText = valuedText.replace(buildVariableReplacer(key), value);
  });

  // strip out all whitespace
  const strippedText = valuedText.replace(noWhitespace, '');

  if (strippedText.match(/([(,],)|(,\))/g)) throw new Error('Leading or trailing comma detected');

  // functions are case insensitive
  const lowercaseText = strippedText.toLowerCase();

  // then replace the unary minus with a 'u' so we can
  // handle it differently to subtraction in the tokeniser
  const replacedText = replaceUnaryMinus(lowercaseText);

  // then create a postfix queue using the shunting yard algorithm
  const queue = shuntingYard(replacedText);

  // then process the queue
  return processQueue(queue);
}
