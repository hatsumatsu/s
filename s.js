/**
 * 
	//////
  ///     ´
	///
	  /////
  ,     ///
   //////

S

Lean subscription-based state management.

 * 
 */

export class S {
    constructor(initialState) {
        // {
        //   'x': 1,
        //   'y': 'Hi!'
        // }
        this._state = {};

        // [
        //   {
        //      key: 'x'.
        //      callback: () => {},
        //      context: null
        //   }
        // ]
        this._subscriptions = [];

        // {
        //   x: {timeout},
        //   x: {timeout}
        // }
        this._onChangeDelays = {};

        if (initialState !== undefined) {
            this._state = initialState;
        }
    }

    set(key, value = undefined) {
        if (!key || typeof key !== 'string') {
            throw new Error('No key provided.');
        }

        if (value === this._state[key]) {
            return;
        }

        this._state[key] = value;

        this._debounceOnChange(key);
    }

    get(key) {
        if (!key || typeof key !== 'string') {
            throw new Error('No key provided.');
        }

        return this._state[key];
    }

    on(key, callback, context = undefined) {
        if (!key || typeof key !== 'string') {
            throw new Error('No key provided.');
        }

        if (!callback || typeof callback !== 'function') {
            throw new Error('No callback provided.');
        }

        this._subscriptions.push({
            key: key,
            callback: callback,
            context: context,
        });
    }

    off(key, callbackOrContext = undefined) {
        if (!key) {
            if (!callbackOrContext) {
                // .off()
                this._subscriptions = [];
            } else {
                // .off( null, callbackOrContext )
                if (typeof callbackOrContext === 'string') {
                    // callbackOrContext is context
                    this._subscriptions = this._subscriptions.filter(
                        (subscription) => callbackOrContext !== subscription.context
                    );
                } else {
                    // callbackOrContext is callback
                    this._subscriptions = this._subscriptions.filter((subscription) => {
                        return callbackOrContext !== subscription.callback;
                    });
                }
            }
        } else {
            if (!callbackOrContext) {
                // .off( key )
                this._subscriptions = this._subscriptions.filter((subscription) => key !== subscription.key);
            } else {
                // .off( key, callbackOrContext )
                if (typeof callbackOrContext === 'string') {
                    // callbackOrContext is context
                    this._subscriptions = this._subscriptions.filter(
                        (subscription) => key !== subscription.key || callbackOrContext !== subscription.context
                    );
                } else {
                    // callbackOrContext is callback
                    this._subscriptions = this._subscriptions.filter((subscription) => {
                        return key !== subscription.key || callbackOrContext !== subscription.callback;
                    });
                }
            }
        }
    }

    destroy() {
        this._state = {};
        this._subscriptions = [];
        this._onChangeDelays = {};
    }

    _debounceOnChange(key) {
        if (!key || typeof key !== 'string') {
            return;
        }

        if (this._onChangeDelays[key]) {
            clearTimeout(this._onChangeDelays[key]);
        }
        this._onChangeDelays[key] = setTimeout(() => {
            this._onChange(key);
        }, 1);
    }

    _onChange(key) {
        if (this._subscriptions.length < 1) {
            return;
        }

        this._subscriptions.forEach((_subscription) => {
            if (key === _subscription.key) {
                _subscription.callback.call();
            }
        });
    }
}

export class s {
    constructor(initialValue) {
        // 1
        this._value = undefined;

        // [
        //   () => {},
        //   () => {}
        // ]
        this._subscriptions = [];

        this._onChangeDelay = null;

        if (initialValue !== undefined) {
            this._value = initialValue;
        }
    }

    set(value = undefined) {
        if (value === this._value) {
            return;
        }

        this._value = value;

        // debounce onChange();
        if (this._onChangeDelay) {
            clearTimeout(this._onChangeDelay);
        }
        this._onChangeDelay = setTimeout(() => {
            this._onChange();
        }, 1);
    }

    get() {
        return this._value;
    }

    on(callback) {
        if (!callback || typeof callback !== 'function') {
            throw new Error('No callback provided.');
        }

        this._subscriptions.push(callback);
    }

    off(callback = undefined) {
        if (!callback) {
            this._subscriptions = [];
        } else {
            this._subscriptions = this._subscriptions.filter((_callback) => callback !== _callback);
        }
    }

    destroy() {
        this._value = undefined;
        this._subscriptions = [];
        if (this._onChangeDelay) {
            clearTimeout(this._onChangeDelay);
        }
    }

    _onChange() {
        if (this._subscriptions.length < 1) {
            return;
        }

        this._subscriptions.forEach((_callback) => {
            _callback.call();
        });
    }
}
