// noinspection ES6PreferShortImport

import {exportSTL} from '../src/exportSTL';
import {Geometry} from '../src/Geometry';

describe('exportSTL', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('returns STL data object', () => {
        // (instanceof DataView)
        expect(typeof exportSTL([])).toBe('object');
    });

    it('returns STL data string', () => {
        expect(exportSTL([], false, {
            xMin: 0, yMin: 0, zMin: 0,
            xMax: 0, yMax: 0, zMax: 0,
        })).toStrictEqual('solid exported\nendsolid exported\n');
    });

    it('acts on surfaces', () => {
        const data = [new Geometry({type: 'surface',options:{color:'white',opacity:1},vertices:[],faces:[]})];
        const config = {
            aspectRatio:[1,1,1],
            xMin: 0, yMin: 0, zMin: 0,
            xMax: 1, yMax: 1, zMax: 10,
        };

        expect(exportSTL(data, false, config))
            .toStrictEqual('solid exported\nendsolid exported\n');
    });
});
