// noinspection JSUnusedGlobalSymbols

import {round} from '@backstrap/math';
import {cleanCopy} from './helpers';
import {Coords} from './Coords';

/**
 * Convert color properties to a CSS color string.
 * @param {Object} color
 * @param {number} color.hue - color hue (0-360)
 * @param {number} color.saturation - color saturation percentage
 * @param {number} color.lightness - color lightness percentage
 * @returns {string}
 * @private
 */
const hslColor = function ({hue, saturation, lightness}) {
    return `hsl(${hue},${saturation}%,${lightness}%)`;
}

/**
 * Class representing a graphable object.
 * Provides support for graphing options including color and opacity,
 * in addition to a local coordinate system via its parent class, Coords.
 * @extends Coords
 */
export class Graphable extends Coords {
    #options = {
        color: 'hsl(200,95%,50%)',
    };

    #color = {
        hue: 200,
        saturation: 95,
        lightness: 50,
    }

    /**
     * @param {Graphable|Coords} [parent]
     */
    constructor(parent = null) {
        super(parent);
        this.#options = parent && parent.#options ? parent.options() : this.#options;
        this.#color = parent && parent.#color ? {...parent.#color} : this.#color;
    }

    /**
     * Returns a deep clone of the options object.
     * @returns {Object}
     */
    options() {
        return cleanCopy(this.#options);
    }

    /**
     * @param {Object} options
     * @returns {this}
     */
    setOptions(options) {
        this.#options = Object.assign({}, this.#options, options);
        return this;
    }

    /**
     * @param {number} opacity
     * @returns {this}
     */
    opacity(opacity) {
        return this.setOptions({opacity});
    }

    /**
     * @param {string} color
     * @returns {this}
     */
    color(color) {
        return this.setOptions({color});
    }

    /**
     * @param {number} [hue] - hue as degrees on a color wheel (0-360)
     * @returns {this}
     */
    hue(hue = 0) {
        this.#color.hue = round(1000*hue)/1000;
        return this.color(hslColor(this.#color));
    }

    /**
     * @param {number} [saturation] - saturation percentage
     * @returns {this}
     */
    saturation(saturation = 0) {
        this.#color.saturation = round(1000*saturation)/1000;
        return this.color(hslColor(this.#color));
    }

    /**
     * @param {number} [lightness] - lightness percentage
     * @returns {this}
     */
    lightness(lightness = 0) {
        this.#color.lightness = round(1000*lightness)/1000;
        return this.color(hslColor(this.#color));
    }
}
