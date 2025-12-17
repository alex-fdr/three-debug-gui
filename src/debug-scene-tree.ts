import type { Object3D } from 'three';
import { type FolderApi, Pane } from 'tweakpane';
import type { Debug, DebugComponent } from './debug';

type SomeObject3D = Object3D & {
    isMesh?: boolean;
    isLight?: boolean;
};

export class DebugSceneTree implements DebugComponent {
    context: Debug;
    panel!: Pane;
    title = 'Scene Tree';
    private exclude = ['transform-controls', 'TransformControlsGizmo'];
    private keepClosed = ['mixamorig_Hips'];
    private lightsFolder!: FolderApi;

    constructor(context: Debug) {
        this.context = context;
    }

    init() {
        this.panel = new Pane({ title: this.title });
        this.panel.element.parentElement?.setAttribute('id', 'scene-panel');

        this.lightsFolder = this.panel.addFolder({ title: 'Lights' });

        for (const child of this.context.scene.children) {
            this.traverseScene(child, this.panel);
        }
    }

    traverseScene(object: SomeObject3D, parentFolder: Pane | FolderApi) {
        const name = object.name !== '' ? object.name : object.type;

        if (this.exclude.includes(name)) {
            return;
        }

        const parent = object.isLight ? this.lightsFolder : parentFolder;
        const folder = parent.addFolder({ title: name });

        folder.controller.view.buttonElement.removeEventListener(
            'click',
            folder.controller.onTitleClick_,
        );
        folder.controller.view.buttonElement.children[1].addEventListener(
            'click',
            folder.controller.onTitleClick_,
        );

        folder.controller.view.titleElement.addEventListener('click', (e) => {
            e.preventDefault();
            this.context.onSceneAction?.(object);
        });

        if (this.keepClosed.includes(name) || object.isLight || object.isMesh) {
            folder.expanded = false;
        }

        // recursively traverse children of the current node
        for (const child of object.children) {
            this.traverseScene(child, folder);
        }
    }

    toggle(status: boolean) {
        if (!this.panel) {
            this.init();
        }

        this.panel.expanded = status;
        this.context.components.props.adjustPlacement(status);
    }
}
