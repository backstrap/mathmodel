// noinspection ES6PreferShortImport

import {Plot} from '../src/Plot';

describe('Plot', () => {
    let subject;

    beforeEach(() => {
        subject = new Plot();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('text method', () => {
        it('returns Geometry array', () => {
            const actual = subject.text('test', [0, 0, 0]);
            expect(actual.length).toEqual(1);
            expect(actual[0].constructor.name).toEqual('Geometry');
            expect(actual[0]).toMatchObject({
                text: 'test',
                point: [0, 0, 0],
            });
        });
    });

    describe('point method', () => {
        it('returns Geometry array', () => {
            const actual = subject.point([0, 0, 0]);
            expect(actual.length).toEqual(1);
            expect(actual[0].constructor.name).toEqual('Geometry');
            expect(actual[0].point).toEqual([0, 0, 0]);
        });
    });

    describe('listPlot method', () => {
        it('returns Geometry array', () => {
            const actual = subject.listPlot([[0, 0, 0]]);
            expect(actual.length).toEqual(1);
            expect(actual[0].constructor.name).toEqual('Geometry');
            expect(actual[0]).toMatchObject({
                points: [[0, 0, 0]]
            });
        });
    });

    describe('curvePlot method', () => {
        it('returns Geometry array', () => {
            const actual = subject.curvePlot([[0, 0, 0]]);
            expect(actual.length).toEqual(1);
            expect(actual[0].constructor.name).toEqual('Geometry');
            expect(actual[0]).toMatchObject({
                faces: [],
                vertices: [[0, 0, 0]],
            });
        });
    });

    describe('surfacePlot method', () => {
        it('returns Geometry array', () => {
            const actual = subject.surfacePlot([[[0, 0, 0]]]);
            expect(actual.length).toEqual(1);
            expect(actual[0].constructor.name).toEqual('Geometry');
            expect(actual[0]).toMatchObject({
                faces: [],
                vertices: [[0, 0, 0]],
            });
        });
    });
});
