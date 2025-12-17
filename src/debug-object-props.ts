import type { Color, Light, Material, Mesh, Object3D, Texture } from 'three';
import {
    BackSide,
    ClampToEdgeWrapping,
    DoubleSide,
    FrontSide,
    MirroredRepeatWrapping,
    RepeatWrapping,
} from 'three';
import { type FolderApi, Pane } from 'tweakpane';
import type { Debug, DebugComponent } from './debug';

type ColoredObject = {
    color?: Color;
    groundColor?: Color;
    emissive?: Color;
    specular?: Color;
};

type TexturedObject = {
    map?: Texture;
};

type CustomHandler = (target: Object3D, panel: Pane | FolderApi) => void;

export class DebugObjectProps implements DebugComponent {
    context: Debug;
    panel!: Pane;
    customHandler?: CustomHandler;
    title = 'Object Props';
    private activeObjectUuid = '';

    constructor(context: Debug) {
        this.context = context;
    }

    createPanel() {
        const panel = new Pane({ title: this.title });
        panel.element.parentElement?.setAttribute('id', 'object-panel');
        return panel;
    }

    adjustPlacement(visible: boolean) {
        if (!this.panel) {
            this.panel = this.createPanel();
            // this.panel.hide();
            this.panel.hidden = true;
        }

        if (this.panel.element.parentElement) {
            this.panel.element.parentElement.style.right = visible ? '200px' : '0px';
        }
    }

    toggle(status: boolean) {
        if (!this.panel) {
            this.init();
        }

        this.panel.hidden = !status;
        // this.panel.show(status);
    }

    init(target?: Object3D) {
        if (!this.context.options.props) {
            return;
        }

        if (!this.panel) {
            this.panel = this.createPanel();
            // this.panel.close();
            this.panel.expanded = false;
            this.adjustPlacement(this.context.options.scene === true);
        }

        if (!target) {
            return;
        }

        // check if we already shown props for this object
        if (this.activeObjectUuid === target.uuid) {
            // this.panel.open();
            this.panel.expanded = true;
            return;
        }

        this.activeObjectUuid = target.uuid;
        this.clearPanel();

        // set folder's name based on what the target object is
        const name = target.name || target.type || 'Object';
        this.panel.title = `${name} props`;
        console.log(this.panel.title);
        // this.panel.open();
        this.panel.expanded = true;

        this.parseObject(target);
    }

    clearPanel() {
        for (const child of this.panel.children) {
            child.dispose();
        }

        // for (const child of this.panel.children) {
        //     child.destroy();
        // }

        // for (const folder of this.panel.folders) {
        //     folder.destroy();
        // }

        // for (const ctrl of this.panel.controllers) {
        //     ctrl.destroy();
        // }
    }

    parseObject(target: Object3D | Light | Mesh) {
        this.panel.addBinding(target, 'type');

        if ('isLight' in target) {
            this.showLightProps(target);
        }

        if ('material' in target) {
            const { material } = target;
            const materials = Array.isArray(material) ? material : [material];

            for (const [i, mat] of materials.entries()) {
                this.showMaterialProps(target, mat, i);
            }
        }

        if ('position' in target) {
            this.showTransformProps(target);
        }

        if (target.children.length) {
            this.showGroupProps(target);
        }

        this.customHandler?.(target, this.panel);
    }

    showLightProps(target: Light) {
        this.handleColor(this.panel, target, 'color');
        this.handleColor(this.panel, target, 'groundColor');
        this.panel.addBinding(target, 'intensity', { min: 0, max: 3, step: 0.1 });
    }

    showMaterialProps(target: Mesh, material: Material & ColoredObject, materialId: number) {
        const name = materialId > 0 ? `Material${materialId}` : 'Material';
        const folder = this.panel.addFolder({ title: name });
        folder.addBinding(material, 'type');
        folder.addBinding(target, 'visible');

        this.handleColor(folder, material, 'color');
        this.handleColor(folder, material, 'emissive');
        this.handleColor(folder, material, 'specular');

        folder.addBinding(material, 'transparent');
        folder.addBinding(material, 'opacity', { min: 0, max: 1 });

        folder
            .addBinding(material, 'side', {
                options: {
                    FrontSide,
                    BackSide,
                    DoubleSide,
                },
            })
            .on('change', (event) => {
                material.side = event.value;
            });

        if ('wireframe' in material) {
            folder.addBinding(material, 'wireframe');
        }

        // if ('color' in material && material.color?.getHex()) {
        //     this.handleFunction(folder, 'LinearToSRGB', () =>
        //         material.color?.convertLinearToSRGB(),
        //     );
        //     this.handleFunction(folder, 'SRGBToLinear', () =>
        //         material.color?.convertSRGBToLinear(),
        //     );
        // }

        this.showMaterialTextureProps(folder, material);
    }

    // biome-ignore-start format: keep those folder.add calls as one-liners
    showMaterialTextureProps(parent: Pane | FolderApi, material: Material & TexturedObject) {
        const texture = material.map;
        
        if (!texture) {
            return;
        }
        
        const folder = parent.addFolder({ title: 'Texture' });
        folder.addBinding(texture, 'flipY');
        folder.addBinding(texture, 'rotation', { min: 0, max: Math.PI * 2, step: 0.01});
        folder.addBinding(texture.offset, 'x', { label: 'offsetX', min: 0, max: 1, step: 0.01});
        folder.addBinding(texture.offset, 'y', { label: 'offsetY', min: 0, max: 1, step: 0.01});
        folder.addBinding(texture.repeat, 'x', { label: 'repeatX'});
        folder.addBinding(texture.repeat, 'y', { label: 'repeatY'});

        const wrapFolder = folder.addBinding(texture, 'wrapS', { 
            label: 'wrap', 
            options: { 
                RepeatWrapping, 
                ClampToEdgeWrapping, 
                MirroredRepeatWrapping 
            }
        })
        wrapFolder.on('change', (event) => {
            texture.wrapS = event.value;
            texture.wrapT = event.value;
            texture.needsUpdate = true;
        });
    }
    // biome-ignore-end format: end of a block with custom formatting

    showGroupProps(target: Object3D) {
        this.panel.addBinding(target, 'visible');
    }

    showTransformProps(target: Object3D) {
        const params = {
            format: (v: number) => v.toFixed(2),
        };
        const folder = this.panel.addFolder({ title: 'Transform' });
        folder.addBinding(target, 'position', params);
        folder.addBinding(target, 'rotation', params);
        folder.addBinding(target, 'scale', params);
    }

    handleColor(parentFolder: Pane | FolderApi, target: ColoredObject, key: keyof typeof target) {
        if (!target[key]) {
            return;
        }

        const value = target[key];
        const colorProps = { [key]: value.getHex() };
        // const callback = (color: Color) => value.set(color);
        parentFolder.addBinding(colorProps, key, { view: 'color' }).on('change', (event) => {
            value.set(event.value);
        });
    }

    handleFunction(parentFolder: Pane | FolderApi, label: string, callback: () => void) {
        const obj = { fn: () => callback() };
        parentFolder.addBinding(obj, 'fn', { label });
    }
}
