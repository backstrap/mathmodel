## The MathModel Package

### What it is

The MathModel package is a 3D modeling and display package built on top of
Paul Masson's [MathCell](https://paulmasson.github.io/mathcell/) package
and the [Three.js](https://threejs.org/) render engine.
It also makes use of Paul Masson's ["math"](https://paulmasson.github.io/math/)
package of mathematical functions.

It provides a simple, fluent, and object-oriented API for drawing 3D graphics.

### API documentation

API documentation is included in the NPM package in the "/docs" folder,
and published on [GitHub Pages](https://backstrap.github.io/mathmodel/).

### How to use

The simplest way to use MathModel is to use
[the NPM package](https://www.npmjs.com/package/@backstrap/mathmodel)
as follows.
First, install it as a dependency in your project.

    npm install --save  @backstrap/mathmodel

Now you can define a subclass of the MathModel class to create a scene.
At its simplest, you just need to override the update() method.
Most methods are chainable where appropriate.
Here we add a cube with side length 2 and a sphere of diameter 1 to our scene.

    import {MathModel, Solid} from '@backstrap/mathmodel';

    class MyModel1 extends MathModel {
        update() {
            const solid = new Solid();
            this.add(solid.block(2))
                .add(solid.sphere());
        }
    }

Explore the
<a href="Shape.html">Shape</a>, <a href="Surface.html">Surface</a>,
<a href="Solid.html">Solid</a>, and <a href="Plot.html">Plot</a>
classes to see what methods are available for creating graphic objects.
At the most basic level, there are the Shape methods surface(), wireframe() and curve().
The Surface class provides 2D primitives like rect() and disc().
The Solid class provides 3D solid objects like block(), cone(), and sphere().
And the Plot class provides various plotting methods - point() and text(),
as well as more advanced plots.

All the above graphic object classes are subclasses of
<a href="Coords.html">Coords</a>,
which defines a local coordinate system transformation matrix
and standard transformation methods (translate, rotate, scale, stretch, quaternion.)
Thus, you can easily transform objects, for example:

    new Solid().rotate(pi/4).stretch(2, 3, 4).block();

Scenes can also be animated by setting the 'animate' property of your MathModel config
and then setting the rotationAxisAngle (and optionally rotationOrigin) options
of the shapes that are to be animated (rotation is the only animation currently supported.)

The <a href="GroupedShape.html">GroupedShape</a> class
can be used to group elements together into logic objects.
Grouped objects will be animated as a single entity.

    class MyPart extends GroupedShape {
        // Returns a simple spinning shape composed of two squares.
        get() {
            const surface = new Surface(this.setOptions({rotationAxisAngle: [[1, 0, 0], 1]}));
             
            return surface.rect().concat(
                surface.rotate(pi/2).rect()
            );
        }
    }

You might also like to install and use
[the "math" NPM package](https://www.npmjs.com/package/@backstrap/math)
as well, for some useful mathematical functions, but this is entirely optional.

    npm install --save  @backstrap/math

Once you've defined your scene, you'll want to display it.
A basic HTML page that will display a MathModel looks like this:

    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>My First MathModel!</title>
        <script src="main.js"></script>
      </head>
      <body>
          <div id="mymodel1" class="mathcell"></div>
      </body>
    </html>

Note that we've referenced "main.js" here, which is webpack's default output filename.
Also, the "mathcell" classname here is special (as explained in a moment).
With the above HTML file and MyModel1 class in hand, we can now create an
entrypoint "index.js" file which will load and draw the scene.
Here's our index.js:

    import {MathModel} from '@backstrap/mathmodel';
    import {MyModel1} from './MyModel1';
    
    MathModel.loadMathCells(document, {
        mymodel1: MyModel1,
    });

It just needs to call MathModel.loadMathCells(),
passing it an object which defines a map from  the id's of div's on our page to MathModel classes.
The loadMathCells() method will search for all the HTML elements in our document
that have class="mathcell", and if the element has an id which appears in our map,
then it will instantiate the associated MathModel class
and  tell it to draw that scene inside that element.

In this way, a single compiled main.js file can support multiple
graphics on one page, or even multiple graphics across multiple pages.
Just assign a unique id, and the class "mathcell", to each div that you want graphics in,
and then list them all in the object that you pass to MathModel.loadMathCells()!

Note that if you name your script file something other than "main.js",
or put it in a different folder,
or you want to load it from a CDN,
then you will need to call the setScriptUrl() method on your MathModel classes,
to tell them where to find it.

### Advanced: Breaking things up into multiple JS files

It is also possible to import from "@backstrap/mathmodel/thin" instead of "@backstrap/mathmodel",
which will build your "main.js" file without including the render engine code.
This makes for a smaller "main.js".
You will then also need to use setScriptUrl() to tell it where to find the render engine,
either at some external URL or by compiling it separately.
If you compile with webpack, you can do this by including another webpack entrypoint.
Add a file called "./src/render.js" to your project that will just load the render engine code
and do nothing else:

    import * as dummy from '@backstrap/mathmodel/render';
    export {dummy};

Then your webpack config might have an entry spec like this,
which implements the default entrypoint rule plus one for our "render" entrypoint:

    entry: {
      main: './src/index.js',
      render: './src/render.js',
    }

Then our "index.js" will look like this:

    import {MathModel} from '@backstrap/mathmodel/thin';
    import {MyModel1} from './MyModel1';
    
    MathModel.loadMathCells(document, {
        mymodel1: MyModel1,
    });

And our model class will look like this:

    import {MathModel} from '@backstrap/mathmodel/thin';

    class MyModel1 extends MathModel {
        constructor(...args) {
            super(...args);
            this.setScriptUrl('./render.js');
        }

        update() {
            const shape = new Shape();
            this.add(shape.block(2))
                .add(shape.sphere());
        }
    }

This way you can have multiple different smaller main script files for different pages,
which all share a single render.js.

