// noinspection ES6PreferShortImport

import {Shape} from '../src/Shape';

const expectGeometry = obj => expect(obj.constructor.name).toEqual('Geometry');

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
        it('changes drawing style', () => {
            const args = [(u, v) => [u, v, 0], [0, 1, 1], [0, 1, 1]];
            subject.style('surface');
            let actual = subject.surface(...args);
            expect(actual.length).toBe(1);
            expectGeometry(actual[0]);
            expect(actual[0]).toMatchObject({
                type: 'surface',
                faces: [[0, 1, 3, 2]],
            });
            subject.style('wireframe');
            actual = subject.surface(...args);
            expect(actual.length).toBe(4);
            actual.forEach(line => expectGeometry(line) &&
                expect(line).toMatchObject({
                    type: 'line',
                    points: [expect.any(Array), expect.any(Array)],
                })
            );
        });
        it('is no-op for invalid values', () => {
            expect(subject.style('invalid')).toBe(subject);
        });
    });

    describe('curve method', () => {
        it('returns Geometry array for curve', () => {
            const actual = subject.curve(u => [u, 0, 0], [0, 1, 1]);
            expect(actual.length).toEqual(1);
            expectGeometry(actual[0]);
            expect(actual[0]).toMatchObject({
                type: 'line',
                points: [[0, 0, 0], [1, 0, 0]],
            });
        });
    });

    describe('wireframe method', () => {
        it('returns Geometry array for wireframe surface', () => {
            const actual = subject.wireframe((u, v) => [u, v, 0], [0, 1, 1], [0, 1, 1]);
            expect(actual.length).toEqual(4);
            actual.forEach(line => expectGeometry(line) &&
                expect(line).toMatchObject({
                    type: 'line',
                    points: [expect.any(Array), expect.any(Array)],
                })
            );
        });
    });

    describe('surface method', () => {
        it('returns Geometry array', () => {
            const actual = subject.surface((u, v) => [u, v, 0], [0, 1, 1], [0, 1, 1]);
            expect(actual.length).toBe(1);
            expectGeometry(actual[0]);
            expect(actual[0]).toMatchObject({
                type: 'surface',
                faces: [[0, 1, 3, 2]],
                vertices: expect.any(Array),
            });
        });
        it('returns Geometry array in wireframe mode', () => {
            subject.style('wireframe');
            const actual = subject.surface((u, v) => [u, v, 0], [0, 1, 1], [0, 1, 1]);
            expect(actual.length).toBe(4);
            actual.forEach(line => expectGeometry(line) &&
                expect(line).toMatchObject({
                    type: 'line',
                    points: [expect.any(Array), expect.any(Array)],
                })
            );
        });
    });
});
