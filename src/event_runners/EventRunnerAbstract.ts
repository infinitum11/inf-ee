import {EventSet, IEventEmitter, IHandlerRunner} from "../Contracts";

export default abstract class EventRunnerAbstract<ESet extends EventSet, EventName extends keyof ESet> implements IHandlerRunner<ESet, EventName> {
    constructor(protected emitter: IEventEmitter<ESet>, protected handler: ESet[EventName]) {}

    getHandler(): ESet[EventName] {
        return this.handler;
    }

    abstract run(eventName: EventName, ...args: Parameters<ESet[EventName]>): void
}