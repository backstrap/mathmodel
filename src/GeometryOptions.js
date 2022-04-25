
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

    /**
     * @param {Object} data - option data as an primitive Object
     */
    constructor(data) {
        this.group = data.group;
        this.color = data.color;
        this.opacity = data.opacity;
        this.colormap = data.colormap;
        this.complexFunction = data.complexFunction;
    }
}
