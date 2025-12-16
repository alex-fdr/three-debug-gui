import type { Object3D, PerspectiveCamera, Scene } from 'three';
import { Pane } from 'tweakpane';
// import { DebugObjectProps } from './debug-object-props.ts';
import { DebugOrbitControls } from './debug-orbit-controls.ts';
import { DebugSceneTree } from './debug-scene-tree.ts';
import { DebugTransform } from './debug-transform.ts';

export interface DebugComponent {
    init?(target?: Object3D): void;
    toggle(status: boolean): void;
    update?(dt?: number): void;
}

export type Options = {
    scene: boolean;
    props: boolean;
    transform: boolean;
    orbit: boolean;
    [key: string]: boolean | undefined;
};

export type DebugParams = {
    scene: Scene;
    camera: PerspectiveCamera;
    canvas: HTMLCanvasElement;
    options: Partial<Options>;
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
        // props: DebugObjectProps;
        transform: DebugTransform;
        orbit: DebugOrbitControls;
        [key: string]: DebugComponent;
    };
    panel!: Pane;
    scene!: Scene;
    canvas!: HTMLCanvasElement;
    camera!: PerspectiveCamera;
    enabled = false;

    constructor() {
        this.options = {
            scene: false,
            props: false,
            transform: false,
            orbit: false,
        };
    }

    init({ scene, canvas, camera, options = {} }: DebugParams) {
        if (this.panel) {
            return;
        }

        this.scene = scene;
        this.canvas = canvas;
        this.camera = camera;
        this.options = { ...this.options, ...options };

        this.panel = new Pane({
            // width: 100,
            title: 'Debug',
        });
        console.log(this.panel);
        this.panel.element.parentElement?.setAttribute('id', 'debug-panel');

        this.components = {
            // props: new DebugObjectProps(this),
            orbit: new DebugOrbitControls(this),
            scene: new DebugSceneTree(this),
            transform: new DebugTransform(this),
        };

        for (const label of Object.keys(this.options)) {
            this.createToggle(label);

            // perform control's action if it is enabled by default
            if (this.options[label]) {
                this.components[label].init?.();
            }
        }

        this.tweakPanelStyle();
        this.enabled = true;
    }

    tweakPanelStyle() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            #debug-panel {
                top: 0;
                left: 0;
                position: fixed;
            }

            #debug-panel .tp-lblv_v {
                width: 20%;
            }
        `;
        document.head.appendChild(styleElement);
    }

    createToggle(label: keyof Options) {
        this.panel.addBinding(this.options, label).on('change', (event) => {
            console.log('EVENT', event);
            if (typeof event.value === 'undefined') {
                return;
            }

            this.options[label] = event.value;
            this.components[label]?.toggle(event.value);
        });
    }

    registerComponent({ label, instance, initialValue = false }: CustomComponent) {
        if (Object.hasOwn(this.options, label)) {
            console.error(`a toggle with the name '${label}' already exists`);
            return;
        }

        this.options[label] = initialValue;
        this.components[label] = instance;
        this.createToggle(label);

        if (initialValue === true) {
            instance.init?.();
        }
    }

    onSceneAction(target: Object3D) {
        /* this.components.props.init(target); */
        this.components.transform.controls?.attach(target);
        this.logObject(target);
    }

    onTransformAction(target: Object3D) {
        // show props panel for the selected object
        /* this.components.props.init(target); */
        this.logObject(target);
    }

    logObject(target: Object3D) {
        if (!target) {
            return;
        }

        console.log('\n');
        console.log('target:   ', target);
        console.log('position: ', target.position);
        console.log('rotation: ', target.rotation);
        console.log('scale:    ', target.scale);
    }

    update(dt: number): void {
        if (!this.enabled) {
            return;
        }

        this.components.orbit.update?.(dt);
        this.components.physics?.update?.();
    }
}
