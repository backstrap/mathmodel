import {threejsGraphic} from './threejsGraphic';

/* IOSFix() code taken from @backstrap/mathcell/src/core.js */
const iOSFix = output => {
    const iframe = output.children[0];

    if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
        iframe.style.width = getComputedStyle(iframe).width;
        iframe.style.height = getComputedStyle(iframe).height;
    }
};

/**
 * Class representing a MathCell display output cell.
 * Used by {@link MathModel} only.
 * @protected
 */
export class Canvas {
    /** @member {string} */
    #scriptUrl = './main.js';

    /** @member {string} */
    #id;

    /** @member {Geometry[][]} */
    #data = [];

    /** @member {renderConfig} */
    #config = {
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
     * Set the location of the script URL for the rendering engine.
     * @param {string} scriptUrl
     * @returns {this}
     */
    setScriptUrl(scriptUrl) {
        this.#scriptUrl = scriptUrl;
        return this;
    }

    /**
     * Add graphics object to the buffer.
     * @param {Geometry[][]} objs
     * @returns {this}
     */
    add(objs) {
        this.#data = this.#data.concat(objs);
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
        this.#evaluate(this.#id, this.#data, this.#config);
        return this;
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Code based on @backstrap/mathcell/src/core.js:evaluate()
     *
     * @param {string} id - the id of a document element
     * @param {Geometry[][]|Geometry[][][]} data - data to be rendered
     * @param {renderConfig} config - a rendering configuration
     */
    #evaluate(id, data, config) {
        const outputs = document.querySelectorAll('[id^=' + id + 'output]');

        if (outputs.length === 1) {
            const output = outputs[0];

            output.innerHTML = threejsGraphic(id, data, config, this.#scriptUrl);
            iOSFix(output);
        } else {
            for (let i = 0 ; i < outputs.length ; i ++) {
                const output = outputs[i];
                const n = output.id.substring(output.id.indexOf('output') + 6);
                const c = Array.isArray(config) ? config[i] : JSON.parse(JSON.stringify(config));

                c.output = n;
                c.no3DBorder = true;
                output.innerHTML = threejsGraphic(id, data[i], c, this.#scriptUrl);
                iOSFix(output);
            }
        }
    }
}
