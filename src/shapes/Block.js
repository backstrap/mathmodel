import {Shape} from '../Shape';

/**
 * Class representing a block shape (cuboid).
 * @extends Shape
 */
export class Block extends Shape {
    /**
     * @type {function(number=, number=, number=): Geometry[]}
     * @param [w]
     * @param [h]
     * @param [d]
     * @returns {Geometry[]}
     */
    get(w = 1, h = w, d = h) {
        return [
            (u, v) => [-w/2, h*(u - 0.5), -d*(v - 0.5)],
            (u, v) => [w/2, h*(u - 0.5), d*(v - 0.5)],
            (u, v) => [w*(u - 0.5), -h/2, d*(v - 0.5)],
            (u, v) => [w*(u - 0.5), h/2, -d*(v - 0.5)],
            (u, v) => [w*(u - 0.5), -h*(v - 0.5), -d/2],
            (u, v) => [w*(u - 0.5), h*(v - 0.5), d/2],
        ].map(f => this.surface(f, [0, 1, 1], [0, 1, 1])).flat();
    }
}
