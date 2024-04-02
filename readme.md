# fc64js-collision-detection

A collision detection experiment for the [fc64js](https://github.com/TheInvader360/fc64js) fantasy console

Supports collisions between points, lines, circles, rectangles, and polygons

Each pair of shapes can be experimented with in an interactive demo, and all combinations are showcased in an autoplay demo

[Live preview](https://theinvader360.github.io/fc64js-collision-detection/dist/)

## Menu

* Press L/R to cycle through the options
* Press A to confirm selection
* Press B at any point to return

## Autoplay demo

<img src="https://raw.githubusercontent.com/TheInvader360/fc64js-collision-detection/main/docs/demo-autoplay.gif" width="192"/>

Automatically cycles through all the possible combinations of collidable shapes, randomly moving a dynamic shape around

* Press nothing to just let it do it's thing
* Press U/D to cycle through the dynamic shapes
* Press L/R to cycle through the static shapes

## Interactive demos

<img src="https://raw.githubusercontent.com/TheInvader360/fc64js-collision-detection/main/docs/demo-interactive.gif" width="192"/>

* Press U/D/L/R to move the currently selected dynamic element (flashing)
* Press A for demo specific actions - commonly used to randomise shape positions and sizes and to cycle between currently selected dynamic elements (e.g. ends of lines)
* Hold A and press U/D/L/R for more demo specific actions (sometimes) - commonly used to resize circles and add/remove vertices to/from polygons

## Running locally

```bash
git clone https://github.com/TheInvader360/fc64js-collision-detection.git
cd fc64js-collision-detection
npm ci
npm upgrade fc64js
npm run lint
npm run dev
```

## Building

```bash
npm run build-and-preview
```

## Credits

* Code by TheInvader360
* Collision logic ported over from [this book](https://www.jeffreythompson.org/collision-detection/) by Jeff Thompson (refer to ```docs/notes.md``` for changes)
