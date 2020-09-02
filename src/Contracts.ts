export type EventSet = Record<string, (...args: any[]) => void>

export type EventListenerStorage<ESet extends EventSet> = {
    [EventName in keyof ESet] ?: Array<IHandlerRunner<ESet, EventName>>
}

export interface IEventEmitter<ESet extends EventSet> {
    on<EventName extends keyof ESet>(eventName: EventName, handler: ESet[EventName]): void
    once<EventName extends keyof ESet>(eventName: EventName, handler: ESet[EventName]): void
    off<EventName extends keyof ESet>(eventName: EventName, handler: ESet[EventName]) : void
    offByName<EventName extends keyof ESet>(eventName: EventName) : void
    offAll() : void
    emit<EventName extends keyof ESet>(eventName: EventName, ...args: Parameters<ESet[EventName]>): void
    has<EventName extends keyof ESet>(eventName: EventName, handler: ESet[EventName]): boolean
}

export interface IHandlerRunner<ESet extends EventSet, EventName extends keyof ESet> {
    run(eventName: EventName, ...args: Parameters<ESet[EventName]>): void
    getHandler(): ESet[EventName]
}