import {ceiling, round, sqrt, exp, complex, sin, cos, pi} from '@backstrap/math';
import {parametric, wireframe} from '@backstrap/mathcell';
import {Coords} from './Coords';
import {Geometry} from './Geometry';

/**
 * Class representing a factory for basic graphic objects.
 * @extends Coords
 */
export class Shape extends Coords {
    #config = {
        color: 'hsl(200,95%,50%)',
    };

    #props = {
        style: 'surface',
        hue: 200,
        saturation: 95,
        lightness: 50,
        color: function () {return (
            (({hue, saturation, lightness}) => `hsl(${hue},${saturation}%,${lightness}%)`)(this)
        );},
    }

    /**
     * @param {Shape|Coords} parent
     */
    constructor(parent = null) {
        super(parent);
        this.#config = parent ? {...parent.#config} : this.#config;
        this.#props = parent ? {...parent.#props} : this.#props;
    }

    /**
     * @param {Object} config
     * @returns {this}
     */
    setParams(config = {}) {
        this.#config = Object.assign({}, this.#config, config);
        return this;
    }

    /**
     * @param {number} opacity
     * @returns {this}
     */
    opacity(opacity) {
        return this.setParams({opacity});
    }

    /**
     * @param {string} color
     * @returns {this}
     */
    color(color) {
        return this.setParams({color});
    }

    /**
     * @param {number} hue - hue as a percentage of a circle (0-100)
     * @returns {this}
     */
    hue(hue = 0) {
        // Convert percentage to degrees.
        this.#props.hue = round(360*hue)/100;
        return this.color(this.#props.color());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {number} saturation - saturation percentage
     * @returns {this}
     */
    saturation(saturation = 0) {
        this.#props.saturation = round(1000*saturation)/1000;
        return this.color(this.#props.color());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {number} lightness - lightness percentage
     * @returns {this}
     */
    lightness(lightness = 0) {
        this.#props.lightness = round(1000*lightness)/1000;
        return this.color(this.#props.color());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {string} style - either 'surface' or 'wireframe'.
     * @returns {this}
     */
    style(style) {
        if (style === 'surface' || style === 'wireframe') {
            this.#props.style = style;
        }
        return this;
    }

    /**
     * @param {function(number): number[]} f - parametric function
     * @param {number[]} u - parametric coordinate range
     * @returns {Geometry[]}
     */
    curve(f, u) {
        return [new Geometry(parametric((s) => this.transform(f(s)), u, {...this.#config}))];
    }

    /**
     * @param {function(number, number): number[]} f - parametric function
     * @param {number[]} u - first parametric coordinate range
     * @param {number[]} v - second parametric coordinate range
     * @returns {Geometry[]}
     */
    wireframe(f, u, v) {
        return [new Geometry(wireframe((s, t) => this.transform(f(s, t)), u, v, {...this.#config}))];
    }

    /**
     * @param {function(number, number): number[]} f - parametric function
     * @param {number[]} u - first parametric coordinate range
     * @param {number[]} v - second parametric coordinate range
     * @returns {Geometry[]}
     */
    surface(f, u, v) {
        const mapper = (this.#props.style === 'wireframe' ? wireframe : parametric);
        return [new Geometry(mapper((s, t) => this.transform(f(s, t)), u, v, {...this.#config}))];
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {number} w - width
     * @param {number} h - height
     */
    rect(w = 1, h = w) {
        return this.surface((u, v) => [w*u, h*v, 0], [-0.5, 0.5, 1], [-0.5, 0.5, 1]);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {number} w - width
     * @param {number} h - height
     */
    rightTriangle(w = 1, h = w) {
        return this.surface((u, v) => [w*u*(1 - v), h*v, 0], [0, 1, 1], [0, 1, 1]);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {number} n - number of sides
     * @param {number} r - radius of circumscribed circle
     */
    polygon(n = 5, r = 1) {
        return this.surface(
            (u, v) => u ? ((c => [r*c.re, r*c.im, 0])(exp(complex(0, v)))) : [0, 0, 0],
            [0, 1, 1],
            [0, 2*pi, n]
        );
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Generate a disc, or a portion of one.
     *
     * @param {number} r - radius
     * @param {number} angle - included arc angle
     */
    disc(r = 1, angle = 2*pi) {
        return this.surface(
            (u, v) => [u && r*sin(angle*v), u && r*cos(angle*v), 0],
            [0, 1, 1],
            [0, 1, ceiling(this.dv*angle/(2*pi))]
        );
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Generate a conic section, or a portion of one (annulus, cylinder, cone, etc.)
     *
     * @param {number} r1 - inner radius
     * @param {number} r2 - outer radius
     * @param {number} h - height
     * @param {number} angle - included arc angle
     */
    conic(r1 = 1, r2 = 2, h = 0, angle = 2*pi) {
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

    // noinspection JSUnusedGlobalSymbols
    /**
     * Generate a sphere, or a portion of a spherical surface.
     *
     * @param {number} r - radius
     * @param {number|function(number): number} angle - longitudinal segment size (0 to 2*pi)
     * @param {number} azimuth - latitudinal segment size (0 to pi)
     * @param {number} offset - latitudinal offset (+/-(pi - azimuth)/2)
     */
    sphereBand(r = 1, angle = 2*pi, azimuth = pi, offset = 0) {
        const getAngle = (typeof angle === 'function' ? angle : (() => angle));
        return this.surface(
            (u, v) => [
                r*cos(getAngle(v)*u)*cos(azimuth*v + offset),
                r*sin(getAngle(v)*u)*cos(azimuth*v + offset),
                r*sin(azimuth*v + offset)
            ],
            [-0.5, 0.5, 2*ceiling(this.dv*getAngle(0)/(2*pi))],
            [-0.5, 0.5, 2*ceiling(this.dv*azimuth/(2*pi))]
        );
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Generate a sphere with cubic tesselation.
     *
     * @param {number} r - radius
     */
    sphere(r = 1) {
        const dv = ceiling(this.dv/4);
        const uvRange = [-0.5, 0.5, dv];
        const dist = (u, v) => r/sqrt(u*u + v*v + 0.25);

        return [
            this.surface((u, v) => (p => [ u*p,  v*p,  p/2])(dist(u, v)), uvRange, uvRange),
            this.surface((u, v) => (p => [ u*p, -v*p, -p/2])(dist(u, v)), uvRange, uvRange),
            this.surface((u, v) => (p => [ p/2,  u*p,  v*p])(dist(u, v)), uvRange, uvRange),
            this.surface((u, v) => (p => [ u*p, -p/2,  v*p])(dist(u, v)), uvRange, uvRange),
            this.surface((u, v) => (p => [-p/2, -u*p,  v*p])(dist(u, v)), uvRange, uvRange),
            this.surface((u, v) => (p => [-u*p,  p/2,  v*p])(dist(u, v)), uvRange, uvRange),
        ].flat();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Generate a hemisphere with cubic tesselation.
     *
     * @param {number} r - radius
     */
    hemisphere(r = 1) {
        const dv = ceiling(this.dv/4);
        const sRange = [-0.5, 0.5, dv];
        const tRange = [0, 0.5, dv];
        const dist = (u, v) => r/sqrt(u*u + v*v + 0.25);

        return [
            this.surface((u, v) => (p => [ u*p,  v*p, p/2])(dist(u, v)), sRange, sRange),
            this.surface((u, v) => (p => [ p/2,  u*p, v*p])(dist(u, v)), sRange, tRange),
            this.surface((u, v) => (p => [ u*p, -p/2, v*p])(dist(u, v)), sRange, tRange),
            this.surface((u, v) => (p => [-p/2, -u*p, v*p])(dist(u, v)), sRange, tRange),
            this.surface((u, v) => (p => [-u*p,  p/2, v*p])(dist(u, v)), sRange, tRange),
        ].flat();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Generate a regular torus.
     *
     * @param {number} r1 - primary radius
     * @param {number} r2 - secondary radius
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
