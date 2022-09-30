// noinspection ES6PreferShortImport

import {Shape} from '../src/Shape';

describe('Shape', () => {
    let subject;

    beforeEach(() => {
        subject = new Shape();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('style method', () => {
        it('returns this', () => {
            expect(subject.style('wireframe')).toBe(subject);
        });
        it('returns this', () => {
            expect(subject.style('surface')).toBe(subject);
        });
        it('returns this', () => {
            expect(subject.style('invalid')).toBe(subject);
        });
    });

    describe('curve method', () => {
        it('returns Geometry array', () => {
            const actual = subject.curve(() => [0, 0, 0], [0, 1, 1]);
            expect(actual.length).toEqual(1);
            expect(actual[0].constructor.name).toEqual('Geometry');
        });
    });

    describe('wireframe method', () => {
        it('returns Geometry array', () => {
            const actual = subject.wireframe(() => [0, 0, 0], [0, 1, 1], [0, 1, 1]);
            expect(actual.length).toEqual(4);
            expect(actual[0].constructor.name).toEqual('Geometry');
        });
    });

    describe('surface method', () => {
        it('returns Geometry array', () => {
            const actual = subject.surface(() => [0, 0, 0], [0, 1, 1], [0, 1, 1]);
            expect(actual.length).toEqual(1);
            expect(actual[0].constructor.name).toEqual('Geometry');
        });
        it('returns Geometry array in wireframe mode', () => {
            subject.style('wireframe');
            const actual = subject.surface(() => [0, 0, 0], [0, 1, 1], [0, 1, 1]);
            expect(actual.length).toEqual(4);
            expect(actual[0].constructor.name).toEqual('Geometry');
        });
    });
});
