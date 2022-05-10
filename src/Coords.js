// noinspection JSUnusedGlobalSymbols

import {sqrt, sin, cos, arcsin, identity, matrixMul} from '@backstrap/math';

/**
 * Compose two matrices (with null arg equivalent to identity matrix)
 * @type {function(number[][]?, number[][]?): number[][]}
 * @private
 */
const compose = ((a, b) => a && b ? matrixMul(a, b) : b || a);

/**
 * Class representing a 3D coordinate system.
 */
export class Coords {
    /**
     * The current transformation matrix.
     * @member {number[][]|null}
     */
    #matrix = null;

    /**
     * Nominal step-count for parametric curves and surfaces.
     * @member {number}
     */
    dv = 100;

    /**
     * @param {Coords} [parent]
     */
    constructor(parent = null) {
        this.#matrix = (parent || this).#matrix;
        this.dv = (parent || this).dv;
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
     * @param {number|number[]} [axis] - either an axis index (0, 1, 2) or an axis vector
     * @returns {this}
     */
    rotate(angle = 0, axis = 0) {
        const r = identity(4);

        if (axis.length) {
            const n = sqrt(axis[0]**2 + axis[1]**2 + axis[2]**2);
            const x = axis[0]/n, y = axis[1]/n, z = axis[2]/n;
            const c = cos(angle), s = sin(angle);
            r[0] = [c + (1 - c)*x**2, x*y*(1 - c) - z*s, x*z*(1 - c) + y*s, 0];
            r[1] = [x*y*(1 - c) + z*s, c + (1 - c)*y**2, y*z*(1 - c) - x*s, 0];
            r[2] = [x*z*(1 - c) - y*s, y*z*(1 - c) + x*s, c + (1 - c)*z**2, 0];
        } else {
            const a = (axis + 1) % 3;
            const b = (axis + 2) % 3;
            r[a][a] = r[b][b] = cos(angle);
            r[a][b] = -(r[b][a] = sin(angle));
        }

        this.#matrix = compose(this.#matrix, r);
        return this;
    }

    /**
     * Rotate so that srcAxis goes into dstAxis.
     * @param {number[]} srcAxis
     * @param {number[]} dstAxis
     */
    rotateTo(srcAxis, dstAxis) {
        const norm = ([x, y, z]) => sqrt(x*x + y*y + z*z);
        const cross = ([a1, a2, a3], [b1, b2, b3]) => [a2*b3 - a3*b2, a3*b1 - a1*b3, a1*b2 - a2*b1];
        const r = cross(srcAxis, dstAxis);

        if (norm(r) > 0 && !isNaN(r[0] + r[1] + r[2])) {
            const a = arcsin(norm(r) / norm(dstAxis));
            this.rotate(a, r);
        }
        return this;
    }

    /**
     * Rotate by a quaternion
     * @param {number[]} q - a quaternion
     * @returns {this}
     */
    quaternion(q) {
        const h = q[0], i = q[1], j = q[2], k = q[3];
        const norm = h**2 + i**2 + j**2 + k**2;
        const s = norm > 0 ? 2/norm : 0;
        const r = [
            [1 - s*(j**2 + k**2), s*(i*j - k*h), s*(i*k + j*h), 0],
            [s*(i*j + k*h), 1 - s*(i**2 + k**2), s*(j*k - i*h), 0],
            [s*(i*k - j*h), s*(j*k + i*h), 1 - s*(i**2 + j**2), 0],
            [0, 0, 0, 1]
        ];
        this.#matrix = compose(this.#matrix, r);
        return this;
    }

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
        return this.#matrix ? this.#matrix.slice(0, 3).map(
                r => r[0]*v[0] + r[1]*v[1] + r[2]*v[2] + r[3]
            ) : v;
    }

    /**
     * Apply current un-translated coordinate transform to vector v.
     * @param {number[]} v
     * @returns {number[]}
     */
    orient(v) {
        return this.#matrix ? this.#matrix.slice(0, 3).map(
                r => r[0]*v[0] + r[1]*v[1] + r[2]*v[2]
            ) : v;
    }
}
