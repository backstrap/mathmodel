/**
 * @typedef {Object} rotationOption
 * @property {number[]} axis
 * @property {number} angle
 * @property {number[]} [origin]
 */
/**
 * @typedef {Object} translationOption
 * @property {string|function(number):number[]} path
 * @property {number} [step]
 */
/**
 * @typedef {Object} colorsOption
 * @property {number} r
 * @property {number} g
 * @property {number} b
 */
/**
 * @typedef {Object} geometryOptions
 * @property {string} [group]
 * @property {string} [material]
 * @property {string} [color]
 * @property {string} [colormap]
 * @property {colorsOption[]} [colors]
 * @property {number} [opacity]
 * @property {number} [renderOrder]
 * @property {boolean} [complexFunction]
 * @property {boolean} [singleSide]
 * @property {rotationOption} [rotation]
 * @property {translationOption} [translation]
 * @property {number} [fontSize]
 * @property {number} [size]
 * @property {number} [linewidth]
 * @property {number} [maxFaceSlope]
 * @property {boolean} [fill]
 * @property {boolean} [useLineSegments]
 * @property {boolean} [openEnded]
 * @property {number[]} [center]
 * @property {number[]} [axis]
 * @property {boolean} [endcaps]
 * @property {number} [radius]
 * @property {number} [steps]
 */
/**
 * Class representing mathcell geometry options.
 */
export class GeometryOptions {
    /**
     * @param {geometryOptions} data - option data as a primitive Object
     */
    constructor(data = {}) {
        Object.assign(this, data);
    }
}
