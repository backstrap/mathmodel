// noinspection ES6PreferShortImport

import {Graphable} from '../src/Graphable';

describe('Graphable', () => {
    let subject;

    beforeEach(() => {
        subject = new Graphable();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('options method', () => {
        it('returns an options object with a default color', () => {
            expect(subject.options()).toStrictEqual({"color": "hsl(200,95%,50%)"});
        });
    });

    describe('setOptions method', () => {
        it('returns this', () => {
            expect(subject.setOptions({test: 'test'})).toBe(subject);
        });
    });

    describe('opacity method', () => {
        it('returns this', () => {
            expect(subject.opacity(0)).toBe(subject);
        });
    });

    describe('color method', () => {
        it('returns this', () => {
            expect(subject.color('#ffffff')).toBe(subject);
        });
    });

    describe('hue method', () => {
        it('returns this', () => {
            expect(subject.hue(0)).toBe(subject);
        });
    });

    describe('saturation method', () => {
        it('returns this', () => {
            expect(subject.saturation(0)).toBe(subject);
        });
    });

    describe('lightness method', () => {
        it('returns this', () => {
            expect(subject.lightness(0)).toBe(subject);
        });
    });
});
