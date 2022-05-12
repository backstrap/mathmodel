// noinspection ES6PreferShortImport

import {Surface} from '../src/Surface';

describe('Surface', () => {
    let subject;

    beforeEach(() => {
        subject = new Surface();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('rect method', () => {
        it('returns Geometry array', () => {
            const actual = subject.rect();
            expect(actual.length).toEqual(1);
            expect(actual[0].constructor.name).toEqual('Geometry');
        });
    });

    describe('rightTriangle method', () => {
        it('returns Geometry array', () => {
            const actual = subject.rightTriangle();
            expect(actual.length).toEqual(1);
            expect(actual[0].constructor.name).toEqual('Geometry');
        });
    });

    describe('polygon method', () => {
        it('returns Geometry array', () => {
            const actual = subject.polygon();
            expect(actual.length).toEqual(1);
            expect(actual[0].constructor.name).toEqual('Geometry');
        });
    });

    describe('conic method', () => {
        it('returns Geometry array', () => {
            const actual = subject.conic();
            expect(actual.length).toEqual(1);
            expect(actual[0].constructor.name).toEqual('Geometry');
        });
    });

    describe('disc method', () => {
        it('returns Geometry array', () => {
            const actual = subject.disc();
            expect(actual.length).toEqual(1);
            expect(actual[0].constructor.name).toEqual('Geometry');
        });
    });

    describe('cylinder method', () => {
        it('returns Geometry array', () => {
            const actual = subject.cylinder();
            expect(actual.length).toEqual(1);
            expect(actual[0].constructor.name).toEqual('Geometry');
        });
    });

    describe('hemisphere method', () => {
        it('returns Geometry array', () => {
            const actual = subject.hemisphere();
            expect(actual.length).toEqual(5);
            expect(actual[0].constructor.name).toEqual('Geometry');
        });
    });

    describe('sphereBand method', () => {
        it('returns Geometry array', () => {
            const actual = subject.sphereBand();
            expect(actual.length).toEqual(1);
            expect(actual[0].constructor.name).toEqual('Geometry');
        });
    });
});
