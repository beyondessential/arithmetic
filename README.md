# @beyondessential/arithmetic

Utility to evaluate [BODMAS](https://en.wikipedia.org/wiki/Order_of_operations) arithmetic formulas. It is an implementation of the [shunting yard algorithm](https://en.wikipedia.org/wiki/Shunting-yard_algorithm).

## Installation

With `yarn`:

```
yarn add @beyondessential/arithmetic
```

With `npm`:

```
npm add @beyondessential/arithmetic
```

## API

`formulaText` must be in [BODMAS](https://en.wikipedia.org/wiki/Order_of_operations) format.

### `runArithmetic(formulaText: string, values?: Record<string, string | number>): number`

Usage example:

```js
import { runArithmetic } from '@beyondessential/arithmetic';

const value = runArithmetic('(-1 + 2.5) / 3');
console.log(value); // 0.5

const valueWithVariable = runArithmetic('2 * four', {
  four: 4,
});
console.log(valueWithVariable); // 8
```

### `getVariables(formulaText: string): string[]`

Usage example:

```js
import { getVariables } from '@beyondessential/arithmetic';

const variables = getVariables('(-a * b - 1) / (c + 3)');
console.log(variables); // ['a', 'b', 'c']
```

## formulaText operators
Note: All operators are case **in**sensitive.
Operator | Example | Description
-|-|-
 `+` | `1 + 1` | Addition
 `-` | `1 - 1` | Subtraction
`*` or `x` | `1 * 1` or `1 x 1` | Multiplication
`/` | `1 / 1` | Division
`()`| `1 / (1 + 1)` | Brackets
`-` | `-1` | Unary minus
`max` | `max(1, 2, 3)` | Takes the maximum value of it's arguments. `-Infinity` if given none
