// noinspection JSUnusedGlobalSymbols

import {point, text, listPlot, surfaceFromLines} from '@backstrap/mathcell';
import {Shape} from './Shape';
import {Geometry} from './Geometry';

/**
 * Class representing a factory for various plotting graphics.
 * @extends Shape
 */
export class Plot extends Shape {
    /**
     * Draw a text string.
     * @param {string} str - the text to display
     * @param {number[]} vector - position to display the text at
     * @returns {Geometry[]}
     */
    text(str, vector) {
        return this.#objectify(text(str, this.transform(vector), this.options()));
    }

    /**
     * Plot a single point.
     * @param {number[]} vector - position of point to be plotted
     * @returns {Geometry[]}
     */
    point(vector) {
        return this.#objectify(point(this.transform(vector), this.options()));
    }

    /**
     * Plot a list of points.
     * @param {number[][]} points - list of points to be plotted.
     * @returns {Geometry[]}
     */
    listPlot(points) {
        return this.#objectify(listPlot(points.map(p => this.transform(p)), this.options()));
    }

    /**
     * Plot a curve (polyline) from a list of points.
     * @param {number[][]} vertices - list of points on the curve.
     * @returns {Geometry[]}
     */
    curvePlot(vertices) {
        return this.#objectify(surfaceFromLines([vertices.map(p => this.transform(p))], this.options()));
    }

    /**
     * Uses the mathcell surfaceFromLines() function to draw a surface.
     * @param {number[][][]} vertices - 2D array of points to use as a surface mesh
     * @returns {Geometry[]}
     */
    surfacePlot(vertices) {
        return this.#objectify(surfaceFromLines(vertices.map(row => row.map(p => this.transform(p))), this.options()));
    }

    /**
     * @param {Object[]} arr
     * @returns {Geometry[]}
     */
    #objectify(arr) {
        return arr.map(obj => new Geometry(obj));
    }
}
