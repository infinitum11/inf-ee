import { EventListenerStorage, EventSet, IEventEmitter, IHandlerRunner } from "./Contracts";
import EventRunnerDefault from "./event_runners/EventRunnerDefault";
import EventRunnerNTimes from "./event_runners/EventRunnerNTimes";

export class EventEmitter <ESet extends EventSet> implements IEventEmitter<EventSet> {
    private _events : EventListenerStorage<ESet> = Object.create(null);

    on<EventName extends keyof ESet>(eventName: EventName, handler: ESet[EventName]): void {
        this._addEventListener(eventName, new EventRunnerDefault(this, handler));
    }

    once<EventName extends keyof ESet>(eventName: EventName, handler: ESet[EventName]): void {
        this._addEventListener(eventName, new EventRunnerNTimes(this, handler, 1));
    }

    off<EventName extends keyof ESet>(eventName: EventName, handler: ESet[EventName]): void {
        const events = this._events[eventName];
        if(!events?.length) {
            return;
        }
        this._events[eventName] = events.filter(h => h.getHandler() !== handler);
    }

    offByName<EventName extends keyof ESet>(eventName: EventName) : void {
        const events = this._events[eventName];
        if(events === undefined) {
            return;
        }
        events.length = 0;
        delete this._events[eventName];
    }

    offAll() : void {
        Object.keys(this._events).forEach(eventName => {
            const events = this._events[eventName];
            if(events) {
                events.length = 0;
            }
        });
        this._events = Object.create(null);
    }

    emit<EventName extends keyof ESet>(eventName: EventName, ...args: Parameters<ESet[EventName]>): void {
        const events = this._events[eventName];
        if(events) {
            events.forEach(handler => handler.run(eventName, ...args));
        }
    }

    has<EventName extends keyof ESet>(eventName: EventName, handler: ESet[EventName]): boolean {
        const events = this._events[eventName];
        if(!events) {
            return false;
        }
        for(let i = 0; i < events.length; i++) {
            if(events[i].getHandler() === handler) {
                return true;
            }
        }
        return false;
    }

    private _addEventListener<EventName extends keyof ESet>(eventName: EventName, runner: IHandlerRunner<ESet, EventName>) {
        const events = this._events[eventName];
        if(Array.isArray(events)) {
            events.push(runner);
        } else {
            this._events[eventName] = [runner];
        }
    }
}