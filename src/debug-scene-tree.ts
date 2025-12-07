import GUI from 'lil-gui';
import type { Object3D } from 'three';
import type { Debug, DebugComponent } from './debug';

type SomeObject3D = Object3D & {
    isMesh?: boolean;
    isLight?: boolean;
};

export class DebugSceneTree implements DebugComponent {
    context: Debug;
    panel!: GUI;
    title = 'Scene Tree';
    private exclude = ['transform-controls', 'TransformControlsGizmo'];
    private keepClosed = ['mixamorig_Hips'];
    private lightsFolder!: GUI;

    constructor(context: Debug) {
        this.context = context;
    }

    init() {
        this.panel = new GUI({ title: this.title, width: 200 });
        this.panel.domElement.style.right = '0px';

        this.lightsFolder = this.panel.addFolder('Lights');

        this.tweakPanelStyle();

        for (const child of this.context.scene.children) {
            this.traverseScene(child, this.panel);
        }
    }

    tweakPanelStyle() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .lil-gui {
                --folder-indent: 8px;
            }
            .lil-title:has(+ .lil-children:empty)::before {
                content: '';
            }
            .lil-title ~ .lil-children:empty {
                display: none;
            }
            .lil-gui .lil-title:before {
                display: inline;
            }
        `;
        document.head.appendChild(styleElement);
    }

    traverseScene(object: SomeObject3D, parentFolder: GUI) {
        const name = object.name !== '' ? object.name : object.type;

        if (this.exclude.includes(name)) {
            return;
        }

        const parent = object.isLight ? this.lightsFolder : parentFolder;
        const folder = parent.addFolder(name);
        const clickArea = folder.domElement.querySelector('.lil-title');

        clickArea?.addEventListener('click', () => {
            this.context.onSceneAction?.(object);
        });

        if (this.keepClosed.includes(name) || object.isLight || object.isMesh) {
            folder.close();
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

        this.panel.show(status);
        this.context.components.props.adjustPlacement(status);
    }
}
