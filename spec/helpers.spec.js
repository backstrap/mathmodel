// noinspection ES6PreferShortImport

import {canonicalizeConfig, cleanCopy} from '../src/helpers';

describe('canonicalizeConfig', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('sets some default config parameters', () => {
        const config = {};
        const data = [
            {type: 'point', point: [0,0,0]},
            {type: 'point', point: [1,1,1]},
        ];
        canonicalizeConfig(config, data, [], [], [], []);
        expect(config).toEqual({
            "ambientLight": "rgb(127,127,127)",
            "animate": false,
            "aspectRatio": [1, 1, 1],
            "axes": false,
            "axesLabels": ["x", "y", "z"],
            "clearColor": "white",
            "decimals": 2,
            "equalAspect": false,
            "frame": true,
            "suspendTimeout": 5000,
            "viewDistance": "auto",
            "viewpoint": "auto",
            "xMax": 1, "xMin": 0,
            "yMax": 1, "yMin": 0,
            "zMax": 1, "zMin": 0,
        });
    });

    it('doesn\'t override passed config parameters', () => {
        const config = {
            "ambientLight": "rgb(255,127,127)",
            "animate": true,
            "aspectRatio": [2, 2, 2],
            "axes": true,
            "axesLabels": ["a", "b", "c"],
            "clearColor": "black",
            "decimals": 3,
            "equalAspect": true,
            "frame": true,
            "suspendTimeout": 2000,
            "viewDistance": 1,
            "viewpoint": [1, 0, 0],
            "xMax": 2, "xMin": -2,
            "yMax": 2, "yMin": -2,
            "zMax": 2, "zMin": -2,
        };
        const data = [
            {type: 'point', point: [0,0,0]},
            {type: 'point', point: [1,1,1]},
        ];
        canonicalizeConfig(config, data, [], [], [], []);
        expect(config).toEqual({
            "ambientLight": "rgb(255,127,127)",
            "animate": true,
            "aspectRatio": [2, 2, 2],
            "axes": true,
            "axesLabels": ["a", "b", "c"],
            "clearColor": "black",
            "decimals": 3,
            "equalAspect": true,
            "frame": true,
            "suspendTimeout": 2000,
            "viewDistance": 1,
            "viewpoint": [1, 0, 0],
            "xMax": 2, "xMin": -2,
            "yMax": 2, "yMin": -2,
            "zMax": 2, "zMin": -2,
        });
    });

    it('only allows axesLabels with frame', () => {
        const config = {axesLabels: ['x', 'y', 'z'], frame: false};
        canonicalizeConfig(config, [], [], [], [], []);
        expect(config.axesLabels).toBe(false);
    });

    it('separates data items by type', () => {
        const data = [
            {type: 'text', point: [0, 0, 0]},
            {type: 'point', point: [1, 1, 1]},
            {type: 'line', points: [[0, 0, 0]]},
            {type: 'surface', vertices: [[0, 0, 0]], options: {}},
        ];
        const results = [[], [], [], []];
        canonicalizeConfig({}, data, ...results);
        expect(results).toEqual([
            [data[0]],
            [data[1]],
            [data[2]],
            [data[3]],
        ]);
    });

    it('processes surface colormaps', () => {
        const test = {type: 'surface', vertices: [[0, 0, 0], [0, 0, 1]], options: {colormap: 'gray'}};
        canonicalizeConfig({}, [test], [], [], [], [])
        expect(test.options.colors).toEqual([{r: 0, g: 0, b: 0}, {r: 1, g: 1, b: 1}]);
    });

    it('accepts surface colormaps with colors', () => {
        const map = [{r: 0, g: 1, b: 2}];
        const test = {type: 'surface', vertices: [[0, 0, 0], [0, 0, 1]], options: {colormap: 'gray', colors: map}};
        canonicalizeConfig({}, [test], [], [], [], [])
        expect(test.options.colors).toBe(map);
    });

    it('computes mapped colors from z values', () => {
        const config = {zMin: -2, zMax: 2};
        const test = {type: 'surface', vertices: [[0, 0, -2], [0, 0, 0], [0, 0, 0.4], [0, 0, 1], [0, 0, 2]], options: {colormap: 'gray'}};
        const expected = [0, 0.5, 0.6, 0.75, 1].map(v => ({r: v, g: v, b: v}));
        canonicalizeConfig(config, [test], [], [], [], [])
        expect(test.options.colors).toEqual(expected);
    });

    it('clamps out-of-range colormap values', () => {
        const config = {zMin: 0, zMax: 1};
        const test = {type: 'surface', vertices: [[0, 0, -1], [0, 0, 0], [0, 0, 0.4], [0, 0, 1], [0, 0, 2]], options: {colormap: 'gray'}};
        const expected = [0, 0, 0.4, 1, 1].map(v => ({r: v, g: v, b: v}));
        canonicalizeConfig(config, [test], [], [], [], [])
        expect(test.options.colors).toEqual(expected);
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
