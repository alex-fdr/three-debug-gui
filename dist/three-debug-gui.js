import r from "lil-gui";
import { DoubleSide as c, BackSide as d, FrontSide as p, MeshLambertMaterial as f, MeshBasicMaterial as m, MeshPhongMaterial as u, MeshStandardMaterial as w, MirroredRepeatWrapping as g, RepeatWrapping as b, ClampToEdgeWrapping as S, Raycaster as y, Vector2 as C } from "three";
import { OrbitControls as P } from "three/addons/controls/OrbitControls";
import { TransformControls as T } from "three/addons/controls/TransformControls";
class x {
  activeObjectUuid = "";
  panel;
  createPanel() {
    return new r({ title: "Object Props", width: 200 });
  }
  adjustPlacement(s) {
    this.panel || (this.panel = this.createPanel(), this.panel.hide()), this.panel.domElement.style.right = s ? "200px" : "0px";
  }
  toggle(s, e) {
    this.panel || this.action(e), this.panel.show(s);
  }
  action(s, e) {
    if (!s.options.props || (this.panel || (this.panel = this.createPanel(), this.panel.close(), this.adjustPlacement(s.options.scene === !0)), !e))
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
    for (const s of this.panel.children)
      s.destroy();
    for (const s of this.panel.folders)
      s.destroy();
    for (const s of this.panel.controllers)
      s.destroy();
  }
  parseObject(s) {
    if ("isLight" in s && this.showLightProps(s), "material" in s) {
      const { material: e } = s, t = Array.isArray(e) ? e : [e];
      for (const [n, o] of t.entries())
        this.showMaterialProps(s, o, n);
    }
    s.children.length && this.showGroupProps(s);
  }
  showLightProps(s) {
    this.handleColor(this.panel, s, "color"), this.handleColor(this.panel, s, "groundColor"), this.panel.add(s, "intensity", 0, 3, 0.1);
  }
  showMaterialProps(s, e, t) {
    const n = t > 0 ? `Material${t}` : "Material", o = this.panel.addFolder(n);
    o.add(e, "type"), o.add(s, "visible"), this.handleColor(o, e, "color"), this.handleColor(o, e, "emissive"), this.handleColor(o, e, "specular"), o.add(e, "transparent"), o.add(e, "opacity", 0, 1), o.add(e, "side", { FrontSide: p, BackSide: d, DoubleSide: c }).onChange((a) => {
      e.side = a;
    }), (e instanceof f || e instanceof m || e instanceof u || e instanceof w) && (Object.hasOwn(e, "wireframe") && o.add(e, "wireframe"), e.color?.getHex() && (this.handleFunction(
      o,
      "LinearToSRGB",
      () => e.color.convertLinearToSRGB()
    ), this.handleFunction(
      o,
      "SRGBToLinear",
      () => e.color.convertSRGBToLinear()
    )), this.showMaterialTextureProps(o, e));
  }
  showMaterialTextureProps(s, e) {
    const t = s.addFolder("Texture"), n = e.map;
    n && (t.add(n, "flipY"), t.add(n, "rotation").min(0).max(Math.PI * 2).step(0.01), t.add(n.offset, "x").name("offsetX").min(0).max(1).step(0.01), t.add(n.offset, "y").name("offsetY").min(0).max(1).step(0.01), t.add(n.repeat, "x").name("repeatX"), t.add(n.repeat, "y").name("repeatY"), t.add(n, "wrapS", {
      ClampToEdgeWrapping: S,
      RepeatWrapping: b,
      MirroredRepeatWrapping: g
    }).onChange((o) => {
      n.wrapS = o, n.wrapT = o, n.needsUpdate = !0;
    }).name("wrap"));
  }
  showGroupProps(s) {
    this.panel.add(s, "visible");
  }
  handleColor(s, e, t) {
    if (!e[t])
      return;
    const n = { [t]: e[t].getHex() };
    s.addColor(n, t).onChange((o) => e[t].set(o));
  }
  handleFunction(s, e, t) {
    const n = { fn: () => t() };
    s.add(n, "fn").name(e);
  }
}
class M {
  controls;
  action({ camera: s, renderer: e }) {
    this.controls = new P(s, e.domElement), this.controls.update();
  }
  toggle(s, e) {
    this.controls || this.action(e), this.controls.enabled = s;
  }
  update(s) {
    this.controls?.update(s);
  }
}
class k {
  exclude = ["transform-controls", "TransformControlsGizmo"];
  keepClosed = ["mixamorig_Hips"];
  lightsFolder;
  panel;
  onActionComplete;
  constructor(s) {
    this.onActionComplete = s;
  }
  action(s) {
    this.panel = new r({ title: "Scene Tree", width: 200 }), this.panel.domElement.style.right = "0px", this.lightsFolder = this.panel.addFolder("Lights"), this.tweakPanelStyle();
    for (const e of s.scene.children)
      this.traverseScene(e, this.panel);
  }
  tweakPanelStyle() {
    const s = document.createElement("style");
    s.textContent = `
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
        `, document.head.appendChild(s);
  }
  traverseScene(s, e) {
    const t = s.name !== "" ? s.name : s.type;
    if (this.exclude.includes(t))
      return;
    const n = "isLight" in s && s.isLight, o = "isMesh" in s && s.isMesh, h = (n ? this.lightsFolder : e).addFolder(t);
    h.domElement.querySelector(".lil-title")?.addEventListener("click", () => {
      this.onActionComplete?.(s, t);
    }), (this.keepClosed.includes(t) || n || o) && h.close();
    for (const l of s.children)
      this.traverseScene(l, h);
  }
  toggle(s, e) {
    this.panel || this.action(e), this.panel.show(s), e.components.props.adjustPlacement(s);
  }
}
class E {
  onActionComplete;
  controls;
  isShiftPressed = !1;
  selectable = [];
  raycaster = new y();
  pointer = new C();
  excludeTypes = ["Line", "LineSegments", "DirectionalLight", "HemisphereLight"];
  constructor(s) {
    this.onActionComplete = s;
  }
  action({ camera: s, renderer: e, scene: t, components: n }) {
    this.controls = new T(s, e.domElement);
    const o = this.controls.getHelper();
    o.name = "transform-controls", t.add(o), this.selectable = t.children.filter(({ name: a }) => a !== o.name), this.bindEvents(n.orbit);
  }
  bindEvents(s) {
    this.controls.addEventListener("mouseUp", () => {
      this.onActionComplete?.(this.controls.object);
    }), this.controls.addEventListener("dragging-changed", (o) => {
      s?.controls && (s.controls.enabled = !o.value);
    }), window.addEventListener("keydown", ({ key: o }) => {
      this.controls.enabled && this.handleKeyPress(o, this.controls);
    }), window.addEventListener("keyup", ({ key: o }) => {
      o === "Shift" && (this.isShiftPressed = !1);
    });
    const e = "ontouchstart" in document.documentElement, t = window.navigator.maxTouchPoints >= 1, n = e || t ? "touchstart" : "mousedown";
    window.addEventListener(n, (o) => {
      this.handleClick(o instanceof TouchEvent ? o.changedTouches[0] : o);
    });
  }
  handleKeyPress(s, e) {
    switch (s) {
      case "g":
        e.setMode("translate");
        break;
      case "r":
        e.setMode("rotate");
        break;
      case "s":
        e.setMode("scale");
        break;
      case "x":
        e.showX = !0, e.showY = e.showY === e.showZ ? !e.showY : !1, e.showZ = e.showY;
        break;
      case "y":
        e.showX = e.showX === e.showZ ? !e.showX : !1, e.showY = !0, e.showZ = e.showX;
        break;
      case "z":
        e.showX = e.showX === e.showY ? !e.showX : !1, e.showY = e.showX, e.showZ = !0;
        break;
      case "q":
        e.setSpace(e.space === "local" ? "world" : "local");
        break;
      case "Control":
        e.translationSnap ? (e.setTranslationSnap(null), e.setRotationSnap(null), e.setScaleSnap(null)) : (e.setTranslationSnap(1), e.setRotationSnap(15 * (Math.PI / 180)), e.setScaleSnap(0.1));
        break;
      case "Escape":
        e.detach(), e.showX = e.showY = e.showZ = !0;
        break;
      case "Shift":
        this.isShiftPressed = !0;
        break;
      case "+":
      case "=":
        e.setSize(e.size + 0.1);
        break;
      case "-":
      case "_":
        e.setSize(Math.max(e.size - 0.1, 0.1));
        break;
      default:
        console.warn("unsupported key pressed", s);
    }
  }
  handleClick(s) {
    if (!this.controls?.enabled || !this.isShiftPressed)
      return;
    this.pointer.x = s.clientX / window.innerWidth * 2 - 1, this.pointer.y = -(s.clientY / window.innerHeight) * 2 + 1, this.raycaster.setFromCamera(this.pointer, this.controls.camera);
    const [e] = this.raycaster.intersectObjects(this.selectable, !0);
    e?.object && (this.controls.attach(e.object), this.onActionComplete?.(e.object));
  }
  toggle(s, e) {
    this.controls || this.action(e), this.controls.enabled = s, this.controls.detach();
  }
}
class v {
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
  init({ scene: s, renderer: e, camera: t }, n = {}) {
    if (!this.panel) {
      this.scene = s, this.renderer = e, this.camera = t, this.options = { ...this.options, ...n }, this.panel = new r({ width: 100, title: "Debug" }), this.panel.domElement.setAttribute("id", "debug-panel"), this.components = {
        props: new x(),
        orbit: new M(),
        scene: new k(this.onSceneAction.bind(this)),
        transform: new E(this.onTransformAction.bind(this))
      };
      for (const o of Object.keys(this.options))
        this.createToggle(o), this.options[o] && this.components[o]?.action?.(this);
      this.tweakPanelStyle();
    }
  }
  tweakPanelStyle() {
    const s = document.createElement("style");
    s.textContent = `
            #debug-panel {
                top: 0;
                left: 0;
            }
            #debug-panel .lil-controller > .lil-name {
                width: 80%;
            }
        `, document.head.appendChild(s);
  }
  createToggle(s) {
    this.panel.add(this.options, s).onChange((e) => {
      this.options[s] = e, this.components[s]?.toggle(e, this);
    });
  }
  addCustomToggle({ label: s, handler: e, initialValue: t = !1 }) {
    if (Object.hasOwn(this.options, s)) {
      console.error(`a toggle with the name '${s}' already exists`);
      return;
    }
    this.options[s] = t, this.components[s] = {
      toggle: (n) => e(n)
    }, this.createToggle(s);
  }
  registerComponent({ label: s, instance: e, initialValue: t = !1 }) {
    this.options[s] = t, this.components[s] = e, this.createToggle(s), t === !0 && e.action?.(this);
  }
  onSceneAction(s) {
    this.components.props.action(this, s), this.components.transform.controls?.attach(s), this.logObject(s);
  }
  onTransformAction(s) {
    this.components.props.action(this, s), this.logObject(s);
  }
  logObject(s) {
    s && (console.log(`
`), console.log("target:   ", s), console.log("position: ", s.position), console.log("rotation: ", s.rotation), console.log("scale:    ", s.scale));
  }
  update(s) {
    this.components.orbit.update?.(s), this.components.physics?.update?.();
  }
}
const F = new v();
export {
  v as Debug,
  F as debug
};
