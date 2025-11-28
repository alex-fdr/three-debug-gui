import { default as default_2 } from 'lil-gui';
import { Light } from 'three';
import { Material } from 'three';
import { Mesh } from 'three';
import { MeshBasicMaterial } from 'three';
import { MeshLambertMaterial } from 'three';
import { MeshPhongMaterial } from 'three';
import { MeshStandardMaterial } from 'three';
import { Object3D } from 'three';
import { OrbitControls } from '../node_modules/@types/three/examples/jsm/controls/OrbitControls';
import { PerspectiveCamera } from 'three';
import { Raycaster } from 'three';
import { Scene } from 'three';
import { TransformControls } from '../node_modules/@types/three/examples/jsm/controls/TransformControls';
import { Vector2 } from 'three';

declare type CustomComponent = {
    label: string;
    initialValue: boolean;
    instance: DebugComponent;
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
    canvas: HTMLCanvasElement;
    camera: PerspectiveCamera;
    enabled: boolean;
    constructor();
    init({ scene, canvas, camera, options }: DebugParams): void;
    tweakPanelStyle(): void;
    createToggle(label: keyof Options): void;
    registerComponent({ label, instance, initialValue }: CustomComponent): void;
    onSceneAction(target: Object3D): void;
    onTransformAction(target: Object3D): void;
    logObject(target: Object3D): void;
    update(dt: number): void;
}

export declare const debug: Debug;

export declare interface DebugComponent {
    action?(target?: Object3D): void;
    toggle(status: boolean): void;
    update?(dt?: number): void;
}

declare class DebugObjectProps {
    context: Debug;
    panel: default_2;
    private activeObjectUuid;
    constructor(context: Debug);
    createPanel(): default_2;
    adjustPlacement(visible: boolean): void;
    toggle(status: boolean): void;
    action(target?: Object3D): void;
    clearPanel(): void;
    parseObject(target: Object3D | Light | Mesh): void;
    showLightProps(target: Light): void;
    showMaterialProps(target: Mesh, material: Material, materialId: number): void;
    showMaterialTextureProps(parent: default_2, material: MeshLambertMaterial | MeshBasicMaterial | MeshPhongMaterial | MeshStandardMaterial): void;
    showGroupProps(target: Object3D): void;
    handleColor(parentFolder: default_2, target: any, key: string): void;
    handleFunction(parentFolder: default_2, label: string, callback: () => void): void;
}

declare class DebugOrbitControls implements DebugComponent {
    controls: OrbitControls;
    context: Debug;
    constructor(context: Debug);
    action(): void;
    toggle(status: boolean): void;
    update(dt: number): void;
}

declare type DebugParams = {
    scene: Scene;
    camera: PerspectiveCamera;
    canvas: HTMLCanvasElement;
    options: Partial<Options>;
};

declare class DebugSceneTree implements DebugComponent {
    context: Debug;
    panel: default_2;
    private exclude;
    private keepClosed;
    private lightsFolder;
    constructor(context: Debug);
    action(): void;
    tweakPanelStyle(): void;
    traverseScene(object: Object3D | Light | Mesh, parentFolder: default_2): void;
    toggle(status: boolean): void;
}

declare class DebugTransform implements DebugComponent {
    context: Debug;
    controls: TransformControls;
    isShiftPressed: boolean;
    selectable: Object3D[];
    raycaster: Raycaster;
    pointer: Vector2;
    excludeTypes: string[];
    constructor(context: Debug);
    action(): void;
    bindEvents(orbit: DebugOrbitControls): void;
    handleKeyPress(key: string, ctrl: TransformControls): void;
    handleClick(e: MouseEvent | Touch): void;
    toggle(status: boolean): void;
}

declare type Options = {
    scene: boolean;
    props: boolean;
    transform: boolean;
    orbit: boolean;
    [key: string]: boolean | undefined;
};

export { }
