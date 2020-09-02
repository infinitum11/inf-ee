import { EventEmitter } from "../src/EventEmitter";
import Spy = jasmine.Spy;

type User = {
    id: number
    name: string
}

type EventSet = {
    void: () => void,
    str: (s: string) => void,
    num: (n: number) => void,
    strNum: (s: string, n: number) => void,
    user: (u: User) => void;
}

describe(`Event emitter`, function () {
    let e : EventEmitter<EventSet>;

    beforeEach(()=> {
        e = new EventEmitter<EventSet>();
    });

    describe(`hasEventListener`, function () {
        it(`should not have event listener`, function () {
            const handlerStr = (s: string) => {};
            expect(e.has("str", handlerStr)).toBe(false);
        });
    });

    describe(`addEventListener`, function () {
        it(`should add event listener`, function () {
            const handlerNum = (n: number) => {};
            e.on("num", handlerNum);
            expect(e.has("num", handlerNum)).toBe(true);
        });
    });

    describe(`addEventListenerOnce`, function () {
        it(`should add event listener`, function () {
            const handlerVoid = () => {};
            e.once('void', handlerVoid);
            expect(e.has('void', handlerVoid)).toBe(true);
        });
    });

    describe(`removeListener`, function () {
        it(`should remove single event listener`, function () {
            const handlerNum = (num: number) => {};
            e.on('num', handlerNum);
            e.on('num', handlerNum);

            e.off('num', handlerNum);
            expect(e.has('num', handlerNum)).toBe(false);
        });
    });

    describe(`removeEventListenersByName`, function () {
        it(`should remove all event listeners by name`, function () {
            const handlerNum1 = (num: number) => {};
            const handlerNum2 = (num: number) => {};
            const handlerStr = (str: string) => {};

            e.on('num', handlerNum1);
            e.on('num', handlerNum2);
            e.on('str', handlerStr);

            e.offByName('num');

            expect(e.has('num', handlerNum1)).toBe(false);
            expect(e.has('num', handlerNum2)).toBe(false);
            expect(e.has('str', handlerStr)).toBe(true);
        });
    });

    describe(`removeAllEventListeners`, function () {
        it(`should remove all event listeners`, function () {
            const handlerVoid = () => {};
            const handlerStrNum = (str: string, num: number) => {};

            e.on('void', handlerVoid);
            e.on('strNum', handlerStrNum);

            e.offAll();

            expect(e.has('void', handlerVoid)).toBe(false);
            expect(e.has('strNum', handlerStrNum)).toBe(false);
        });
    });

    describe(`emit`, function () {
        const user = {
            name: "Infinitum",
            id: 11,
        };
        const user2 = {
            name: "Nigma",
            id: 20,
        };

        let userSpy : Spy;
        let strNumSpy : Spy;
        let strNumSpy2: Spy;

        beforeEach(function () {
            userSpy = jasmine.createSpy('userSpy');
            strNumSpy = jasmine.createSpy('strNumSpy');
            strNumSpy2 = jasmine.createSpy('strNumSpy2');
        });

        it(`should emit event listener`, function () {
            e.on('strNum', strNumSpy);
            e.emit('strNum', 'Age', 29);

            expect(strNumSpy).toHaveBeenCalledWith('Age', 29);
        });

        it(`should emit event listener only once`, function () {
            e.once('user', userSpy);
            e.emit('user', user);
            e.emit('user', user2);

            expect(userSpy).toHaveBeenCalledWith(user);
            expect(userSpy).toHaveBeenCalledTimes(1);
        });

        it(`should not emit event listener after removal listener`, function () {
            e.on('strNum', strNumSpy);
            e.off('strNum', strNumSpy);
            e.emit('strNum', 'Infinitum', 11);

            expect(strNumSpy).not.toHaveBeenCalled();
        });

        it(`should not emit event listener after removal listeners by event group name`, function () {
            e.on('strNum', strNumSpy);
            e.on('strNum', strNumSpy2);

            e.offByName('strNum');
            e.emit('strNum', 'Infinitum', 11);

            expect(strNumSpy).not.toHaveBeenCalled();
            expect(strNumSpy2).not.toHaveBeenCalled();
        });

        it(`should not emit event listener after removal all listeners`, function () {
            e.on('strNum', strNumSpy);
            e.on('user', userSpy);

            e.offAll();
            e.emit('strNum', 'Infinitum', 11);
            e.emit('user', user);

            expect(strNumSpy).not.toHaveBeenCalled();
            expect(userSpy).not.toHaveBeenCalled();
        });
    });
});