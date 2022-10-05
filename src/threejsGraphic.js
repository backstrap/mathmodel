import {canonicalizeConfig, cleanCopy} from './helpers';
import {renderThree} from './renderThree';

const renderers = {};

/**
 * @type {function(string, Window)}
 * @param {string} id - id of the renderer
 * @param {Window} cw - the contentWindow to pass to the renderer
 * @private
 */
const startOutput = (id, cw) => {
    if (renderers[id]) {
        renderers[id](cw);
        renderers[id] = null;
    }
};

/**
 * IOSFix() code taken from @backstrap/mathcell/src/core.js
 * @type {function(HTMLElement)}
 * @param {HTMLElement} output
 * @private
 */
const iOSFix = output => {
    const iframe = output.children[0];

    if (typeof navigator !== 'undefined' && /(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
        iframe.style.width = getComputedStyle(iframe).width;
        iframe.style.height = getComputedStyle(iframe).height;
    }
};

/* threejsGraphic() based on @backstrap/mathcell:src/render/threejs.js */
/**
 * Either creates an iframe if needed,
 * or else re-runs the renderThree() function
 * on the appropriate iframe's contentWindow,
 * to render with the given data and config.
 * @param {HTMLElement} output - an HTML Element on the page
 * @param {Geometry[]} data - graphic objects to be drawn
 * @param {renderConfig} config - a rendering configuration
 * @private
 */
export function threejsGraphic(output, data, config) {
  let texts = [], points = [], lines = [], surfaces = [];
  let lights = [{ position: [-5,3,0], color: 'rgb(127,127,127)', parent: 'camera' }];
  // noinspection JSUnresolvedVariable
  const border = config.no3DBorder ? 'none' : '1px solid black';

  // make a clean working copy of data
  data = cleanCopy(data);

  canonicalizeConfig(config, data, texts, points, lines, surfaces);

  // noinspection JSUnresolvedVariable
  if ( output.children.length > 0 && output.children[0].contentWindow ) {
    // noinspection JSUnresolvedVariable
    const cw = output.children[0].contentWindow;

    if (cw.camera) {
        const v = cw.camera.position;
        // only direction of viewpoint is meaningful, not normalization
        config.viewpoint = [ v.x - cw.xMid, v.y - cw.yMid, v.z - cw.zMid ];
    }

    cw.dispatchEvent(new Event('endAnimation'));
    renderThree(config, lights, texts, points, lines, surfaces, cw);
  } else {
    const id = JSON.stringify(output.id);
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
    <!--suppress JSUnusedGlobalSymbols -->
    <!--suppress JSUnusedAssignment -->
    <script>
      parent.startOutput(${id}, window);
    </script>
  </body>
</html>`.replace(/"/g, '&quot;');

    if (typeof window !== 'undefined') {
      window.startOutput = startOutput;
    }

    renderers[output.id] = cw => renderThree(config, lights, texts, points, lines, surfaces, cw);
    // noinspection JSUndefinedPropertyAssignment
    output.innerHTML = `<!--suppress ALL -->
<iframe style="width: 100%; height: 100%; border: ${border};"
        srcdoc="${html}" scrolling="no"></iframe>`;
    iOSFix(output);
  }
}
