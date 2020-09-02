import EventRunnerAbstract from "./EventRunnerAbstract";
import {EventSet} from "../Contracts";

export default class EventRunnerDefault<ESet extends EventSet, EventName extends keyof ESet> extends EventRunnerAbstract<ESet, EventName> {
    run(eventName: EventName, ...args: Parameters<ESet[EventName]>): void {
        this.handler.apply(null, args);
    }
}
