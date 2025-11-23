# three-debug-gui
This package leverages `lil-gui` library to show some useful stuff to help with the development of `three.js` based projects.

[![npm version](https://img.shields.io/npm/v/@alexfdr/three-debug-gui)](https://www.npmjs.com/package/@alexfdr/three-debug-gui)

## About

![Screenshot](/docs/screenshot-main-view.jpg)
![Screenshot](/docs/screenshot-custom-components.jpg)

### Components
Here is the list of components included by default.
Custom toggle components can be defined and added later on.

#### debug-scene-tree
Show the entire scene tree

#### debug-object-props 
Inspect selected object and tweak it's material, texture, visibility etc, 

#### debug-orbit 
Toggle on/off OrbitControls

#### debug-transform component
Allows to pick an object on the scene and modify its position, scale, rotation in-place. Based on `three/addons/controls/TransformControls.js`

- `Shift` + `Left Click` - pick an object
- `g` - translate mode, move selected object around
- `r` - rotate mode
- `s` - scale mode
- `x` - toggle X axis
- `y` - toggle Y axis
- `z` - toggle Z axis
- `q` - toggle world-local coordinate space
- `+` or `=` - increase controls size
- `-` or `_` - decrease controls size
- `Control` - toggle snap mode, so position, rotation or scale can be changed with a predefined step
- `Escape` - reset, detach controls from selected object


## Installation
```base
npm install @alexfdr/three-debug-gui --save-dev
```


## Usage

```javascript
import { debug } from '@alexfdr/three-debug-gui';

debug.init({
    scene: threeScene,
    camera: threeCamera,
    canvas: threeRenderer.domElement,
    props: {
        scene: true,
        props: true,
        orbit: true,
        transform: true,
    }
})
```

Adding custom toggle component
```javascript
debug.registerComponent({
    label: 'user input',
    initialValue: input.enabled,
    instance: {
        toggle: (value) => {
            input.enabled = value;
        },
    },
});
```