# flatten
### `flatten( Array ) Array`
Flatten an input array of nested arrays and values to an array of depth 1.

Example:

```js
const { flatten } = require("./src/flatten");

flatten([
    [1, 2],
    [3, 4]
]); // [1, 2, 3, 4]
```

### Testing
Install the development dependencies with `yarn` or `npm`:

    $ yarn

And execute the Jest test suite:

    $ npm test

To lint the files:

    $ npm run lint

License: MIT
