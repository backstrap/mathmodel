// noinspection ES6PreferShortImport

import {exportSTL} from '../src/exportSTL';

describe('exportSTL', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('returns STL data string', () => {
        expect(exportSTL([], false)).toStrictEqual('solid exported\nendsolid exported\n');
    });
});
