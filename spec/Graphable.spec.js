// noinspection ES6PreferShortImport

import {Graphable} from '../src/Graphable';

describe('Graphable', () => {
    /** @type {Graphable} */
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
        it('returns a new copy each time', () => {
            expect(subject.options()).not.toBe(subject.options());
        });
    });

    describe('setOptions method', () => {
        it('returns this', () => {
            expect(subject.setOptions({opacity: 0.5})).toBe(subject);
        });
        it('changes option values', () => {
            const opts = {opacity: 0.5};
            expect(subject.options()).not.toMatchObject(opts);
            subject.setOptions(opts);
            expect(subject.options()).toMatchObject(opts);
        });
    });

    describe('setSubOptions method', () => {
        it('returns this', () => {
            expect(subject.setSubOptions({translation: {step: 1}})).toBe(subject);
        });
        it('changes option values', () => {
            const opts = {translation: {step: 1}};
            expect(subject.options()).not.toMatchObject(opts);
            subject.setOptions(opts);
            expect(subject.options()).toMatchObject(opts);
        });
    });

    describe('opacity method', () => {
        it('returns this', () => {
            expect(subject.opacity(0)).toBe(subject);
        });
        it('changes the opacity', () => {
            const opts = {opacity: 0.5};
            expect(subject.options()).not.toMatchObject(opts);
            subject.opacity(opts.opacity);
            expect(subject.options()).toMatchObject(opts);
        });
    });

    describe('color method', () => {
        it('returns this', () => {
            expect(subject.color('#ffffff')).toBe(subject);
        });
        it('changes the color', () => {
            const opts = {color: 'blue'};
            expect(subject.options()).not.toMatchObject(opts);
            subject.color(opts.color);
            expect(subject.options()).toMatchObject(opts);
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
            subject.grey(0);
            expect(subject.options().color).toBe('hsl(200,0%,0%)');
        });
        it('rounds value to 3 decimal places', () => {
            subject.grey(50.1234);
            expect(subject.options().color).toBe('hsl(200,0%,50.123%)');
        });
        it('defaults to zero', () => {
            subject.grey();
            expect(subject.options().color).toBe('hsl(200,0%,0%)');
        });
    });

    describe('hue method', () => {
        it('returns this', () => {
            expect(subject.hue(0)).toBe(subject);
        });
        it('sets hue', () => {
            subject.hue(0);
            expect(subject.options().color).toBe('hsl(0,95%,50%)');
            subject.hue(50);
            expect(subject.options().color).toBe('hsl(50,95%,50%)');
            subject.hue(0);
            expect(subject.options().color).toBe('hsl(0,95%,50%)');
        });
        it('rounds to tenths', () => {
            subject.hue(100.0004);
            expect(subject.options().color).toBe('hsl(100,95%,50%)');
            subject.hue(100.0006);
            expect(subject.options().color).toBe('hsl(100.001,95%,50%)');
        });
        it('defaults to zero', () => {
            subject.hue();
            expect(subject.options().color).toBe('hsl(0,95%,50%)');
        });
    });

    describe('saturation method', () => {
        it('returns this', () => {
            expect(subject.saturation(0)).toBe(subject);
        });
        it('sets saturation', () => {
            subject.saturation(0);
            expect(subject.options().color).toBe('hsl(200,0%,50%)');
            subject.saturation(50);
            expect(subject.options().color).toBe('hsl(200,50%,50%)');
            subject.saturation(0);
            expect(subject.options().color).toBe('hsl(200,0%,50%)');
        });
        it('rounds to tenths', () => {
            subject.saturation(10.0004);
            expect(subject.options().color).toBe('hsl(200,10%,50%)');
            subject.saturation(10.0006);
            expect(subject.options().color).toBe('hsl(200,10.001%,50%)');
        });
        it('defaults to zero', () => {
            subject.saturation();
            expect(subject.options().color).toBe('hsl(200,0%,50%)');
        });
    });

    describe('lightness method', () => {
        it('returns this', () => {
            expect(subject.lightness(0)).toBe(subject);
        });
        it('sets lightness', () => {
            subject.lightness(0);
            expect(subject.options().color).toBe('hsl(200,95%,0%)');
            subject.lightness(50);
            expect(subject.options().color).toBe('hsl(200,95%,50%)');
            subject.lightness(0);
            expect(subject.options().color).toBe('hsl(200,95%,0%)');
        });
        it('rounds to tenths', () => {
            subject.lightness(10.0004);
            expect(subject.options().color).toBe('hsl(200,95%,10%)');
            subject.lightness(10.0006);
            expect(subject.options().color).toBe('hsl(200,95%,10.001%)');
        });
        it('defaults to zero', () => {
            subject.lightness();
            expect(subject.options().color).toBe('hsl(200,95%,0%)');
        });
    });
});
