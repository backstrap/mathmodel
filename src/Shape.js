// noinspection JSUnusedGlobalSymbols

import {parametric, wireframe} from '@backstrap/mathcell';
import {Graphable} from './Graphable';
import {Geometry} from './Geometry';

/**
 * Class representing a factory for basic graphic objects.
 * @extends Graphable
 */
export class Shape extends Graphable {
    /**
     * Current surface-drawing style - either "surface" or "wireframe"
     * @member {string}
     */
    #style;

    /**
     * @param {Shape|Graphable|Coords} parent
     */
    constructor(parent = null) {
        super(parent);
        this.#style = parent && parent.#style ? parent.#style : 'surface';
    }

    /**
     * Set the drawing style of the surface() method.
     * Allows for easy dynamic switching between solid and wireframe views.
     * @param {string} style - either 'surface' or 'wireframe'.
     * @returns {this}
     */
    style(style) {
        if (style === 'surface' || style === 'wireframe') {
            this.#style = style;
        }
        return this;
    }

    /**
     * Draw a parametric curve.
     * @param {function(number): number[]} f - parametric function
     * @param {number[]} u - parametric coordinate range
     * @returns {Geometry[][]}
     */
    curve(f, u) {
        return this.#objectify(parametric((s) => this.transform(f(s)), u, this.options()));
    }

    /**
     * Draw a wireframe of a parametric surface.
     * @param {function(number, number): number[]} f - parametric function
     * @param {number[]} u - first parametric coordinate range
     * @param {number[]} v - second parametric coordinate range
     * @returns {Geometry[][]}
     */
    wireframe(f, u, v) {
        return this.#objectify(wireframe((s, t) => this.transform(f(s, t)), u, v, this.options()));
    }

    /**
     * Draw a parametric surface (or a wireframe representation, if our style has been set to "wireframe").
     * @param {function(number, number): number[]} f - parametric function
     * @param {number[]} u - first parametric coordinate range
     * @param {number[]} v - second parametric coordinate range
     * @returns {Geometry[][]}
     */
    surface(f, u, v) {
        const mapper = (this.#style === 'wireframe' ? wireframe : parametric);
        return this.#objectify(mapper((s, t) => this.transform(f(s, t)), u, v, this.options()));
    }

    /**
     * @param {Object[]} arr
     * @returns {Geometry[][]}
     */
    #objectify(arr) {
        return [arr.map(obj => new Geometry(obj))];
    }
}
