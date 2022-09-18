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

    describe('grey method', () => {
        it('returns this', () => {
            expect(subject.grey(0)).toBe(subject);
        });
        it('sets saturation and lightness', () => {
            subject.grey(0);
            expect(subject.options().color).toBe('hsl(200,0%,0%)');
            subject.grey(50);
            expect(subject.options().color).toBe('hsl(200,0%,50%)');
        });
        it('rounds value to 3 decimal places', () => {
            subject.grey(50.1234);
            expect(subject.options().color).toBe('hsl(200,0%,50.123%)');
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
