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
        it('removes bad vertices', () => {
            const surface = {
                faces: [[0, 1, 2], [0, 1, 3]],
                vertices: [[0, 0, 0], [1, 1, 1], [2, 0, 0], [0, 0, NaN]],
                options: {
                    material: 'normal',
                    linewidth: 1,
                    opacity: 1,
                }
            };
            addSurface(scene, surface,
                [1, 0, 0], -1, 1)
            expect(surface.faces.length).toBe(1);
        });
        it('sets std material', () => {
            const surface = {
                faces: [[0, 1, 2]],
                vertices: [[0, 0, 0], [1, 1, 1], [2, 0, 0]],
                options: Object.assign(options, {material: 'standard'})
            };
            addSurface(scene, surface,
                [1, 0, 0], -1, 1)
            expect(surface.faces.length).toBe(1);
        });
        it('sets "mogrify" animation', () => {
            const surface = {
                faces: [[0, 1, 2]],
                vertices: [[0, 0, 0], [1, 1, 1], [2, 0, 0]],
                options: Object.assign(options, {
                    mogrifyStep: 0,
                    mogrifyMax: 10,
                })
            };
            addSurface(scene, surface,
                [1, 0, 0], -1, 1)
            expect(surface.faces.length).toBe(1);
        });
        it('sets "mogrify" animation without group', () => {
            const surface = {
                faces: [[0, 1, 2]],
                vertices: [[0, 0, 0], [1, 1, 1], [2, 0, 0]],
                options: {
                    linewidth: 1,
                    opacity: 1,
                    color: 'white',
                    mogrifyStep: 0,
                    mogrifyMax: 10,
                }
            };
            addSurface(scene, surface,
                [1, 0, 0], -1, 1)
            expect(surface.faces.length).toBe(1);
        });
    });
});
