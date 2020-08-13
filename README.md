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

// SET
// set single value
state.set('counter', 123);

// set object value
state.set('lunch', {
    type: 'pizza',
    variation: 'margherita',
});

// deep-set object property
state.set('lunch/variation', 'bufalina');

// The state tree
//
// {
//   counter: 123,
//   lunch: {
//     type: 'pizza',
//     variation: 'bufalina'
//   }
// }

// GET
state.get('counter'); // 123
state.get('lunch/type'); // 'pizza'

// SUBSCRIBE
state.subscribe('counter', () => {
    // fired when 'counter' is updated.
});

state.subscribe('lunch/variation', () => {
    // fired when 'lunch/variation' is updated.
});

state.subscribe('lunch', () => {
    // fired when 'lunch' or any of its child properties is updated.
});

// UNSUBSCRIBE
// subscribe() returns a subscription ID that can be used to unsubscribe:
let subscriptionId = state.subscribe('lunch', () => {});
state.unsubscribe(subscriptionId);
```
