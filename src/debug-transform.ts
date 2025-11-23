import { type Object3D, Raycaster, Vector2 } from 'three';
import { TransformControls } from 'three/addons/controls/TransformControls';
import type { Debug, DebugComponent } from './debug';
import type { DebugOrbitControls } from './debug-orbit-controls';

export class DebugTransform implements DebugComponent {
    context: Debug;
    controls!: TransformControls;
    isShiftPressed: boolean = false;
    selectable: Object3D[] = [];
    raycaster = new Raycaster();
    pointer = new Vector2();
    excludeTypes = ['Line', 'LineSegments', 'DirectionalLight', 'HemisphereLight'];

    constructor(context: Debug) {
        this.context = context;
    }

    action() {
        const { camera, canvas, scene, components } = this.context;

        this.controls = new TransformControls(camera, canvas);

        const helper = this.controls.getHelper();
        helper.name = 'transform-controls';
        scene.add(helper);

        this.selectable = scene.children.filter(({ name }) => name !== helper.name);

        this.bindEvents(components.orbit);
    }

    bindEvents(orbit: DebugOrbitControls) {
        this.controls.addEventListener('mouseUp', () => {
            this.context.onTransformAction?.(this.controls.object);
        });

        this.controls.addEventListener('dragging-changed', (event) => {
            if (orbit?.controls) {
                orbit.controls.enabled = !event.value;
            }
        });

        window.addEventListener('keydown', ({ key }) => {
            if (this.controls.enabled) {
                this.handleKeyPress(key, this.controls);
            }
        });

        window.addEventListener('keyup', ({ key }) => {
            if (key === 'Shift') {
                this.isShiftPressed = false;
            }
        });

        const hasTouchEvent = 'ontouchstart' in document.documentElement;
        const hasTouchPoints = window.navigator.maxTouchPoints >= 1;
        const eventName = hasTouchEvent || hasTouchPoints ? 'touchstart' : 'mousedown';

        window.addEventListener(eventName, (e) => {
            this.handleClick(e instanceof TouchEvent ? e.changedTouches[0] : e);
        });
    }

    handleKeyPress(key: string, ctrl: TransformControls) {
        switch (key) {
            case 'g':
                ctrl.setMode('translate');
                break;
            case 'r':
                ctrl.setMode('rotate');
                break;
            case 's':
                ctrl.setMode('scale');
                break;
            case 'x':
                ctrl.showX = true;
                ctrl.showY = ctrl.showY === ctrl.showZ ? !ctrl.showY : false;
                ctrl.showZ = ctrl.showY;
                break;
            case 'y':
                ctrl.showX = ctrl.showX === ctrl.showZ ? !ctrl.showX : false;
                ctrl.showY = true;
                ctrl.showZ = ctrl.showX;
                break;
            case 'z':
                ctrl.showX = ctrl.showX === ctrl.showY ? !ctrl.showX : false;
                ctrl.showY = ctrl.showX;
                ctrl.showZ = true;
                break;
            case 'q':
                ctrl.setSpace(ctrl.space === 'local' ? 'world' : 'local');
                break;
            case 'Control':
                if (!ctrl.translationSnap) {
                    ctrl.setTranslationSnap(1);
                    ctrl.setRotationSnap(15 * (Math.PI / 180));
                    ctrl.setScaleSnap(0.1);
                } else {
                    ctrl.setTranslationSnap(null);
                    ctrl.setRotationSnap(null);
                    ctrl.setScaleSnap(null);
                }
                break;
            case 'Escape':
                ctrl.detach();
                ctrl.showX = ctrl.showY = ctrl.showZ = true;
                break;
            case 'Shift':
                this.isShiftPressed = true;
                break;
            case '+':
            case '=':
                ctrl.setSize(ctrl.size + 0.1);
                break;
            case '-':
            case '_':
                ctrl.setSize(Math.max(ctrl.size - 0.1, 0.1));
                break;
            default:
                console.warn('unsupported key pressed', key);
        }
    }

    handleClick(e: MouseEvent | Touch) {
        if (!this.controls?.enabled || !this.isShiftPressed) {
            return;
        }

        this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.pointer, this.controls.camera);

        const [firstIntersect] = this.raycaster.intersectObjects(this.selectable, true);

        if (firstIntersect?.object) {
            this.controls.attach(firstIntersect.object);
            this.context.onTransformAction?.(firstIntersect.object);
        }
    }

    toggle(status: boolean) {
        if (!this.controls) {
            this.action();
        }

        this.controls.enabled = status;
        this.controls.detach();
    }
}
