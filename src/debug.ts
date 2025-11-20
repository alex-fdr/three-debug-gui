import GUI from 'lil-gui';
import type { Object3D, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { DebugObjectProps } from './debug-object-props.ts';
import { DebugOrbitControls } from './debug-orbit-controls.ts';
import { DebugSceneTree } from './debug-scene-tree.ts';
import { DebugTransform } from './debug-transform.ts';

export interface DebugComponent {
    action?(context: Debug, target?: Object3D): void;
    toggle(status: boolean, context: Debug): void;
    update?(dt?: number): void;
}

type Options = {
    scene: boolean;
    props: boolean;
    transform: boolean;
    orbit: boolean;
    // physics: boolean;
    [key: string]: boolean;
};

type CoreSystems = {
    scene: Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
};

type CustomToggle = {
    label: string;
    initialValue: boolean;
    handler: (status: boolean) => void;
};

export type CustomComponent = {
    label: string;
    initialValue: boolean;
    instance: DebugComponent;
};

export class Debug {
    options: Options;
    components!: {
        scene: DebugSceneTree;
        props: DebugObjectProps;
        transform: DebugTransform;
        orbit: DebugOrbitControls;
        [key: string]: DebugComponent;
    };
    panel!: GUI;
    scene!: Scene;
    renderer!: WebGLRenderer;
    camera!: PerspectiveCamera;

    constructor() {
        this.options = {
            scene: false,
            props: false,
            transform: false,
            orbit: false,
            // physics: false,
        };
    }

    init({ scene, renderer, camera }: CoreSystems, props = {}) {
        if (this.panel) {
            return;
        }

        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.options = { ...this.options, ...props };

        this.panel = new GUI({ width: 100, title: 'Debug' });
        this.panel.domElement.setAttribute('id', 'debug-panel');

        this.components = {
            props: new DebugObjectProps(),
            orbit: new DebugOrbitControls(),
            scene: new DebugSceneTree(this.onSceneAction.bind(this)),
            transform: new DebugTransform(this.onTransformAction.bind(this)),
        };

        for (const label of Object.keys(this.options)) {
            this.createToggle(label);

            // perform control's action if this option is enabled by default
            if (this.options[label]) {
                this.components[label]?.action?.(this);
            }
        }

        this.tweakPanelStyle();
    }

    tweakPanelStyle() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            #debug-panel {
                top: 0;
                left: 0;
            }
            #debug-panel .lil-controller > .lil-name {
                width: 80%;
            }
        `;
        document.head.appendChild(styleElement);
    }

    createToggle(label: keyof Options) {
        this.panel.add(this.options, label).onChange((value: boolean) => {
            this.options[label] = value;
            this.components[label]?.toggle(value, this);
        });
    }

    addCustomToggle({ label, handler, initialValue = false }: CustomToggle) {
        if (Object.hasOwn(this.options, label)) {
            console.error(`a toggle with the name '${label}' already exists`);
            return;
        }

        this.options[label] = initialValue;
        this.components[label] = {
            toggle: (status) => handler(status),
        };

        this.createToggle(label);
    }

    registerComponent({ label, instance, initialValue = false }: CustomComponent) {
        this.options[label] = initialValue;
        this.components[label] = instance;
        this.createToggle(label);

        if (initialValue === true) {
            instance.action?.(this);
        }
    }

    onSceneAction(target: Object3D) {
        this.components.props.action(this, target);
        this.components.transform.controls?.attach(target);
        this.logObject(target);
    }

    onTransformAction(target: Object3D) {
        // show props panel for the selected object
        this.components.props.action(this, target);
        this.logObject(target);
    }

    logObject(target: Object3D) {
        if (!target) return;

        console.log('\n');
        console.log('target:   ', target);
        console.log('position: ', target.position);
        console.log('rotation: ', target.rotation);
        console.log('scale:    ', target.scale);
    }

    update(dt: number) {
        this.components.orbit.update?.(dt);
        this.components.physics?.update?.();
    }
}
