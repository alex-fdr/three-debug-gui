import { OrbitControls } from 'three/addons/controls/OrbitControls';
import type { Debug, DebugComponent } from './debug';

export class DebugOrbitControls implements DebugComponent {
    controls!: OrbitControls;
    context: Debug;

    constructor(context: Debug) {
        this.context = context;
    }

    action() {
        const { camera, canvas } = this.context;
        this.controls = new OrbitControls(camera, canvas);
        this.controls.update();
    }

    toggle(status: boolean) {
        if (!this.controls) {
            this.action();
        }

        this.controls.enabled = status;
    }

    update(dt: number) {
        this.controls?.update(dt);
    }
}
