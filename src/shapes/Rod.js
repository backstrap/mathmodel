import {sin, cos, pi} from '@backstrap/math';
import {Shape} from '../Shape';

/**
 * Class representing a rod shape (a solid cylinder).
 * @extends Shape
 */
export class Rod extends Shape {
    /**
     * @type {function(number=, number=): Geometry[]}
     * @param [r] - radius
     * @param [h] - height
     * @returns {Geometry[]}
     */
    get(r = 1, h = 1) {
        return [
            this.surface(
                (u, v) => [h*(u - 0.5), r*sin(2*pi*v), r*cos(2*pi*v)],
                [0, 1, 1],
                [0, 1, this.dv]
            ),
            (this.dupe().translate(h*0.5, 0, 0).rotate(pi/2, 1)).disc(r),
            (this.dupe().translate(-h*0.5, 0, 0).rotate(-pi/2, 1)).disc(r),
        ].flat();
    }
}
