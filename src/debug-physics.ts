import CannonDebugger from 'cannon-es-debugger';
import type { Debug, DebugComponent } from './debug';
import type { Mesh } from 'three';

export class DebugPhysics implements DebugComponent {
    private debugger: ReturnType<typeof CannonDebugger> | null = null;
    private meshes: Mesh[] = [];

    action({ scene, physics }: Debug) {
        if (!physics) {
            return;
        }

        this.debugger = CannonDebugger(scene, physics.world, {
            onInit: (_, mesh: Mesh) => {
                this.meshes.push(mesh);
            },
        });
    }

    toggle(status: boolean, context: Debug) {
        if (!this.debugger) {
            this.action(context);
        }

        for (const mesh of this.meshes) {
            mesh.visible = status;
        }
    }

    update() {
        this.debugger?.update();
    }
}
