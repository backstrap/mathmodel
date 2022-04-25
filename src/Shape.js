// noinspection JSUnusedGlobalSymbols

import {round} from '@backstrap/math';
import {parametric, wireframe} from '@backstrap/mathcell';
import {Coords} from './Coords';
import {Geometry} from './Geometry';

/**
 * Class representing a factory for basic graphic objects.
 * @extends Coords
 */
export class Shape extends Coords {
    #config = {
        color: 'hsl(200,95%,50%)',
    };

    #props = {
        style: 'surface',
        hue: 200,
        saturation: 95,
        lightness: 50,
        color: function () {return (
            (({hue, saturation, lightness}) => `hsl(${hue},${saturation}%,${lightness}%)`)(this)
        );},
    }

    /**
     * @param {Shape|Coords} parent
     */
    constructor(parent = null) {
        super(parent);
        this.#config = parent ? {...parent.#config} : this.#config;
        this.#props = parent ? {...parent.#props} : this.#props;
    }

    /**
     * @param {Object} config
     * @returns {this}
     */
    setParams(config = {}) {
        this.#config = Object.assign({}, this.#config, config);
        return this;
    }

    /**
     * @param {number} opacity
     * @returns {this}
     */
    opacity(opacity) {
        return this.setParams({opacity});
    }

    /**
     * @param {string} color
     * @returns {this}
     */
    color(color) {
        return this.setParams({color});
    }

    /**
     * @param {number} hue - hue as degrees on a color wheel (0-360)
     * @returns {this}
     */
    hue(hue = 0) {
        this.#props.hue = round(1000*hue)/1000;
        return this.color(this.#props.color());
    }

    /**
     * @param {number} saturation - saturation percentage
     * @returns {this}
     */
    saturation(saturation = 0) {
        this.#props.saturation = round(1000*saturation)/1000;
        return this.color(this.#props.color());
    }

    /**
     * @param {number} lightness - lightness percentage
     * @returns {this}
     */
    lightness(lightness = 0) {
        this.#props.lightness = round(1000*lightness)/1000;
        return this.color(this.#props.color());
    }

    /**
     * @param {string} style - either 'surface' or 'wireframe'.
     * @returns {this}
     */
    style(style) {
        if (style === 'surface' || style === 'wireframe') {
            this.#props.style = style;
        }
        return this;
    }

    /**
     * @param {function(number): number[]} f - parametric function
     * @param {number[]} u - parametric coordinate range
     * @returns {Geometry[]}
     */
    curve(f, u) {
        return this.#objectify(parametric((s) => this.transform(f(s)), u, {...this.#config}));
    }

    /**
     * @param {function(number, number): number[]} f - parametric function
     * @param {number[]} u - first parametric coordinate range
     * @param {number[]} v - second parametric coordinate range
     * @returns {Geometry[]}
     */
    wireframe(f, u, v) {
        return this.#objectify(wireframe((s, t) => this.transform(f(s, t)), u, v, {...this.#config}));
    }

    /**
     * @param {function(number, number): number[]} f - parametric function
     * @param {number[]} u - first parametric coordinate range
     * @param {number[]} v - second parametric coordinate range
     * @returns {Geometry[][]}
     */
    surface(f, u, v) {
        const mapper = (this.#props.style === 'wireframe' ? wireframe : parametric);
        return this.#objectify(mapper((s, t) => this.transform(f(s, t)), u, v, {...this.#config}));
    }

    /**
     * @param {Object[]} arr
     * @returns {Geometry[][]}
     */
    #objectify(arr) {
        return [arr.map(obj => new Geometry(obj))];
    }
}
