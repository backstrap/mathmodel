# The MathModel Package

## What It Is

The MathModel package is a 3D modeling and display package built on top of
Paul Masson's MathCell package and the Three render engine.
It also makes use of Paul Masson's "math" package of mathematical functions.

MathModel provides a simple, fluent, and object-oriented API for drawing 3D graphics.

## API Documentation

API documentation is included in the NPM package in the "/docs" folder.

## How to use

MathModel is built on top of
the excellent mathcell and math packages by Paul Masson (refs needed).
It provides a very simple, straightforward, yet powerful
3D graphics drawing API.

The simplest way to use it is as follows.  First, install it in your project.

    npm install --save  @backstrap/mathmodel

Then you can extend the MathModel class to create a scene.
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

A basic HTML page that will display a MathModel graphic looks like this:

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

Note that we've referenced "main.js" which is webpack's default output filename.
Also, the "mathcell" classname here is special (as explained in a moment).
With the above HTML file and MyModel1 class in hand, we can now create an
entrypoint index.js file, which will load and draw the scene.
It just needs to call the loadMathCells() method,
passing it an object which maps div id's to classnames.
The loadMathCells() method will search for all the HTML elements in our document
that have class="mathcell", and if the element has an id which appears in our map,
then it will instantiate the associated MathModel class
and  tell it to draw that scene inside that element.
So here's our index.js:

    import {MathModel} from '@backstrap/mathmodel';
    import {MyModel1} from './MyModel1';
    
    MathModel.loadMathCells(document, {
        mymodel1: MyModel1,
    });

In this way, a single compiled main.js file can support multiple
graphics on one page, or even multiple graphics across multiple pages.
Just assign a unique id, and the class "mathcell", to each div that you want graphics in,
and then list them all in the object that you pass to MathModel.loadMathCells()!

Nte that if you name your script file something other than "main.js",
or put it in a different folder,
or you want to load it from a CDN,
then you will need to call the setScriptUrl() method on your MathModel classes,
to tell them where to find it.

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

