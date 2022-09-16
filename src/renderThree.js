// noinspection DuplicatedCode

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {addPoint, addLine, addSurface} from './threejsScene';

/**
 * The body of the renderThree() function is essentially
 * a copy of the boilerplate code from the inlined script
 * created by @backstrap/mathcell/src/render/threejs-template.js:threejsTemplate()
 * It is used in the template created by mathmodel's threejsGraphic() function.
 *
 * In addition to defining the renderThree() function,
 * this module also sets event listeners on the passed window object, if they have not already been set,
 * and defines/updates certain variables on the passed window object: camera, listeners, xMid, yMid, and zMid.
 */
export function renderThree(config, lights, texts, points, lines, surfaces, window) {
const document = window.document;
const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( config.clearColor, 1 );
for (let oldCanvas of document.body.getElementsByTagName('canvas')) {
    document.body.removeChild(oldCanvas);
}
document.body.appendChild( renderer.domElement );

const a = config.aspectRatio; // aspect multipliers
let animate = config.animate;

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
const rRange = Math.sqrt( xRange*xRange + yRange*yRange );

if ( zRange > rRange && a[2] === 1 && !config.equalAspect ) {
  a[2] = rRange / zRange;
  zMin *= a[2];
  zMax *= a[2];
  zRange *= a[2];
}

let xMid = window.xMid = ( xMin + xMax ) / 2;
let yMid = window.yMid = ( yMin + yMax ) / 2;
let zMid = window.zMid = ( zMin + zMax ) / 2;

if ( config.frame ) {
  const vertices = [ xMin, yMin, zMin, xMax, yMax, zMax ];
  const box = new THREE.BufferGeometry();
  box.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
  const boxMesh = new THREE.Line( box );
  scene.add( new THREE.BoxHelper( boxMesh, 'black' ) );
}

if ( config.axesLabels ) {

  const d = config.decimals; // decimals
  const offsetRatio = .1;
  const al = config.axesLabels;

  let offset = offsetRatio * ( yMax - yMin );
  let xm = ( xMid/a[0] ).toFixed(d);
  if ( /^-0.?0*$/.test(xm) ) xm = xm.substring(1);
  addLabel( al[0] + '=' + xm, xMid, yMax+offset, zMin );
  addLabel( ( xMin/a[0] ).toFixed(d), xMin, yMax+offset, zMin );
  addLabel( ( xMax/a[0] ).toFixed(d), xMax, yMax+offset, zMin );

  offset = offsetRatio * ( xMax - xMin );
  let ym = ( yMid/a[1] ).toFixed(d);
  if ( /^-0.?0*$/.test(ym) ) ym = ym.substring(1);
  addLabel( al[1] + '=' + ym, xMax+offset, yMid, zMin );
  addLabel( ( yMin/a[1] ).toFixed(d), xMax+offset, yMin, zMin );
  addLabel( ( yMax/a[1] ).toFixed(d), xMax+offset, yMax, zMin );

  offset = offsetRatio * ( yMax - yMin );
  let zm = ( zMid/a[2] ).toFixed(d);
  if ( /^-0.?0*$/.test(zm) ) zm = zm.substring(1);
  addLabel( al[2] + '=' + zm, xMax, yMin-offset, zMid );
  addLabel( ( zMin/a[2] ).toFixed(d), xMax, yMin-offset, zMin );
  addLabel( ( zMax/a[2] ).toFixed(d), xMax, yMin-offset, zMax );

}

function addLabel( text, x, y, z, color='black', fontsize=14 ) {

  const canvas = document.createElement( 'canvas' );
  const pixelRatio = Math.round( window.devicePixelRatio );
  canvas.width = 128 * pixelRatio;
  canvas.height = 32 * pixelRatio; // powers of two
  canvas.style.width = '128px';
  canvas.style.height = '32px';

  const context = canvas.getContext( '2d' );
  context.scale( pixelRatio, pixelRatio );
  context.fillStyle = color;
  context.font = fontsize + 'px monospace';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText( text, canvas.width/2/pixelRatio, canvas.height/2/pixelRatio );

  const texture = new THREE.Texture( canvas );
  texture.needsUpdate = true;

  const sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: texture, sizeAttenuation: false } ) );
  sprite.position.set( x, y, z );
  sprite.scale.set( 1/4, 1/16, 1 ); // ratio of width to height plus scaling
  scene.add( sprite );

}

