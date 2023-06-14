// noinspection ES6PreferShortImport

import {Solid} from '../src/Solid';

const expectSurface = obj => (
    expect(obj.constructor.name).toEqual('Geometry')
    && expect(obj).toMatchObject({type: 'surface', faces: expect.any(Array)})
);

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
            actual.forEach(obj => expectSurface(obj));
        });
    });

    describe('rod method', () => {
        it('returns Geometry array', () => {
            const actual = subject.rod();
            expect(actual.length).toEqual(3);
            actual.forEach(obj => expectSurface(obj));
        });
    });

    describe('cone method', () => {
        it('returns Geometry array', () => {
            const actual = subject.cone();
            expect(actual.length).toEqual(2);
            actual.forEach(obj => expectSurface(obj));
        });
    });

    describe('sphere method', () => {
        it('returns Geometry array', () => {
            const actual = subject.sphere();
            expect(actual.length).toEqual(6);
            actual.forEach(obj => expectSurface(obj));
        });
    });

    describe('torus method', () => {
        it('returns Geometry array', () => {
            const actual = subject.torus();
            expect(actual.length).toEqual(1);
            actual.forEach(obj => expectSurface(obj));
        });
    });

    describe('volume method', () => {
        it('returns Geometry array', () => {
            const actual = subject.volume();
            expect(actual.length).toEqual(6);
            actual.forEach(obj => expectSurface(obj));
        });
    });
});
