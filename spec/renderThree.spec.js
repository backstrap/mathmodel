// noinspection ES6PreferShortImport

import {JSDOM} from "jsdom";
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {renderThree} from '../src/renderThree';

jest.mock('three/examples/jsm/controls/OrbitControls');

describe('renderThree', () => {
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
        options = {
            linewidth: 1,
            opacity: 1,
            color: 'white',
            fontSize: 12,
        };
        global.requestAnimationFrame = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('dummy test', () => {
        window.devicePixelRatio = 1;
        window.innerWidth = window.innerHeight = 1000;
        renderThree({
                aspectRatio: [1, 1, 1],
                viewpoint: [1, 0, 0],
                xMin: 0, yMin: 0, zMin: 0,
                xMax: 1, yMax: 1, zMax: 10,
                frame: true, axesLabels: true,
            animate: true,
            },
            [], [
                {point: [0, 0, 0], options: options},
            ], [], [
                {points: [[1, 1, 1]], options: options},
            ], [], window);
        expect(OrbitControls).toHaveBeenCalled();
        expect(true).toBeTruthy();
    });
});
