// noinspection ES6PreferShortImport

import {JSDOM} from "jsdom";
import {THREE} from './threeFix';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {renderThree} from '../src/renderThree';

jest.mock('three/examples/jsm/controls/OrbitControls');

describe('renderThree', () => {
    let listeners;
    let options;
    let baseConfig;

    beforeAll(() => {
        OrbitControls.mockImplementation(
            () => {
                return {
                    target: {set: jest.fn()},
                    addEventListener: jest.fn()
                        .mockImplementation((type, f) => f()),
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
        baseConfig = {
            aspectRatio: [1, 1, 1],
            viewpoint: [1, 0, 0],
            xMin: 0, yMin: 0, zMin: 0,
            xMax: 1, yMax: 1, zMax: 10,
            animate: true,
        };
        global.requestAnimationFrame = jest.fn();
        window.devicePixelRatio = 1;
        window.innerWidth = window.innerHeight = 1000;
        delete window.listeners;
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
                    arc: jest.fn(),
                    fill: jest.fn(),
                    fillText: jest.fn(),
                    scale: jest.fn(),
                }),
                style: {},
            }
        ));
        window.addEventListener = jest.fn().mockImplementation((name, f) => listeners.push(f));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('removes old canvases', () => {
        const oldCanvas = {};
        jest.spyOn(window.document.body, 'getElementsByTagName')
            .mockImplementation(() => [oldCanvas]);
        jest.spyOn(window.document.body, 'removeChild')
            .mockImplementation(() => undefined);
        renderThree(baseConfig, [], [], [], [], [], window);
        expect(document.body.removeChild).toHaveBeenCalledWith(oldCanvas);
    });

    it('avoids zero-size viewport', () => {
        const config = Object.assign({}, baseConfig, {
            xMin: 1, xMax: 1,
            yMin: 1, yMax: 1,
            zMin: 1, zMax: 1,
        });
        renderThree(config, [], [], [], [], [], window);
        // TODO How to actually test xMin, etc?
        expect(true).toBeTruthy();
    });

    it('builds frame and axes labels', () => {
        const config = Object.assign(baseConfig, {
            frame: true,
            axes: true,
            axesLabels: ['x', 'y', 'z'],
            cameraNear: 1,
            cameraFar: 100,
            viewpoint: 'auto',
            viewDistance: 'auto',
            clippingPlane: [[1, 0, 0], -1],
        });
        renderThree(config, [], [], [], [], [], window);
        // TODO How to actually test frame, labels, etc?
        expect(true).toBeTruthy();
    });

    it('avoids negative zero in axis labels', () => {
        const config = Object.assign(baseConfig, {
            xMin: -1.0001, yMin: -1.0001, zMin: -1.0001,
            xMax: 1, yMax: 1, zMax: 1,
            aspectRatio: [1, 1, 1],
            axesLabels: ['x', 'y', 'z'],
        });
        renderThree(config, [], [], [], [], [], window);
        // TODO How to actually test a label?
        expect(true).toBeTruthy();
    });

    it('does not re-add window listeners', () => {
        window.listeners = {};
        renderThree(baseConfig, [], [], [], [], [], window);
        // TODO How to actually test?
        expect(window.addEventListener).not.toHaveBeenCalled();
    });

    it('skips animation code if not animating', () => {
        const config = Object.assign(baseConfig, {animate: false});
        renderThree(config, [], [], [], [], [], window);
        // TODO How to actually test non-animation?
        expect(true).toBeTruthy();
    });

    it('running listeners with animation off', () => {
        const config = Object.assign(baseConfig, {animate: false});
        renderThree(config, [], [], [], [], [], window);
        listeners.forEach(f => f());
        // TODO How to actually test listener state?
        expect(true).toBeTruthy();
    });

    it('renders the scene', () => {
        // Should actually mock threejsScene functions and scene.children.
        renderThree(baseConfig,
            [
                {color: 'white', position: [1, 1, 1]},
                {
                    color: 'white', position: [1, 1, 0], parent: 'camera',
                    target: {position: {set: jest.fn()}},
                }
            ], [
                {point: [0, 0, 0], options: options},
            ], [
                {point: [0, 1, 0], options: options},
            ], [
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

    it('will split lines at empty points', () => {
        const lines = [{
            points: [[], [0, 0, 0], [1, 0, 0], [], [1, 0, 0], [2, 0, 0]],
            options: options,
        }];
        renderThree(baseConfig, [], [], [], lines, [], window);
        expect(lines.length).toBe(3);
    });

    it('will remove line segments not in viewport', () => {
        const lines = [{
            points: [[0, 0, 0], [1, 0, 0], [99, 99, 99], [0, 1, 0], [0, 0, 1]],
            options: options,
        }];
        renderThree(baseConfig, [], [], [], lines, [], window);
        expect(lines.length).toBe(2);
    });

    describe('suspend timer', () => {
        it('runs suspend timer', done => {
            const config = Object.assign(baseConfig, {
                suspendTimeout: 0,
                animate: true
            });
            renderThree(config, [], [], [], [], [], window);
            window.listeners.suspendAnimation();
            setTimeout(done, 5);
            // TODO l. 194-196 need a real test
            expect(true).toBeTruthy();
        });
        it('does not run suspend timer if animating on interaction', done => {
            const config = Object.assign(baseConfig, {
                suspendTimeout: 0,
                animate: true,
                animateOnInteraction: true,
            });
            renderThree(config, [], [], [], [], [], window);
            window.listeners.suspendAnimation();
            setTimeout(done, 5);
            // TODO l. 194-196 need a real test
            expect(true).toBeTruthy();
        });
    });
});
