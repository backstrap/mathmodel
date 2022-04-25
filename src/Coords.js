import {sin, cos, identity, matrixMul} from '@backstrap/math';

/**
 * @type {function(number[][]|null, number[][]): number[][]}
 * @private
 */
const compose = ((a, b) => a ? matrixMul(a, b) : b);

/**
 * Class representing a 3D coordinate system.
 */
export class Coords {
    /** @type {number[][]|null} */
    #matrix = null;

    /** @type {number} */
    dv = 100;

    /**
     * @param {Coords} parent
     */
    constructor(parent = null) {
        this.#matrix = (parent ? parent : this).#matrix;
    }

    /**
     * @param {number} [x]
     * @param {number} [y]
     * @param {number} [z]
     * @returns {this}
     */
    translate(x = 0, y = 0, z = 0) {
        this.#matrix = compose(
            this.#matrix,
            [[1, 0, 0, x], [0, 1, 0, y], [0, 0, 1, z], [0, 0, 0, 1]]
        );
        return this;
    }

    /**
     * @param {number} [s]
     * @returns {this}
     */
    scale(s = 1) {
        this.#matrix = compose(
            this.#matrix,
            [[s, 0, 0, 0], [0, s, 0, 0], [0, 0, s, 0], [0, 0, 0, 1]]
        );
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {number} [x]
     * @param {number} [y]
     * @param {number} [z]
     * @returns {this}
     */
    stretch(x = 1, y = 1, z = 1) {
        this.#matrix = compose(
            this.#matrix,
            [[x, 0, 0, 0], [0, y, 0, 0], [0, 0, z, 0], [0, 0, 0, 1]]
        );
        return this;
    }

    /**
     * @param {number} [angle]
     * @param {number} [axis] - axis index (0, 1, or 2)
     * @returns {this}
     */
    rotate(angle = 0, axis = 0) {
        const a = axis > 0 ? 0 : 1;
        const b = axis < 2 ? 2 : 1;
        const r = identity(4);
        r[a][a] = r[b][b] = cos(angle);
        r[a][b] = -(r[b][a] = sin(angle));
        this.#matrix = compose(this.#matrix, r);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @returns {this}
     */
    resetTransform() {
        this.#matrix = null;
        return this;
    }

    /**
     * Get a new duplicate transformed Coords object.
     * @returns {this}
     */
    dupe() {
        return new this.constructor(this);
    }

    /**
     * Apply current coordinate transform to vector v.
     * @param {number[]} v
     * @returns {number[]}
     */
    transform(v) {
        return this.#matrix ? this.#matrix.slice(0, 3).map(r => r[0]*v[0] + r[1]*v[1] + r[2]*v[2] + r[3]) : v;
    }

    /**
     * Apply current un-translated coordinate transform to vector v.
     * @param {number[]} v
     * @returns {number[]}
     */
    orient(v) {
        return this.#matrix ? this.#matrix.slice(0, 3).map(r => r[0]*v[0] + r[1]*v[1] + r[2]*v[2]) : v;
    }
}
