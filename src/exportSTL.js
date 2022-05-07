// noinspection DuplicatedCode

import * as THREE from 'three';
import {STLExporter} from 'three/examples/jsm/exporters/STLExporter';
import {sqrt} from '@backstrap/math';
import {dataReplacer, dataReviver} from '@backstrap/mathcell';
import {addPoint, addLine, addSurface} from './threejsScene';
import {canonicalizeConfig} from './threejsGraphic';

/*
 * Usage: exportSTL(data, config);
 */

// noinspection JSUnusedGlobalSymbols
/**
 * @param {Geometry[][]} data - graphic objects to be drawn
 * @param {renderConfig} config - a rendering configuration
 * @returns {string}
 * @private
 */
export function exportSTL(data, config)
{
  return new STLExporter().parse(sceneFromData(data, config));
}

/**
 * sceneFromData() mimics threejsGraphic(), without lights, cameras, axes.
 * Note that "text" objects are not supported.
 * @param {Geometry[][]} data - graphic objects to be drawn
 * @param {renderConfig} config - a rendering configuration
 * @returns {Object3D}
 * @private
 */
function sceneFromData(data, config) {
  // working copy of data
  data = JSON.parse( JSON.stringify( data, dataReplacer ), dataReviver );

  const points = [], lines = [], surfaces = [];

  canonicalizeConfig(config, data, [], points, lines, surfaces);

  return generateScene(config, points, lines, surfaces);
}

/**
 * generateScene() mimics renderThree(), without lights, cameras, axes.
 * Note that "text" objects are not supported.
 * @returns {Object3D}
 * @private
 */
function generateScene(config, points, lines, surfaces)
{
  const scene = new THREE.Scene();
  const a = config.aspectRatio; // aspect multipliers
  let xMin = config.xMin, yMin = config.yMin, zMin = config.zMin;
  let xMax = config.xMax, yMax = config.yMax, zMax = config.zMax;

  if ( xMin === xMax ) { xMin -= 1; xMax += 1; }
  if ( yMin === yMax ) { yMin -= 1; yMax += 1; }
  if ( zMin === zMax ) { zMin -= 1; zMax += 1; }

  // apply aspect multipliers for convenience
  xMin *= a[0]; yMin *= a[1]; zMin *= a[2];
  xMax *= a[0]; yMax *= a[1]; zMax *= a[2];

  const xRange = xMax - xMin;
  const yRange = yMax - yMin;
  let zRange = zMax - zMin;
  const rRange = sqrt( xRange*xRange + yRange*yRange );

  if ( zRange > rRange && a[2] === 1 && !config.equalAspect ) {
    a[2] = rRange / zRange;
    zMin *= a[2];
    zMax *= a[2];
  }

  for ( let i = 0 ; i < points.length ; i++ ) addPoint( scene, points[i], a );

  const newLines = [];
  let tempPoints = [];

  for ( let i = 0 ; i < lines.length ; i++ ) {
    lines[i].points.forEach( v => {
      // apply aspect multipliers for convenience
      //   and set points outside bounds or NaN to empty array
      v[0] *= a[0]; v[1] *= a[1]; v[2] *= a[2];
      if ( v[0] < xMin || v[0] > xMax || v[1] < yMin || v[1] > yMax
             || v[2] < zMin || v[2] > zMax || isNaN(v[2]) )
        v.splice(0);
    } );

    // split lines at empty points
    for ( let j = 0 ; j < lines[i].points.length ; j++ )
      if ( lines[i].points[j].length === 0 ) {
        tempPoints = lines[i].points.splice( j );
        if ( j === 0 ) lines[i].points = [[0,0,0]]; // dummy line for options
      }

    let l = [];
    for ( let j = 0 ; j < tempPoints.length ; j++ ) {
      const p = tempPoints[j];
      if ( p.length > 0 ) l.push( p );
      else if ( l.length > 0 ) {
        newLines.push( { points: l, options: lines[i].options } );
        l = [];
      }
    }
    if ( l.length > 0 ) newLines.push( { points: l, options: lines[i].options } );
  }

  newLines.forEach( l => lines.push( l ) );

  for ( let i = 0 ; i < lines.length ; i++ ) addLine( scene, lines[i] );
  for ( let i = 0 ; i < surfaces.length ; i++ ) addSurface( scene, surfaces[i], a, zMin, zMax );

  return scene;
}
