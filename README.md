```
    //////
  ///     ´
    ///
      /////
  ,     ///
   //////
```

Lean subscription-based state management.

### Installation

`npm install @superstructure.net/s`

### Usage

```js
import { S } from '@superstructure.net/s';

// Init state object with key:value pairs
const state = new S({
  x: 0,
  message: 'Hi!'
});

// Set value
state.set('x', 1);

// Get value
state.get('x'); // 1

// Subscribe to changes
const onChangeX = () => {
  console.log('x changed', state.get('x'));
};

state.on('x', onChangeX);

// Unsubscribe
// 1. Unsubscribe specific callback
state.off('x', onChangeX);
// 2. Unsubscribe all callbacks attached to a key
state.off('x');
// 3. Unsubscribe all callbacks
state.off();

// Destroy instance
state.destroy();
```

### Notes

Subscriptions are debounced per key, updating a value frequently only calls its callbacks once:

```js
state.on('x', () => {
  console.log('x changed', state.get('x'));
});

state.set('x', 1);
state.set('x', 2);
state.set('x', 3);
state.set('x', 4);

// Only logs 'x changed 4'
```

### Atomic state

Instead of having a state tree with ky value pairs you can also use atomic state items with `s` instead of `S`.

```js
import { s } from '@superstructure.net/s';

// Init state
const x = new s(0);
const message = new s('Hi!');

// Set value
x.set(1);

// Get value
x.get(); // 1

// Subscribe to changes
const onChangeX = () => {
  console.log('x changed', x.get());
};

x.on(onChangeX);

// Unsubscribe
// 1. Unsubscribe specific callback
x.off(onChangeX);
// 2. Unsubscribe all callbacks
x.off();

// Destroy instance
state.destroy();
```
