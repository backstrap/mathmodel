// noinspection ES6PreferShortImport

// TODO Impl. threejsScene unit tests
import {addPoint, addLine, addSurface} from '../src/threejsScene';

describe('threejsScene', () => {
    let scene;
    let options;

    beforeEach(() => {
        scene = {
            add: jest.fn(),
            getObjectByName: jest.fn(),
        };
        options = {
            linewidth: 1,
            opacity: 1,
            color: 'white',
            colors: [{r: 0, g: 0, b: 0}],
            rotation: {axis: [1, 0, 0], angle: 1, origin: [0, 0, 0]},
            translation: {path: () => [1, 0, 0]},
            group: 'test',
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('addPoint', () => {
        it('calls add()', () => {
            jest.spyOn(document, 'createElement').mockImplementation(() => (
                {getContext: () => ({
                    arc: jest.fn(),
                    fill: jest.fn(),
                })}
            ));
            addPoint(scene, {point: [[0, 0, 0]], options: options}, [1, 1, 1])
            expect(scene.add).toHaveBeenCalled();
        });
    });

    describe('addLine', () => {
        it('calls add()', () => {
            addLine(scene, {points: [[0, 0, 0], [1, 1, 1]], options: options})
            expect(scene.add).toHaveBeenCalled();
        });
    });

    describe('addSurface', () => {
        it('calls add()', () => {
            addSurface(scene, {
                    faces: [[0, 1, 2]],
                    vertices: [[0, 0, 0], [1, 1, 1], [2, 0, 0]],
                    options: options
                },
                [1, 0, 0], -1, 1)
            expect(scene.add).toHaveBeenCalled();
        });
    });
});
