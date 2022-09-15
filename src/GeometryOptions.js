/*
 * Known options:
 *
 * group, color, opacity, colormap, material, colors, renderOrder,
 * complexFunction, singleSide, rotation, translation,
 * fontSize, size, linewidth, useLineSegments, level, fill, maxFaceSlope,
 * openEnded, center, axis, endcaps, radius, steps.
 */
/**
 * Class representing mathcell geometry options.
 */
export class GeometryOptions {
    /**
     * @param {Object} data - option data as a primitive Object
     */
    constructor(data = {}) {
        Object.assign(this, data);
    }
}
