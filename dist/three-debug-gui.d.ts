import { Color } from 'three';
import { FolderApi } from 'tweakpane';
import { Light } from 'three';
import { Material } from 'three';
import { Mesh } from 'three';
import { Object3D } from 'three';
import { OrbitControls } from '../node_modules/@types/three/examples/jsm/controls/OrbitControls';
import { Pane } from 'tweakpane';
import { PerspectiveCamera } from 'three';
import { Raycaster } from 'three';
import { Scene } from 'three';
import { Texture } from 'three';
import { TransformControls } from '../node_modules/@types/three/examples/jsm/controls/TransformControls';
import { Vector2 } from 'three';

declare type ColoredObject = {
    color?: Color;
    groundColor?: Color;
    emissive?: Color;
    specular?: Color;
};

declare type CustomComponent = {
    label: string;
    initialValue: boolean;
    instance: DebugComponent;
};

declare type CustomHandler = (target: Object3D, panel: Pane | FolderApi) => void;

export declare class Debug {
    options: Options;
    components: {
        scene: DebugSceneTree;
        props: DebugObjectProps;
        transform: DebugTransform;
        orbit: DebugOrbitControls;
        [key: string]: DebugComponent;
    };
    panel: Pane;
    scene: Scene;
    canvas: HTMLCanvasElement;
    camera: PerspectiveCamera;
    enabled: boolean;
    constructor();
    init({ scene, canvas, camera, options }: DebugParams): void;
    createToggle(label: keyof Options): void;
    registerComponent({ label, instance, initialValue }: CustomComponent): void;
    onSceneAction(target: Object3D): void;
    onTransformAction(target: Object3D): void;
    logObject(target: Object3D): void;
    update(dt: number): void;
}

export declare const debug: Debug;

export declare interface DebugComponent {
    init?(target?: Object3D): void;
    toggle(status: boolean): void;
    update?(dt?: number): void;
}

declare class DebugObjectProps implements DebugComponent {
    context: Debug;
    panel: Pane;
    customHandler?: CustomHandler;
    title: string;
    private activeObjectUuid;
    constructor(context: Debug);
    createPanel(): Pane;
    adjustPlacement(visible: boolean): void;
    toggle(status: boolean): void;
    init(target?: Object3D): void;
    clearPanel(): void;
    parseObject(target: Object3D | Light | Mesh): void;
    showLightProps(target: Light): void;
    showMaterialProps(target: Mesh, material: Material & ColoredObject, materialId: number): void;
    showMaterialTextureProps(parent: Pane | FolderApi, material: Material & TexturedObject): void;
    showGroupProps(target: Object3D): void;
    showTransformProps(target: Object3D): void;
    handleColor(parentFolder: Pane | FolderApi, target: ColoredObject, key: keyof typeof target): void;
    handleFunction(parentFolder: Pane | FolderApi, label: string, callback: () => void): void;
}

declare class DebugOrbitControls implements DebugComponent {
    controls: OrbitControls;
    context: Debug;
    constructor(context: Debug);
    init(): void;
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
    panel: Pane;
    title: string;
    private exclude;
    private keepClosed;
    private lightsFolder;
    constructor(context: Debug);
    init(): void;
    traverseScene(object: SomeObject3D, parentFolder: Pane | FolderApi): void;
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
    init(): void;
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

declare type SomeObject3D = Object3D & {
    isMesh?: boolean;
    isLight?: boolean;
};

declare type TexturedObject = {
    map?: Texture;
};

export { }
