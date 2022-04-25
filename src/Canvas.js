import {evaluate} from '@backstrap/mathcell';

/**
 * Class representing a MathCell display output cell.
 * Used by {@link MathModel} only.
 * @protected
 */
export class Canvas {
    /** @member {string} */
    #id;

    /** @member {Geometry[]} */
    #data = [];

    /** @member {renderConfig} */
    #config = {
        pathToThreejs: '.',
        type: 'threejs',
        frame: false,
        viewpoint: [1, 0, 0],
        equalAspect: true,
    };

    /**
     * @param {string} id
     * @param {renderConfig} config
     */
    constructor(id, config = {}) {
        this.#id = id;
        this.configure(config);
    }

    /**
     * Set display configuration properties.
     * @param {renderConfig} config
     * @returns {this}
     */
    configure(config = {}) {
        Object.assign(this.#config, config);
        return this;
    }

    /**
     * Add graphics object to the buffer.
     * @param {Geometry[]} objs
     * @returns {this}
     */
    add(...objs) {
        objs.forEach(obj => this.#data = this.#data.concat(obj));
        return this;
    }

    /**
     * Clear the buffer of all graphics objects.
     * @returns {this}
     */
    clear() {
        this.#data = [];
        return this;
    }

    /**
     * Draw the current set of graphics to the screen.
     * @returns {this}
     */
    show() {
        evaluate(this.#id, this.#data, this.#config);
        return this;
    }
}
