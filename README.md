# @beyondessential/arithmetic

Utility to evaluate [BODMAS](https://en.wikipedia.org/wiki/Order_of_operations) arithmetic formulas. It is an implementation of the [shunting yard algorithm](https://en.wikipedia.org/wiki/Shunting-yard_algorithm). 

### Installation

**Note:** Since this is a private repository, you will need to authenticate your connection to GitHub, for example via [ssh](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh).

```
yarn add beyondessential/arithmetic
```

### Usage

```js
import { runArithmetic } from '@beyondessential/arithmetic';

const value = runArithmetic('(-1 + 2.5) / 3');
console.log(value); // 0.5

const valueWithVariable = runArithmetic('2 * four', {
  four: 4
});
console.log(valueWithVariable); // 8
```
