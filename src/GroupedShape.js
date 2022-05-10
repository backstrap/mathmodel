import {generateId} from '@backstrap/mathcell';
import {Shape} from './Shape';

/**
 * Class representing a shape whose elements are grouped by a unique id.
 * @extends Shape
 */
export class GroupedShape extends Shape {
    /**
     * @param {GroupedShape|Shape|Coords} [parent]
     */
    constructor(parent = null) {
        super(parent);
        this.setOptions({
            group: this.constructor.name + '-' + generateId(),
        });
    }
}
