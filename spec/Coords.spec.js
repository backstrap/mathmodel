// noinspection ES6PreferShortImport

import {toBeDeepCloseTo} from 'jest-matcher-deep-close-to';
import {pi} from '@backstrap/math';
import {Coords} from '../src/Coords';

describe('Coords', () => {
    let subject;

    beforeAll(() => {
        expect.extend({toBeDeepCloseTo});
    })

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
        it('uniformly scales coords', () => {
            expect(subject.scale(2).transform([1, 1, 1])).toEqual([2, 2, 2]);
            expect(subject.scale(2.5).transform([1, 1, 1])).toEqual([5, 5, 5]);
        });
    });

    describe('stretch method', () => {
        it('returns this', () => {
            expect(subject.stretch()).toBe(subject);
        });
        it('non-uniformly scales coords', () => {
            expect(subject.stretch(2).transform([1, 1, 1])).toEqual([2, 1, 1]);
            expect(subject.stretch(2.5, 1, 3).transform([1, 1, 1])).toEqual([5, 1, 3]);
        });
    });

    describe('rotate method', () => {
        it('returns this', () => {
            expect(subject.rotate()).toBe(subject);
            expect(subject.rotate(1, 1)).toBe(subject);
        });
        it('rotates around x axis by default', () => {
            expect(subject.rotate().transform([1, 1, 1])).toEqual([1, 1, 1]);
            expect(subject.rotate(pi).transform([1, 2, 3])).toBeDeepCloseTo([1, -2, -3], 10);
        });
        it('rotates around y', () => {
            expect(subject.rotate().transform([1, 1, 1])).toEqual([1, 1, 1]);
            expect(subject.rotate(pi, 1).transform([1, 2, 3])).toBeDeepCloseTo([-1, 2, -3], 10);
        });
        it('rotates around z', () => {
            expect(subject.rotate().transform([1, 1, 1])).toEqual([1, 1, 1]);
            expect(subject.rotate(pi/2, 2).transform([1, 2, 3])).toBeDeepCloseTo([-2, 1, 3], 10);
        });
    });

    describe('rotateTo method', () => {
        it('returns this', () => {
            expect(subject.rotateTo([1, 0, 0], [1, 2, 3])).toBe(subject);
        });
        it('rotates the axes', () => {
            subject.rotateTo([1, 2, 3], [3, 2, 1]);
            expect(subject.transform([1, 2, 3]))
                .toBeDeepCloseTo([3, 2, 1], 10);
        });
        it('is a no-op for bad values', () => {
            jest.spyOn(subject, 'rotate');
            subject.rotateTo([1, 0, 0], [0, 0, 0]);
            expect(subject.rotate).not.toHaveBeenCalled();
        });
    });

    describe('quaternion method', () => {
        it('returns this', () => {
            expect(subject.quaternion([0, 0, 0, 0])).toBe(subject);
            expect(subject.quaternion([1, 1, 0, 0])).toBe(subject);
        });
        it('rotates the axes', () => {
            subject.quaternion([1, 2, 3, 4]);
            expect(subject.transform([1, 2, 3]))
                .toBeDeepCloseTo([1.8, 2, 2.6], 10);
        });
    });

    describe('resetTransform method', () => {
        it('returns this', () => {
            expect(subject.resetTransform()).toBe(subject);
        });
        it('resets the transformation matrix to identity', () => {
            subject.resetTransform();
            expect(subject.transform([0, 0, 0])).toEqual([0, 0, 0]);
            expect(subject.transform([1, 0, 0])).toEqual([1, 0, 0]);
            expect(subject.transform([0, 1, 0])).toEqual([0, 1, 0]);
            expect(subject.transform([0, 0, 1])).toEqual([0, 0, 1]);
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
