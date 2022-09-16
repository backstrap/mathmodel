import * as THREE from 'three';

const isFunction = f => (f instanceof Function || Object.prototype.toString.call(f) === '[object Function]');

/* function definitions based on @backstrap/mathcell:src/render/threejs-template.js */

export function addPoint(scene, p, a)
{
  const v = p.point;
  const vertices = [ a[0]*v[0], a[1]*v[1], a[2]*v[2] ];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

  const canvas = document.createElement( 'canvas' );
  canvas.width = 128;
  canvas.height = 128;

  const context = canvas.getContext( '2d' );
  context.arc( 64, 64, 64, 0, 2 * Math.PI );
  context.fillStyle = p.options.color;
  context.fill();

  const texture = new THREE.Texture( canvas );
  texture.needsUpdate = true;

  const transparent = (p.options.opacity < 1);
  const material = new THREE.PointsMaterial( { size: p.options.size/20, map: texture,
                                             transparent: transparent, opacity: p.options.opacity,
                                             alphaTest: .1 } );

  const c = new THREE.Vector3();
  geometry.computeBoundingBox();
  geometry.boundingBox.getCenter( c );
  geometry.translate( -c.x, -c.y, -c.z );

  const mesh = new THREE.Points( geometry, material );
  mesh.position.set( c.x, c.y, c.z );
  mesh.updateMatrixWorld();
  scene.add( mesh );

}

