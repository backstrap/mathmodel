// noinspection JSUnusedGlobalSymbols

import {ceiling, sqrt, sin, cos, pi} from '@backstrap/math';
import {Shape} from './Shape';
import {Surface} from './Surface';

/**
 * Class representing a factory for various simple solid objects.
 * @extends Coords
 */
export class Solid extends Shape {
    /**
     * @type {function(number=, number=, number=): Geometry[]}
     * @param {number} [w] - width
     * @param {number} [h] - height
     * @param {number} [d] - depth
     * @returns {Geometry[]}
     */
    block(w = 1, h = w, d = h) {
        return [
            (u, v) => [-w/2, h*(u - 0.5), -d*(v - 0.5)],
            (u, v) => [w/2, h*(u - 0.5), d*(v - 0.5)],
            (u, v) => [w*(u - 0.5), -h/2, d*(v - 0.5)],
            (u, v) => [w*(u - 0.5), h/2, -d*(v - 0.5)],
            (u, v) => [w*(u - 0.5), -h*(v - 0.5), -d/2],
            (u, v) => [w*(u - 0.5), h*(v - 0.5), d/2],
        ].map(f => this.surface(f, [0, 1, 1], [0, 1, 1])).flat();
    }

    /**
     * Generate a rod - a cylinder with closed ends.
     *
     * @type {function(number=, number=): Geometry[]}
     * @param [r] - radius
     * @param [h] - height
     * @returns {Geometry[]}
     */
    rod(r = 1, h = 1) {
        const surface = new Surface(this);
        return surface.surface.cylinder(r, h)
            .concat(surface.surface.dupe().translate(h*0.5, 0, 0).disc(r))
            .concat(surface.surface.dupe().translate(-h*0.5, 0, 0).rotate(pi).disc(r));
    }

    /**
     * Generate a cone, or a portion of one.
     *
     * @param {number} r - radius
     * @param {number} h - height
     * @param {number} angle - included arc angle
     * @returns {Geometry[]}
     */
    cone(r = 1, h = 1, angle = 2*pi) {
        const surface = new Surface(this);
        return surface.conic(0, r, h, angle)
            .concat(surface.dupe().translate(-h*0.5, 0, 0).rotate(pi).disc(r));
    }

    /**
     * Generate a sphere with cubic tesselation.
     *
     * @param {number} r - radius
     * @returns {Geometry[]}
     */
    sphere(r = 1) {
        const dv = ceiling(this.dv/4);
        const uvRange = [-0.5, 0.5, dv];
        const dist = (u, v) => r/sqrt(u*u + v*v + 0.25);

        return [
            p => [ u*p,  v*p,  p/2],
            p => [ u*p, -v*p, -p/2],
            p => [ p/2,  u*p,  v*p],
            p => [ u*p, -p/2,  v*p],
            p => [-p/2, -u*p,  v*p],
            p => [-u*p,  p/2,  v*p],
        ].map(f => this.surface((u, v) => f(dist(u, v)),  uvRange, uvRange)).flat();
    }

    /**
     * Generate a regular torus.
     *
     * @param {number} r1 - primary radius
     * @param {number} r2 - secondary radius
     * @returns {Geometry[]}
     */
    torus(r1 = 2, r2 = 1) {
        const uvRange = [0, 2*pi, this.dv];

        return this.surface((u, v) => [
            (r1 + r2*cos(v))*cos(u),
            (r1 + r2*cos(v))*sin(u),
            r2*sin(v)
        ], uvRange, uvRange);
    }
}
