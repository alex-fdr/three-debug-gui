// biome-ignore assist/source/organizeImports: custom formatting for imports
import GUI from 'lil-gui';
import type { Debug, DebugComponent } from './debug';
import type { Color, Light, Material, Mesh, Object3D, Side, Texture, Wrapping } from 'three';
import {
    BackSide,
    DoubleSide,
    FrontSide,
    ClampToEdgeWrapping,
    MirroredRepeatWrapping,
    RepeatWrapping,
} from 'three';

type ColoredObject = {
    color?: Color;
    groundColor?: Color;
    emissive?: Color;
    specular?: Color;
};

type TexturedObject = {
    map?: Texture;
};

export class DebugObjectProps implements DebugComponent {
    context: Debug;
    panel!: GUI;
    customHandler?: (target: Object3D, panel: GUI) => void;
    title = 'Object Props';
    private activeObjectUuid = '';

    constructor(context: Debug) {
        this.context = context;
    }

    createPanel() {
        return new GUI({ title: this.title, width: 200 });
    }

    adjustPlacement(visible: boolean) {
        if (!this.panel) {
            this.panel = this.createPanel();
            this.panel.hide();
        }

        this.panel.domElement.style.right = visible ? '200px' : '0px';
    }

    toggle(status: boolean) {
        if (!this.panel) {
            this.init();
        }

        this.panel.show(status);
    }

    init(target?: Object3D) {
        if (!this.context.options.props) {
            return;
        }

        if (!this.panel) {
            this.panel = this.createPanel();
            this.panel.close();
            this.adjustPlacement(this.context.options.scene === true);
        }

        if (!target) {
            return;
        }

        // check if we already shown props for this object
        if (this.activeObjectUuid === target.uuid) {
            this.panel.open();
            return;
        }

        this.activeObjectUuid = target.uuid;
        this.clearPanel();

        // set folder's name based on what the target object is
        const name = target.name || target.type || 'Object';
        this.panel.title(`${name} props`);
        this.panel.open();

        this.parseObject(target);
    }

    clearPanel() {
        for (const child of this.panel.children) {
            child.destroy();
        }

        for (const folder of this.panel.folders) {
            folder.destroy();
        }

        for (const ctrl of this.panel.controllers) {
            ctrl.destroy();
        }
    }

    parseObject(target: Object3D | Light | Mesh) {
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

        if (target.children.length) {
            this.showGroupProps(target);
        }

        this.customHandler?.(target, this.panel);
    }

    showLightProps(target: Light) {
        this.handleColor(this.panel, target, 'color');
        this.handleColor(this.panel, target, 'groundColor');
        this.panel.add(target, 'intensity', 0, 3, 0.1);
    }

    showMaterialProps(target: Mesh, material: Material & ColoredObject, materialId: number) {
        const name = materialId > 0 ? `Material${materialId}` : 'Material';
        const folder = this.panel.addFolder(name);
        folder.add(material, 'type');
        folder.add(target, 'visible');

        this.handleColor(folder, material, 'color');
        this.handleColor(folder, material, 'emissive');
        this.handleColor(folder, material, 'specular');

        folder.add(material, 'transparent');
        folder.add(material, 'opacity', 0, 1);
        folder.add(material, 'side', { FrontSide, BackSide, DoubleSide }).onChange((s: Side) => {
            material.side = s;
        });

        if ('wireframe' in material) {
            folder.add(material, 'wireframe');
        }

        if ('color' in material && material.color?.getHex()) {
            this.handleFunction(folder, 'LinearToSRGB', () =>
                material.color?.convertLinearToSRGB(),
            );
            this.handleFunction(folder, 'SRGBToLinear', () =>
                material.color?.convertSRGBToLinear(),
            );
        }

        this.showMaterialTextureProps(folder, material);
    }

    showMaterialTextureProps(parent: GUI, material: Material & TexturedObject) {
        const texture = material.map;

        if (!texture) {
            return;
        }

        const folder = parent.addFolder('Texture');
        folder.add(texture, 'flipY');
        folder
            .add(texture, 'rotation')
            .min(0)
            .max(Math.PI * 2)
            .step(0.01);
        folder.add(texture.offset, 'x').name('offsetX').min(0).max(1).step(0.01);
        folder.add(texture.offset, 'y').name('offsetY').min(0).max(1).step(0.01);
        folder.add(texture.repeat, 'x').name('repeatX');
        folder.add(texture.repeat, 'y').name('repeatY');

        folder
            .add(texture, 'wrapS', {
                ClampToEdgeWrapping,
                RepeatWrapping,
                MirroredRepeatWrapping,
            })
            .onChange((val: Wrapping) => {
                texture.wrapS = val;
                texture.wrapT = val;
                texture.needsUpdate = true;
            })
            .name('wrap');
    }

    showGroupProps(target: Object3D) {
        this.panel.add(target, 'visible');
    }

    handleColor(parentFolder: GUI, target: ColoredObject, key: keyof typeof target) {
        if (!target[key]) {
            return;
        }

        const value = target[key];
        const colorProps = { [key]: value.getHex() };
        const callback = (color: Color) => value.set(color);
        parentFolder.addColor(colorProps, key).onChange(callback);
    }

    handleFunction(parentFolder: GUI, label: string, callback: () => void) {
        const obj = { fn: () => callback() };
        parentFolder.add(obj, 'fn').name(label);
    }
}
