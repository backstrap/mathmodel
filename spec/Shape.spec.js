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
    });

    describe('curve method', () => {
        it('returns Geometry array', () => {
            const actual = subject.curve(u => [0, 0, 0], [0, 1, 1]);
            expect(actual.length).toEqual(1);
            expect(actual[0].constructor.name).toEqual('Geometry');
        });
    });

    describe('wireframe method', () => {
        it('returns Geometry array', () => {
            const actual = subject.wireframe((u, v) => [0, 0, 0], [0, 1, 1], [0, 1, 1]);
            expect(actual.length).toEqual(4);
            expect(actual[0].constructor.name).toEqual('Geometry');
        });
    });

    describe('surface method', () => {
        it('returns Geometry array', () => {
            const actual = subject.surface((u, v) => [0, 0, 0], [0, 1, 1], [0, 1, 1]);
            expect(actual.length).toEqual(1);
            expect(actual[0].constructor.name).toEqual('Geometry');
        });
    });
});
