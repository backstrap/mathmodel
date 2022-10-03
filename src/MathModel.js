// noinspection JSUnusedGlobalSymbols

import {MathCell, generateId, getVariable, checkLimits} from '@backstrap/mathcell';
import {Canvas} from './Canvas';

/**
 * @typedef {Object} renderConfig
 * @property {boolean}             [axes]
 * @property {boolean}             [animate]
 * @property {boolean}             [animateOnInteraction]
 * @property {boolean}             [equalAspect]
 * @property {boolean}             [frame]
 * @property {number}              [cameraNear]
 * @property {number}              [cameraFar]
 * @property {number}              [decimals]
 * @property {number}              [suspendTimeout]
 * @property {number}              [xMin]
 * @property {number}              [yMin]
 * @property {number}              [zMin]
 * @property {number}              [xMax]
 * @property {number}              [yMax]
 * @property {number}              [zMax]
 * @property {number[]}            [aspectRatio]
 * @property {number[]}            [viewpoint]
 * @property {number[]}            [viewDistance]
 * @property {number[]|number[][]} [clippingPlane]
 * @property {string}              [ambientLight]
 * @property {string}              [clearColor]
 * @property {string[]}            [axesLabel]
 */
/**
 * @typedef {Object} baseConfig
 * @property {string} type
 * @property {string} name
 * @property {string} [label]
 * @property {number} [default]
 */
/**
 * @typedef {baseConfig} buttonsConfig
 * @property {number[]} [values]
 */
/**
 * @typedef {baseConfig} sliderConfig
 * @property {number} [min]
 * @property {number} [max]
 */
/**
 * @typedef {buttonsConfig|sliderConfig} inputConfig
 */
/**
 * @typedef {inputConfig[]|inputConfig[][]} inputConfigSet
 */

/**
 * @type {function(string): HTMLElement}
 * @private
 */
const getNode = (id => document.getElementById(id));

/**
 * Class representing a MathCell graphic.
 */
export class MathModel {
    /**
     * A MathCell rendering configuration
     * @member {renderConfig}
     */
    config = {};

    /**
     * A hierarchical array of input configurations
     * @member {inputConfigSet}
     */
    inputs = [];

    /**
     * The Canvas object on which we will draw our graphics
     * @member {Canvas}
     */
    canvas = new Canvas('', {});

    // noinspection JSUnusedGlobalSymbols
    /**
     * Attempt to load all mathcells in a document
     * @param {Object} classMap - an object which maps id's to Classes
     * @param {Document} document - a DOM document (defaults to window.document)
     */
    static loadMathCells(classMap, document = window.document) {
        const win = document.defaultView || window;
        // For input onchange events
        win.checkLimits = checkLimits;

        win.addEventListener('load', () => {
            for (const cell of document.getElementsByClassName('mathcell')) {
                /** @type {function(string=)} */
                const Model = classMap[cell.id];

                if (Model) {
                    new Model(cell.id).run(cell);
                } else {
                    console.warn('Unknown model id "' + cell.id + '"');
                }
            }
        });
    }

    /**
     * If a subclass overrides beforeUpdate(), and it returns a truthy value,
     * then the canvas' screen will be cleared before attempting to redraw the content.
     * If beforeUpdate() returns a falsy value, the content redraw will happen synchronously instead.
     *
     * @param {Object} params - the parameter values from our configured inputs
     */
    beforeUpdate(params) { }

    /**
     * @param {Object} params - the parameter values from our configured inputs
     */
    update(params) { }

    /**
     * Build an interactive Math Cell in a DOM node.
     *
     * @param {HTMLElement|string} node - A DOM node, or the id of one.
     */
    run(node) {
        let id = node;
        let first = true;

        if (typeof id === 'string' || id instanceof String) {
            node = getNode(id);
        } else {
            id = node.id || (node.id = generateId());
        }

        this.canvas = new Canvas(id, this.config);
        MathCell(id, this.inputs);
        node.update = (id => {
            try {
                const values = this.#getValues(id, this.inputs);

                this.canvas.clear();

                if (this.beforeUpdate(values)) {
                    // Draw a blank canvas.
                    first = first ? false : this.canvas.show()&&false;

                    // Allow any DOM changes in beforeUpdate() to take effect.
                    setTimeout(() => {
                        this.update(values);
                        this.canvas.show();
                    }, 0);
                } else {
                    this.update(values);
                    this.canvas.show();
                }
            } catch (e) {
                document.getElementById(id + 'output').innerHTML = e.toString();
                throw e;
            }
        });
        node.update(id);
    }

    /**
     * Add some geometry to the current drawing
     * @param {Geometry[]} objs
     */
    add(...objs) {
        objs.map(obj => this.canvas.add(obj));
        return this;
    }

    /**
     * Modify the rendering configuration
     * @param {renderConfig} config - the parameters to be updated
     */
    configure(config) {
        this.canvas.configure(config);
        return this;
    }

    /**
     * Get the values from our configured inputs
     * @param {string} id
     * @param {inputConfigSet} inputs
     * @returns {Object}
     */
    #getValues(id, inputs) {
        return inputs.reduce(
            (values, input) => Object.assign(
                values,
                Array.isArray(input)
                    ? this.#getValues(id, input)
                    : {[input.name]: getVariable(id, input.name)}
            ),
            {}
        );
    }
}
