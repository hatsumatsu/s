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

> Note: This library comes as es6 module only.
> If you use a transpiler like babel or swc make sure to include `/node_modules/@superstructure.net/s` in your transpiler’s config.

### Usage

```js
import { S } from '@superstructure.net/s';

// Init state object with key:value pairs
const state = new S({
    x: 0,
    message: 'Hi!',
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

// pass optional context for bulk unsubscription
state.on('x', onChangeX, 'myContext');

// Unsubscribe ...
// ... key + callback
state.off('x', onChangeX);
// ... key + context
state.off('x', 'myContext');
// ... key
state.off('x');
// ... callback
state.off(null, onChangeX);
// ... context
state.off(null, 'myContext');
// ... all
state.off();

// Destroy instance
state.destroy();
```

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

Be aware that debouncing means subscriptions are async:

```js
state.on('x', () => {
    console.log('x changed', state.get('x'));
});

console.log('A');

state.set('x', 1);

console.log('B');

// Log order:
//    'A'
//    'B'
//    'x changed 1'
```

### API

`set( key, value, immediate = false, triggerWhenEqual = false )`

-   `key`
-   `value`
-   `immediate` By default subscriptions are debounced by key. Set to `true` to trigger subscriptions immediately instead.
-   `triggerWhenEqual` By default subscriptions are not triggered if `new value === previous value`. Set to `true` to always call subscriptions.

`get( key )`

-   `key`

`toggle( key, immediate = false, triggerWhenEqual = false )`

Same as `set()` but toggles a boolean value.

`on( keys, callback, context = undefined )`

-   `keys` one or more keys separated by space
-   `callback`
-   `context` optional context string for bulk unsubscription

`off()`

-   `key` Optional. Set to select which subscriptions to unsubscribe.
-   `(callback|context)` Optional. Set to select which subscriptions to unsubscribe.

### Atomic state

Instead of having a state tree with `key:value` pairs you can also use atomic state items with `s` instead of `S`.

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

// Unsubscribe ...
// ... specific callback
x.off(onChangeX);
// ... Unsubscribe all callbacks
x.off();

// Destroy instance
state.destroy();
```

### API

`set( value, immediate = false, triggerWhenEqual = false )`

-   `value`
-   `immediate` By default subscriptions are debounced. Set to `true` to trigger subscriptions immediately instead.
-   `triggerWhenEqual` By default subscriptions are not triggered if `new value === previous value`. Set to `true` to call always subscriptions.

`get()`

`on( callback )`

-   `key`
-   `callback`

`off( callback = undefined )`

-   `callback` Optional. Set to select which subscriptions to unsubscribe.