if ( config.axes ) scene.add( new THREE.AxesHelper( Math.min( xMax, yMax, zMax ) ) );

const camera = window.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight,
                                          config.cameraNear ? config.cameraNear : .1,
                                          config.cameraFar ? config.cameraFar : 1000 );
camera.up.set( 0, 0, 1 );

// default auto position, followed by rotation to viewpoint direction
camera.position.set( xMid, yMid, zMid );
const defaultOffset = new THREE.Vector3( xRange, yRange, zRange );
let offsetScale = 0.9;
if ( config.viewDistance !== 'auto' ) {
    offsetScale = config.viewDistance/defaultOffset.length();
}
defaultOffset.multiplyScalar(offsetScale);

if ( config.viewpoint !== 'auto' ) {
  const v = config.viewpoint;
  const t = new THREE.Vector3( v[0], v[1], v[2] );
  const phi = defaultOffset.angleTo( t );
  const n = t.cross( defaultOffset ).normalize();
  defaultOffset.applyAxisAngle( n, -phi );
}

// noinspection JSUnresolvedFunction
  camera.position.add( defaultOffset );

for ( let i = 0 ; i < lights.length ; i++ ) {
  const light = new THREE.DirectionalLight( lights[i].color, 1 );
  const v = lights[i].position;
  light.position.set( a[0]*v[0], a[1]*v[1], a[2]*v[2] );
  if ( lights[i].parent === 'camera' ) {
    light.target.position.set( xMid, yMid, zMid );
    scene.add( light.target );
    camera.add( light );
  } else scene.add( light );
}
scene.add( camera );

scene.add( new THREE.AmbientLight( config.ambientLight, 1 ) );

const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( xMid, yMid, zMid );
controls.addEventListener( 'change', function() { if ( !animate ) render(); } );
controls.update();

let suspendTimer;

if (!window.listeners) {
  window.addEventListener( 'resize', () => window.listeners.resize() );
  window.addEventListener( 'endAnimation', () => window.listeners.endAnimation() );
  ['mousedown', 'mousemove', 'mousewheel', 'touchstart', 'touchmove', 'touchend'].forEach(
      type => window.addEventListener( type, () => window.listeners.suspendAnimation() )
  );
}

window.listeners = {
  resize: function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    if (!animate) render();
  },
  suspendAnimation: function suspendAnimation() {
    // noinspection JSUnresolvedVariable
    if ( config.animateOnInteraction ) return;
    clearTimeout(suspendTimer);
    animate = false;
    suspendTimer = setTimeout(
        function () {
          if (config.animate) {
            animate = true;
            render();
          }
        },
        config.suspendTimeout
    );
  },
  endAnimation: function endAnimation() {
    clearTimeout(suspendTimer);
    config = Object.assign({}, config, {animate: false});
    animate = false;
  },
};

for ( let i = 0 ; i < texts.length ; i++ ) {
  const t = texts[i];
  addLabel( t.text, t.point[0], t.point[1], t.point[2], t.options.color, t.options.fontSize );
}

for ( let i = 0 ; i < points.length ; i++ ) addPoint( scene, points[i], a );

let newLines = [], tempPoints = [];

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

if ( config.clippingPlane ) {

  const v = config.clippingPlane[0];
  const d = config.clippingPlane[1];
  const plane = new THREE.Plane( new THREE.Vector3(v[0],v[1],v[2]).normalize(), d );
  renderer.clippingPlanes = [ plane ];

}

let mogrifyIndex = 0;

function render()
{
  if ( animate ) requestAnimationFrame( render );

  renderer.render(scene, camera);

  if (animate) {
    scene.children.forEach(child => {
      if (child.userData.mogrifyMax) {
        const childStep = (mogrifyIndex%(child.userData.mogrifyMax + 1) - child.userData.mogrifyStep);
        child.visible = (childStep >= 0 && childStep < child.userData.mogrifyCount);
      }
      if (child.userData.rotation) {
        child.rotateOnAxis(child.userData.rotation.axis, child.userData.rotation.angle);
      }
      if (child.userData.translation) {
        const trans = child.userData.translation;
        const v = trans.path(trans.t);
        child.position.set(v[0], v[1], v[2]);
        trans.t += trans.step;
      }
    });
    mogrifyIndex += 1;
  }
}

render();

}