export function addLine(scene, l)
{
  const vertices = [];
  for ( let i = 0 ; i < l.points.length ; i++ ) {
    const v = l.points[i];
    vertices.push( v[0], v[1], v[2] );
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

  const transparent = (l.options.opacity < 1);
  const material = new THREE.LineBasicMaterial( { color: l.options.color, linewidth: l.options.linewidth,
                                                transparent: transparent, opacity: l.options.opacity } );

  const c = new THREE.Vector3();
  geometry.computeBoundingBox();
  geometry.boundingBox.getCenter( c );
  geometry.translate( -c.x, -c.y, -c.z );

  const mesh = l.options.useLineSegments ? new THREE.LineSegments( geometry, material )
                                       : new THREE.Line( geometry, material );
  mesh.position.set( c.x, c.y, c.z );
  mesh.updateMatrixWorld();
  scene.add(handleAnimationOptions(l.options, mesh, scene.getObjectByName(l.options.group)));
}

export function addSurface(scene, s, a, zMin, zMax)
{
  // apply aspect multipliers for convenience
  s.vertices.forEach( v => { v[0] *= a[0]; v[1] *= a[1]; v[2] *= a[2]; } );

  const badVertices = [];

  // remove faces completely outside vertical range or containing NaN
  for ( let i = s.faces.length - 1 ; i >= 0 ; i-- ) {
    const f = s.faces[i];

    if ( f.every( index => s.vertices[index][2] < zMin ) ) s.faces.splice( i, 1 );
    if ( f.every( index => s.vertices[index][2] > zMax ) ) s.faces.splice( i, 1 );

    let check = false;
    f.forEach( index => {
      if ( isNaN( s.vertices[index][2] ) ) {
        if ( !badVertices.includes( index ) ) badVertices.push( index );
        check = true;
      } } );
    if ( check ) s.faces.splice( i, 1 );
  }

  // set bad vertices to dummy value
  badVertices.forEach( index => s.vertices[index][2] = 0 );

  // constrain vertices to vertical range
  for ( let i = 0 ; i < s.vertices.length ; i++ ) {
    if ( s.vertices[i][2] < zMin ) s.vertices[i][2] = zMin;
    if ( s.vertices[i][2] > zMax ) s.vertices[i][2] = zMax;
  }

  const indices = [];
  for ( let i = 0 ; i < s.faces.length ; i++ ) {
    const f = s.faces[i];
    for ( let j = 0 ; j < f.length - 2 ; j++ )
      indices.push( f[0], f[j+1], f[j+2] );
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setIndex( indices );
  geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( s.vertices.flat(), 3 ) );
  geometry.computeVertexNormals();

  // noinspection JSUnresolvedVariable
  const side = s.options.singleSide ? THREE.FrontSide : THREE.DoubleSide;
  const transparent = (s.options.opacity < 1);
  let material;

  switch ( s.options.material ) {

    case 'normal':

      material = new THREE.MeshNormalMaterial( { side: THREE.DoubleSide } );
      break;

    case 'standard':

      material = new THREE.MeshStandardMaterial( {
                               color: s.options.color, side: side,
                               transparent: transparent, opacity: s.options.opacity,
                               metalness: .5, roughness: .5 } );
      break;

    case 'phong':
    default:

      material = new THREE.MeshPhongMaterial( {
                               color: s.options.color, side: side,
                               transparent: transparent, opacity: s.options.opacity,
                               shininess: 20 } );

  }

  if ( 'colors' in s.options ) {
    const colors = [];
    for ( let i = 0 ; i < s.options.colors.length ; i++ ) {
      const c = s.options.colors[i];
      colors.push( c.r, c.g, c.b );
    }
    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    material.vertexColors = THREE.VertexColors;
    material.color.set( 'white' ); // crucial!
  }

  const c = new THREE.Vector3();
  geometry.computeBoundingBox();
  geometry.boundingBox.getCenter( c );
  geometry.translate( -c.x, -c.y, -c.z );

  const mesh = new THREE.Mesh( geometry, material );
  mesh.position.set( c.x, c.y, c.z );
  mesh.updateMatrixWorld();
  if ( s.options.renderOrder ) mesh.renderOrder = s.options.renderOrder;
  scene.add(handleAnimationOptions(s.options, mesh, scene.getObjectByName(s.options.group)));
}

function handleAnimationOptions(options, mesh, group) {
  let sceneObject;

  // to be removed
  // noinspection JSUnresolvedVariable
  if ( options.rotationAxisAngle ) {
    options.rotation = { axis: options.rotationAxisAngle[0],
                           angle: options.rotationAxisAngle[1] }
    console.log( 'rotationAxisAngle is deprecated: see documentation for new format' );
  }

  // to be removed
  // noinspection JSUnresolvedVariable
  if ( options.rotationOrigin ) {
    // noinspection JSUnresolvedVariable
    (options.rotation||{}).origin = options.rotationOrigin;
    console.log( 'rotationOrigin is deprecated: see documentation for new format' );
  }

  if ( options.rotation ) {
    const v = options.rotation.axis;
    mesh.userData.rotation = { axis: new THREE.Vector3( v[0], v[1], v[2] ).normalize(),
                               angle: options.rotation.angle,
                               origin: options.rotation.origin };
  }

  if ( options.translation ) {
    const arg = options.translation.argument ? options.translation.argument : 't';
    const step = Number.isFinite(options.translation.step) ? options.translation.step : .05;
    const f = options.translation.path;
    mesh.userData.translation = { 
      path: isFunction(f) ? f : Function( arg, 'return ' + f ),
      step: step, t: 0 };
  }

  if ( options.mogrifyMax > 0 && options.mogrifyStep >= 0 ) {
    mesh.userData.mogrifyMax = options.mogrifyMax;
    mesh.userData.mogrifyStep = options.mogrifyStep;
    mesh.userData.mogrifyCount = options.mogrifyCount||1;
  }

  if ( 'group' in options ) {
    if ( !group ) {
      group = new THREE.Group();
      group.name = options.group;
    }
    mesh.position.sub(group.position);
    group.add( mesh );
    sceneObject = group;

    if ( mesh.userData.rotation ) {
      group.userData.rotation = {
        axis: mesh.userData.rotation.axis,
        angle: mesh.userData.rotation.angle
      };
      if (mesh.userData.rotation.origin) {
        const shift = (new THREE.Vector3(...mesh.userData.rotation.origin)).sub(group.position);
        group.traverse(obj => obj.position[obj === group ? 'add' : 'sub'](shift));
        group.updateMatrixWorld();
      }
      delete mesh.userData.rotation;
    }
    if ( mesh.userData.translation ) {
      group.userData.translation = {
        path: mesh.userData.translation.path,
        step: mesh.userData.translation.step,
        t: mesh.userData.translation.t,
      };
      delete mesh.userData.translation;
    }

    if ( mesh.userData.mogrifyMax ) {
        group.userData.mogrifyMax = mesh.userData.mogrifyMax;
        group.userData.mogrifyStep = mesh.userData.mogrifyStep;
        group.userData.mogrifyCount = mesh.userData.mogrifyCount;
        delete mesh.userData.mogrifyMax;
        delete mesh.userData.mogrifyStep;
        delete mesh.userData.mogrifyCount;
        group.visible = (group.userData.mogrifyStep === 0);
    }
  } else {
    if ( mesh.userData.mogrifyMax ) {
        mesh.visible = (mesh.userData.mogrifyStep === 0);
    }
    sceneObject = mesh;
  }

  return sceneObject;
}
