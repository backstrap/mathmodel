// noinspection ES6PreferShortImport

import {Coords} from '../src/Coords';

describe('Coords', () => {
    let subject;

    beforeEach(() => {
        subject = new Coords();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('has a "dv" member', () => {
        expect(subject.dv).toBe(100);
    });

    describe('translate method', () => {
        it('returns this', () => {
            expect(subject.translate()).toBe(subject);
        });
        it('adds translations', () => {
            expect(subject.translate(1, 0, 0).transform([0, 0, 0])).toEqual([1, 0, 0]);
            expect(subject.translate(1, 0, 0).transform([0, 0, 0])).toEqual([2, 0, 0]);
        });
    });

    describe('scale method', () => {
        it('returns this', () => {
            expect(subject.scale()).toBe(subject);
        });
    });

    describe('stretch method', () => {
        it('returns this', () => {
            expect(subject.stretch()).toBe(subject);
        });
    });

    describe('rotate method', () => {
        it('returns this', () => {
            expect(subject.rotate()).toBe(subject);
            expect(subject.rotate(1, 1)).toBe(subject);
            expect(subject.rotate(1, 2)).toBe(subject);
        });
    });

    describe('quaternion method', () => {
        it('returns this', () => {
            expect(subject.quaternion([0, 0, 0, 0])).toBe(subject);
            expect(subject.quaternion([1, 1, 0, 0])).toBe(subject);
        });
    });

    describe('resetTransform method', () => {
        it('returns this', () => {
            expect(subject.resetTransform()).toBe(subject);
        });
    });

    describe('dupe method', () => {
        it('returns new object of same type', () => {
            expect(subject.dupe()).not.toBe(subject);
            expect(subject.dupe() instanceof Coords).toBeTruthy();
        });
    });

    describe('transform method', () => {
        it('returns a transformed 3-vector', () => {
            expect(subject.transform([0, 0, 0])).toEqual([0, 0, 0]);
            expect(subject.transform([1, 2, 3])).toEqual([1, 2, 3]);
        });
    });

    describe('orient method', () => {
        it('returns a re-oriented 3-vector', () => {
            expect(subject.orient([0, 0, 0])).toEqual([0, 0, 0]);
            expect(subject.translate(1).orient([1, 2, 3])).toEqual([1, 2, 3]);
        });
    });
});
