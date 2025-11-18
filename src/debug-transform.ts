import { Object3D, PerspectiveCamera, Raycaster, Vector2 } from 'three';
import { TransformControls } from 'three/addons/controls/TransformControls';
import { DebugOrbitControls } from './debug-orbit-controls';
import type { Debug, DebugComponent } from './debug';

const actions = ['translate', 'rotate', 'scale', 'xAxis', 'yAxis', 'zAxis', 'pick', 'snap', 'worldLocalSpace', 'reset', 'controlsSizeBigger', 'controlsSizeSmaller'] as const;
const keys = ['x', 'y', 'z', 'w', 'g', 'r', 's', 'q', '+', '=', '-', '_', 'control', 'shift', 'escape'] as const;

type ActionsList = Record<typeof actions[number], (arg?: boolean) => void>;
type Keymap = Record<typeof keys[number], (arg?: boolean) => void>;

export class DebugTransform implements DebugComponent {
    onActionComplete: Function;
    controls!: TransformControls;
    isShiftPressed: boolean = false;
    private camera!: PerspectiveCamera;
    private actions!: ActionsList;
    private keymap!: Keymap;
    private selectable: Object3D[] = [];
    private intersected: Object3D | null = null;
    private raycaster = new Raycaster();
    private pointer = new Vector2();
    private excludeTypes = ['LineSegments', 'DirectionalLight', 'HemisphereLight', 'Line'];

    constructor(onActionComplete: Function) {
        this.onActionComplete = onActionComplete;
    }

    action({ camera, renderer, scene, components: { orbit } }: Debug) {
        this.camera = camera;

        this.controls = new TransformControls(camera, renderer.domElement);
        const helper = this.controls.getHelper();
        helper.name = 'transform-controls';
        scene.add(helper);

        this.actions = this.initActionsList(this.controls);
        this.keymap = this.initKeymap(this.actions);

        this.selectable = scene.children
            .filter(({ type }) => !this.excludeTypes.includes(type))
            .filter(({ children }) => children.every((c) => c.type !== 'Line'))
            .filter(({ name }) => name !== 'transform-controls');

        this.bindEvents(orbit);
    }

    private initActionsList(ctrl: TransformControls): ActionsList {
        return {
            translate: () => {
                ctrl.setMode('translate');
            },
            rotate: () => {
                ctrl.setMode('rotate');
            },
            scale: () => {
                ctrl.setMode('scale');
            },
            xAxis: () => {
                ctrl.showX = true;
                ctrl.showY = ctrl.showY === ctrl.showZ ? !ctrl.showY : false;
                ctrl.showZ = ctrl.showY;
            },
            yAxis: () => {
                ctrl.showX = ctrl.showX === ctrl.showZ ? !ctrl.showX : false;
                ctrl.showY = true;
                ctrl.showZ = ctrl.showX;
            },
            zAxis: () => {
                ctrl.showX = ctrl.showX === ctrl.showY ? !ctrl.showX : false;
                ctrl.showY = ctrl.showX;
                ctrl.showZ = true;
            },
            pick: (status = true) => {
                this.isShiftPressed = status;
            },
            snap: () => {
                if (!ctrl.translationSnap) {
                    ctrl.setTranslationSnap(1);
                    ctrl.setRotationSnap(15 * (Math.PI / 180));
                } else {
                    ctrl.setTranslationSnap(null);
                    ctrl.setRotationSnap(null);
                }
            },
            worldLocalSpace: () => {
                ctrl.setSpace(ctrl.space === 'local' ? 'world' : 'local');
            },
            reset: () => {
                ctrl.detach();
                ctrl.showX = ctrl.showY = ctrl.showZ = true;
            },
            controlsSizeBigger: () => {
                ctrl.setSize(ctrl.size + 0.1);
            },
            controlsSizeSmaller: () => {
                ctrl.setSize(Math.max(ctrl.size - 0.1, 0.1));
            },
        };
    }

    private initKeymap(actions: ActionsList): Keymap {
        return {
            x: () => actions.xAxis(),
            y: () => actions.yAxis(),
            z: () => actions.zAxis(),
            w: () => actions.translate(),
            g: () => actions.translate(),
            r: () => actions.rotate(),
            s: () => actions.scale(),
            q: () => actions.worldLocalSpace(),
            shift: (arg) => actions.pick(arg),
            control: () => actions.snap(),
            escape: () => actions.reset(),
            '+': () => actions.controlsSizeBigger(),
            '=': () => actions.controlsSizeBigger(),
            '-': () => actions.controlsSizeSmaller(),
            _: () => actions.controlsSizeSmaller(),
        };
    }

    private bindEvents(orbit: DebugComponent) {
        if (!(orbit instanceof DebugOrbitControls)) {
            return;
        }

        this.controls?.addEventListener('mouseUp', () => {
            this.onActionComplete?.(this.controls?.object);
        });

        this.controls?.addEventListener('dragging-changed', (event) => {
            if (orbit?.controls) {
                orbit.controls.enabled = !event.value;
            }
        });

        window.addEventListener('keydown', (event) => {
            const key = event.key.toLowerCase();
            const isShiftKey = key === 'shift';
            this.keymap[key as typeof keys[number]]?.(isShiftKey);
        });

        window.addEventListener('keyup', (event) => {
            const key = event.key.toLowerCase();
            if (key === 'shift') {
                this.keymap?.[key](false);
            }
        });

        const hasTouchEvent = 'ontouchstart' in document.documentElement;
        const hasTouchPoints = window.navigator.maxTouchPoints >= 1;
        const isTouch = hasTouchEvent || hasTouchPoints;
        const eventName = isTouch ? 'touchstart' : 'mousedown';

        window.addEventListener(eventName, (e) => {
            this.handleClick((e instanceof TouchEvent) ? e.changedTouches[0] : e);
        });
    }

    private handleClick(e: MouseEvent | Touch) {
        if (!this.controls?.enabled || !this.isShiftPressed) {
            return;
        }

        this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.pointer, this.camera);

        const [firstIntersect] = this.raycaster.intersectObjects(
            this.selectable,
            true,
        );

        if (firstIntersect && firstIntersect.object !== this.intersected) {
            this.intersected = firstIntersect.object;
        }

        if (this.intersected) {
            this.controls.attach(this.intersected);
            this.onActionComplete?.(this.intersected);
        }
    }

    toggle(status: boolean, context: Debug) {
        if (!this.controls) {
            this.action(context);
        }

        if (!this.controls) {
            return;
        }

        this.controls.enabled = status;
        this.controls.detach();
    }
}
