// noinspection ES6PreferShortImport

import {Solid} from '../src/Solid';

describe('Solid', () => {
    let subject;

    beforeEach(() => {
        subject = new Solid();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('block method', () => {
        it('returns Geometry array', () => {
            const actual = subject.block();
            expect(actual.length).toEqual(6);
            expect(actual[0].constructor.name).toEqual('Geometry');
        });
    });

    describe('rod method', () => {
        it('returns Geometry array', () => {
            const actual = subject.rod();
            expect(actual.length).toEqual(3);
            expect(actual[0].constructor.name).toEqual('Geometry');
        });
    });

    describe('cone method', () => {
        it('returns Geometry array', () => {
            const actual = subject.cone();
            expect(actual.length).toEqual(2);
            expect(actual[0].constructor.name).toEqual('Geometry');
        });
    });

    describe('sphere method', () => {
        it('returns Geometry array', () => {
            const actual = subject.sphere();
            expect(actual.length).toEqual(6);
            expect(actual[0].constructor.name).toEqual('Geometry');
        });
    });

    describe('torus method', () => {
        it('returns Geometry array', () => {
            const actual = subject.torus();
            expect(actual.length).toEqual(1);
            expect(actual[0].constructor.name).toEqual('Geometry');
        });
    });
});
