# three-debug-gui
A bunch of helpers to ease the development process using three.js library.

[![npm version](https://img.shields.io/npm/v/@alexfdr/three-debug-gui)](https://www.npmjs.com/package/@alexfdr/three-debug-gui)

## About
This package leverages `lil-gui` gui library to show add some extra debugging stuff for `three.js` based projects.
![Screenshot](/docs/screenshot-main-view.jpg)
![Screenshot](/docs/screenshot-custom-components.jpg)

### Components
Here is the list of components inlcuded by default.
Custom toggle components can be defined later.

#### debug-scene-tree
Show entire scene tree

#### debug-object-props 
Inspect selected object and tweak it's material, texture, visibility etc, 

#### debug-orbit 
Toggle on/off OrbitControls

#### debug-transform component
Allows to pick an object on the scene and modify its position, scale, rotation in-place


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