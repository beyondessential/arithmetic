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

### `getOperands(formulaText: string): string[]`

Usage example:

```js
import { getOperands } from '@beyondessential/arithmetic';

const operands = getOperands('(-a * b) / 3');
console.log(value); // ['a', 'b', '3']
```
