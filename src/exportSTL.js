// noinspection DuplicatedCode

import {Scene, Vector3} from 'three';
import {STLExporter} from 'three/examples/jsm/exporters/STLExporter';
import {sqrt} from '@backstrap/math';
import {roundTo} from '@backstrap/mathcell';
import {addSurface} from './threejsScene';
import {canonicalizeConfig, cleanCopy} from './helpers';

// noinspection JSUnusedGlobalSymbols
/**
 * @param {Geometry[]} data - graphic objects to be drawn
 * @param {boolean} [binary] - whether to export as binary or text STL format
 * @param {renderConfig} [config] - a rendering configuration
 * @returns {string}
 */
export function exportSTL(data, binary = true, config = {})
{
  const v = new Vector3();
  const {subVectors, normalize} = v;
  const proto = Object.getPrototypeOf(v);
  const scene = sceneFromData(data, config);

  // Hack to make STLExporter.parse() print with fixed precision.
  if (!binary) {
      const decimals = config.decimals;

      proto.subVectors = function altSubVectors(a, b) {
          subVectors.call(this, a, b);
          a.x = roundTo(a.x, decimals, false);
          a.y = roundTo(a.y, decimals, false);
          a.z = roundTo(a.z, decimals, false);
          b.x = roundTo(b.x, decimals, false);
          b.y = roundTo(b.y, decimals, false);
          b.z = roundTo(b.z, decimals, false);
          return this;
      };

      proto.normalize = function altNormalize() {
          normalize.call(this);
          this.x = roundTo(this.x, decimals, false);
          this.y = roundTo(this.y, decimals, false);
          this.z = roundTo(this.z, decimals, false);
          return this;
      };
  }

  const result = new STLExporter().parse(scene, {binary: binary});

  if (!binary) {
      proto.subVectors = subVectors;
      proto.normalize = normalize;
  }

  return result;
}

/**
 * sceneFromData() mimics threejsGraphic(), without lights, cameras, axes, texts, points, lines.
 * Note that only surface objects are supported by STL.
 * @param {Geometry[]} data - graphic objects to be drawn
 * @param {renderConfig} config - a rendering configuration
 * @returns {Object3D}
 * @private
 */
function sceneFromData(data, config) {
  // working copy of data
  data = cleanCopy(data);

  const surfaces = [];

  canonicalizeConfig(config, data, [], [], [], surfaces);

  return generateScene(config, surfaces);
}

/**
 * generateScene() mimics renderThree(), without lights, cameras, axes, texts, points, lines.
 * Note that only surface objects are supported by STL.
 * @param {renderConfig} config - a rendering configuration
 * @param {Geometry[]} surfaces - surface objects to be drawn
 * @returns {Object3D}
 * @private
 */
function generateScene(config, surfaces)
{
  const scene = new Scene();
  const a = config.aspectRatio; // aspect multipliers
  let xMin = config.xMin, yMin = config.yMin, zMin = config.zMin;
  let xMax = config.xMax, yMax = config.yMax, zMax = config.zMax;

  if (xMin === xMax) { xMin -= 1; xMax += 1; }
  if (yMin === yMax) { yMin -= 1; yMax += 1; }
  if (zMin === zMax) { zMin -= 1; zMax += 1; }

  // apply aspect multipliers for convenience
  xMin *= a[0]; yMin *= a[1]; zMin *= a[2];
  xMax *= a[0]; yMax *= a[1]; zMax *= a[2];

  const xRange = xMax - xMin;
  const yRange = yMax - yMin;
  const rRange = sqrt( xRange*xRange + yRange*yRange );
  let zRange = zMax - zMin;

  if (zRange > rRange && a[2] === 1 && !config.equalAspect) {
    a[2] = rRange / zRange;
    zMin *= a[2];
    zMax *= a[2];
  }

  for (let i = 0 ; i < surfaces.length ; i++) {
    addSurface(scene, surfaces[i], a, zMin, zMax);
  }

  return scene;
}
