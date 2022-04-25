import {GeometryOptions} from './GeometryOptions';

/**
 * @property {string} type
 * @property {GeometryOptions} options
 * @property {number[][]} vertices
 * @property {number[][]} faces
 * @property {number[][]} points
 * @property {number[]} point
 * @property {string} text
 */
export class Geometry {
    /** @member {string} */
    type;

    /** @member {GeometryOptions} */
    options;

    /** @member {number[][]} */
    vertices;

    /** @member {number[][]} */
    faces;

    /** @member {number[][]} */
    points;

    /** @member {number[]} */
    point;

    /** @member {string} */
    text;

    /**
     * Class representing a mathcell geometry object.
     * @param {Object} data - mathcell geometry as a primitive Object.
     */
    constructor(data) {
        this.type = data.type;
        this.options = new GeometryOptions(data.options);

        switch (data.type) {
            case 'surface':
                this.vertices = data.vertices;
                this.faces = data.faces;
                break;

            case 'line':
                this.points = data.points;
                break;

            case 'point':
                this.point = data.point;
                break;

            case 'text':
                this.point = data.point;
                this.text = data.text;
                break;

            default:
                console.log(data);
                throw new Error('Unknown Geometry type: ' + data.type);
        }
    }
}
