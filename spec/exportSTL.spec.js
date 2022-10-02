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
        const data = [new Geometry({
            type: 'surface',
            faces: [[0, 1, 2]],
            vertices: [[0, 0, 0], [1, 0, 0], [0, 1, 0]],
            options: {color: 'white', opacity: 1},
        })];
        const config = {
            aspectRatio:[1, 1, 1],
            xMin: 0, yMin: 0, zMin: 0,
            xMax: 1, yMax: 1, zMax: 1,
        };

        expect(exportSTL(data, false, config))
            .toStrictEqual(
                'solid exported\n'
                + '\tfacet normal 0 0 1\n'
                + '\t\touter loop\n'
                + '\t\t\tvertex 0 0 0\n'
                + '\t\t\tvertex 1 0 0\n'
                + '\t\t\tvertex 0 1 0\n'
                + '\t\tendloop\n'
                + '\tendfacet\n'
                + 'endsolid exported\n'
            );
    });
});
