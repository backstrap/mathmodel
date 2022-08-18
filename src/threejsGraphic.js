import {dataReplacer, dataReviver, roundTo, minMax, colormap} from '@backstrap/mathcell';

/* IOSFix() code taken from @backstrap/mathcell/src/core.js */
const iOSFix = output => {
    const iframe = output.children[0];

    if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
        iframe.style.width = getComputedStyle(iframe).width;
        iframe.style.height = getComputedStyle(iframe).height;
    }
};

/* threejsGraphic() based on @backstrap/mathcell:src/render/threejs.js */
/**
 * Either creates an iframe if needed,
 * or else re-runs the renderThree() function
 * on the appropriate iframe's content window,
 * to render with the given data and config.
 * @param {Node} output - an HTML Element on the page
 * @param {Geometry[]} data - graphic objects to be drawn
 * @param {renderConfig} config - a rendering configuration
 * @param {string} scriptUrl - location of render engine script
 * @private
 */
export function threejsGraphic(output, data, config, scriptUrl) {
  let texts = [], points = [], lines = [], surfaces = [];
  let lights = [{ position: [-5,3,0], color: 'rgb(127,127,127)', parent: 'camera' }];
  // noinspection JSUnresolvedVariable
  const border = config.no3DBorder ? 'none' : '1px solid black';

  // make a clean working copy of data
  data = JSON.parse( JSON.stringify( data, dataReplacer ), dataReviver );

  canonicalizeConfig(config, data, texts, points, lines, surfaces);

  if ( output.children.length > 0 && output.children[0].contentWindow ) {
    const cw = output.children[0].contentWindow;

    if (cw.camera) {
        const v = cw.camera.position;
        // only direction of viewpoint is meaningful, not normalization
        config.viewpoint = [ v.x - cw.xMid, v.y - cw.yMid, v.z - cw.zMid ];
    }

    cw.dispatchEvent(new Event('endanimation'));
    cw.renderThree(config, lights, texts, points, lines, surfaces);
  } else {
    const configStr = JSON.stringify( config );

    lights = JSON.stringify( lights );
    texts = JSON.stringify( texts );
    points = JSON.stringify( points );
    lines = JSON.stringify( lines, dataReplacer );
    surfaces = JSON.stringify( surfaces, dataReplacer );

    const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title></title>
    <meta charset="utf-8">
    <meta name=viewport content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <style>
       body { margin: 0; overflow: hidden; }
    </style>
  </head>
  <body>
    <script src="${scriptUrl}"></script>
    <!--suppress JSUnusedGlobalSymbols -->
    <!--suppress JSUnusedAssignment -->
    <script>
      const config = ${configStr};
      const lights = ${lights};
      const texts = ${texts};
      const points = ${points};
      const lines = ${lines};
      const surfaces = ${surfaces};
      renderThree(config, lights, texts, points, lines, surfaces);
    </script>
  </body>
</html>`.replace(/"/g, '&quot;');

    output.innerHTML = `<!--suppress ALL -->
<iframe style="width: 100%; height: 100%; border: ${border};"
        srcdoc="${html}" scrolling="no"></iframe>`;
    iOSFix(output);
  }
}

export function canonicalizeConfig(config, data, texts, points, lines, surfaces)
{
  if (!('ambientLight' in config)) config.ambientLight = 'rgb(127,127,127)';
  if (!('animate' in config)) config.animate = false;
  if (!('aspectRatio' in config)) config.aspectRatio = [1, 1, 1];
  if (!('axes' in config)) config.axes = false;
  if (!('axesLabels' in config)) config.axesLabels = ['x', 'y', 'z'];
  if (!('clearColor' in config)) config.clearColor = 'white';
  if (!('decimals' in config)) config.decimals = 2;
  if (!('equalAspect' in config)) config.equalAspect = false;
  if (!('frame' in config)) config.frame = true;
  if (!('viewpoint' in config)) config.viewpoint = 'auto';
  if (!('viewdistance' in config)) config.viewdistance = 'auto';
  if (!('suspendTimeout' in config)) config.suspendTimeout = 5000;

  if (!config.frame) config.axesLabels = false;

  for (let j = 0; j < data.length; j++) {
    const d = data[j];
    if (d.type === 'text') texts.push(d);
    if (d.type === 'point') points.push(d);
    if (d.type === 'line') {
      d.points = roundTo(d.points, 3, false); // reduce raw data size
      lines.push(d);
    }
    if (d.type === 'surface') {
      d.vertices = roundTo(d.vertices, 3, false); // reduce raw data size
      surfaces.push(d);
    }
  }

  const all = [];
  for (let i = 0; i < texts.length; i++) all.push(texts[i].point);
  for (let i = 0; i < points.length; i++) all.push(points[i].point);
  for (let i = 0; i < lines.length; i++) lines[i].points.forEach(p => all.push(p));
  for (let i = 0; i < surfaces.length; i++) surfaces[i].vertices.forEach(p => all.push(p));

  const xMinMax = minMax(all, 0);
  const yMinMax = minMax(all, 1);
  const zMinMax = minMax(all, 2);

  if (!('xMin' in config)) config.xMin = xMinMax.min;
  if (!('yMin' in config)) config.yMin = yMinMax.min;
  if (!('zMin' in config)) config.zMin = zMinMax.min;

  if (!('xMax' in config)) config.xMax = xMinMax.max;
  if (!('yMax' in config)) config.yMax = yMinMax.max;
  if (!('zMax' in config)) config.zMax = zMinMax.max;

  surfaces.forEach(s => {
    // process predefined colormaps
    if ('colormap' in s.options &&
        (!('colors' in s.options) || s.options.colors.length === 0)) {
      s.options.colors = [];
      // noinspection JSUnresolvedVariable
      const f = colormap(s.options.colormap, s.options.reverseColormap);
      const zMinMax = minMax(s.vertices, 2);
      const zMin = zMinMax.min < config.zMin ? config.zMin : zMinMax.min;
      const zMax = zMinMax.max > config.zMax ? config.zMax : zMinMax.max;
      for (let i = 0; i < s.vertices.length; i++) {
        let z = s.vertices[i][2];
        if (z < zMin) z = zMin;
        if (z > zMax) z = zMax;
        const w = (z - zMin) / (zMax - zMin);
        s.options.colors.push(f(w));
      }
    }
  });
}
