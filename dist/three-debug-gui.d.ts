import { default as default_2 } from 'lil-gui';
import { Object3D } from 'three';
import { OrbitControls } from '../node_modules/@types/three/examples/jsm/controls/OrbitControls';
import { PerspectiveCamera } from 'three';
import { Scene } from 'three';
import { TransformControls } from '../node_modules/@types/three/examples/jsm/controls/TransformControls';
import { WebGLRenderer } from 'three';

declare type CoreSystems = {
    scene: Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
};

declare type CustomComponent = {
    label: string;
    initialValue: boolean;
    instance: DebugComponent;
};

declare type CustomToggle = {
    label: string;
    initialValue: boolean;
    handler: (status: boolean) => void;
};

export declare class Debug {
    options: Options;
    components: {
        scene: DebugSceneTree;
        props: DebugObjectProps;
        transform: DebugTransform;
        orbit: DebugOrbitControls;
        [key: string]: DebugComponent;
    };
    panel: default_2;
    scene: Scene;
    renderer: WebGLRenderer;
    camera: PerspectiveCamera;
    constructor();
    init({ scene, renderer, camera }: CoreSystems, props?: {}): void;
    tweakPanelStyle(): void;
    createToggle(label: keyof Options): void;
    addCustomToggle({ label, handler, initialValue }: CustomToggle): void;
    registerComponent({ label, instance, initialValue }: CustomComponent): void;
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

declare class DebugObjectProps {
    private activeObjectUuid;
    panel: default_2;
    private createPanel;
    adjustPlacement(visible: boolean): void;
    toggle(status: boolean, context: Debug): void;
    action(context: Debug, target?: Object3D): void;
    private clearPanel;
    private parseObject;
    private showLightProps;
    private showMaterialProps;
    private showMaterialTextureProps;
    private showGroupProps;
    private handleColor;
    private handleFunction;
}

declare class DebugOrbitControls implements DebugComponent {
    controls: OrbitControls;
    action({ camera, renderer }: Debug): void;
    toggle(status: boolean, context: Debug): void;
    update(dt: number): void;
}

declare class DebugSceneTree implements DebugComponent {
    private exclude;
    private keepClosed;
    private lightsFolder;
    panel: default_2;
    onActionComplete: Function;
    constructor(onActionComplete: Function);
    action(context: Debug): void;
    private tweakPanelStyle;
    private traverseScene;
    toggle(status: boolean, context: Debug): void;
}

declare class DebugTransform implements DebugComponent {
    onActionComplete: Function;
    controls: TransformControls;
    isShiftPressed: boolean;
    private camera;
    private actions;
    private keymap;
    private selectable;
    private intersected;
    private raycaster;
    private pointer;
    private excludeTypes;
    constructor(onActionComplete: Function);
    action({ camera, renderer, scene, components }: Debug): void;
    private initActionsList;
    private initKeymap;
    private bindEvents;
    private handleClick;
    toggle(status: boolean, context: Debug): void;
}

declare type Options = {
    scene: boolean;
    props: boolean;
    transform: boolean;
    orbit: boolean;
    [key: string]: boolean;
};

export { }
