var u = Object.defineProperty;
var w = (c, e, t) => e in c ? u(c, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : c[e] = t;
var i = (c, e, t) => w(c, typeof e != "symbol" ? e + "" : e, t);
import p from "lil-gui";
import { FrontSide as g, BackSide as y, DoubleSide as S, MeshLambertMaterial as C, MeshBasicMaterial as x, MeshPhongMaterial as b, MeshStandardMaterial as T, ClampToEdgeWrapping as P, RepeatWrapping as L, MirroredRepeatWrapping as M, Raycaster as v, Vector2 as E } from "three";
import { OrbitControls as A } from "three/addons/controls/OrbitControls";
import { TransformControls as O } from "three/addons/controls/TransformControls";
class k {
  constructor() {
    i(this, "controls");
  }
  action({ camera: e, renderer: t }) {
    this.controls = new A(e, t.domElement), this.controls.update();
  }
  toggle(e, t) {
    this.controls || this.action(t), this.controls.enabled = e;
  }
  update(e) {
    var t;
    (t = this.controls) == null || t.update(e);
  }
}
class j {
  constructor() {
    i(this, "activeObjectUuid", "");
    i(this, "panel");
  }
  createPanel() {
    return new p({ title: "Object Props", width: 200 });
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
      for (const [o, n] of s.entries())
        this.showMaterialProps(e, n, o);
    }
    e.children.length && this.showGroupProps(e);
  }
  showLightProps(e) {
    this.handleColor(this.panel, e, "color"), this.handleColor(this.panel, e, "groundColor"), this.panel.add(e, "intensity", 0, 3, 0.1);
  }
  showMaterialProps(e, t, s) {
    var r;
    const o = s > 0 ? `Material${s}` : "Material", n = this.panel.addFolder(o);
    n.add(t, "type"), n.add(e, "visible"), this.handleColor(n, t, "color"), this.handleColor(n, t, "emissive"), this.handleColor(n, t, "specular"), n.add(t, "transparent"), n.add(t, "opacity", 0, 1), n.add(t, "side", { FrontSide: g, BackSide: y, DoubleSide: S }).onChange((h) => t.side = h), (t instanceof C || t instanceof x || t instanceof b || t instanceof T) && (Object.hasOwn(t, "wireframe") && n.add(t, "wireframe"), (r = t.color) != null && r.getHex() && (this.handleFunction(
      n,
      "LinearToSRGB",
      () => t.color.convertLinearToSRGB()
    ), this.handleFunction(
      n,
      "SRGBToLinear",
      () => t.color.convertSRGBToLinear()
    )), this.showMaterialTextureProps(n, t));
  }
  showMaterialTextureProps(e, t) {
    const s = e.addFolder("Texture"), o = t.map;
    o && (s.add(o, "flipY"), s.add(o, "rotation").min(0).max(Math.PI * 2).step(0.01), s.add(o.offset, "x").name("offsetX").min(0).max(1).step(0.01), s.add(o.offset, "y").name("offsetY").min(0).max(1).step(0.01), s.add(o.repeat, "x").name("repeatX"), s.add(o.repeat, "y").name("repeatY"), s.add(o, "wrapS", {
      ClampToEdgeWrapping: P,
      RepeatWrapping: L,
      MirroredRepeatWrapping: M
    }).onChange((n) => {
      o.wrapS = n, o.wrapT = n, o.needsUpdate = !0;
    }).name("wrap"));
  }
  showGroupProps(e) {
    this.panel.add(e, "visible");
  }
  handleColor(e, t, s) {
    if (!t[s])
      return;
    const o = { [s]: t[s].getHex() };
    e.addColor(o, s).onChange((n) => t[s].set(n));
  }
  handleFunction(e, t, s) {
    const o = { fn: () => s() };
    e.add(o, "fn").name(t);
  }
}
class z {
  constructor(e) {
    i(this, "exclude", ["transform-controls", "TransformControlsGizmo"]);
    i(this, "keepClosed", ["mixamorig_Hips"]);
    i(this, "lightsFolder");
    i(this, "panel");
    i(this, "onActionComplete");
    this.onActionComplete = e;
  }
  action(e) {
    this.panel = new p({ title: "Scene Tree", width: 200 }), this.panel.domElement.style.right = "0px", this.lightsFolder = this.panel.addFolder("Lights"), this.tweakPanelStyle();
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
    const o = "isLight" in e && e.isLight, n = "isMesh" in e && e.isMesh, h = (o ? this.lightsFolder : t).addFolder(s), a = h.domElement.querySelector(".lil-title");
    a == null || a.addEventListener("click", () => {
      var l;
      (l = this.onActionComplete) == null || l.call(this, e, s);
    }), (this.keepClosed.includes(s) || o || n) && h.close();
    for (const l of e.children)
      this.traverseScene(l, h);
  }
  toggle(e, t) {
    this.panel || this.action(t), this.panel.show(e), t.components.props.adjustPlacement(e);
  }
}
class X {
  constructor(e) {
    i(this, "onActionComplete");
    i(this, "controls");
    i(this, "isShiftPressed", !1);
    i(this, "camera");
    i(this, "actions");
    i(this, "keymap");
    i(this, "selectable", []);
    i(this, "intersected", null);
    i(this, "raycaster", new v());
    i(this, "pointer", new E());
    i(this, "excludeTypes", ["LineSegments", "DirectionalLight", "HemisphereLight", "Line"]);
    this.onActionComplete = e;
  }
  action({ camera: e, renderer: t, scene: s, components: o }) {
    this.camera = e, this.controls = new O(e, t.domElement);
    const n = this.controls.getHelper();
    n.name = "transform-controls", s.add(n), this.actions = this.initActionsList(this.controls), this.keymap = this.initKeymap(this.actions), this.selectable = s.children.filter(({ type: r }) => !this.excludeTypes.includes(r)).filter(({ children: r }) => r.every((h) => h.type !== "Line")).filter(({ name: r }) => r !== "transform-controls"), this.bindEvents(o.orbit);
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
    var r, h;
    (r = this.controls) == null || r.addEventListener("mouseUp", () => {
      var a, l;
      (l = this.onActionComplete) == null || l.call(this, (a = this.controls) == null ? void 0 : a.object);
    }), (h = this.controls) == null || h.addEventListener("dragging-changed", (a) => {
      e != null && e.controls && (e.controls.enabled = !a.value);
    }), window.addEventListener("keydown", (a) => {
      var f, m;
      const l = a.key.toLowerCase(), d = l === "shift";
      (m = (f = this.keymap)[l]) == null || m.call(f, d);
    }), window.addEventListener("keyup", (a) => {
      var d;
      const l = a.key.toLowerCase();
      l === "shift" && ((d = this.keymap) == null || d[l](!1));
    });
    const t = "ontouchstart" in document.documentElement, s = window.navigator.maxTouchPoints >= 1, n = t || s ? "touchstart" : "mousedown";
    window.addEventListener(n, (a) => {
      this.handleClick(a instanceof TouchEvent ? a.changedTouches[0] : a);
    });
  }
  handleClick(e) {
    var s, o;
    if (!((s = this.controls) != null && s.enabled) || !this.isShiftPressed)
      return;
    this.pointer.x = e.clientX / window.innerWidth * 2 - 1, this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1, this.raycaster.setFromCamera(this.pointer, this.camera);
    const [t] = this.raycaster.intersectObjects(
      this.selectable,
      !0
    );
    t && t.object !== this.intersected && (this.intersected = t.object), this.intersected && (this.controls.attach(this.intersected), (o = this.onActionComplete) == null || o.call(this, this.intersected));
  }
  toggle(e, t) {
    this.controls || this.action(t), this.controls && (this.controls.enabled = e, this.controls.detach());
  }
}
class F {
  constructor() {
    i(this, "options");
    i(this, "components");
    i(this, "panel");
    i(this, "scene");
    i(this, "renderer");
    i(this, "camera");
    this.options = {
      scene: !1,
      props: !1,
      transform: !1,
      orbit: !1
      // physics: false,
    };
  }
  init({ scene: e, renderer: t, camera: s }, o = {}) {
    var n, r;
    if (!this.panel) {
      this.scene = e, this.renderer = t, this.camera = s, this.options = { ...this.options, ...o }, this.panel = new p({ width: 100, title: "Debug" }), this.panel.domElement.setAttribute("id", "debug-panel"), this.components = {
        props: new j(),
        orbit: new k(),
        scene: new z(this.onSceneAction.bind(this)),
        transform: new X(this.onTransformAction.bind(this))
      };
      for (const h of Object.keys(this.options))
        this.createToggle(h), this.options[h] && ((r = (n = this.components[h]) == null ? void 0 : n.action) == null || r.call(n, this));
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
      var s;
      this.options[e] = t, (s = this.components[e]) == null || s.toggle(t, this);
    });
  }
  addCustomToggle({ label: e, handler: t, initialValue: s = !1 }) {
    if (Object.hasOwn(this.options, e)) {
      console.error(`a toggle with the name '${e}' already exists`);
      return;
    }
    this.options[e] = s, this.components[e] = {
      toggle: (o) => t(o)
    }, this.createToggle(e);
  }
  registerComponent({ label: e, instance: t, initialValue: s = !1 }) {
    var o;
    this.options[e] = s, this.components[e] = t, this.createToggle(e), s === !0 && ((o = t.action) == null || o.call(t, this));
  }
  onSceneAction(e) {
    var t;
    this.components.props.action(this, e), (t = this.components.transform.controls) == null || t.attach(e), this.logObject(e);
  }
  onTransformAction(e) {
    this.components.props.action(this, e), this.logObject(e);
  }
  logObject(e) {
    e && (console.log(`
`), console.log("target:   ", e), console.log("position: ", e.position), console.log("rotation: ", e.rotation), console.log("scale:    ", e.scale));
  }
  update(e) {
    var t, s, o, n;
    (s = (t = this.components.orbit).update) == null || s.call(t, e), (n = (o = this.components.physics) == null ? void 0 : o.update) == null || n.call(o);
  }
}
const H = new F();
export {
  F as Debug,
  H as debug
};
