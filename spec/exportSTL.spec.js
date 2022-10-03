// noinspection ES6PreferShortImport

import {exportSTL} from '../src/exportSTL';
import {Geometry} from '../src/Geometry';
import {addSurface} from '../src/threejsScene';

jest.mock('../src/threejsScene', () => {
    const actual = jest.requireActual('../src/threejsScene');
    return {
        __esModule: true,
        addSurface: jest.fn((...args) => actual.addSurface(...args)),
    };
});

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

    it('scales z axis appropriately', () => {
        const config = {
            aspectRatio:[1, 1, 1],
            xMin: 0, yMin: 0, zMin: 0,
            xMax: 1, yMax: 1, zMax: 2,
        };
        const surface = new Geometry({
            type: 'surface',
            faces: [[0, 1, 2]],
            vertices: [[0, 0, 0], [1, 0, 0], [0, 1, 0]],
            options: {color: 'white', opacity: 1},
        });
        addSurface.mockClear();
        exportSTL([surface], false, config);
        expect(addSurface).toHaveBeenCalledWith(
            expect.anything(),
            expect.anything(),
            [1, 1, 0.7071067811865476],
            0,
            1.4142135623730951
        );
    });
});
