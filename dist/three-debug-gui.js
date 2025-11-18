import h from "lil-gui";
import { DoubleSide as d, BackSide as p, FrontSide as f, MeshLambertMaterial as m, MeshBasicMaterial as u, MeshPhongMaterial as w, MeshStandardMaterial as g, MirroredRepeatWrapping as y, RepeatWrapping as S, ClampToEdgeWrapping as b, Raycaster as C, Vector2 as x } from "three";
import { OrbitControls as T } from "three/addons/controls/OrbitControls";
import { TransformControls as P } from "three/addons/controls/TransformControls";
class L {
  controls;
  action({ camera: e, renderer: t }) {
    this.controls = new T(e, t.domElement), this.controls.update();
  }
  toggle(e, t) {
    this.controls || this.action(t), this.controls.enabled = e;
  }
  update(e) {
    this.controls?.update(e);
  }
}
class A {
  activeObjectUuid = "";
  panel;
  createPanel() {
    return new h({ title: "Object Props", width: 200 });
  }
  adjustPlacement(e) {
    this.panel || (this.panel = this.createPanel(), this.panel.hide()), this.panel.domElement.style.right = e ? "200px" : "0px";
  }
  toggle(e, t) {
    this.panel || this.action(t), this.panel.show(e);
  }
  action(e, t) {
    if (!e.options.props || (this.panel || (this.panel = this.createPanel(), this.panel.close(), this.adjustPlacement(e.options.scene === !0)), !t))
      return;
    if (this.activeObjectUuid === t.uuid) {
      this.panel.open();
      return;
    }
    this.activeObjectUuid = t.uuid, this.clearPanel();
    const s = t.name || t.type || "Object";
    this.panel.title(`${s} props`), this.panel.open(), this.parseObject(t);
  }
  clearPanel() {
    for (const e of this.panel.children)
      e.destroy();
    for (const e of this.panel.folders)
      e.destroy();
    for (const e of this.panel.controllers)
      e.destroy();
  }
  parseObject(e) {
    if ("isLight" in e && this.showLightProps(e), "material" in e) {
      const { material: t } = e, s = Array.isArray(t) ? t : [t];
      for (const [n, o] of s.entries())
        this.showMaterialProps(e, o, n);
    }
    e.children.length && this.showGroupProps(e);
  }
  showLightProps(e) {
    this.handleColor(this.panel, e, "color"), this.handleColor(this.panel, e, "groundColor"), this.panel.add(e, "intensity", 0, 3, 0.1);
  }
  showMaterialProps(e, t, s) {
    const n = s > 0 ? `Material${s}` : "Material", o = this.panel.addFolder(n);
    o.add(t, "type"), o.add(e, "visible"), this.handleColor(o, t, "color"), this.handleColor(o, t, "emissive"), this.handleColor(o, t, "specular"), o.add(t, "transparent"), o.add(t, "opacity", 0, 1), o.add(t, "side", { FrontSide: f, BackSide: p, DoubleSide: d }).onChange((i) => t.side = i), (t instanceof m || t instanceof u || t instanceof w || t instanceof g) && (Object.hasOwn(t, "wireframe") && o.add(t, "wireframe"), t.color?.getHex() && (this.handleFunction(
      o,
      "LinearToSRGB",
      () => t.color.convertLinearToSRGB()
    ), this.handleFunction(
      o,
      "SRGBToLinear",
      () => t.color.convertSRGBToLinear()
    )), this.showMaterialTextureProps(o, t));
  }
  showMaterialTextureProps(e, t) {
    const s = e.addFolder("Texture"), n = t.map;
    n && (s.add(n, "flipY"), s.add(n, "rotation").min(0).max(Math.PI * 2).step(0.01), s.add(n.offset, "x").name("offsetX").min(0).max(1).step(0.01), s.add(n.offset, "y").name("offsetY").min(0).max(1).step(0.01), s.add(n.repeat, "x").name("repeatX"), s.add(n.repeat, "y").name("repeatY"), s.add(n, "wrapS", {
      ClampToEdgeWrapping: b,
      RepeatWrapping: S,
      MirroredRepeatWrapping: y
    }).onChange((o) => {
      n.wrapS = o, n.wrapT = o, n.needsUpdate = !0;
    }).name("wrap"));
  }
  showGroupProps(e) {
    this.panel.add(e, "visible");
  }
  handleColor(e, t, s) {
    if (!t[s])
      return;
    const n = { [s]: t[s].getHex() };
    e.addColor(n, s).onChange((o) => t[s].set(o));
  }
  handleFunction(e, t, s) {
    const n = { fn: () => s() };
    e.add(n, "fn").name(t);
  }
}
class M {
  exclude = ["transform-controls", "TransformControlsGizmo"];
  keepClosed = ["mixamorig_Hips"];
  lightsFolder;
  panel;
  onActionComplete;
  constructor(e) {
    this.onActionComplete = e;
  }
  action(e) {
    this.panel = new h({ title: "Scene Tree", width: 200 }), this.panel.domElement.style.right = "0px", this.lightsFolder = this.panel.addFolder("Lights"), this.tweakPanelStyle();
    for (const t of e.scene.children)
      this.traverseScene(t, this.panel);
  }
  tweakPanelStyle() {
    const e = document.createElement("style");
    e.textContent = `
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
        `, document.head.appendChild(e);
  }
  traverseScene(e, t) {
    const s = e.name !== "" ? e.name : e.type;
    if (this.exclude.includes(s))
      return;
    const n = "isLight" in e && e.isLight, o = "isMesh" in e && e.isMesh, a = (n ? this.lightsFolder : t).addFolder(s);
    a.domElement.querySelector(".lil-title")?.addEventListener("click", () => {
      this.onActionComplete?.(e, s);
    }), (this.keepClosed.includes(s) || n || o) && a.close();
    for (const c of e.children)
      this.traverseScene(c, a);
  }
  toggle(e, t) {
    this.panel || this.action(t), this.panel.show(e), t.components.props.adjustPlacement(e);
  }
}
class v {
  onActionComplete;
  controls;
  isShiftPressed = !1;
  camera;
  actions;
  keymap;
  selectable = [];
  intersected = null;
  raycaster = new C();
  pointer = new x();
  excludeTypes = ["LineSegments", "DirectionalLight", "HemisphereLight", "Line"];
  constructor(e) {
    this.onActionComplete = e;
  }
  action({ camera: e, renderer: t, scene: s, components: n }) {
    this.camera = e, this.controls = new P(e, t.domElement);
    const o = this.controls.getHelper();
    o.name = "transform-controls", s.add(o), this.actions = this.initActionsList(this.controls), this.keymap = this.initKeymap(this.actions), this.selectable = s.children.filter(({ type: i }) => !this.excludeTypes.includes(i)).filter(({ children: i }) => i.every((a) => a.type !== "Line")).filter(({ name: i }) => i !== "transform-controls"), this.bindEvents(n.orbit);
  }
  initActionsList(e) {
    return {
      translate: () => {
        e.setMode("translate");
      },
      rotate: () => {
        e.setMode("rotate");
      },
      scale: () => {
        e.setMode("scale");
      },
      xAxis: () => {
        e.showX = !0, e.showY = e.showY === e.showZ ? !e.showY : !1, e.showZ = e.showY;
      },
      yAxis: () => {
        e.showX = e.showX === e.showZ ? !e.showX : !1, e.showY = !0, e.showZ = e.showX;
      },
      zAxis: () => {
        e.showX = e.showX === e.showY ? !e.showX : !1, e.showY = e.showX, e.showZ = !0;
      },
      pick: (t = !0) => {
        this.isShiftPressed = t;
      },
      snap: () => {
        e.translationSnap ? (e.setTranslationSnap(null), e.setRotationSnap(null)) : (e.setTranslationSnap(1), e.setRotationSnap(15 * (Math.PI / 180)));
      },
      worldLocalSpace: () => {
        e.setSpace(e.space === "local" ? "world" : "local");
      },
      reset: () => {
        e.detach(), e.showX = e.showY = e.showZ = !0;
      },
      controlsSizeBigger: () => {
        e.setSize(e.size + 0.1);
      },
      controlsSizeSmaller: () => {
        e.setSize(Math.max(e.size - 0.1, 0.1));
      }
    };
  }
  initKeymap(e) {
    return {
      x: () => e.xAxis(),
      y: () => e.yAxis(),
      z: () => e.zAxis(),
      w: () => e.translate(),
      g: () => e.translate(),
      r: () => e.rotate(),
      s: () => e.scale(),
      q: () => e.worldLocalSpace(),
      shift: (t) => e.pick(t),
      control: () => e.snap(),
      escape: () => e.reset(),
      "+": () => e.controlsSizeBigger(),
      "=": () => e.controlsSizeBigger(),
      "-": () => e.controlsSizeSmaller(),
      _: () => e.controlsSizeSmaller()
    };
  }
  bindEvents(e) {
    this.controls?.addEventListener("mouseUp", () => {
      this.onActionComplete?.(this.controls?.object);
    }), this.controls?.addEventListener("dragging-changed", (i) => {
      e?.controls && (e.controls.enabled = !i.value);
    }), window.addEventListener("keydown", (i) => {
      const a = i.key.toLowerCase(), l = a === "shift";
      this.keymap[a]?.(l);
    }), window.addEventListener("keyup", (i) => {
      const a = i.key.toLowerCase();
      a === "shift" && this.keymap?.[a](!1);
    });
    const t = "ontouchstart" in document.documentElement, s = window.navigator.maxTouchPoints >= 1, o = t || s ? "touchstart" : "mousedown";
    window.addEventListener(o, (i) => {
      this.handleClick(i instanceof TouchEvent ? i.changedTouches[0] : i);
    });
  }
  handleClick(e) {
    if (!this.controls?.enabled || !this.isShiftPressed)
      return;
    this.pointer.x = e.clientX / window.innerWidth * 2 - 1, this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1, this.raycaster.setFromCamera(this.pointer, this.camera);
    const [t] = this.raycaster.intersectObjects(
      this.selectable,
      !0
    );
    t && t.object !== this.intersected && (this.intersected = t.object), this.intersected && (this.controls.attach(this.intersected), this.onActionComplete?.(this.intersected));
  }
  toggle(e, t) {
    this.controls || this.action(t), this.controls && (this.controls.enabled = e, this.controls.detach());
  }
}
class E {
  options;
  components;
  panel;
  scene;
  renderer;
  camera;
  constructor() {
    this.options = {
      scene: !1,
      props: !1,
      transform: !1,
      orbit: !1
      // physics: false,
    };
  }
  init({ scene: e, renderer: t, camera: s }, n = {}) {
    if (!this.panel) {
      this.scene = e, this.renderer = t, this.camera = s, this.options = { ...this.options, ...n }, this.panel = new h({ width: 100, title: "Debug" }), this.panel.domElement.setAttribute("id", "debug-panel"), this.components = {
        props: new A(),
        orbit: new L(),
        scene: new M(this.onSceneAction.bind(this)),
        transform: new v(this.onTransformAction.bind(this))
      };
      for (const o of Object.keys(this.options))
        this.createToggle(o), this.options[o] && this.components[o]?.action?.(this);
      this.tweakPanelStyle();
    }
  }
  tweakPanelStyle() {
    const e = document.createElement("style");
    e.textContent = `
            #debug-panel {
                top: 0;
                left: 0;
            }
            #debug-panel .lil-controller > .lil-name {
                width: 80%;
            }
        `, document.head.appendChild(e);
  }
  createToggle(e) {
    this.panel.add(this.options, e).onChange((t) => {
      this.options[e] = t, this.components[e]?.toggle(t, this);
    });
  }
  addCustomToggle({ label: e, handler: t, initialValue: s = !1 }) {
    if (Object.hasOwn(this.options, e)) {
      console.error(`a toggle with the name '${e}' already exists`);
      return;
    }
    this.options[e] = s, this.components[e] = {
      toggle: (n) => t(n)
    }, this.createToggle(e);
  }
  registerComponent({ label: e, instance: t, initialValue: s = !1 }) {
    this.options[e] = s, this.components[e] = t, this.createToggle(e), s === !0 && t.action?.(this);
  }
  onSceneAction(e) {
    this.components.props.action(this, e), this.components.transform.controls?.attach(e), this.logObject(e);
  }
  onTransformAction(e) {
    this.components.props.action(this, e), this.logObject(e);
  }
  logObject(e) {
    e && (console.log(`
`), console.log("target:   ", e), console.log("position: ", e.position), console.log("rotation: ", e.rotation), console.log("scale:    ", e.scale));
  }
  update(e) {
    this.components.orbit.update?.(e), this.components.physics?.update?.();
  }
}
const X = new E();
export {
  E as Debug,
  X as debug
};
