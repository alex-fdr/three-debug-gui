import r from "lil-gui";
import { DoubleSide as c, BackSide as d, FrontSide as p, MeshLambertMaterial as f, MeshBasicMaterial as u, MeshPhongMaterial as m, MeshStandardMaterial as w, MirroredRepeatWrapping as g, RepeatWrapping as b, ClampToEdgeWrapping as x, Raycaster as S, Vector2 as y } from "three";
import { OrbitControls as P } from "three/addons/controls/OrbitControls";
import { TransformControls as C } from "three/addons/controls/TransformControls";
class T {
  context;
  panel;
  customHandler;
  activeObjectUuid = "";
  constructor(e) {
    this.context = e;
  }
  createPanel() {
    return new r({ title: "Object Props", width: 200 });
  }
  adjustPlacement(e) {
    this.panel || (this.panel = this.createPanel(), this.panel.hide()), this.panel.domElement.style.right = e ? "200px" : "0px";
  }
  toggle(e) {
    this.panel || this.init(), this.panel.show(e);
  }
  init(e) {
    if (!this.context.options.props || (this.panel || (this.panel = this.createPanel(), this.panel.close(), this.adjustPlacement(this.context.options.scene === !0)), !e))
      return;
    if (this.activeObjectUuid === e.uuid) {
      this.panel.open();
      return;
    }
    this.activeObjectUuid = e.uuid, this.clearPanel();
    const t = e.name || e.type || "Object";
    this.panel.title(`${t} props`), this.panel.open(), this.parseObject(e);
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
      const { material: t } = e, n = Array.isArray(t) ? t : [t];
      for (const [o, s] of n.entries())
        this.showMaterialProps(e, s, o);
    }
    e.children.length && this.showGroupProps(e), this.customHandler?.(e, this.panel);
  }
  showLightProps(e) {
    this.handleColor(this.panel, e, "color"), this.handleColor(this.panel, e, "groundColor"), this.panel.add(e, "intensity", 0, 3, 0.1);
  }
  showMaterialProps(e, t, n) {
    const o = n > 0 ? `Material${n}` : "Material", s = this.panel.addFolder(o);
    s.add(t, "type"), s.add(e, "visible"), this.handleColor(s, t, "color"), this.handleColor(s, t, "emissive"), this.handleColor(s, t, "specular"), s.add(t, "transparent"), s.add(t, "opacity", 0, 1), s.add(t, "side", { FrontSide: p, BackSide: d, DoubleSide: c }).onChange((a) => {
      t.side = a;
    }), (t instanceof f || t instanceof u || t instanceof m || t instanceof w) && (Object.hasOwn(t, "wireframe") && s.add(t, "wireframe"), t.color?.getHex() && (this.handleFunction(
      s,
      "LinearToSRGB",
      () => t.color.convertLinearToSRGB()
    ), this.handleFunction(
      s,
      "SRGBToLinear",
      () => t.color.convertSRGBToLinear()
    )), this.showMaterialTextureProps(s, t));
  }
  showMaterialTextureProps(e, t) {
    const n = e.addFolder("Texture"), o = t.map;
    o && (n.add(o, "flipY"), n.add(o, "rotation").min(0).max(Math.PI * 2).step(0.01), n.add(o.offset, "x").name("offsetX").min(0).max(1).step(0.01), n.add(o.offset, "y").name("offsetY").min(0).max(1).step(0.01), n.add(o.repeat, "x").name("repeatX"), n.add(o.repeat, "y").name("repeatY"), n.add(o, "wrapS", {
      ClampToEdgeWrapping: x,
      RepeatWrapping: b,
      MirroredRepeatWrapping: g
    }).onChange((s) => {
      o.wrapS = s, o.wrapT = s, o.needsUpdate = !0;
    }).name("wrap"));
  }
  showGroupProps(e) {
    this.panel.add(e, "visible");
  }
  // biome-ignore lint/suspicious/noExplicitAny: Have no idea how to get rid off 'any' here
  handleColor(e, t, n) {
    if (!t[n])
      return;
    const o = {
      [n]: t[n].getHex()
    };
    e.addColor(o, n).onChange((s) => t[n].set(s));
  }
  handleFunction(e, t, n) {
    const o = { fn: () => n() };
    e.add(o, "fn").name(t);
  }
}
class v {
  controls;
  context;
  constructor(e) {
    this.context = e;
  }
  init() {
    const { camera: e, canvas: t } = this.context;
    this.controls = new P(e, t), this.controls.update();
  }
  toggle(e) {
    this.controls || this.init(), this.controls.enabled = e;
  }
  update(e) {
    this.controls?.update(e);
  }
}
class M {
  context;
  panel;
  exclude = ["transform-controls", "TransformControlsGizmo"];
  keepClosed = ["mixamorig_Hips"];
  lightsFolder;
  constructor(e) {
    this.context = e;
  }
  init() {
    this.panel = new r({ title: "Scene Tree", width: 200 }), this.panel.domElement.style.right = "0px", this.lightsFolder = this.panel.addFolder("Lights"), this.tweakPanelStyle();
    for (const e of this.context.scene.children)
      this.traverseScene(e, this.panel);
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
    const n = e.name !== "" ? e.name : e.type;
    if (this.exclude.includes(n))
      return;
    const o = "isLight" in e && e.isLight, s = "isMesh" in e && e.isMesh, h = (o ? this.lightsFolder : t).addFolder(n);
    h.domElement.querySelector(".lil-title")?.addEventListener("click", () => {
      this.context.onSceneAction?.(e);
    }), (this.keepClosed.includes(n) || o || s) && h.close();
    for (const l of e.children)
      this.traverseScene(l, h);
  }
  toggle(e) {
    this.panel || this.init(), this.panel.show(e), this.context.components.props.adjustPlacement(e);
  }
}
class k {
  context;
  controls;
  isShiftPressed = !1;
  selectable = [];
  raycaster = new S();
  pointer = new y();
  excludeTypes = ["Line", "LineSegments", "DirectionalLight", "HemisphereLight"];
  constructor(e) {
    this.context = e;
  }
  init() {
    const { camera: e, canvas: t, scene: n, components: o } = this.context;
    this.controls = new C(e, t);
    const s = this.controls.getHelper();
    s.name = "transform-controls", n.add(s), this.selectable = n.children.filter(({ name: a }) => a !== s.name), this.bindEvents(o.orbit);
  }
  bindEvents(e) {
    this.controls.addEventListener("mouseUp", () => {
      this.context.onTransformAction?.(this.controls.object);
    }), this.controls.addEventListener("dragging-changed", (s) => {
      e?.controls && (e.controls.enabled = !s.value);
    }), window.addEventListener("keydown", ({ key: s }) => {
      this.controls.enabled && this.handleKeyPress(s, this.controls);
    }), window.addEventListener("keyup", ({ key: s }) => {
      s === "Shift" && (this.isShiftPressed = !1);
    });
    const t = "ontouchstart" in document.documentElement, n = window.navigator.maxTouchPoints >= 1, o = t || n ? "touchstart" : "mousedown";
    window.addEventListener(o, (s) => {
      this.handleClick(s instanceof TouchEvent ? s.changedTouches[0] : s);
    });
  }
  handleKeyPress(e, t) {
    switch (e) {
      case "g":
        t.setMode("translate");
        break;
      case "r":
        t.setMode("rotate");
        break;
      case "s":
        t.setMode("scale");
        break;
      case "x":
        t.showX = !0, t.showY = t.showY === t.showZ ? !t.showY : !1, t.showZ = t.showY;
        break;
      case "y":
        t.showX = t.showX === t.showZ ? !t.showX : !1, t.showY = !0, t.showZ = t.showX;
        break;
      case "z":
        t.showX = t.showX === t.showY ? !t.showX : !1, t.showY = t.showX, t.showZ = !0;
        break;
      case "q":
        t.setSpace(t.space === "local" ? "world" : "local");
        break;
      case "Control":
        t.translationSnap ? (t.setTranslationSnap(null), t.setRotationSnap(null), t.setScaleSnap(null)) : (t.setTranslationSnap(1), t.setRotationSnap(15 * (Math.PI / 180)), t.setScaleSnap(0.1));
        break;
      case "Escape":
        t.detach(), t.showX = t.showY = t.showZ = !0;
        break;
      case "Shift":
        this.isShiftPressed = !0;
        break;
      case "+":
      case "=":
        t.setSize(t.size + 0.1);
        break;
      case "-":
      case "_":
        t.setSize(Math.max(t.size - 0.1, 0.1));
        break;
      default:
        console.warn("unsupported key pressed", e);
    }
  }
  handleClick(e) {
    if (!this.controls?.enabled || !this.isShiftPressed)
      return;
    this.pointer.x = e.clientX / window.innerWidth * 2 - 1, this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1, this.raycaster.setFromCamera(this.pointer, this.controls.camera);
    const [t] = this.raycaster.intersectObjects(this.selectable, !0);
    t?.object && (this.controls.attach(t.object), this.context.onTransformAction?.(t.object));
  }
  toggle(e) {
    this.controls || this.init(), this.controls.enabled = e, this.controls.detach();
  }
}
class L {
  options;
  components;
  panel;
  scene;
  canvas;
  camera;
  enabled = !1;
  constructor() {
    this.options = {
      scene: !1,
      props: !1,
      transform: !1,
      orbit: !1
    };
  }
  init({ scene: e, canvas: t, camera: n, options: o = {} }) {
    if (!this.panel) {
      this.scene = e, this.canvas = t, this.camera = n, this.options = { ...this.options, ...o }, this.panel = new r({ width: 100, title: "Debug" }), this.panel.domElement.setAttribute("id", "debug-panel"), this.components = {
        props: new T(this),
        orbit: new v(this),
        scene: new M(this),
        transform: new k(this)
      };
      for (const s of Object.keys(this.options))
        this.createToggle(s), this.options[s] && this.components[s].init?.();
      this.tweakPanelStyle(), this.enabled = !0;
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
      this.options[e] = t, this.components[e]?.toggle(t);
    });
  }
  registerComponent({ label: e, instance: t, initialValue: n = !1 }) {
    if (Object.hasOwn(this.options, e)) {
      console.error(`a toggle with the name '${e}' already exists`);
      return;
    }
    this.options[e] = n, this.components[e] = t, this.createToggle(e), n === !0 && t.init?.();
  }
  onSceneAction(e) {
    this.components.props.init(e), this.components.transform.controls?.attach(e), this.logObject(e);
  }
  onTransformAction(e) {
    this.components.props.init(e), this.logObject(e);
  }
  logObject(e) {
    e && (console.log(`
`), console.log("target:   ", e), console.log("position: ", e.position), console.log("rotation: ", e.rotation), console.log("scale:    ", e.scale));
  }
  update(e) {
    this.enabled && (this.components.orbit.update?.(e), this.components.physics?.update?.());
  }
}
const Y = new L();
export {
  L as Debug,
  Y as debug
};
