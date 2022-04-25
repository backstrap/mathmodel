
/**
 * Class representing mathcell geometry options.
 */
export class GeometryOptions {
    /** @member {string} */
    group;

    /** @member {string} */
    color;

    /** @member {number} */
    opacity;

    /** @member {function} */
    colormap;

    /** @member {string} */
    complexFunction;

    /** @member {boolean} */
    singleSide;

    /** @member {number[]} */
    rotationOrigin;

    /** @member {(number|number[])[]} */
    rotationAxisAngle;

    // TODO Add more properties.

    /**
     * @param {Object} data - option data as a primitive Object
     */
    constructor(data = {}) {
        this.group = data.group;
        this.color = data.color;
        this.opacity = data.opacity;
        this.colormap = data.colormap;
        this.complexFunction = data.complexFunction;
        this.singleSide = data.singleSide;
        this.rotationOrigin = data.rotationOrigin;
        this.rotationAxisAngle = data.rotationAxisAngle;
    }
}
