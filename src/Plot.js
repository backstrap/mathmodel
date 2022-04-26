import {point, text} from '@backstrap/mathcell';
import {Shape} from './Shape';
import {Geometry} from './Geometry';

/**
 * Class representing a factory for various plotting graphics.
 * @extends Shape
 */
export class Plot extends Shape {
    /**
     * @param {number[]} vector
     * @returns {Geometry[][]}
     */
    point(vector) {
        return [point(vector, this.options()).map(obj => new Geometry(obj))];
    }

    /**
     * @param {string} str
     * @param {number[]} vector
     * @returns {Geometry[][]}
     */
    text(str, vector) {
        return [text(str, vector, this.options()).map(obj => new Geometry(obj))];
    }

    // TODO Impl. plot, listPlot, polyline, isoline, etc.
}
