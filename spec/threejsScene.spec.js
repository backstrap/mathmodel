// noinspection ES6PreferShortImport

import {addPoint, addLine, addSurface} from '../src/threejsScene';

describe('threejsScene', () => {
    let scene;
    let options;
    let groupOptions;

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
        };
        groupOptions = Object.assign({group: 'test'}, options);
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
            addPoint(scene, {point: [[0, 0, 0]], options: groupOptions}, [1, 1, 1]);
            expect(scene.add).toHaveBeenCalled();
        });
    });

    describe('addLine', () => {
        it('calls add()', () => {
            addLine(scene, {points: [[0, 0, 0], [1, 1, 1]], options: groupOptions});
            expect(scene.add).toHaveBeenCalled();
        });
        it('Can use line segments instead of line', () => {
            addLine(scene, {
                points: [[0, 0, 0], [1, 1, 1]],
                options: {
                    linewidth: 1,
                    opacity: 1,
                    color: 'white',
                    useLineSegments: true,
                }
            });
            expect(scene.add).toHaveBeenCalledWith(expect.objectContaining({
                type: 'LineSegments'
            }));
        });
    });

    describe('addSurface', () => {
        it('calls add()', () => {
            addSurface(scene, {
                    faces: [[0, 1, 2]],
                    vertices: [[0, 0, 0], [1, 1, 1], [2, 0, 0]],
                    options: groupOptions
                },
                [1, 0, 0], -1, 1);
            expect(scene.add).toHaveBeenCalled();
        });
        it('removes bad vertices', () => {
            const surface = {
                faces: [[0, 1, 2], [0, 1, 3], [0, 2, 3]],
                vertices: [[0, 0, 0], [1, 1, 1], [2, 0, 0], [0, 0, NaN]],
                options: {
                    material: 'normal',
                    linewidth: 1,
                    opacity: 1,
                    singleSide: true,
                    translation: {path: '[x, 0, 0]', argument: 'x'},
                }
            };
            addSurface(scene, surface, [1, 0, 0], -1, 1);
            expect(surface.faces.length).toBe(1);
        });
        it('removes out-of-z-range faces', () => {
            const surface = {
                faces: [[0, 1, 2], [3, 4, 5]],
                vertices: [[0, 0, -9], [1, 1, -9], [2, 0, -9], [0, 0, 9], [1, 1, 9], [2, 0, 9]],
                options: {
                    material: 'phong',
                    color: 'white',
                    linewidth: 1,
                    opacity: 1,
                    translation: {path: '[1, 0, 0]'},
                }
            };
            addSurface(scene, surface, [1, 1, 1], -1, 1);
            expect(surface.faces).toEqual([]);
        });
        it('sets std material', () => {
            const surface = {
                faces: [[0, 1, 2]],
                vertices: [[0, 0, 0], [1, 1, 1], [2, 0, 0]],
                options: Object.assign(options, {material: 'standard'})
            };
            addSurface(scene, surface, [1, 0, 0], -1, 1);
            expect(scene.add).toHaveBeenCalledWith(expect.objectContaining({
                material: expect.objectContaining({
                    type: 'MeshStandardMaterial',
                    metalness: 0.5,
                    roughness: 0.5,
                })
            }));
        });
        it('sets std material with properties', () => {
            const surface = {
                faces: [[0, 1, 2]],
                vertices: [[0, 0, 0], [1, 1, 1], [2, 0, 0]],
                options: Object.assign(options, {
                    material: 'standard',
                    metalness: 0,
                    roughness: 0,
                })
            };
            addSurface(scene, surface, [1, 0, 0], -1, 1);
            expect(scene.add).toHaveBeenCalledWith(expect.objectContaining({
                material: expect.objectContaining({
                    type: 'MeshStandardMaterial',
                    metalness: 0,
                    roughness: 0,
                })
            }));
        });
        it('sets phong material with properties', () => {
            const surface = {
                faces: [[0, 1, 2]],
                vertices: [[0, 0, 0], [1, 1, 1], [2, 0, 0]],
                options: Object.assign(options, {
                    material: 'phong',
                    shininess: 0,
                    renderOrder: 1,
                })
            };
            addSurface(scene, surface, [1, 0, 0], -1, 1);
            expect(scene.add).toHaveBeenCalledWith(expect.objectContaining({
                material: expect.objectContaining({
                    type: 'MeshPhongMaterial',
                    shininess: 0,
                })
            }));
        });
        it('sets "mogrify" animation on group', () => {
            const surface = {
                faces: [[0, 1, 2]],
                vertices: [[0, 0, 0], [1, 1, 1], [2, 0, 0]],
                options: {
                    linewidth: 1,
                    opacity: 1,
                    color: 'white',
                    group: 'test',
                    mogrifyStep: 0,
                    mogrifyMax: 10,
                }
            };
            addSurface(scene, surface, [1, 0, 0], -1, 1)
            expect(scene.add).toHaveBeenCalledWith(expect.objectContaining({
                userData: {
                    mogrifyStep: 0,
                    mogrifyMax: 10,
                    mogrifyCount: 1,
                }
            }));
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
            addSurface(scene, surface, [1, 0, 0], -1, 1);
            expect(scene.add).toHaveBeenCalledWith(expect.objectContaining({
                userData: {
                    mogrifyStep: 0,
                    mogrifyMax: 10,
                    mogrifyCount: 1,
                }
            }));
        });
        it('warns about deprecated options', () => {
            jest.spyOn(console, 'warn').mockImplementation(() => undefined);
            const surface = {
                faces: [[0, 1, 2]],
                vertices: [[0, 0, 0], [1, 1, 1], [2, 0, 0]],
                options: Object.assign({rotationAxisAngle: [[1, 0, 0], 1]}, groupOptions),
            };
            addSurface(scene, surface, [1, 0, 0], -1, 1);
            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('rotationAxisAngle is deprecated'));
            surface.options = Object.assign({rotationOrigin: [0, 0, 0]}, groupOptions);
            addSurface(scene, surface, [1, 0, 0], -1, 1);
            surface.options = {
                rotationOrigin: [0, 0, 0],
                linewidth: 1,
                opacity: 1,
                color: 'white'
            };
            addSurface(scene, surface, [1, 0, 0], -1, 1);
            expect(console.warn).toHaveBeenCalledTimes(3);
            expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('rotationOrigin is deprecated'));
        });
        it('adds to existing group object', () => {
            const group = {
                userData: {},
                position: {},
                add: jest.fn(),
                traverse: jest.fn(),
                updateMatrixWorld: jest.fn(),
            };
            jest.spyOn(scene, 'getObjectByName').mockImplementation(() => group);
            const surface = {
                faces: [[0, 1, 2]],
                vertices: [[0, 0, 0], [1, 1, 1], [2, 0, 0]],
                options: groupOptions,
            };
            addSurface(scene, surface, [1, 0, 0], -1, 1);
            expect(scene.add).toHaveBeenCalledWith(group);
            surface.options = {
                linewidth: 1,
                opacity: 1,
                color: 'white',
                group: 'test',
            };
            addSurface(scene, surface, [1, 0, 0], -1, 1);
            expect(scene.add).toHaveBeenLastCalledWith(group);
        });
    });
});
