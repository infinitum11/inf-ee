import {EventSet, IEventEmitter} from "../Contracts";
import EventRunnerDefault from "./EventRunnerDefault";

export default class EventRunnerNTimes<ESet extends EventSet, EventName extends keyof ESet> extends EventRunnerDefault<ESet, EventName> {
    private i = 0;

    constructor(emitter: IEventEmitter<ESet>, handler: ESet[EventName], private total = 1) {
        super(emitter, handler);
        if(this.total < 1) {
            throw new Error(`{total} can not be less than 1`);
        }
    }

    run(eventName: EventName, ...args: Parameters<ESet[EventName]>): void {
        super.run(eventName, ...args);
        if(++this.i >= this.total) {
            this.emitter.off(eventName, this.handler);
        }
    }
}