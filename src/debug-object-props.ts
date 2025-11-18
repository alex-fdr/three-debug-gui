import { Body } from 'cannon-es';
import GUI from 'lil-gui';
import {
    BackSide,
    DoubleSide,
    FrontSide,
    RepeatWrapping,
    ClampToEdgeWrapping,
    MirroredRepeatWrapping,
    MeshBasicMaterial,
    MeshLambertMaterial,
    MeshPhongMaterial,
    MeshStandardMaterial,
    type Object3D,
    type Light,
    type Mesh,
    type Color,
    type Material,
    type Wrapping,
    type Side,
} from 'three';
import type { Debug } from './debug';

type PhysicalObject3D = Object3D & { body: Body; };

export class DebugObjectProps {
    private activeObjectUuid = '';
    panel!: GUI;

    private createPanel() {
        return new GUI({ title: 'Object Props', width: 200 });
    }

    adjustPlacement(visible: boolean) {
        if (!this.panel) {
            this.panel = this.createPanel();
            this.panel.hide();
        }

        this.panel.domElement.style.right = visible ? '200px' : '0px';
    }

    toggle(status: boolean, context: Debug) {
        if (!this.panel) {
            this.action(context);
        }

        this.panel.show(status);
    }

    action(context: Debug, target?: Object3D) {
        if (!context.options.props) {
            return;
        }

        if (!this.panel) {
            this.panel = this.createPanel();
            this.panel.close();
            this.adjustPlacement(context.options.scene === true);
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

    private clearPanel() {
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

    private parseObject(target: Object3D | Light | Mesh) {
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

        if ('body' in target) {
            this.showPhysicsBodyProps(target as PhysicalObject3D);
        }
    }

    private showLightProps(target: Light) {
        this.handleColor(this.panel, target, 'color');
        this.handleColor(this.panel, target, 'groundColor');
        this.panel.add(target, 'intensity', 0, 3, 0.1);
    }

    private showMaterialProps(target: Mesh, material: Material, materialId: number) {
        const name = materialId > 0 ? `Material${materialId}` : 'Material';
        const folder = this.panel.addFolder(name);
        folder.add(material, 'type');
        folder.add(target, 'visible');

        this.handleColor(folder, material, 'color');
        this.handleColor(folder, material, 'emissive');
        this.handleColor(folder, material, 'specular');

        folder.add(material, 'transparent');
        folder.add(material, 'opacity', 0, 1);
        folder
            .add(material, 'side', { FrontSide, BackSide, DoubleSide })
            .onChange((val: Side) => material.side = val);

        if (material instanceof MeshLambertMaterial ||
            material instanceof MeshBasicMaterial ||
            material instanceof MeshPhongMaterial ||
            material instanceof MeshStandardMaterial) {

            if (Object.hasOwn(material, 'wireframe')) {
                folder.add(material, 'wireframe');
            }

            if (material.color?.getHex()) {
                this.handleFunction(folder, 'LinearToSRGB', () =>
                    material.color.convertLinearToSRGB(),
                );
                this.handleFunction(folder, 'SRGBToLinear', () =>
                    material.color.convertSRGBToLinear(),
                );
            }

            this.showMaterialTextureProps(folder, material);
        }

    }

    private showMaterialTextureProps(parent: GUI, material: MeshLambertMaterial | MeshBasicMaterial | MeshPhongMaterial | MeshStandardMaterial) {
        const folder = parent.addFolder('Texture');
        const texture = material.map;

        if (!texture) {
            return;
        }

        folder.add(texture, 'flipY');
        folder.add(texture, 'rotation').min(0).max(Math.PI * 2).step(0.01);
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

    private showPhysicsBodyProps(target: PhysicalObject3D) {
        const { body } = target;
        const folder = this.panel.addFolder('Physical Body');

        folder.add(body, 'type', {
            dynamic: Body.DYNAMIC,
            static: Body.STATIC,
            kinematic: Body.KINEMATIC,
        });

        folder.add(body, 'mass');
        folder.add(body, 'angularDamping').min(0).max(1).step(0.01);
        folder.add(body, 'linearDamping').min(0).max(1).step(0.01);

        // this.handleVector3(folder, body, 'position');
        // this.handleVector3(folder, body, 'velocity');
        // this.handleVector3(folder, body, 'inertia');
        // this.handleVector3(folder, body, 'force');
    }

    private showGroupProps(target: Object3D) {
        this.panel.add(target, 'visible');
    }

    private handleColor(parentFolder: GUI, target: any, key: string) {
        if (!target[key]) {
            return;
        }

        const colorProps = { [key]: target[key].getHex() };
        parentFolder
            .addColor(colorProps, key)
            .onChange((color: Color) => target[key].set(color));
    }

    private handleFunction(parentFolder: GUI, label: string, callback: Function) {
        const obj = { fn: () => callback() };
        parentFolder.add(obj, 'fn').name(label);
    }
}
