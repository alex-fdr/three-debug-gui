import { OrbitControls } from 'three/addons/controls/OrbitControls';
import type { Debug, DebugComponent } from './debug';

export class DebugOrbitControls implements DebugComponent {
    controls!: OrbitControls;

    action({ camera, renderer }: Debug) {
        this.controls = new OrbitControls(camera, renderer.domElement);
        this.controls.update();
    }

    toggle(status: boolean, context: Debug) {
        if (!this.controls) {
            this.action(context);
        }

        this.controls.enabled = status;
    }

    update() {
        this.controls?.update();
    }
}
