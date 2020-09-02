# Type Safe Event Emitter

Simple event emitter for any Javascript runtime environment (browser, nodejs, etc...).<br>
Uses Typescript's type inference feature to provide type safety for consumer and producer.

##### Table of contents
+ [TL;DR](#tldr)
+ [Installation](#installation)
    - [Command Line](#command-line)
    - [CDN](#cdn)
+ [Usage](#usage)
    - [Typescript](#typescript)
    - [NodeJS](#nodejs)
    - [ES6 Modules](#es6-modules)
    - [Browser](#browser)
+ [Producer / Consumer example](#producer--consumer-example)
+ [API Reference](#api-reference)
+ [Tests](#tests)
+ [LICENSE](#license)

## TL;DR

```typescript
import {EventEmitter} from "inf-ee";

type EventSet = {
    data: (str: string) => void
}
const ee = new EventEmitter<EventSet>();
ee.on(`data`, (data) => {
    console.log(`Received data: ${data.toUpperCase()}`);
});
ee.emit(`data`, `Important info`);
```

## Installation

### Command line
```bash
$ npm install --save inf-ee
```

### CDN

```text
https://unpkg.com/inf-ee@latest/dist/browser/event-emitter.min.js
```

## Usage

### Typescript

```typescript
import {EventEmitter} from "inf-ee";

type EventSet = {
    data: (str: string) => void
}
const ee = new EventEmitter<EventSet>();
ee.on(`data`, data => {
    console.log(`Received data: ${data.toUpperCase()}`);
});
ee.emit(`data`, `Important info`);
```

### NodeJS

```javascript
const EventEmitter = require('inf-ee').EventEmitter;

const e = new EventEmitter();

e.on('greet', function (name) {
    console.log(`Hi, ${name}`);
});

e.emit('greet', 'John');
```

### ES6 Modules
```javascript
import { EventEmitter } from "inf-ee";

const e = new EventEmitter();

e.on('data', data => console.log(data));

e.emit('data', 'Data chunk');
```

### Browser

```html
<script src="//unpkg.com/inf-ee@latest/dist/browser/event-emitter.min.js"></script>
<script>
    var ee = new InfEE();
    ee.on('greet', function (name) {
        console.log('Hi, ' + name);
    });
    ee.emit('greet', 'John');
</script>
```

## Producer / Consumer example

### producer.ts

1. Producer constructs a type `EventSet` with a set of properties `EventName` of type `Event Handler`.
2. Producer exposes `on`, `once`, `off` methods for consumer in order to subscribe / unsubscribe to internal events.
3. Producer `emit`s events passing the supplied arguments to each handler.

```typescript
// ----- producer.ts

import {EventEmitter} from "inf-ee";

type MathAction = 'multiplication' | 'division';

type EventSet = {
    mathAction: (action: MathAction, oldValue: number, newValue: number) => void
    error: (err: string) => void
}

export class NumberManipulation {
    private _ee = new EventEmitter<EventSet>();

    constructor(private _num = 0) {}

    multiplication(n: number) {
        const old = this._num;
        this._num *= n;
        this._ee.emit('mathAction', 'multiplication', old, this._num);
        return this;
    }

    division(n: number) {
        if(n === 0) {
            this._ee.emit('error', `Can't divide by zero`);
            return this;
        } else {
            const old = this._num;
            this._num /= n;
            this._ee.emit('mathAction', 'division', old, this._num);
            return this;
        }
    }

    on<EventName extends keyof EventSet>(eventName: EventName, handler: EventSet[EventName]) {
        this._ee.on(eventName, handler);
    }

    once<EventName extends keyof EventSet>(eventName: EventName, handler: EventSet[EventName]) {
        this._ee.once(eventName, handler);
    }

    off<EventName extends keyof EventSet>(eventName: EventName, handler: EventSet[EventName]) {
        this._ee.off(eventName, handler);
    }
}
```
### consumer.ts

1. Consumer subscribes to events.
2. Consumer invokes object's methods and gets notified.
```typescript
// ----- consumer.ts

import { NumberManipulation } from "./NumberManipulation";

const m = new NumberManipulation(1);

m.once('mathAction', () => {
    console.log(`I run only once`);
});
m.on('mathAction', (action, oldValue, newValue) => {
    console.log(`${action}: Old value is ${oldValue}. New value is ${newValue}`);
});
m.on('error', err => {
    console.log(`Error! ${err}`);
});

m.multiplication(2).multiplication(6).division(3).division(0);
```

### output
```text
I run only once
multiplication: Old value is 1. New value is 2
multiplication: Old value is 2. New value is 12
division: Old value is 12. New value is 4
Error! Can't divide by zero
```

## API Reference

<a name="api_on" href="#api_on">#</a> **on**(`eventName:` string | symbol | number, `handler:` Function) : void

Adds the `handler` to the end of the listeners array for the `eventName`. No checks are made to see if the `handler` has already been added. Multiple calls passing the same combination of `eventName` and `handler` will result in the listener being added, and called, multiple times.

---

<a name="api_once" href="#api_once">#</a> **once**(`eventName:` string | symbol | number, `handler:` Function) : void

Adds a one-time `handler` function for the `eventName`. The next time `eventName` is triggered, this `handler` is invoked and then removed.

---

<a name="api_off" href="#api_off">#</a> **off**(`eventName:` string | symbol | number, `handler:` Function) : void

Removes the specified `handler` from the listener array for the `eventName`. If the `handler` has been added multiple times, then all references of that `handler` will be removed. 

---

<a name="api_offByName" href="#api_offByName">#</a> **offByName**(`eventName:` string | symbol | number) : void

Removes all handlers, or those of the specified `eventName`. **It's bad practice. Use on own risk.**

---

<a name="api_offAll" href="#api_offAll">#</a> **offAll**() : void

Removes all handlers of all events. **It's bad practice. Use on own risk.**

---

<a name="api_has" href="#api_has">#</a> **has**(`eventName:` string | symbol | number, `handler:` Function): boolean

Checks whether a `handler` has been attached to `eventName`

---

<a name="api_has" href="#api_has">#</a> **emit**(`eventName:` string | symbol | number, `...args:` Parameters\<Function\>): void

Synchronously calls each of the handlers registered for the `eventName`, in the order they were registered, passing the supplied `...args` to each.

## Tests

This module is well tested. You can run tests by executing the following command.
```bash
$ npm run test
```

## LICENSE

[MIT](LICENSE)