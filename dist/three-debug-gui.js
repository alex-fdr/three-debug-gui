(function(){"use strict";try{if(typeof document<"u"){var o=document.createElement("style");o.appendChild(document.createTextNode(":root{--tp-base-font-family: Arial, sans-serif;--tp-base-background-color: hsla(230, 20%, 11%, 1);--tp-base-shadow-color: hsla(0, 0%, 0%, .2);--tp-button-background-color: hsla(230, 10%, 80%, 1);--tp-button-background-color-active: hsla(230, 10%, 95%, 1);--tp-button-background-color-focus: hsla(230, 10%, 90%, 1);--tp-button-background-color-hover: hsla(230, 10%, 85%, 1);--tp-button-foreground-color: hsla(230, 20%, 11%, 1);--tp-container-background-color: hsla(230, 25%, 16%, 1);--tp-container-background-color-active: hsla(230, 25%, 31%, 1);--tp-container-background-color-focus: hsla(230, 25%, 26%, 1);--tp-container-background-color-hover: hsla(230, 25%, 21%, 1);--tp-container-foreground-color: hsla(230, 10%, 80%, 1);--tp-groove-foreground-color: hsla(230, 20%, 8%, 1);--tp-input-background-color: hsla(230, 20%, 8%, 1);--tp-input-background-color-active: hsla(230, 28%, 23%, 1);--tp-input-background-color-focus: hsla(230, 28%, 18%, 1);--tp-input-background-color-hover: hsla(230, 20%, 13%, 1);--tp-input-foreground-color: hsla(230, 10%, 80%, 1);--tp-label-foreground-color: hsla(230, 12%, 48%, 1);--tp-monitor-background-color: hsla(230, 20%, 8%, 1);--tp-monitor-foreground-color: hsla(230, 12%, 48%, 1)}#debug-panel{top:0;left:0;width:110px}#debug-panel .tp-lblv_v{width:20%}#scene-panel{top:0;right:0;width:200px}#scene-panel .tp-rotv_c{height:calc(100dvh - 24px)!important;overflow-y:scroll}#object-panel{top:0}")),document.head.appendChild(o)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
var c = Object.defineProperty;
var p = (l, e, t) => e in l ? c(l, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : l[e] = t;
var i = (l, e, t) => p(l, typeof e != "symbol" ? e + "" : e, t);
import { Pane as d } from "tweakpane";
import { FrontSide as u, BackSide as f, DoubleSide as m, RepeatWrapping as w, ClampToEdgeWrapping as g, MirroredRepeatWrapping as b, Raycaster as x, Vector2 as S } from "three";
import { OrbitControls as v } from "three/addons/controls/OrbitControls";
import { TransformControls as P } from "three/addons/controls/TransformControls";
class y {
  constructor(e) {
    i(this, "context");
    i(this, "panel");
    i(this, "customHandler");
    i(this, "title", "Object Props");
    i(this, "activeObjectUuid", "");
    this.context = e;
  }
  createPanel() {
    var t;
    const e = new d({ title: this.title });
    return (t = e.element.parentElement) == null || t.setAttribute("id", "object-panel"), e;
  }
  adjustPlacement(e) {
    this.panel || (this.panel = this.createPanel(), this.panel.hidden = !0), this.panel.element.parentElement && (this.panel.element.parentElement.style.right = e ? "200px" : "0px");
  }
  toggle(e) {
    this.panel || this.init(), this.panel.hidden = !e;
  }
  init(e) {
    if (!this.context.options.props || (this.panel || (this.panel = this.createPanel(), this.panel.expanded = !1, this.adjustPlacement(this.context.options.scene === !0)), !e))
      return;
    if (this.activeObjectUuid === e.uuid) {
      this.panel.expanded = !0;
      return;
    }
    this.activeObjectUuid = e.uuid, this.clearPanel();
    const t = e.name || e.type || "Object";
    this.panel.title = `${t} props`, console.log(this.panel.title), this.panel.expanded = !0, this.parseObject(e);
  }
  clearPanel() {
    for (const e of this.panel.children)
      e.dispose();
  }
  parseObject(e) {
    var t;
    if (console.log("parse object", e), "isLight" in e && this.showLightProps(e), "material" in e) {
      const { material: s } = e, o = Array.isArray(s) ? s : [s];
      for (const [n, a] of o.entries())
        this.showMaterialProps(e, a, n);
    }
    e.children.length && this.showGroupProps(e), (t = this.customHandler) == null || t.call(this, e, this.panel);
  }
  showLightProps(e) {
    this.handleColor(this.panel, e, "color"), this.handleColor(this.panel, e, "groundColor"), this.panel.addBinding(e, "intensity", { min: 0, max: 3, step: 0.1 });
  }
  showMaterialProps(e, t, s) {
    const o = s > 0 ? `Material${s}` : "Material", n = this.panel.addFolder({ title: o });
    n.addBinding(t, "type"), n.addBinding(e, "visible"), this.handleColor(n, t, "color"), this.handleColor(n, t, "emissive"), this.handleColor(n, t, "specular"), n.addBinding(t, "transparent"), n.addBinding(t, "opacity", { min: 0, max: 1 }), n.addBinding(t, "side", {
      options: {
        FrontSide: u,
        BackSide: f,
        DoubleSide: m
      }
    }).on("change", (a) => {
      t.side = a.value;
    }), "wireframe" in t && n.addBinding(t, "wireframe"), this.showMaterialTextureProps(n, t);
  }
  // biome-ignore-start format: keep those folder.add calls as one-liners
  showMaterialTextureProps(e, t) {
    const s = t.map;
    if (!s)
      return;
    const o = e.addFolder({ title: "Texture" });
    o.addBinding(s, "flipY"), o.addBinding(s, "rotation", { min: 0, max: Math.PI * 2, step: 0.01 }), o.addBinding(s.offset, "x", { label: "offsetX", min: 0, max: 1, step: 0.01 }), o.addBinding(s.offset, "y", { label: "offsetY", min: 0, max: 1, step: 0.01 }), o.addBinding(s.repeat, "x", { label: "repeatX" }), o.addBinding(s.repeat, "y", { label: "repeatY" }), o.addBinding(s, "wrapS", {
      label: "wrap",
      options: {
        RepeatWrapping: w,
        ClampToEdgeWrapping: g,
        MirroredRepeatWrapping: b
      }
    }).on("change", (a) => {
      s.wrapS = a.value, s.wrapT = a.value, s.needsUpdate = !0;
    });
  }
  // biome-ignore-end format: end of a block with custom formatting
  showGroupProps(e) {
    this.panel.addBinding(e, "visible");
  }
  handleColor(e, t, s) {
    if (!t[s])
      return;
    const o = t[s], n = { [s]: o.getHex() };
    e.addBinding(n, s, { view: "color" }).on("change", (a) => {
      o.set(a.value);
    });
  }
  handleFunction(e, t, s) {
    const o = { fn: () => s() };
    e.addBinding(o, "fn", { label: t });
  }
}
class T {
  constructor(e) {
    i(this, "controls");
    i(this, "context");
    this.context = e;
  }
  init() {
    const { camera: e, canvas: t } = this.context;
    this.controls = new v(e, t), this.controls.update();
  }
  toggle(e) {
    this.controls || this.init(), this.controls.enabled = e;
  }
  update(e) {
    var t;
    (t = this.controls) == null || t.update(e);
  }
}
class C {
  constructor(e) {
    i(this, "context");
    i(this, "panel");
    i(this, "title", "Scene Tree");
    i(this, "exclude", ["transform-controls", "TransformControlsGizmo"]);
    i(this, "keepClosed", ["mixamorig_Hips"]);
    i(this, "lightsFolder");
    this.context = e;
  }
  init() {
    var e;
    this.panel = new d({ title: this.title }), (e = this.panel.element.parentElement) == null || e.setAttribute("id", "scene-panel"), this.lightsFolder = this.panel.addFolder({ title: "Lights" }), this.tweakPanelStyle();
    for (const t of this.context.scene.children)
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
    const n = (e.isLight ? this.lightsFolder : t).addFolder({ title: s });
    n.on("fold", (a) => {
      var r, h;
      (h = (r = this.context).onSceneAction) == null || h.call(r, e);
    }), (this.keepClosed.includes(s) || e.isLight || e.isMesh) && (n.expanded = !1, console.log("do not expand this shit", s));
    for (const a of e.children)
      this.traverseScene(a, n);
  }
  toggle(e) {
    this.panel || this.init(), this.panel.expanded = e, this.context.components.props.adjustPlacement(e);
  }
}
class k {
  constructor(e) {
    i(this, "context");
    i(this, "controls");
    i(this, "isShiftPressed", !1);
    i(this, "selectable", []);
    i(this, "raycaster", new x());
    i(this, "pointer", new S());
    i(this, "excludeTypes", ["Line", "LineSegments", "DirectionalLight", "HemisphereLight"]);
    this.context = e;
  }
  init() {
    const { camera: e, canvas: t, scene: s, components: o } = this.context;
    this.controls = new P(e, t);
    const n = this.controls.getHelper();
    n.name = "transform-controls", s.add(n), this.selectable = s.children.filter(({ name: a }) => a !== n.name), this.bindEvents(o.orbit);
  }
  bindEvents(e) {
    this.controls.addEventListener("mouseUp", () => {
      var n, a;
      (a = (n = this.context).onTransformAction) == null || a.call(n, this.controls.object);
    }), this.controls.addEventListener("dragging-changed", (n) => {
      e != null && e.controls && (e.controls.enabled = !n.value);
    }), window.addEventListener("keydown", ({ key: n }) => {
      this.controls.enabled && this.handleKeyPress(n, this.controls);
    }), window.addEventListener("keyup", ({ key: n }) => {
      n === "Shift" && (this.isShiftPressed = !1);
    });
    const t = "ontouchstart" in document.documentElement, s = window.navigator.maxTouchPoints >= 1, o = t || s ? "touchstart" : "mousedown";
    window.addEventListener(o, (n) => {
      this.handleClick(n instanceof TouchEvent ? n.changedTouches[0] : n);
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
    var s, o, n;
    if (!((s = this.controls) != null && s.enabled) || !this.isShiftPressed)
      return;
    this.pointer.x = e.clientX / window.innerWidth * 2 - 1, this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1, this.raycaster.setFromCamera(this.pointer, this.controls.camera);
    const [t] = this.raycaster.intersectObjects(this.selectable, !0);
    t != null && t.object && (this.controls.attach(t.object), (n = (o = this.context).onTransformAction) == null || n.call(o, t.object));
  }
  toggle(e) {
    this.controls || this.init(), this.controls.enabled = e, this.controls.detach();
  }
}
class B {
  constructor() {
    i(this, "options");
    i(this, "components");
    i(this, "panel");
    i(this, "scene");
    i(this, "canvas");
    i(this, "camera");
    i(this, "enabled", !1);
    this.options = {
      scene: !1,
      props: !1,
      transform: !1,
      orbit: !1
    };
  }
  init({ scene: e, canvas: t, camera: s, options: o = {} }) {
    var n, a, r;
    if (!this.panel) {
      this.scene = e, this.canvas = t, this.camera = s, this.options = { ...this.options, ...o }, this.panel = new d({ title: "Debug" }), (n = this.panel.element.parentElement) == null || n.setAttribute("id", "debug-panel"), console.log(this.panel), this.components = {
        props: new y(this),
        orbit: new T(this),
        scene: new C(this),
        transform: new k(this)
      };
      for (const h of Object.keys(this.options))
        this.createToggle(h), this.options[h] && ((r = (a = this.components[h]).init) == null || r.call(a));
      this.enabled = !0;
    }
  }
  createToggle(e) {
    this.panel.addBinding(this.options, e).on("change", (t) => {
      var s;
      typeof t.value > "u" || (this.options[e] = t.value, (s = this.components[e]) == null || s.toggle(t.value));
    });
  }
  registerComponent({ label: e, instance: t, initialValue: s = !1 }) {
    var o;
    if (Object.hasOwn(this.options, e)) {
      console.error(`a toggle with the name '${e}' already exists`);
      return;
    }
    this.options[e] = s, this.components[e] = t, this.createToggle(e), s === !0 && ((o = t.init) == null || o.call(t));
  }
  onSceneAction(e) {
    var t;
    this.components.props.init(e), (t = this.components.transform.controls) == null || t.attach(e), this.logObject(e);
  }
  onTransformAction(e) {
    this.components.props.init(e), this.logObject(e);
  }
  logObject(e) {
    e && (console.log(`
`), console.log("target:   ", e), console.log("position: ", e.position), console.log("rotation: ", e.rotation), console.log("scale:    ", e.scale));
  }
  update(e) {
    var t, s, o, n;
    this.enabled && ((s = (t = this.components.orbit).update) == null || s.call(t, e), (n = (o = this.components.physics) == null ? void 0 : o.update) == null || n.call(o));
  }
}
const X = new B();
export {
  B as Debug,
  X as debug
};
