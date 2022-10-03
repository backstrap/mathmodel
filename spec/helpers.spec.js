// noinspection ES6PreferShortImport

import {canonicalizeConfig, cleanCopy} from '../src/helpers';

describe('canonicalizeConfig', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('dummy test', () => {
        canonicalizeConfig({}, [
            {type: 'text', point: [0,0,0]},
            {type: 'point', point: [1,1,1]},
            {type: 'line', points: []},
            {type: 'surface', vertices: [], options: {}},
        ], [], [], [], [])
        expect(true).toBeTruthy();
    });

    it('processes surface colormaps', () => {
        const test = {type: 'surface', vertices: [[0,0,0],[0,0,1]], options: {colormap: 'gray'}};
        canonicalizeConfig({}, [test], [], [], [], [])
        expect(test.options.colors).toEqual([{r:0,g:0,b:0},{r:1,g:1,b:1}]);
    });

    it('accepts surface colormaps with colors', () => {
        const map = [{r:0,g:1,b:2}];
        const test = {type: 'surface', vertices: [[0,0,0],[0,0,1]], options: {colormap: 'gray', colors: map}};
        canonicalizeConfig({}, [test], [], [], [], [])
        expect(test.options.colors).toBe(map);
    });
});

describe('cleanCopy', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('copies a data object', () => {
        // noinspection JSUnusedGlobalSymbols
        const data = {
            id: 1,
            name: 'test',
            arr: [1, 'a', null],
            obj: {id: 2},
            f: function tester() { return true; },
        };
        expect(cleanCopy(data)).not.toBe(data);
        expect(cleanCopy(data)).toEqual(data);
    });
});
