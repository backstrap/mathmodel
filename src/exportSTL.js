// noinspection DuplicatedCode

import {Scene} from 'three';
import {STLExporter} from 'three/examples/jsm/exporters/STLExporter';
import {sqrt} from '@backstrap/math';
import {dataReplacer, dataReviver} from '@backstrap/mathcell';
import {addSurface} from './threejsScene';
import {canonicalizeConfig} from './threejsGraphic';

/*
 * Usage: exportSTL(data, config);
 */

// noinspection JSUnusedGlobalSymbols
/**
 * @param {Geometry[]} data - graphic objects to be drawn
 * @param {renderConfig} [config] - a rendering configuration
 * @returns {string}
 * @private
 */
export function exportSTL(data, config = {})
{
  return new STLExporter().parse(sceneFromData(data, config));
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
  data = JSON.parse(JSON.stringify( data, dataReplacer ), dataReviver);

  const surfaces = [];

  canonicalizeConfig(config, data, [], [], [], surfaces);

  return generateScene(config, surfaces);
}

/**
 * generateScene() mimics renderThree(), without lights, cameras, axes, texts, points, lines.
 * Note that only surface objects are supported by STL.
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
