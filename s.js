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

export default class S {
    constructor() {
        this._state = {};
        this._subscriptionId = 0;
        this._subscriptions = [];
    }

    init(key, value = null) {
        this.set(key, value, true);
    }

    set(key, value = null, checkSubscriptions = true) {
        if (!key || typeof key !== 'string') {
            throw new Error('No key of type string provided.');
        }

        let keys = key.split('/');
        let root = this._state;
        for (let i = 0; i < keys.length; i++) {
            if (!root.hasOwnProperty(keys[i]) || typeof root[keys[i]] !== 'object') {
                root[keys[i]] = {};
            }

            if (i === keys.length - 1) {
                root[keys[i]] = value;
            }

            root = root[keys[i]];
        }

        if (checkSubscriptions) {
            this._checkSubscriptions(key);
        }
    }

    get(key) {
        if (!key || typeof key !== 'string') {
            throw new Error('No key of type string provided.');
        }

        let keys = key.split('/');
        let root = this._state;
        for (let i = 0; i < keys.length; i++) {
            if (!root.hasOwnProperty(keys[i])) {
                return false;
            }

            if (i === keys.length - 1) {
                return root[keys[i]];
            }

            root = root[keys[i]];
        }
    }

    subscribe(key, handler) {
        if (!key || typeof key !== 'string') {
            throw new Error('No key of type string provided.');
        }

        if (!handler || typeof handler !== 'function') {
            throw new Error('No handler of type function provided.');
        }

        if (!this._subscriptions.hasOwnProperty(key)) {
            this._subscriptions[key] = [];
        }

        this._subscriptionId = this._subscriptionId + 1;

        this._subscriptions[key].push({
            id: this._subscriptionId,
            handler: handler,
        });

        return this._subscriptionId;
    }

    unsubscribe(subscriptionId) {
        if (!subscriptionId) {
            throw new Error('No subscription ID provided.');
        }

        for (const key in this._subscriptions) {
            this._subscriptions[key] = this._subscriptions[key].filter((subscription) => {
                return subscription.id !== subscriptionId;
            });
        }
    }

    _checkSubscriptions(key = '') {
        if (!key || typeof key !== 'string') {
            throw new Error('No key of type string provided.');
        }

        let keys = key.split('/');
        for (let i = keys.length; i > 0; i--) {
            let _key = keys.slice(0, i).join('/');

            if (!this._subscriptions.hasOwnProperty(_key)) {
                continue;
            }

            for (const subscription of this._subscriptions[_key]) {
                if (!subscription.hasOwnProperty('handler') || typeof subscription.handler !== 'function') {
                    return;
                }

                subscription.handler.call();
            }
        }
    }
}
