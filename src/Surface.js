// noinspection JSUnusedGlobalSymbols

import {ceiling, sqrt, exp, complex, sin, cos, pi} from '@backstrap/math';
import {Shape} from './Shape';

/**
 * Class representing a factory for various simple 2D surfaces.
 * @extends Coords
 */
export class Surface extends Shape {
    /**
     * @param {number} w - width
     * @param {number} h - height
     * @returns {Geometry[]}
     */
    rect(w = 1, h = w) {
        return this.surface((u, v) => [w*u, h*v, 0], [-0.5, 0.5, 1], [-0.5, 0.5, 1]);
    }

    /**
     * @param {number} w - width
     * @param {number} h - height
     * @returns {Geometry[]}
     */
    rightTriangle(w = 1, h = w) {
        return this.surface((u, v) => [w*u*(1 - v), h*v, 0], [0, 1, 1], [0, 1, 1]);
    }

    /**
     * Generate a regular polygon with N sides.
     *
     * @param {number} n - number of sides
     * @param {number} r - radius of circumscribed circle
     * @returns {Geometry[]}
     */
    polygon(n = 5, r = 1) {
        return this.surface(
            (u, v) => u ? ((c => [r*c.re, r*c.im, 0])(exp(complex(0, v)))) : [0, 0, 0],
            [0, 1, 1],
            [0, 2*pi, n]
        );
    }

    /**
     * Generate a conic section, or a portion of one (annulus, cylinder, cone, etc.)
     *
     * @param {number} r1 - inner radius
     * @param {number} r2 - outer radius
     * @param {number} h - height
     * @param {number} angle - included arc angle
     * @returns {Geometry[]}
     */
    conic(r1 = 0, r2 = 1, h = 1, angle = 2*pi) {
        return this.surface(
            (u, v) => [
                (r1 + u*(r2 - r1))*cos(angle*v),
                (r1 + u*(r2 - r1))*sin(angle*v),
                (0.5 - u)*h
            ],
            [0, 1, 1],
            [0, 1, ceiling(this.dv*angle/(2*pi))]
        );
    }

    /**
     * Generate a disc, or a portion of one.
     *
     * @param {number} r - radius
     * @param {number} angle - included arc angle
     * @returns {Geometry[]}
     */
    disc(r = 1, angle = 2*pi) {
        return this.conic(0, r, 0, angle);
    }

    /**
     * Generate a cylinder, or a portion of one.
     *
     * @param {number} r - radius
     * @param {number} h - height
     * @param {number} angle - included arc angle
     * @returns {Geometry[]}
     */
    cylinder(r = 1, h = 1, angle = 2*pi) {
        return this.conic(r, r, h, angle);
    }

    /**
     * Generate a hemisphere with cubic tesselation.
     *
     * @param {number} r - radius
     * @param {boolean} [rev] - reverse orientation (normal pointing inward)
     * @returns {Geometry[]}
     */
    hemisphere(r = 1, rev) {
        const dv = ceiling(this.dv/4);
        const sRange = [-0.5, 0.5, dv];
        const tRange = [rev ? 0.5 : 0, rev ? 0 : 0.5, dv];
        const dist = (u, v) => r/sqrt(u*u + v*v + 0.25);

        return [
            this.surface((u, v) => (p => [ u*p,  v*p, p/2])(dist(u, v)), sRange, rev ? [0.5, -0.5, dv] : sRange),
            this.surface((u, v) => (p => [ p/2,  u*p, v*p])(dist(u, v)), sRange, tRange),
            this.surface((u, v) => (p => [ u*p, -p/2, v*p])(dist(u, v)), sRange, tRange),
            this.surface((u, v) => (p => [-p/2, -u*p, v*p])(dist(u, v)), sRange, tRange),
            this.surface((u, v) => (p => [-u*p,  p/2, v*p])(dist(u, v)), sRange, tRange),
        ].flat();
    }

    /**
     * Generate a sphere with lat/lon tesselation, or a portion of a spherical surface.
     *
     * @param {number} r - radius
     * @param {number|function(number): number} angle - longitudinal segment size (0 to 2*pi)
     * @param {number} azimuth - latitudinal segment size (0 to pi)
     * @param {number} offset - latitudinal offset (+/-(pi - azimuth)/2)
     * @param {boolean} rev - reverse orientation (normal pointing inward)
     * @returns {Geometry[]}
     */
    sphereBand(r = 1, angle = 2*pi, azimuth = pi, offset = 0, rev) {
        const getAngle = (typeof angle === 'function' ? angle : (() => angle));
        return this.surface(
            (u, v) => [
                r*cos(getAngle(v)*u)*cos(azimuth*v + offset),
                r*sin(getAngle(v)*u)*cos(azimuth*v + offset),
                r*sin(azimuth*v + offset)
            ],
            [-0.5, 0.5, 2*ceiling(this.dv*getAngle(0)/(2*pi))],
            [rev ? 0.5 : -0.5, rev ? -0.5 : 0.5, 2*ceiling(this.dv*azimuth/(2*pi))]
        );
    }
}
