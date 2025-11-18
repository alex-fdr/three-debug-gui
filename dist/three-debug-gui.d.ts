import { default as default_2 } from 'lil-gui';
import { Object3D } from 'three';
import { PerspectiveCamera } from 'three';
import { Scene } from 'three';
import { WebGLRenderer } from 'three';
import { World } from 'cannon-es';

declare type CoreSystems = {
    scene: Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    physics?: {
        world: World;
    };
};

declare type CustomToggle = {
    label: string;
    initialValue: boolean;
    handler: (status: boolean) => void;
};

export declare class Debug {
    options: Options;
    components: {
        [K in keyof Options]: DebugComponent;
    };
    panel: default_2;
    scene: Scene;
    renderer: WebGLRenderer;
    camera: PerspectiveCamera;
    physics?: CoreSystems['physics'];
    constructor();
    init({ scene, renderer, camera, physics }: CoreSystems, props?: {}): void;
    tweakPanelStyle(): void;
    createToggle(label: keyof Options): void;
    addCustomToggle({ label, initialValue, handler }: CustomToggle): void;
    onSceneAction(target: Object3D): void;
    onTransformAction(target: Object3D): void;
    logObject(target: Object3D): void;
    update(dt: number): void;
}

export declare const debug: Debug;

export declare interface DebugComponent {
    action?(context: Debug, target?: Object3D): void;
    toggle(status: boolean, context: Debug): void;
    update?(dt?: number): void;
}

declare type Options = {
    scene: boolean;
    props: boolean;
    transform: boolean;
    orbit: boolean;
    physics: boolean;
    [key: string]: boolean;
};

export { }
