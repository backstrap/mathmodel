import {dataReplacer, dataReviver, roundTo, minMax, colormap} from '@backstrap/mathcell';

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
  if (!('viewDistance' in config)) config.viewDistance = 'auto';
  if (!('suspendTimeout' in config)) config.suspendTimeout = 5000;

  if (!config.frame) config.axesLabels = false;

  for (let j = 0; j < data.length; j++) {
    const d = data[j];
    if (d.type === 'text') texts.push(d);
    if (d.type === 'point') points.push(d);
    if (d.type === 'line') lines.push(d);
    if (d.type === 'surface') surfaces.push(d);
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

const fns = [];
const copyId = Math.random();

const replace = (key, value) => {
  if (value instanceof Function || Object.prototype.toString.call(value) === '[object Function]') {
    return {functionReplacer: copyId, n: fns.push(value)};
  } else {
    return dataReplacer(key, value);
  }
};

const revive = (key, value) => {
  return value && value.functionReplacer === copyId && value.n > 0 ? fns[value.n - 1] : dataReviver(key, value);
};

export function cleanCopy(data)
{
  fns.length = 0;
  return JSON.parse(JSON.stringify(data, replace), revive);
}
