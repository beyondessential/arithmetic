# @beyondessential/arithmetic

Utility to evaluate [BODMAS](https://en.wikipedia.org/wiki/Order_of_operations) arithmetic formulas. It is an implementation of the [shunting yard algorithm](https://en.wikipedia.org/wiki/Shunting-yard_algorithm).

### Installation

```
# Install a specific version (recommended)
yarn add beyondessential/arithmetic#v1.1.0

# Install the current latest version
# Will get updated to the latest version automatically every time `yarn install` is run
yarn add beyondessential/arithmetic

```

`npm` can also be used in place of `yarn` in the commands above.

### Usage

```js
import { runArithmetic } from '@beyondessential/arithmetic';

const value = runArithmetic('(-1 + 2.5) / 3');
console.log(value); // 0.5

const valueWithVariable = runArithmetic('2 * four', {
  four: 4,
});
console.log(valueWithVariable); // 8
```
