// noinspection ES6PreferShortImport

import {Geometry} from '../src/Geometry';

describe('Geometry', () => {
    let subject;

    beforeEach(() => {
        subject = new Geometry({type: 'point'});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('has a "type" member', () => {
        expect(subject.type).toEqual('point');
    });

    it('acquires surface data from passed constructor arg', () => {
        subject = new Geometry({
            type: 'surface',
            vertices: [[0,0,0]],
            faces: [[1,1,1]],
        });
        expect(subject.type).toEqual('surface');
        expect(subject.vertices).toStrictEqual([[0,0,0]]);
        expect(subject.faces).toStrictEqual([[1,1,1]]);
    });

    it('acquires line data from passed constructor arg', () => {
        subject = new Geometry({
            type: 'line',
            points: [[0,0,0]],
        });
        expect(subject.type).toEqual('line');
        expect(subject.points).toStrictEqual([[0,0,0]]);
    });

    it('acquires point data from passed constructor arg', () => {
        subject = new Geometry({
            type: 'point',
            point: [0,0,0],
        });
        expect(subject.type).toEqual('point');
        expect(subject.point).toStrictEqual([0,0,0]);
    });

    it('acquires text data from passed constructor arg', () => {
        subject = new Geometry({
            type: 'text',
            point: [0,0,0],
            text: 'something',
        });
        expect(subject.type).toEqual('text');
        expect(subject.point).toStrictEqual([0,0,0]);
        expect(subject.text).toEqual('something');
    });

    it('fails on unknown geometry type', () => {
        jest.spyOn(console, 'log').mockImplementation(() => undefined);
        expect(() => new Geometry({type: 'test'}))
            .toThrow('Unknown Geometry type: test');
    });
});
