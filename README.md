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
import S from '@superstructure.net/s';

let state = new S();

// set single value
state.set('counter', 123);

// set object value
state.set('lunch', {
    type: 'pizza',
    variation: 'margherita',
});

// deep-set object property
state.set('lunch/variation', 'bufalina');

// The created state tree looks like:
//
// {
//   counter: 123,
//   lunch: {
//     type: 'pizza',
//     variation: 'bufalina'
//   }
// }

state.subscribe('counter', () => {
    // fired when 'counter' is updated.
});

state.subscribe('lunch/variation', () => {
    // fired when 'lunch/table' is updated.
});

state.subscribe('lunch', () => {
    // fired when any property of 'lunch' is updated.
});

// subscribe() returns a subscription ID that can be used to unsubscribe:
let subscriptionId = state.subscribe('lunch', () => {});
state.unsubscribe(subscriptionId);
```
