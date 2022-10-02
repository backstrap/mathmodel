// noinspection ES6PreferShortImport

import {JSDOM} from "jsdom";
import {THREE} from './threeFix';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {renderThree} from '../src/renderThree';

jest.mock('three/examples/jsm/controls/OrbitControls');

describe('renderThree', () => {
    let listeners;
    let options;

    beforeAll(() => {
        OrbitControls.mockImplementation(
            () => {
                return {
                    target: {set: jest.fn()},
                    addEventListener: jest.fn(),
                    update: jest.fn(),
                };
            }
        );
    });

    beforeEach(() => {
        listeners = [];
        options = {
            linewidth: 1,
            opacity: 1,
            color: 'white',
            fontSize: 12,
        };
        global.requestAnimationFrame = jest.fn();
        jest.spyOn(THREE, 'WebGLRenderer').mockImplementation(() => {
            return {
                setPixelRatio: jest.fn(),
                setSize: jest.fn(),
                setClearColor: jest.fn(),
                render: jest.fn(),
                domElement: JSDOM.fragment('<div></div>'),
            };
        });
        jest.spyOn(document, 'createElement').mockImplementation(() => (
            {
                getContext: () => ({
                    scale: jest.fn(),
                    fillText: jest.fn(),
                }),
                style: {},
            }
        ));
        window.addEventListener = jest.fn().mockImplementation((name, f) => listeners.push(f));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('dummy test', () => {
        window.document.body.append(document.createElement('canvas'));
        window.devicePixelRatio = 1;
        window.innerWidth = window.innerHeight = 1000;
        // Should actually mock threejsScene functions and scene.children.
        renderThree({
                aspectRatio: [1, 1, 1],
                viewpoint: [1, 0, 0],
                clippingPlane: [[1, 0, 0], -1],
                xMin: 0, yMin: 0, zMin: 0,
                xMax: 1, yMax: 1, zMax: 10,
                frame: true, axesLabels: true,
                animate: true,
            },
            [
                {color: 'white', position: [1, 1, 1]}
            ], [
                {point: [0, 0, 0], options: options},
            ], [], [
                {points: [[1, 1, 1], [], [2, 2, 2]], options: options},
            ], [{
                faces: [],
                vertices: [],
                options: Object.assign({
                    rotation: {axis: [1, 0, 0], angle: 1},
                    translation: {path: () => 1, step: 1},
                    mogrifyMax: 10,
                    mogrifyStep: 0,
                }, options)
            }], window);
        expect(OrbitControls).toHaveBeenCalled();
        expect(listeners.length).toBe(8);
        listeners.forEach(f => f());
    });
});
