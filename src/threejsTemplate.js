/*
 * Simplifed version of @backstrap/mathcell/src/render/threejs-template.js:threejsTemplate()
 * Uses a three.js script that has boilerplate code in its renderThree() function.
 */
export function threejsTemplate(config, lights, texts, points, lines, surfaces, scriptUrl) {
    return `
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
      const config = ${config};
      const lights = ${lights};
      const texts = ${texts};
      const points = ${points};
      const lines = ${lines};
      const surfaces = ${surfaces};
      renderThree();
    </script>
  </body>
</html>`;
}
