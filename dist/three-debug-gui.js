var He = Object.defineProperty;
var Xe = (p, t, e) => t in p ? He(p, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : p[t] = e;
var k = (p, t, e) => Xe(p, typeof t != "symbol" ? t + "" : t, e);
import { Ray as je, Plane as Be, MathUtils as Ve, Vector3 as C, Controls as Ae, MOUSE as yt, TOUCH as wt, Quaternion as et, Spherical as le, Vector2 as tt, FrontSide as Ze, BackSide as We, DoubleSide as ze, MeshLambertMaterial as Ue, MeshBasicMaterial as Xt, MeshPhongMaterial as qe, MeshStandardMaterial as Ge, ClampToEdgeWrapping as Qe, RepeatWrapping as Ke, MirroredRepeatWrapping as Je, SphereGeometry as Qt, BoxGeometry as V, PlaneGeometry as Kt, Mesh as v, CylinderGeometry as q, BufferGeometry as Mt, Float32BufferAttribute as Pt, Raycaster as Te, Euler as ti, Matrix4 as Ce, Object3D as Jt, LineBasicMaterial as ei, OctahedronGeometry as Dt, Line as ht, TorusGeometry as gt } from "three";
/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.21.0
 * @author George Michael Brower
 * @license MIT
 */
class lt {
  constructor(t, e, i, s, n = "div") {
    this.parent = t, this.object = e, this.property = i, this._disabled = !1, this._hidden = !1, this.initialValue = this.getValue(), this.domElement = document.createElement(n), this.domElement.classList.add("lil-controller"), this.domElement.classList.add(s), this.$name = document.createElement("div"), this.$name.classList.add("lil-name"), lt.nextNameID = lt.nextNameID || 0, this.$name.id = `lil-gui-name-${++lt.nextNameID}`, this.$widget = document.createElement("div"), this.$widget.classList.add("lil-widget"), this.$disable = this.$widget, this.domElement.appendChild(this.$name), this.domElement.appendChild(this.$widget), this.domElement.addEventListener("keydown", (o) => o.stopPropagation()), this.domElement.addEventListener("keyup", (o) => o.stopPropagation()), this.parent.children.push(this), this.parent.controllers.push(this), this.parent.$children.appendChild(this.domElement), this._listenCallback = this._listenCallback.bind(this), this.name(i);
  }
  /**
   * Sets the name of the controller and its label in the GUI.
   * @param {string} name
   * @returns {this}
   */
  name(t) {
    return this._name = t, this.$name.textContent = t, this;
  }
  /**
   * Pass a function to be called whenever the value is modified by this controller.
   * The function receives the new value as its first parameter. The value of `this` will be the
   * controller.
   *
   * For function controllers, the `onChange` callback will be fired on click, after the function
   * executes.
   * @param {Function} callback
   * @returns {this}
   * @example
   * const controller = gui.add( object, 'property' );
   *
   * controller.onChange( function( v ) {
   * 	console.log( 'The value is now ' + v );
   * 	console.assert( this === controller );
   * } );
   */
  onChange(t) {
    return this._onChange = t, this;
  }
  /**
   * Calls the onChange methods of this controller and its parent GUI.
   * @protected
   */
  _callOnChange() {
    this.parent._callOnChange(this), this._onChange !== void 0 && this._onChange.call(this, this.getValue()), this._changed = !0;
  }
  /**
   * Pass a function to be called after this controller has been modified and loses focus.
   * @param {Function} callback
   * @returns {this}
   * @example
   * const controller = gui.add( object, 'property' );
   *
   * controller.onFinishChange( function( v ) {
   * 	console.log( 'Changes complete: ' + v );
   * 	console.assert( this === controller );
   * } );
   */
  onFinishChange(t) {
    return this._onFinishChange = t, this;
  }
  /**
   * Should be called by Controller when its widgets lose focus.
   * @protected
   */
  _callOnFinishChange() {
    this._changed && (this.parent._callOnFinishChange(this), this._onFinishChange !== void 0 && this._onFinishChange.call(this, this.getValue())), this._changed = !1;
  }
  /**
   * Sets the controller back to its initial value.
   * @returns {this}
   */
  reset() {
    return this.setValue(this.initialValue), this._callOnFinishChange(), this;
  }
  /**
   * Enables this controller.
   * @param {boolean} enabled
   * @returns {this}
   * @example
   * controller.enable();
   * controller.enable( false ); // disable
   * controller.enable( controller._disabled ); // toggle
   */
  enable(t = !0) {
    return this.disable(!t);
  }
  /**
   * Disables this controller.
   * @param {boolean} disabled
   * @returns {this}
   * @example
   * controller.disable();
   * controller.disable( false ); // enable
   * controller.disable( !controller._disabled ); // toggle
   */
  disable(t = !0) {
    return t === this._disabled ? this : (this._disabled = t, this.domElement.classList.toggle("lil-disabled", t), this.$disable.toggleAttribute("disabled", t), this);
  }
  /**
   * Shows the Controller after it's been hidden.
   * @param {boolean} show
   * @returns {this}
   * @example
   * controller.show();
   * controller.show( false ); // hide
   * controller.show( controller._hidden ); // toggle
   */
  show(t = !0) {
    return this._hidden = !t, this.domElement.style.display = this._hidden ? "none" : "", this;
  }
  /**
   * Hides the Controller.
   * @returns {this}
   */
  hide() {
    return this.show(!1);
  }
  /**
   * Changes this controller into a dropdown of options.
   *
   * Calling this method on an option controller will simply update the options. However, if this
   * controller was not already an option controller, old references to this controller are
   * destroyed, and a new controller is added to the end of the GUI.
   * @example
   * // safe usage
   *
   * gui.add( obj, 'prop1' ).options( [ 'a', 'b', 'c' ] );
   * gui.add( obj, 'prop2' ).options( { Big: 10, Small: 1 } );
   * gui.add( obj, 'prop3' );
   *
   * // danger
   *
   * const ctrl1 = gui.add( obj, 'prop1' );
   * gui.add( obj, 'prop2' );
   *
   * // calling options out of order adds a new controller to the end...
   * const ctrl2 = ctrl1.options( [ 'a', 'b', 'c' ] );
   *
   * // ...and ctrl1 now references a controller that doesn't exist
   * assert( ctrl2 !== ctrl1 )
   * @param {object|Array} options
   * @returns {Controller}
   */
  options(t) {
    const e = this.parent.add(this.object, this.property, t);
    return e.name(this._name), this.destroy(), e;
  }
  /**
   * Sets the minimum value. Only works on number controllers.
   * @param {number} min
   * @returns {this}
   */
  min(t) {
    return this;
  }
  /**
   * Sets the maximum value. Only works on number controllers.
   * @param {number} max
   * @returns {this}
   */
  max(t) {
    return this;
  }
  /**
   * Values set by this controller will be rounded to multiples of `step`. Only works on number
   * controllers.
   * @param {number} step
   * @returns {this}
   */
  step(t) {
    return this;
  }
  /**
   * Rounds the displayed value to a fixed number of decimals, without affecting the actual value
   * like `step()`. Only works on number controllers.
   * @example
   * gui.add( object, 'property' ).listen().decimals( 4 );
   * @param {number} decimals
   * @returns {this}
   */
  decimals(t) {
    return this;
  }
  /**
   * Calls `updateDisplay()` every animation frame. Pass `false` to stop listening.
   * @param {boolean} listen
   * @returns {this}
   */
  listen(t = !0) {
    return this._listening = t, this._listenCallbackID !== void 0 && (cancelAnimationFrame(this._listenCallbackID), this._listenCallbackID = void 0), this._listening && this._listenCallback(), this;
  }
  _listenCallback() {
    this._listenCallbackID = requestAnimationFrame(this._listenCallback);
    const t = this.save();
    t !== this._listenPrevValue && this.updateDisplay(), this._listenPrevValue = t;
  }
  /**
   * Returns `object[ property ]`.
   * @returns {any}
   */
  getValue() {
    return this.object[this.property];
  }
  /**
   * Sets the value of `object[ property ]`, invokes any `onChange` handlers and updates the display.
   * @param {any} value
   * @returns {this}
   */
  setValue(t) {
    return this.getValue() !== t && (this.object[this.property] = t, this._callOnChange(), this.updateDisplay()), this;
  }
  /**
   * Updates the display to keep it in sync with the current value. Useful for updating your
   * controllers when their values have been modified outside of the GUI.
   * @returns {this}
   */
  updateDisplay() {
    return this;
  }
  load(t) {
    return this.setValue(t), this._callOnFinishChange(), this;
  }
  save() {
    return this.getValue();
  }
  /**
   * Destroys this controller and removes it from the parent GUI.
   */
  destroy() {
    this.listen(!1), this.parent.children.splice(this.parent.children.indexOf(this), 1), this.parent.controllers.splice(this.parent.controllers.indexOf(this), 1), this.parent.$children.removeChild(this.domElement);
  }
}
class ii extends lt {
  constructor(t, e, i) {
    super(t, e, i, "lil-boolean", "label"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "checkbox"), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$widget.appendChild(this.$input), this.$input.addEventListener("change", () => {
      this.setValue(this.$input.checked), this._callOnFinishChange();
    }), this.$disable = this.$input, this.updateDisplay();
  }
  updateDisplay() {
    return this.$input.checked = this.getValue(), this;
  }
}
function te(p) {
  let t, e;
  return (t = p.match(/(#|0x)?([a-f0-9]{6})/i)) ? e = t[2] : (t = p.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/)) ? e = parseInt(t[1]).toString(16).padStart(2, 0) + parseInt(t[2]).toString(16).padStart(2, 0) + parseInt(t[3]).toString(16).padStart(2, 0) : (t = p.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i)) && (e = t[1] + t[1] + t[2] + t[2] + t[3] + t[3]), e ? "#" + e : !1;
}
const si = {
  isPrimitive: !0,
  match: (p) => typeof p == "string",
  fromHexString: te,
  toHexString: te
}, zt = {
  isPrimitive: !0,
  match: (p) => typeof p == "number",
  fromHexString: (p) => parseInt(p.substring(1), 16),
  toHexString: (p) => "#" + p.toString(16).padStart(6, 0)
}, ni = {
  isPrimitive: !1,
  match: (p) => Array.isArray(p) || ArrayBuffer.isView(p),
  fromHexString(p, t, e = 1) {
    const i = zt.fromHexString(p);
    t[0] = (i >> 16 & 255) / 255 * e, t[1] = (i >> 8 & 255) / 255 * e, t[2] = (i & 255) / 255 * e;
  },
  toHexString([p, t, e], i = 1) {
    i = 255 / i;
    const s = p * i << 16 ^ t * i << 8 ^ e * i << 0;
    return zt.toHexString(s);
  }
}, oi = {
  isPrimitive: !1,
  match: (p) => Object(p) === p,
  fromHexString(p, t, e = 1) {
    const i = zt.fromHexString(p);
    t.r = (i >> 16 & 255) / 255 * e, t.g = (i >> 8 & 255) / 255 * e, t.b = (i & 255) / 255 * e;
  },
  toHexString({ r: p, g: t, b: e }, i = 1) {
    i = 255 / i;
    const s = p * i << 16 ^ t * i << 8 ^ e * i << 0;
    return zt.toHexString(s);
  }
}, ri = [si, zt, ni, oi];
function ai(p) {
  return ri.find((t) => t.match(p));
}
class li extends lt {
  constructor(t, e, i, s) {
    super(t, e, i, "lil-color"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "color"), this.$input.setAttribute("tabindex", -1), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$text = document.createElement("input"), this.$text.setAttribute("type", "text"), this.$text.setAttribute("spellcheck", "false"), this.$text.setAttribute("aria-labelledby", this.$name.id), this.$display = document.createElement("div"), this.$display.classList.add("lil-display"), this.$display.appendChild(this.$input), this.$widget.appendChild(this.$display), this.$widget.appendChild(this.$text), this._format = ai(this.initialValue), this._rgbScale = s, this._initialValueHexString = this.save(), this._textFocused = !1, this.$input.addEventListener("input", () => {
      this._setValueFromHexString(this.$input.value);
    }), this.$input.addEventListener("blur", () => {
      this._callOnFinishChange();
    }), this.$text.addEventListener("input", () => {
      const n = te(this.$text.value);
      n && this._setValueFromHexString(n);
    }), this.$text.addEventListener("focus", () => {
      this._textFocused = !0, this.$text.select();
    }), this.$text.addEventListener("blur", () => {
      this._textFocused = !1, this.updateDisplay(), this._callOnFinishChange();
    }), this.$disable = this.$text, this.updateDisplay();
  }
  reset() {
    return this._setValueFromHexString(this._initialValueHexString), this;
  }
  _setValueFromHexString(t) {
    if (this._format.isPrimitive) {
      const e = this._format.fromHexString(t);
      this.setValue(e);
    } else
      this._format.fromHexString(t, this.getValue(), this._rgbScale), this._callOnChange(), this.updateDisplay();
  }
  save() {
    return this._format.toHexString(this.getValue(), this._rgbScale);
  }
  load(t) {
    return this._setValueFromHexString(t), this._callOnFinishChange(), this;
  }
  updateDisplay() {
    return this.$input.value = this._format.toHexString(this.getValue(), this._rgbScale), this._textFocused || (this.$text.value = this.$input.value.substring(1)), this.$display.style.backgroundColor = this.$input.value, this;
  }
}
class jt extends lt {
  constructor(t, e, i) {
    super(t, e, i, "lil-function"), this.$button = document.createElement("button"), this.$button.appendChild(this.$name), this.$widget.appendChild(this.$button), this.$button.addEventListener("click", (s) => {
      s.preventDefault(), this.getValue().call(this.object), this._callOnChange();
    }), this.$button.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$disable = this.$button;
  }
}
class hi extends lt {
  constructor(t, e, i, s, n, o) {
    super(t, e, i, "lil-number"), this._initInput(), this.min(s), this.max(n);
    const a = o !== void 0;
    this.step(a ? o : this._getImplicitStep(), a), this.updateDisplay();
  }
  decimals(t) {
    return this._decimals = t, this.updateDisplay(), this;
  }
  min(t) {
    return this._min = t, this._onUpdateMinMax(), this;
  }
  max(t) {
    return this._max = t, this._onUpdateMinMax(), this;
  }
  step(t, e = !0) {
    return this._step = t, this._stepExplicit = e, this;
  }
  updateDisplay() {
    const t = this.getValue();
    if (this._hasSlider) {
      let e = (t - this._min) / (this._max - this._min);
      e = Math.max(0, Math.min(e, 1)), this.$fill.style.width = e * 100 + "%";
    }
    return this._inputFocused || (this.$input.value = this._decimals === void 0 ? t : t.toFixed(this._decimals)), this;
  }
  _initInput() {
    this.$input = document.createElement("input"), this.$input.setAttribute("type", "text"), this.$input.setAttribute("aria-labelledby", this.$name.id), window.matchMedia("(pointer: coarse)").matches && (this.$input.setAttribute("type", "number"), this.$input.setAttribute("step", "any")), this.$widget.appendChild(this.$input), this.$disable = this.$input;
    const e = () => {
      let w = parseFloat(this.$input.value);
      isNaN(w) || (this._stepExplicit && (w = this._snap(w)), this.setValue(this._clamp(w)));
    }, i = (w) => {
      const M = parseFloat(this.$input.value);
      isNaN(M) || (this._snapClampSetValue(M + w), this.$input.value = this.getValue());
    }, s = (w) => {
      w.key === "Enter" && this.$input.blur(), w.code === "ArrowUp" && (w.preventDefault(), i(this._step * this._arrowKeyMultiplier(w))), w.code === "ArrowDown" && (w.preventDefault(), i(this._step * this._arrowKeyMultiplier(w) * -1));
    }, n = (w) => {
      this._inputFocused && (w.preventDefault(), i(this._step * this._normalizeMouseWheel(w)));
    };
    let o = !1, a, h, l, c, d;
    const u = 5, f = (w) => {
      a = w.clientX, h = l = w.clientY, o = !0, c = this.getValue(), d = 0, window.addEventListener("mousemove", m), window.addEventListener("mouseup", y);
    }, m = (w) => {
      if (o) {
        const M = w.clientX - a, I = w.clientY - h;
        Math.abs(I) > u ? (w.preventDefault(), this.$input.blur(), o = !1, this._setDraggingStyle(!0, "vertical")) : Math.abs(M) > u && y();
      }
      if (!o) {
        const M = w.clientY - l;
        d -= M * this._step * this._arrowKeyMultiplier(w), c + d > this._max ? d = this._max - c : c + d < this._min && (d = this._min - c), this._snapClampSetValue(c + d);
      }
      l = w.clientY;
    }, y = () => {
      this._setDraggingStyle(!1, "vertical"), this._callOnFinishChange(), window.removeEventListener("mousemove", m), window.removeEventListener("mouseup", y);
    }, x = () => {
      this._inputFocused = !0;
    }, g = () => {
      this._inputFocused = !1, this.updateDisplay(), this._callOnFinishChange();
    };
    this.$input.addEventListener("input", e), this.$input.addEventListener("keydown", s), this.$input.addEventListener("wheel", n, { passive: !1 }), this.$input.addEventListener("mousedown", f), this.$input.addEventListener("focus", x), this.$input.addEventListener("blur", g);
  }
  _initSlider() {
    this._hasSlider = !0, this.$slider = document.createElement("div"), this.$slider.classList.add("lil-slider"), this.$fill = document.createElement("div"), this.$fill.classList.add("lil-fill"), this.$slider.appendChild(this.$fill), this.$widget.insertBefore(this.$slider, this.$input), this.domElement.classList.add("lil-has-slider");
    const t = (g, w, M, I, F) => (g - w) / (M - w) * (F - I) + I, e = (g) => {
      const w = this.$slider.getBoundingClientRect();
      let M = t(g, w.left, w.right, this._min, this._max);
      this._snapClampSetValue(M);
    }, i = (g) => {
      this._setDraggingStyle(!0), e(g.clientX), window.addEventListener("mousemove", s), window.addEventListener("mouseup", n);
    }, s = (g) => {
      e(g.clientX);
    }, n = () => {
      this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("mousemove", s), window.removeEventListener("mouseup", n);
    };
    let o = !1, a, h;
    const l = (g) => {
      g.preventDefault(), this._setDraggingStyle(!0), e(g.touches[0].clientX), o = !1;
    }, c = (g) => {
      g.touches.length > 1 || (this._hasScrollBar ? (a = g.touches[0].clientX, h = g.touches[0].clientY, o = !0) : l(g), window.addEventListener("touchmove", d, { passive: !1 }), window.addEventListener("touchend", u));
    }, d = (g) => {
      if (o) {
        const w = g.touches[0].clientX - a, M = g.touches[0].clientY - h;
        Math.abs(w) > Math.abs(M) ? l(g) : (window.removeEventListener("touchmove", d), window.removeEventListener("touchend", u));
      } else
        g.preventDefault(), e(g.touches[0].clientX);
    }, u = () => {
      this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("touchmove", d), window.removeEventListener("touchend", u);
    }, f = this._callOnFinishChange.bind(this), m = 400;
    let y;
    const x = (g) => {
      if (Math.abs(g.deltaX) < Math.abs(g.deltaY) && this._hasScrollBar) return;
      g.preventDefault();
      const M = this._normalizeMouseWheel(g) * this._step;
      this._snapClampSetValue(this.getValue() + M), this.$input.value = this.getValue(), clearTimeout(y), y = setTimeout(f, m);
    };
    this.$slider.addEventListener("mousedown", i), this.$slider.addEventListener("touchstart", c, { passive: !1 }), this.$slider.addEventListener("wheel", x, { passive: !1 });
  }
  _setDraggingStyle(t, e = "horizontal") {
    this.$slider && this.$slider.classList.toggle("lil-active", t), document.body.classList.toggle("lil-dragging", t), document.body.classList.toggle(`lil-${e}`, t);
  }
  _getImplicitStep() {
    return this._hasMin && this._hasMax ? (this._max - this._min) / 1e3 : 0.1;
  }
  _onUpdateMinMax() {
    !this._hasSlider && this._hasMin && this._hasMax && (this._stepExplicit || this.step(this._getImplicitStep(), !1), this._initSlider(), this.updateDisplay());
  }
  _normalizeMouseWheel(t) {
    let { deltaX: e, deltaY: i } = t;
    return Math.floor(t.deltaY) !== t.deltaY && t.wheelDelta && (e = 0, i = -t.wheelDelta / 120, i *= this._stepExplicit ? 1 : 10), e + -i;
  }
  _arrowKeyMultiplier(t) {
    let e = this._stepExplicit ? 1 : 10;
    return t.shiftKey ? e *= 10 : t.altKey && (e /= 10), e;
  }
  _snap(t) {
    let e = 0;
    return this._hasMin ? e = this._min : this._hasMax && (e = this._max), t -= e, t = Math.round(t / this._step) * this._step, t += e, t = parseFloat(t.toPrecision(15)), t;
  }
  _clamp(t) {
    return t < this._min && (t = this._min), t > this._max && (t = this._max), t;
  }
  _snapClampSetValue(t) {
    this.setValue(this._clamp(this._snap(t)));
  }
  get _hasScrollBar() {
    const t = this.parent.root.$children;
    return t.scrollHeight > t.clientHeight;
  }
  get _hasMin() {
    return this._min !== void 0;
  }
  get _hasMax() {
    return this._max !== void 0;
  }
}
class ci extends lt {
  constructor(t, e, i, s) {
    super(t, e, i, "lil-option"), this.$select = document.createElement("select"), this.$select.setAttribute("aria-labelledby", this.$name.id), this.$display = document.createElement("div"), this.$display.classList.add("lil-display"), this.$select.addEventListener("change", () => {
      this.setValue(this._values[this.$select.selectedIndex]), this._callOnFinishChange();
    }), this.$select.addEventListener("focus", () => {
      this.$display.classList.add("lil-focus");
    }), this.$select.addEventListener("blur", () => {
      this.$display.classList.remove("lil-focus");
    }), this.$widget.appendChild(this.$select), this.$widget.appendChild(this.$display), this.$disable = this.$select, this.options(s);
  }
  options(t) {
    return this._values = Array.isArray(t) ? t : Object.values(t), this._names = Array.isArray(t) ? t : Object.keys(t), this.$select.replaceChildren(), this._names.forEach((e) => {
      const i = document.createElement("option");
      i.textContent = e, this.$select.appendChild(i);
    }), this.updateDisplay(), this;
  }
  updateDisplay() {
    const t = this.getValue(), e = this._values.indexOf(t);
    return this.$select.selectedIndex = e, this.$display.textContent = e === -1 ? t : this._names[e], this;
  }
}
class di extends lt {
  constructor(t, e, i) {
    super(t, e, i, "lil-string"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "text"), this.$input.setAttribute("spellcheck", "false"), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$input.addEventListener("input", () => {
      this.setValue(this.$input.value);
    }), this.$input.addEventListener("keydown", (s) => {
      s.code === "Enter" && this.$input.blur();
    }), this.$input.addEventListener("blur", () => {
      this._callOnFinishChange();
    }), this.$widget.appendChild(this.$input), this.$disable = this.$input, this.updateDisplay();
  }
  updateDisplay() {
    return this.$input.value = this.getValue(), this;
  }
}
var pi = `.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.lil-root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.lil-root > .lil-children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.lil-allow-touch-styles, .lil-gui.lil-allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.lil-force-touch-styles, .lil-gui.lil-force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.lil-auto-place, .lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-controller.lil-disabled {
  opacity: 0.5;
}
.lil-controller.lil-disabled, .lil-controller.lil-disabled * {
  pointer-events: none !important;
}
.lil-controller > .lil-name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-controller .lil-widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-controller.lil-string input {
  color: var(--string-color);
}
.lil-controller.lil-boolean {
  cursor: pointer;
}
.lil-controller.lil-color .lil-display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-controller.lil-color .lil-display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-controller.lil-color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-controller.lil-color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-controller.lil-option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-controller.lil-option .lil-display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-display.lil-focus {
    background: var(--focus-color);
  }
}
.lil-controller.lil-option .lil-display.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-option .lil-display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-controller.lil-option .lil-widget,
.lil-controller.lil-option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-widget:hover .lil-display {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number input {
  color: var(--number-color);
}
.lil-controller.lil-number.lil-has-slider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-controller.lil-number .lil-slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-controller.lil-number .lil-slider:hover {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number .lil-slider.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-number .lil-slider.lil-active .lil-fill {
  opacity: 0.95;
}
.lil-controller.lil-number .lil-fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-dragging * {
  cursor: ew-resize !important;
}
.lil-dragging.lil-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .lil-title {
  height: var(--title-height);
  font-weight: 600;
  padding: 0 var(--padding);
  width: 100%;
  text-align: left;
  background: none;
  text-decoration-skip: objects;
}
.lil-gui .lil-title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .lil-title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-dragging) .lil-gui .lil-title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .lil-title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.lil-root > .lil-title:focus {
  text-decoration: none !important;
}
.lil-gui.lil-closed > .lil-title:before {
  content: "▸";
}
.lil-gui.lil-closed > .lil-children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.lil-closed:not(.lil-transition) > .lil-children {
  display: none;
}
.lil-gui.lil-transition > .lil-children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .lil-children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.lil-root > .lil-children > .lil-gui > .lil-title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.lil-root > .lil-children > .lil-gui.lil-closed > .lil-title {
  border-bottom-color: transparent;
}
.lil-gui + .lil-controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .lil-title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .lil-children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .lil-controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  border: none;
}
.lil-gui .lil-controller button {
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
}
@media (hover: hover) {
  .lil-gui .lil-controller button:hover {
    background: var(--hover-color);
  }
  .lil-gui .lil-controller button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui .lil-controller button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff2;charset=utf-8;base64,d09GMgABAAAAAALkAAsAAAAABtQAAAKVAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDMgqBBIEbATYCJAMUCwwABCAFhAoHgQQbHAbIDiUFEYVARAAAYQTVWNmz9MxhEgodq49wYRUFKE8GWNiUBxI2LBRaVnc51U83Gmhs0Q7JXWMiz5eteLwrKwuxHO8VFxUX9UpZBs6pa5ABRwHA+t3UxUnH20EvVknRerzQgX6xC/GH6ZUvTcAjAv122dF28OTqCXrPuyaDER30YBA1xnkVutDDo4oCi71Ca7rrV9xS8dZHbPHefsuwIyCpmT7j+MnjAH5X3984UZoFFuJ0yiZ4XEJFxjagEBeqs+e1iyK8Xf/nOuwF+vVK0ur765+vf7txotUi0m3N0m/84RGSrBCNrh8Ee5GjODjF4gnWP+dJrH/Lk9k4oT6d+gr6g/wssA2j64JJGP6cmx554vUZnpZfn6ZfX2bMwPPrlANsB86/DiHjhl0OP+c87+gaJo/gY084s3HoYL/ZkWHTRfBXvvoHnnkHvngKun4KBE/ede7tvq3/vQOxDXB1/fdNz6XbPdcr0Vhpojj9dG+owuSKFsslCi1tgEjirjXdwMiov2EioadxmqTHUCIwo8NgQaeIasAi0fTYSPTbSmwbMOFduyh9wvBrESGY0MtgRjtgQR8Q1bRPohn2UoCRZf9wyYANMXFeJTysqAe0I4mrherOekFdKMrYvJjLvOIUM9SuwYB5DVZUwwVjJJOaUnZCmcEkIZZrKqNvRGRMvmFZsmhP4VMKCSXBhSqUBxgMS7h0cZvEd71AWkEhGWaeMFcNnpqyJkyXgYL7PQ1MoSq0wDAkRtJIijkZSmqYTiSImfLiSWXIZwhRh3Rug2X0kk1Dgj+Iu43u5p98ghopcpSo0Uyc8SnjlYX59WUeaMoDqmVD2TOWD9a4pCRAzf2ECgwGcrHjPOWY9bNxq/OL3I/QjwEAAAA=") format("woff2");
}`;
function ui(p) {
  const t = document.createElement("style");
  t.innerHTML = p;
  const e = document.querySelector("head link[rel=stylesheet], head style");
  e ? document.head.insertBefore(t, e) : document.head.appendChild(t);
}
let he = !1;
class Tt {
  /**
   * Creates a panel that holds controllers.
   * @example
   * new GUI();
   * new GUI( { container: document.getElementById( 'custom' ) } );
   *
   * @param {object} [options]
   * @param {boolean} [options.autoPlace=true]
   * Adds the GUI to `document.body` and fixes it to the top right of the page.
   *
   * @param {Node} [options.container]
   * Adds the GUI to this DOM element. Overrides `autoPlace`.
   *
   * @param {number} [options.width=245]
   * Width of the GUI in pixels, usually set when name labels become too long. Note that you can make
   * name labels wider in CSS with `.lil‑gui { ‑‑name‑width: 55% }`.
   *
   * @param {string} [options.title=Controls]
   * Name to display in the title bar.
   *
   * @param {boolean} [options.closeFolders=false]
   * Pass `true` to close all folders in this GUI by default.
   *
   * @param {boolean} [options.injectStyles=true]
   * Injects the default stylesheet into the page if this is the first GUI.
   * Pass `false` to use your own stylesheet.
   *
   * @param {number} [options.touchStyles=true]
   * Makes controllers larger on touch devices. Pass `false` to disable touch styles.
   *
   * @param {GUI} [options.parent]
   * Adds this GUI as a child in another GUI. Usually this is done for you by `addFolder()`.
   */
  constructor({
    parent: t,
    autoPlace: e = t === void 0,
    container: i,
    width: s,
    title: n = "Controls",
    closeFolders: o = !1,
    injectStyles: a = !0,
    touchStyles: h = !0
  } = {}) {
    if (this.parent = t, this.root = t ? t.root : this, this.children = [], this.controllers = [], this.folders = [], this._closed = !1, this._hidden = !1, this.domElement = document.createElement("div"), this.domElement.classList.add("lil-gui"), this.$title = document.createElement("button"), this.$title.classList.add("lil-title"), this.$title.setAttribute("aria-expanded", !0), this.$title.addEventListener("click", () => this.openAnimated(this._closed)), this.$title.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$children = document.createElement("div"), this.$children.classList.add("lil-children"), this.domElement.appendChild(this.$title), this.domElement.appendChild(this.$children), this.title(n), this.parent) {
      this.parent.children.push(this), this.parent.folders.push(this), this.parent.$children.appendChild(this.domElement);
      return;
    }
    this.domElement.classList.add("lil-root"), h && this.domElement.classList.add("lil-allow-touch-styles"), !he && a && (ui(pi), he = !0), i ? i.appendChild(this.domElement) : e && (this.domElement.classList.add("lil-auto-place", "autoPlace"), document.body.appendChild(this.domElement)), s && this.domElement.style.setProperty("--width", s + "px"), this._closeFolders = o;
  }
  /**
   * Adds a controller to the GUI, inferring controller type using the `typeof` operator.
   * @example
   * gui.add( object, 'property' );
   * gui.add( object, 'number', 0, 100, 1 );
   * gui.add( object, 'options', [ 1, 2, 3 ] );
   *
   * @param {object} object The object the controller will modify.
   * @param {string} property Name of the property to control.
   * @param {number|object|Array} [$1] Minimum value for number controllers, or the set of
   * selectable values for a dropdown.
   * @param {number} [max] Maximum value for number controllers.
   * @param {number} [step] Step value for number controllers.
   * @returns {Controller}
   */
  add(t, e, i, s, n) {
    if (Object(i) === i)
      return new ci(this, t, e, i);
    const o = t[e];
    switch (typeof o) {
      case "number":
        return new hi(this, t, e, i, s, n);
      case "boolean":
        return new ii(this, t, e);
      case "string":
        return new di(this, t, e);
      case "function":
        return new jt(this, t, e);
    }
    console.error(`gui.add failed
	property:`, e, `
	object:`, t, `
	value:`, o);
  }
  /**
   * Adds a color controller to the GUI.
   * @example
   * params = {
   * 	cssColor: '#ff00ff',
   * 	rgbColor: { r: 0, g: 0.2, b: 0.4 },
   * 	customRange: [ 0, 127, 255 ],
   * };
   *
   * gui.addColor( params, 'cssColor' );
   * gui.addColor( params, 'rgbColor' );
   * gui.addColor( params, 'customRange', 255 );
   *
   * @param {object} object The object the controller will modify.
   * @param {string} property Name of the property to control.
   * @param {number} rgbScale Maximum value for a color channel when using an RGB color. You may
   * need to set this to 255 if your colors are too bright.
   * @returns {Controller}
   */
  addColor(t, e, i = 1) {
    return new li(this, t, e, i);
  }
  /**
   * Adds a folder to the GUI, which is just another GUI. This method returns
   * the nested GUI so you can add controllers to it.
   * @example
   * const folder = gui.addFolder( 'Position' );
   * folder.add( position, 'x' );
   * folder.add( position, 'y' );
   * folder.add( position, 'z' );
   *
   * @param {string} title Name to display in the folder's title bar.
   * @returns {GUI}
   */
  addFolder(t) {
    const e = new Tt({ parent: this, title: t });
    return this.root._closeFolders && e.close(), e;
  }
  /**
   * Recalls values that were saved with `gui.save()`.
   * @param {object} obj
   * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
   * @returns {this}
   */
  load(t, e = !0) {
    return t.controllers && this.controllers.forEach((i) => {
      i instanceof jt || i._name in t.controllers && i.load(t.controllers[i._name]);
    }), e && t.folders && this.folders.forEach((i) => {
      i._title in t.folders && i.load(t.folders[i._title]);
    }), this;
  }
  /**
   * Returns an object mapping controller names to values. The object can be passed to `gui.load()` to
   * recall these values.
   * @example
   * {
   * 	controllers: {
   * 		prop1: 1,
   * 		prop2: 'value',
   * 		...
   * 	},
   * 	folders: {
   * 		folderName1: { controllers, folders },
   * 		folderName2: { controllers, folders }
   * 		...
   * 	}
   * }
   *
   * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
   * @returns {object}
   */
  save(t = !0) {
    const e = {
      controllers: {},
      folders: {}
    };
    return this.controllers.forEach((i) => {
      if (!(i instanceof jt)) {
        if (i._name in e.controllers)
          throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);
        e.controllers[i._name] = i.save();
      }
    }), t && this.folders.forEach((i) => {
      if (i._title in e.folders)
        throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);
      e.folders[i._title] = i.save();
    }), e;
  }
  /**
   * Opens a GUI or folder. GUI and folders are open by default.
   * @param {boolean} open Pass false to close.
   * @returns {this}
   * @example
   * gui.open(); // open
   * gui.open( false ); // close
   * gui.open( gui._closed ); // toggle
   */
  open(t = !0) {
    return this._setClosed(!t), this.$title.setAttribute("aria-expanded", !this._closed), this.domElement.classList.toggle("lil-closed", this._closed), this;
  }
  /**
   * Closes the GUI.
   * @returns {this}
   */
  close() {
    return this.open(!1);
  }
  _setClosed(t) {
    this._closed !== t && (this._closed = t, this._callOnOpenClose(this));
  }
  /**
   * Shows the GUI after it's been hidden.
   * @param {boolean} show
   * @returns {this}
   * @example
   * gui.show();
   * gui.show( false ); // hide
   * gui.show( gui._hidden ); // toggle
   */
  show(t = !0) {
    return this._hidden = !t, this.domElement.style.display = this._hidden ? "none" : "", this;
  }
  /**
   * Hides the GUI.
   * @returns {this}
   */
  hide() {
    return this.show(!1);
  }
  openAnimated(t = !0) {
    return this._setClosed(!t), this.$title.setAttribute("aria-expanded", !this._closed), requestAnimationFrame(() => {
      const e = this.$children.clientHeight;
      this.$children.style.height = e + "px", this.domElement.classList.add("lil-transition");
      const i = (n) => {
        n.target === this.$children && (this.$children.style.height = "", this.domElement.classList.remove("lil-transition"), this.$children.removeEventListener("transitionend", i));
      };
      this.$children.addEventListener("transitionend", i);
      const s = t ? this.$children.scrollHeight : 0;
      this.domElement.classList.toggle("lil-closed", !t), requestAnimationFrame(() => {
        this.$children.style.height = s + "px";
      });
    }), this;
  }
  /**
   * Change the title of this GUI.
   * @param {string} title
   * @returns {this}
   */
  title(t) {
    return this._title = t, this.$title.textContent = t, this;
  }
  /**
   * Resets all controllers to their initial values.
   * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
   * @returns {this}
   */
  reset(t = !0) {
    return (t ? this.controllersRecursive() : this.controllers).forEach((i) => i.reset()), this;
  }
  /**
   * Pass a function to be called whenever a controller in this GUI changes.
   * @param {function({object:object, property:string, value:any, controller:Controller})} callback
   * @returns {this}
   * @example
   * gui.onChange( event => {
   * 	event.object     // object that was modified
   * 	event.property   // string, name of property
   * 	event.value      // new value of controller
   * 	event.controller // controller that was modified
   * } );
   */
  onChange(t) {
    return this._onChange = t, this;
  }
  _callOnChange(t) {
    this.parent && this.parent._callOnChange(t), this._onChange !== void 0 && this._onChange.call(this, {
      object: t.object,
      property: t.property,
      value: t.getValue(),
      controller: t
    });
  }
  /**
   * Pass a function to be called whenever a controller in this GUI has finished changing.
   * @param {function({object:object, property:string, value:any, controller:Controller})} callback
   * @returns {this}
   * @example
   * gui.onFinishChange( event => {
   * 	event.object     // object that was modified
   * 	event.property   // string, name of property
   * 	event.value      // new value of controller
   * 	event.controller // controller that was modified
   * } );
   */
  onFinishChange(t) {
    return this._onFinishChange = t, this;
  }
  _callOnFinishChange(t) {
    this.parent && this.parent._callOnFinishChange(t), this._onFinishChange !== void 0 && this._onFinishChange.call(this, {
      object: t.object,
      property: t.property,
      value: t.getValue(),
      controller: t
    });
  }
  /**
   * Pass a function to be called when this GUI or its descendants are opened or closed.
   * @param {function(GUI)} callback
   * @returns {this}
   * @example
   * gui.onOpenClose( changedGUI => {
   * 	console.log( changedGUI._closed );
   * } );
   */
  onOpenClose(t) {
    return this._onOpenClose = t, this;
  }
  _callOnOpenClose(t) {
    this.parent && this.parent._callOnOpenClose(t), this._onOpenClose !== void 0 && this._onOpenClose.call(this, t);
  }
  /**
   * Destroys all DOM elements and event listeners associated with this GUI.
   */
  destroy() {
    this.parent && (this.parent.children.splice(this.parent.children.indexOf(this), 1), this.parent.folders.splice(this.parent.folders.indexOf(this), 1)), this.domElement.parentElement && this.domElement.parentElement.removeChild(this.domElement), Array.from(this.children).forEach((t) => t.destroy());
  }
  /**
   * Returns an array of controllers contained by this GUI and its descendents.
   * @returns {Controller[]}
   */
  controllersRecursive() {
    let t = Array.from(this.controllers);
    return this.folders.forEach((e) => {
      t = t.concat(e.controllersRecursive());
    }), t;
  }
  /**
   * Returns an array of folders contained by this GUI and its descendents.
   * @returns {GUI[]}
   */
  foldersRecursive() {
    let t = Array.from(this.folders);
    return this.folders.forEach((e) => {
      t = t.concat(e.foldersRecursive());
    }), t;
  }
}
const ce = { type: "change" }, ie = { type: "start" }, Ie = { type: "end" }, Ot = new je(), de = new Be(), fi = Math.cos(70 * Ve.DEG2RAD), B = new C(), Q = 2 * Math.PI, N = {
  NONE: -1,
  ROTATE: 0,
  DOLLY: 1,
  PAN: 2,
  TOUCH_ROTATE: 3,
  TOUCH_PAN: 4,
  TOUCH_DOLLY_PAN: 5,
  TOUCH_DOLLY_ROTATE: 6
}, Bt = 1e-6;
class mi extends Ae {
  /**
   * Constructs a new controls instance.
   *
   * @param {Object3D} object - The object that is managed by the controls.
   * @param {?HTMLDOMElement} domElement - The HTML element used for event listeners.
   */
  constructor(t, e = null) {
    super(t, e), this.state = N.NONE, this.target = new C(), this.cursor = new C(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minTargetRadius = 0, this.maxTargetRadius = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = 0.05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.keyRotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.zoomToCursor = !1, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: yt.ROTATE, MIDDLE: yt.DOLLY, RIGHT: yt.PAN }, this.touches = { ONE: wt.ROTATE, TWO: wt.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this._lastPosition = new C(), this._lastQuaternion = new et(), this._lastTargetPosition = new C(), this._quat = new et().setFromUnitVectors(t.up, new C(0, 1, 0)), this._quatInverse = this._quat.clone().invert(), this._spherical = new le(), this._sphericalDelta = new le(), this._scale = 1, this._panOffset = new C(), this._rotateStart = new tt(), this._rotateEnd = new tt(), this._rotateDelta = new tt(), this._panStart = new tt(), this._panEnd = new tt(), this._panDelta = new tt(), this._dollyStart = new tt(), this._dollyEnd = new tt(), this._dollyDelta = new tt(), this._dollyDirection = new C(), this._mouse = new tt(), this._performCursorZoom = !1, this._pointers = [], this._pointerPositions = {}, this._controlActive = !1, this._onPointerMove = yi.bind(this), this._onPointerDown = wi.bind(this), this._onPointerUp = gi.bind(this), this._onContextMenu = Mi.bind(this), this._onMouseWheel = vi.bind(this), this._onKeyDown = bi.bind(this), this._onTouchStart = Ei.bind(this), this._onTouchMove = Si.bind(this), this._onMouseDown = xi.bind(this), this._onMouseMove = _i.bind(this), this._interceptControlDown = Pi.bind(this), this._interceptControlUp = Ai.bind(this), this.domElement !== null && this.connect(this.domElement), this.update();
  }
  connect(t) {
    super.connect(t), this.domElement.addEventListener("pointerdown", this._onPointerDown), this.domElement.addEventListener("pointercancel", this._onPointerUp), this.domElement.addEventListener("contextmenu", this._onContextMenu), this.domElement.addEventListener("wheel", this._onMouseWheel, { passive: !1 }), this.domElement.getRootNode().addEventListener("keydown", this._interceptControlDown, { passive: !0, capture: !0 }), this.domElement.style.touchAction = "none";
  }
  disconnect() {
    this.domElement.removeEventListener("pointerdown", this._onPointerDown), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.domElement.removeEventListener("pointercancel", this._onPointerUp), this.domElement.removeEventListener("wheel", this._onMouseWheel), this.domElement.removeEventListener("contextmenu", this._onContextMenu), this.stopListenToKeyEvents(), this.domElement.getRootNode().removeEventListener("keydown", this._interceptControlDown, { capture: !0 }), this.domElement.style.touchAction = "auto";
  }
  dispose() {
    this.disconnect();
  }
  /**
   * Get the current vertical rotation, in radians.
   *
   * @return {number} The current vertical rotation, in radians.
   */
  getPolarAngle() {
    return this._spherical.phi;
  }
  /**
   * Get the current horizontal rotation, in radians.
   *
   * @return {number} The current horizontal rotation, in radians.
   */
  getAzimuthalAngle() {
    return this._spherical.theta;
  }
  /**
   * Returns the distance from the camera to the target.
   *
   * @return {number} The distance from the camera to the target.
   */
  getDistance() {
    return this.object.position.distanceTo(this.target);
  }
  /**
   * Adds key event listeners to the given DOM element.
   * `window` is a recommended argument for using this method.
   *
   * @param {HTMLDOMElement} domElement - The DOM element
   */
  listenToKeyEvents(t) {
    t.addEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = t;
  }
  /**
   * Removes the key event listener previously defined with `listenToKeyEvents()`.
   */
  stopListenToKeyEvents() {
    this._domElementKeyEvents !== null && (this._domElementKeyEvents.removeEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = null);
  }
  /**
   * Save the current state of the controls. This can later be recovered with `reset()`.
   */
  saveState() {
    this.target0.copy(this.target), this.position0.copy(this.object.position), this.zoom0 = this.object.zoom;
  }
  /**
   * Reset the controls to their state from either the last time the `saveState()`
   * was called, or the initial state.
   */
  reset() {
    this.target.copy(this.target0), this.object.position.copy(this.position0), this.object.zoom = this.zoom0, this.object.updateProjectionMatrix(), this.dispatchEvent(ce), this.update(), this.state = N.NONE;
  }
  update(t = null) {
    const e = this.object.position;
    B.copy(e).sub(this.target), B.applyQuaternion(this._quat), this._spherical.setFromVector3(B), this.autoRotate && this.state === N.NONE && this._rotateLeft(this._getAutoRotationAngle(t)), this.enableDamping ? (this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor, this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor) : (this._spherical.theta += this._sphericalDelta.theta, this._spherical.phi += this._sphericalDelta.phi);
    let i = this.minAzimuthAngle, s = this.maxAzimuthAngle;
    isFinite(i) && isFinite(s) && (i < -Math.PI ? i += Q : i > Math.PI && (i -= Q), s < -Math.PI ? s += Q : s > Math.PI && (s -= Q), i <= s ? this._spherical.theta = Math.max(i, Math.min(s, this._spherical.theta)) : this._spherical.theta = this._spherical.theta > (i + s) / 2 ? Math.max(i, this._spherical.theta) : Math.min(s, this._spherical.theta)), this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi)), this._spherical.makeSafe(), this.enableDamping === !0 ? this.target.addScaledVector(this._panOffset, this.dampingFactor) : this.target.add(this._panOffset), this.target.sub(this.cursor), this.target.clampLength(this.minTargetRadius, this.maxTargetRadius), this.target.add(this.cursor);
    let n = !1;
    if (this.zoomToCursor && this._performCursorZoom || this.object.isOrthographicCamera)
      this._spherical.radius = this._clampDistance(this._spherical.radius);
    else {
      const o = this._spherical.radius;
      this._spherical.radius = this._clampDistance(this._spherical.radius * this._scale), n = o != this._spherical.radius;
    }
    if (B.setFromSpherical(this._spherical), B.applyQuaternion(this._quatInverse), e.copy(this.target).add(B), this.object.lookAt(this.target), this.enableDamping === !0 ? (this._sphericalDelta.theta *= 1 - this.dampingFactor, this._sphericalDelta.phi *= 1 - this.dampingFactor, this._panOffset.multiplyScalar(1 - this.dampingFactor)) : (this._sphericalDelta.set(0, 0, 0), this._panOffset.set(0, 0, 0)), this.zoomToCursor && this._performCursorZoom) {
      let o = null;
      if (this.object.isPerspectiveCamera) {
        const a = B.length();
        o = this._clampDistance(a * this._scale);
        const h = a - o;
        this.object.position.addScaledVector(this._dollyDirection, h), this.object.updateMatrixWorld(), n = !!h;
      } else if (this.object.isOrthographicCamera) {
        const a = new C(this._mouse.x, this._mouse.y, 0);
        a.unproject(this.object);
        const h = this.object.zoom;
        this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), this.object.updateProjectionMatrix(), n = h !== this.object.zoom;
        const l = new C(this._mouse.x, this._mouse.y, 0);
        l.unproject(this.object), this.object.position.sub(l).add(a), this.object.updateMatrixWorld(), o = B.length();
      } else
        console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), this.zoomToCursor = !1;
      o !== null && (this.screenSpacePanning ? this.target.set(0, 0, -1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position) : (Ot.origin.copy(this.object.position), Ot.direction.set(0, 0, -1).transformDirection(this.object.matrix), Math.abs(this.object.up.dot(Ot.direction)) < fi ? this.object.lookAt(this.target) : (de.setFromNormalAndCoplanarPoint(this.object.up, this.target), Ot.intersectPlane(de, this.target))));
    } else if (this.object.isOrthographicCamera) {
      const o = this.object.zoom;
      this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), o !== this.object.zoom && (this.object.updateProjectionMatrix(), n = !0);
    }
    return this._scale = 1, this._performCursorZoom = !1, n || this._lastPosition.distanceToSquared(this.object.position) > Bt || 8 * (1 - this._lastQuaternion.dot(this.object.quaternion)) > Bt || this._lastTargetPosition.distanceToSquared(this.target) > Bt ? (this.dispatchEvent(ce), this._lastPosition.copy(this.object.position), this._lastQuaternion.copy(this.object.quaternion), this._lastTargetPosition.copy(this.target), !0) : !1;
  }
  _getAutoRotationAngle(t) {
    return t !== null ? Q / 60 * this.autoRotateSpeed * t : Q / 60 / 60 * this.autoRotateSpeed;
  }
  _getZoomScale(t) {
    const e = Math.abs(t * 0.01);
    return Math.pow(0.95, this.zoomSpeed * e);
  }
  _rotateLeft(t) {
    this._sphericalDelta.theta -= t;
  }
  _rotateUp(t) {
    this._sphericalDelta.phi -= t;
  }
  _panLeft(t, e) {
    B.setFromMatrixColumn(e, 0), B.multiplyScalar(-t), this._panOffset.add(B);
  }
  _panUp(t, e) {
    this.screenSpacePanning === !0 ? B.setFromMatrixColumn(e, 1) : (B.setFromMatrixColumn(e, 0), B.crossVectors(this.object.up, B)), B.multiplyScalar(t), this._panOffset.add(B);
  }
  // deltaX and deltaY are in pixels; right and down are positive
  _pan(t, e) {
    const i = this.domElement;
    if (this.object.isPerspectiveCamera) {
      const s = this.object.position;
      B.copy(s).sub(this.target);
      let n = B.length();
      n *= Math.tan(this.object.fov / 2 * Math.PI / 180), this._panLeft(2 * t * n / i.clientHeight, this.object.matrix), this._panUp(2 * e * n / i.clientHeight, this.object.matrix);
    } else this.object.isOrthographicCamera ? (this._panLeft(t * (this.object.right - this.object.left) / this.object.zoom / i.clientWidth, this.object.matrix), this._panUp(e * (this.object.top - this.object.bottom) / this.object.zoom / i.clientHeight, this.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), this.enablePan = !1);
  }
  _dollyOut(t) {
    this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale /= t : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = !1);
  }
  _dollyIn(t) {
    this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale *= t : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = !1);
  }
  _updateZoomParameters(t, e) {
    if (!this.zoomToCursor)
      return;
    this._performCursorZoom = !0;
    const i = this.domElement.getBoundingClientRect(), s = t - i.left, n = e - i.top, o = i.width, a = i.height;
    this._mouse.x = s / o * 2 - 1, this._mouse.y = -(n / a) * 2 + 1, this._dollyDirection.set(this._mouse.x, this._mouse.y, 1).unproject(this.object).sub(this.object.position).normalize();
  }
  _clampDistance(t) {
    return Math.max(this.minDistance, Math.min(this.maxDistance, t));
  }
  //
  // event callbacks - update the object state
  //
  _handleMouseDownRotate(t) {
    this._rotateStart.set(t.clientX, t.clientY);
  }
  _handleMouseDownDolly(t) {
    this._updateZoomParameters(t.clientX, t.clientX), this._dollyStart.set(t.clientX, t.clientY);
  }
  _handleMouseDownPan(t) {
    this._panStart.set(t.clientX, t.clientY);
  }
  _handleMouseMoveRotate(t) {
    this._rotateEnd.set(t.clientX, t.clientY), this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const e = this.domElement;
    this._rotateLeft(Q * this._rotateDelta.x / e.clientHeight), this._rotateUp(Q * this._rotateDelta.y / e.clientHeight), this._rotateStart.copy(this._rotateEnd), this.update();
  }
  _handleMouseMoveDolly(t) {
    this._dollyEnd.set(t.clientX, t.clientY), this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart), this._dollyDelta.y > 0 ? this._dollyOut(this._getZoomScale(this._dollyDelta.y)) : this._dollyDelta.y < 0 && this._dollyIn(this._getZoomScale(this._dollyDelta.y)), this._dollyStart.copy(this._dollyEnd), this.update();
  }
  _handleMouseMovePan(t) {
    this._panEnd.set(t.clientX, t.clientY), this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd), this.update();
  }
  _handleMouseWheel(t) {
    this._updateZoomParameters(t.clientX, t.clientY), t.deltaY < 0 ? this._dollyIn(this._getZoomScale(t.deltaY)) : t.deltaY > 0 && this._dollyOut(this._getZoomScale(t.deltaY)), this.update();
  }
  _handleKeyDown(t) {
    let e = !1;
    switch (t.code) {
      case this.keys.UP:
        t.ctrlKey || t.metaKey || t.shiftKey ? this.enableRotate && this._rotateUp(Q * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(0, this.keyPanSpeed), e = !0;
        break;
      case this.keys.BOTTOM:
        t.ctrlKey || t.metaKey || t.shiftKey ? this.enableRotate && this._rotateUp(-Q * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(0, -this.keyPanSpeed), e = !0;
        break;
      case this.keys.LEFT:
        t.ctrlKey || t.metaKey || t.shiftKey ? this.enableRotate && this._rotateLeft(Q * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(this.keyPanSpeed, 0), e = !0;
        break;
      case this.keys.RIGHT:
        t.ctrlKey || t.metaKey || t.shiftKey ? this.enableRotate && this._rotateLeft(-Q * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(-this.keyPanSpeed, 0), e = !0;
        break;
    }
    e && (t.preventDefault(), this.update());
  }
  _handleTouchStartRotate(t) {
    if (this._pointers.length === 1)
      this._rotateStart.set(t.pageX, t.pageY);
    else {
      const e = this._getSecondPointerPosition(t), i = 0.5 * (t.pageX + e.x), s = 0.5 * (t.pageY + e.y);
      this._rotateStart.set(i, s);
    }
  }
  _handleTouchStartPan(t) {
    if (this._pointers.length === 1)
      this._panStart.set(t.pageX, t.pageY);
    else {
      const e = this._getSecondPointerPosition(t), i = 0.5 * (t.pageX + e.x), s = 0.5 * (t.pageY + e.y);
      this._panStart.set(i, s);
    }
  }
  _handleTouchStartDolly(t) {
    const e = this._getSecondPointerPosition(t), i = t.pageX - e.x, s = t.pageY - e.y, n = Math.sqrt(i * i + s * s);
    this._dollyStart.set(0, n);
  }
  _handleTouchStartDollyPan(t) {
    this.enableZoom && this._handleTouchStartDolly(t), this.enablePan && this._handleTouchStartPan(t);
  }
  _handleTouchStartDollyRotate(t) {
    this.enableZoom && this._handleTouchStartDolly(t), this.enableRotate && this._handleTouchStartRotate(t);
  }
  _handleTouchMoveRotate(t) {
    if (this._pointers.length == 1)
      this._rotateEnd.set(t.pageX, t.pageY);
    else {
      const i = this._getSecondPointerPosition(t), s = 0.5 * (t.pageX + i.x), n = 0.5 * (t.pageY + i.y);
      this._rotateEnd.set(s, n);
    }
    this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const e = this.domElement;
    this._rotateLeft(Q * this._rotateDelta.x / e.clientHeight), this._rotateUp(Q * this._rotateDelta.y / e.clientHeight), this._rotateStart.copy(this._rotateEnd);
  }
  _handleTouchMovePan(t) {
    if (this._pointers.length === 1)
      this._panEnd.set(t.pageX, t.pageY);
    else {
      const e = this._getSecondPointerPosition(t), i = 0.5 * (t.pageX + e.x), s = 0.5 * (t.pageY + e.y);
      this._panEnd.set(i, s);
    }
    this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd);
  }
  _handleTouchMoveDolly(t) {
    const e = this._getSecondPointerPosition(t), i = t.pageX - e.x, s = t.pageY - e.y, n = Math.sqrt(i * i + s * s);
    this._dollyEnd.set(0, n), this._dollyDelta.set(0, Math.pow(this._dollyEnd.y / this._dollyStart.y, this.zoomSpeed)), this._dollyOut(this._dollyDelta.y), this._dollyStart.copy(this._dollyEnd);
    const o = (t.pageX + e.x) * 0.5, a = (t.pageY + e.y) * 0.5;
    this._updateZoomParameters(o, a);
  }
  _handleTouchMoveDollyPan(t) {
    this.enableZoom && this._handleTouchMoveDolly(t), this.enablePan && this._handleTouchMovePan(t);
  }
  _handleTouchMoveDollyRotate(t) {
    this.enableZoom && this._handleTouchMoveDolly(t), this.enableRotate && this._handleTouchMoveRotate(t);
  }
  // pointers
  _addPointer(t) {
    this._pointers.push(t.pointerId);
  }
  _removePointer(t) {
    delete this._pointerPositions[t.pointerId];
    for (let e = 0; e < this._pointers.length; e++)
      if (this._pointers[e] == t.pointerId) {
        this._pointers.splice(e, 1);
        return;
      }
  }
  _isTrackingPointer(t) {
    for (let e = 0; e < this._pointers.length; e++)
      if (this._pointers[e] == t.pointerId) return !0;
    return !1;
  }
  _trackPointer(t) {
    let e = this._pointerPositions[t.pointerId];
    e === void 0 && (e = new tt(), this._pointerPositions[t.pointerId] = e), e.set(t.pageX, t.pageY);
  }
  _getSecondPointerPosition(t) {
    const e = t.pointerId === this._pointers[0] ? this._pointers[1] : this._pointers[0];
    return this._pointerPositions[e];
  }
  //
  _customWheelEvent(t) {
    const e = t.deltaMode, i = {
      clientX: t.clientX,
      clientY: t.clientY,
      deltaY: t.deltaY
    };
    switch (e) {
      case 1:
        i.deltaY *= 16;
        break;
      case 2:
        i.deltaY *= 100;
        break;
    }
    return t.ctrlKey && !this._controlActive && (i.deltaY *= 10), i;
  }
}
function wi(p) {
  this.enabled !== !1 && (this._pointers.length === 0 && (this.domElement.setPointerCapture(p.pointerId), this.domElement.addEventListener("pointermove", this._onPointerMove), this.domElement.addEventListener("pointerup", this._onPointerUp)), !this._isTrackingPointer(p) && (this._addPointer(p), p.pointerType === "touch" ? this._onTouchStart(p) : this._onMouseDown(p)));
}
function yi(p) {
  this.enabled !== !1 && (p.pointerType === "touch" ? this._onTouchMove(p) : this._onMouseMove(p));
}
function gi(p) {
  switch (this._removePointer(p), this._pointers.length) {
    case 0:
      this.domElement.releasePointerCapture(p.pointerId), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.dispatchEvent(Ie), this.state = N.NONE;
      break;
    case 1:
      const t = this._pointers[0], e = this._pointerPositions[t];
      this._onTouchStart({ pointerId: t, pageX: e.x, pageY: e.y });
      break;
  }
}
function xi(p) {
  let t;
  switch (p.button) {
    case 0:
      t = this.mouseButtons.LEFT;
      break;
    case 1:
      t = this.mouseButtons.MIDDLE;
      break;
    case 2:
      t = this.mouseButtons.RIGHT;
      break;
    default:
      t = -1;
  }
  switch (t) {
    case yt.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseDownDolly(p), this.state = N.DOLLY;
      break;
    case yt.ROTATE:
      if (p.ctrlKey || p.metaKey || p.shiftKey) {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(p), this.state = N.PAN;
      } else {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(p), this.state = N.ROTATE;
      }
      break;
    case yt.PAN:
      if (p.ctrlKey || p.metaKey || p.shiftKey) {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(p), this.state = N.ROTATE;
      } else {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(p), this.state = N.PAN;
      }
      break;
    default:
      this.state = N.NONE;
  }
  this.state !== N.NONE && this.dispatchEvent(ie);
}
function _i(p) {
  switch (this.state) {
    case N.ROTATE:
      if (this.enableRotate === !1) return;
      this._handleMouseMoveRotate(p);
      break;
    case N.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseMoveDolly(p);
      break;
    case N.PAN:
      if (this.enablePan === !1) return;
      this._handleMouseMovePan(p);
      break;
  }
}
function vi(p) {
  this.enabled === !1 || this.enableZoom === !1 || this.state !== N.NONE || (p.preventDefault(), this.dispatchEvent(ie), this._handleMouseWheel(this._customWheelEvent(p)), this.dispatchEvent(Ie));
}
function bi(p) {
  this.enabled !== !1 && this._handleKeyDown(p);
}
function Ei(p) {
  switch (this._trackPointer(p), this._pointers.length) {
    case 1:
      switch (this.touches.ONE) {
        case wt.ROTATE:
          if (this.enableRotate === !1) return;
          this._handleTouchStartRotate(p), this.state = N.TOUCH_ROTATE;
          break;
        case wt.PAN:
          if (this.enablePan === !1) return;
          this._handleTouchStartPan(p), this.state = N.TOUCH_PAN;
          break;
        default:
          this.state = N.NONE;
      }
      break;
    case 2:
      switch (this.touches.TWO) {
        case wt.DOLLY_PAN:
          if (this.enableZoom === !1 && this.enablePan === !1) return;
          this._handleTouchStartDollyPan(p), this.state = N.TOUCH_DOLLY_PAN;
          break;
        case wt.DOLLY_ROTATE:
          if (this.enableZoom === !1 && this.enableRotate === !1) return;
          this._handleTouchStartDollyRotate(p), this.state = N.TOUCH_DOLLY_ROTATE;
          break;
        default:
          this.state = N.NONE;
      }
      break;
    default:
      this.state = N.NONE;
  }
  this.state !== N.NONE && this.dispatchEvent(ie);
}
function Si(p) {
  switch (this._trackPointer(p), this.state) {
    case N.TOUCH_ROTATE:
      if (this.enableRotate === !1) return;
      this._handleTouchMoveRotate(p), this.update();
      break;
    case N.TOUCH_PAN:
      if (this.enablePan === !1) return;
      this._handleTouchMovePan(p), this.update();
      break;
    case N.TOUCH_DOLLY_PAN:
      if (this.enableZoom === !1 && this.enablePan === !1) return;
      this._handleTouchMoveDollyPan(p), this.update();
      break;
    case N.TOUCH_DOLLY_ROTATE:
      if (this.enableZoom === !1 && this.enableRotate === !1) return;
      this._handleTouchMoveDollyRotate(p), this.update();
      break;
    default:
      this.state = N.NONE;
  }
}
function Mi(p) {
  this.enabled !== !1 && p.preventDefault();
}
function Pi(p) {
  p.key === "Control" && (this._controlActive = !0, this.domElement.getRootNode().addEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
function Ai(p) {
  p.key === "Control" && (this._controlActive = !1, this.domElement.getRootNode().removeEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
class Le {
  constructor() {
    k(this, "controls");
  }
  action({ camera: t, renderer: e }) {
    this.controls = new mi(t, e.domElement), this.controls.update();
  }
  toggle(t, e) {
    this.controls || this.action(e), this.controls.enabled = t;
  }
  update() {
    var t;
    (t = this.controls) == null || t.update();
  }
}
class st {
  /**
   * A vector of length 9, containing all matrix elements.
   */
  /**
   * @param elements A vector of length 9, containing all matrix elements.
   */
  constructor(t) {
    t === void 0 && (t = [0, 0, 0, 0, 0, 0, 0, 0, 0]), this.elements = t;
  }
  /**
   * Sets the matrix to identity
   * @todo Should perhaps be renamed to `setIdentity()` to be more clear.
   * @todo Create another function that immediately creates an identity matrix eg. `eye()`
   */
  identity() {
    const t = this.elements;
    t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1;
  }
  /**
   * Set all elements to zero
   */
  setZero() {
    const t = this.elements;
    t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 0;
  }
  /**
   * Sets the matrix diagonal elements from a Vec3
   */
  setTrace(t) {
    const e = this.elements;
    e[0] = t.x, e[4] = t.y, e[8] = t.z;
  }
  /**
   * Gets the matrix diagonal elements
   */
  getTrace(t) {
    t === void 0 && (t = new r());
    const e = this.elements;
    return t.x = e[0], t.y = e[4], t.z = e[8], t;
  }
  /**
   * Matrix-Vector multiplication
   * @param v The vector to multiply with
   * @param target Optional, target to save the result in.
   */
  vmult(t, e) {
    e === void 0 && (e = new r());
    const i = this.elements, s = t.x, n = t.y, o = t.z;
    return e.x = i[0] * s + i[1] * n + i[2] * o, e.y = i[3] * s + i[4] * n + i[5] * o, e.z = i[6] * s + i[7] * n + i[8] * o, e;
  }
  /**
   * Matrix-scalar multiplication
   */
  smult(t) {
    for (let e = 0; e < this.elements.length; e++)
      this.elements[e] *= t;
  }
  /**
   * Matrix multiplication
   * @param matrix Matrix to multiply with from left side.
   */
  mmult(t, e) {
    e === void 0 && (e = new st());
    const i = this.elements, s = t.elements, n = e.elements, o = i[0], a = i[1], h = i[2], l = i[3], c = i[4], d = i[5], u = i[6], f = i[7], m = i[8], y = s[0], x = s[1], g = s[2], w = s[3], M = s[4], I = s[5], F = s[6], Y = s[7], X = s[8];
    return n[0] = o * y + a * w + h * F, n[1] = o * x + a * M + h * Y, n[2] = o * g + a * I + h * X, n[3] = l * y + c * w + d * F, n[4] = l * x + c * M + d * Y, n[5] = l * g + c * I + d * X, n[6] = u * y + f * w + m * F, n[7] = u * x + f * M + m * Y, n[8] = u * g + f * I + m * X, e;
  }
  /**
   * Scale each column of the matrix
   */
  scale(t, e) {
    e === void 0 && (e = new st());
    const i = this.elements, s = e.elements;
    for (let n = 0; n !== 3; n++)
      s[3 * n + 0] = t.x * i[3 * n + 0], s[3 * n + 1] = t.y * i[3 * n + 1], s[3 * n + 2] = t.z * i[3 * n + 2];
    return e;
  }
  /**
   * Solve Ax=b
   * @param b The right hand side
   * @param target Optional. Target vector to save in.
   * @return The solution x
   * @todo should reuse arrays
   */
  solve(t, e) {
    e === void 0 && (e = new r());
    const i = 3, s = 4, n = [];
    let o, a;
    for (o = 0; o < i * s; o++)
      n.push(0);
    for (o = 0; o < 3; o++)
      for (a = 0; a < 3; a++)
        n[o + s * a] = this.elements[o + 3 * a];
    n[3 + 4 * 0] = t.x, n[3 + 4 * 1] = t.y, n[3 + 4 * 2] = t.z;
    let h = 3;
    const l = h;
    let c;
    const d = 4;
    let u;
    do {
      if (o = l - h, n[o + s * o] === 0) {
        for (a = o + 1; a < l; a++)
          if (n[o + s * a] !== 0) {
            c = d;
            do
              u = d - c, n[u + s * o] += n[u + s * a];
            while (--c);
            break;
          }
      }
      if (n[o + s * o] !== 0)
        for (a = o + 1; a < l; a++) {
          const f = n[o + s * a] / n[o + s * o];
          c = d;
          do
            u = d - c, n[u + s * a] = u <= o ? 0 : n[u + s * a] - n[u + s * o] * f;
          while (--c);
        }
    } while (--h);
    if (e.z = n[2 * s + 3] / n[2 * s + 2], e.y = (n[1 * s + 3] - n[1 * s + 2] * e.z) / n[1 * s + 1], e.x = (n[0 * s + 3] - n[0 * s + 2] * e.z - n[0 * s + 1] * e.y) / n[0 * s + 0], isNaN(e.x) || isNaN(e.y) || isNaN(e.z) || e.x === 1 / 0 || e.y === 1 / 0 || e.z === 1 / 0)
      throw `Could not solve equation! Got x=[${e.toString()}], b=[${t.toString()}], A=[${this.toString()}]`;
    return e;
  }
  /**
   * Get an element in the matrix by index. Index starts at 0, not 1!!!
   * @param value If provided, the matrix element will be set to this value.
   */
  e(t, e, i) {
    if (i === void 0)
      return this.elements[e + 3 * t];
    this.elements[e + 3 * t] = i;
  }
  /**
   * Copy another matrix into this matrix object.
   */
  copy(t) {
    for (let e = 0; e < t.elements.length; e++)
      this.elements[e] = t.elements[e];
    return this;
  }
  /**
   * Returns a string representation of the matrix.
   */
  toString() {
    let t = "";
    const e = ",";
    for (let i = 0; i < 9; i++)
      t += this.elements[i] + e;
    return t;
  }
  /**
   * reverse the matrix
   * @param target Target matrix to save in.
   * @return The solution x
   */
  reverse(t) {
    t === void 0 && (t = new st());
    const e = 3, i = 6, s = zi;
    let n, o;
    for (n = 0; n < 3; n++)
      for (o = 0; o < 3; o++)
        s[n + i * o] = this.elements[n + 3 * o];
    s[3 + 6 * 0] = 1, s[3 + 6 * 1] = 0, s[3 + 6 * 2] = 0, s[4 + 6 * 0] = 0, s[4 + 6 * 1] = 1, s[4 + 6 * 2] = 0, s[5 + 6 * 0] = 0, s[5 + 6 * 1] = 0, s[5 + 6 * 2] = 1;
    let a = 3;
    const h = a;
    let l;
    const c = i;
    let d;
    do {
      if (n = h - a, s[n + i * n] === 0) {
        for (o = n + 1; o < h; o++)
          if (s[n + i * o] !== 0) {
            l = c;
            do
              d = c - l, s[d + i * n] += s[d + i * o];
            while (--l);
            break;
          }
      }
      if (s[n + i * n] !== 0)
        for (o = n + 1; o < h; o++) {
          const u = s[n + i * o] / s[n + i * n];
          l = c;
          do
            d = c - l, s[d + i * o] = d <= n ? 0 : s[d + i * o] - s[d + i * n] * u;
          while (--l);
        }
    } while (--a);
    n = 2;
    do {
      o = n - 1;
      do {
        const u = s[n + i * o] / s[n + i * n];
        l = i;
        do
          d = i - l, s[d + i * o] = s[d + i * o] - s[d + i * n] * u;
        while (--l);
      } while (o--);
    } while (--n);
    n = 2;
    do {
      const u = 1 / s[n + i * n];
      l = i;
      do
        d = i - l, s[d + i * n] = s[d + i * n] * u;
      while (--l);
    } while (n--);
    n = 2;
    do {
      o = 2;
      do {
        if (d = s[e + o + i * n], isNaN(d) || d === 1 / 0)
          throw `Could not reverse! A=[${this.toString()}]`;
        t.e(n, o, d);
      } while (o--);
    } while (n--);
    return t;
  }
  /**
   * Set the matrix from a quaterion
   */
  setRotationFromQuaternion(t) {
    const e = t.x, i = t.y, s = t.z, n = t.w, o = e + e, a = i + i, h = s + s, l = e * o, c = e * a, d = e * h, u = i * a, f = i * h, m = s * h, y = n * o, x = n * a, g = n * h, w = this.elements;
    return w[3 * 0 + 0] = 1 - (u + m), w[3 * 0 + 1] = c - g, w[3 * 0 + 2] = d + x, w[3 * 1 + 0] = c + g, w[3 * 1 + 1] = 1 - (l + m), w[3 * 1 + 2] = f - y, w[3 * 2 + 0] = d - x, w[3 * 2 + 1] = f + y, w[3 * 2 + 2] = 1 - (l + u), this;
  }
  /**
   * Transpose the matrix
   * @param target Optional. Where to store the result.
   * @return The target Mat3, or a new Mat3 if target was omitted.
   */
  transpose(t) {
    t === void 0 && (t = new st());
    const e = this.elements, i = t.elements;
    let s;
    return i[0] = e[0], i[4] = e[4], i[8] = e[8], s = e[1], i[1] = e[3], i[3] = s, s = e[2], i[2] = e[6], i[6] = s, s = e[5], i[5] = e[7], i[7] = s, t;
  }
}
const zi = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
class r {
  constructor(t, e, i) {
    t === void 0 && (t = 0), e === void 0 && (e = 0), i === void 0 && (i = 0), this.x = t, this.y = e, this.z = i;
  }
  /**
   * Vector cross product
   * @param target Optional target to save in.
   */
  cross(t, e) {
    e === void 0 && (e = new r());
    const i = t.x, s = t.y, n = t.z, o = this.x, a = this.y, h = this.z;
    return e.x = a * n - h * s, e.y = h * i - o * n, e.z = o * s - a * i, e;
  }
  /**
   * Set the vectors' 3 elements
   */
  set(t, e, i) {
    return this.x = t, this.y = e, this.z = i, this;
  }
  /**
   * Set all components of the vector to zero.
   */
  setZero() {
    this.x = this.y = this.z = 0;
  }
  /**
   * Vector addition
   */
  vadd(t, e) {
    if (e)
      e.x = t.x + this.x, e.y = t.y + this.y, e.z = t.z + this.z;
    else
      return new r(this.x + t.x, this.y + t.y, this.z + t.z);
  }
  /**
   * Vector subtraction
   * @param target Optional target to save in.
   */
  vsub(t, e) {
    if (e)
      e.x = this.x - t.x, e.y = this.y - t.y, e.z = this.z - t.z;
    else
      return new r(this.x - t.x, this.y - t.y, this.z - t.z);
  }
  /**
   * Get the cross product matrix a_cross from a vector, such that a x b = a_cross * b = c
   *
   * See {@link https://www8.cs.umu.se/kurser/TDBD24/VT06/lectures/Lecture6.pdf Umeå University Lecture}
   */
  crossmat() {
    return new st([0, -this.z, this.y, this.z, 0, -this.x, -this.y, this.x, 0]);
  }
  /**
   * Normalize the vector. Note that this changes the values in the vector.
    * @return Returns the norm of the vector
   */
  normalize() {
    const t = this.x, e = this.y, i = this.z, s = Math.sqrt(t * t + e * e + i * i);
    if (s > 0) {
      const n = 1 / s;
      this.x *= n, this.y *= n, this.z *= n;
    } else
      this.x = 0, this.y = 0, this.z = 0;
    return s;
  }
  /**
   * Get the version of this vector that is of length 1.
   * @param target Optional target to save in
   * @return Returns the unit vector
   */
  unit(t) {
    t === void 0 && (t = new r());
    const e = this.x, i = this.y, s = this.z;
    let n = Math.sqrt(e * e + i * i + s * s);
    return n > 0 ? (n = 1 / n, t.x = e * n, t.y = i * n, t.z = s * n) : (t.x = 1, t.y = 0, t.z = 0), t;
  }
  /**
   * Get the length of the vector
   */
  length() {
    const t = this.x, e = this.y, i = this.z;
    return Math.sqrt(t * t + e * e + i * i);
  }
  /**
   * Get the squared length of the vector.
   */
  lengthSquared() {
    return this.dot(this);
  }
  /**
   * Get distance from this point to another point
   */
  distanceTo(t) {
    const e = this.x, i = this.y, s = this.z, n = t.x, o = t.y, a = t.z;
    return Math.sqrt((n - e) * (n - e) + (o - i) * (o - i) + (a - s) * (a - s));
  }
  /**
   * Get squared distance from this point to another point
   */
  distanceSquared(t) {
    const e = this.x, i = this.y, s = this.z, n = t.x, o = t.y, a = t.z;
    return (n - e) * (n - e) + (o - i) * (o - i) + (a - s) * (a - s);
  }
  /**
   * Multiply all the components of the vector with a scalar.
   * @param target The vector to save the result in.
   */
  scale(t, e) {
    e === void 0 && (e = new r());
    const i = this.x, s = this.y, n = this.z;
    return e.x = t * i, e.y = t * s, e.z = t * n, e;
  }
  /**
   * Multiply the vector with an other vector, component-wise.
   * @param target The vector to save the result in.
   */
  vmul(t, e) {
    return e === void 0 && (e = new r()), e.x = t.x * this.x, e.y = t.y * this.y, e.z = t.z * this.z, e;
  }
  /**
   * Scale a vector and add it to this vector. Save the result in "target". (target = this + vector * scalar)
   * @param target The vector to save the result in.
   */
  addScaledVector(t, e, i) {
    return i === void 0 && (i = new r()), i.x = this.x + t * e.x, i.y = this.y + t * e.y, i.z = this.z + t * e.z, i;
  }
  /**
   * Calculate dot product
   * @param vector
   */
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z;
  }
  isZero() {
    return this.x === 0 && this.y === 0 && this.z === 0;
  }
  /**
   * Make the vector point in the opposite direction.
   * @param target Optional target to save in
   */
  negate(t) {
    return t === void 0 && (t = new r()), t.x = -this.x, t.y = -this.y, t.z = -this.z, t;
  }
  /**
   * Compute two artificial tangents to the vector
   * @param t1 Vector object to save the first tangent in
   * @param t2 Vector object to save the second tangent in
   */
  tangents(t, e) {
    const i = this.length();
    if (i > 0) {
      const s = Ti, n = 1 / i;
      s.set(this.x * n, this.y * n, this.z * n);
      const o = Ci;
      Math.abs(s.x) < 0.9 ? (o.set(1, 0, 0), s.cross(o, t)) : (o.set(0, 1, 0), s.cross(o, t)), s.cross(t, e);
    } else
      t.set(1, 0, 0), e.set(0, 1, 0);
  }
  /**
   * Converts to a more readable format
   */
  toString() {
    return `${this.x},${this.y},${this.z}`;
  }
  /**
   * Converts to an array
   */
  toArray() {
    return [this.x, this.y, this.z];
  }
  /**
   * Copies value of source to this vector.
   */
  copy(t) {
    return this.x = t.x, this.y = t.y, this.z = t.z, this;
  }
  /**
   * Do a linear interpolation between two vectors
   * @param t A number between 0 and 1. 0 will make this function return u, and 1 will make it return v. Numbers in between will generate a vector in between them.
   */
  lerp(t, e, i) {
    const s = this.x, n = this.y, o = this.z;
    i.x = s + (t.x - s) * e, i.y = n + (t.y - n) * e, i.z = o + (t.z - o) * e;
  }
  /**
   * Check if a vector equals is almost equal to another one.
   */
  almostEquals(t, e) {
    return e === void 0 && (e = 1e-6), !(Math.abs(this.x - t.x) > e || Math.abs(this.y - t.y) > e || Math.abs(this.z - t.z) > e);
  }
  /**
   * Check if a vector is almost zero
   */
  almostZero(t) {
    return t === void 0 && (t = 1e-6), !(Math.abs(this.x) > t || Math.abs(this.y) > t || Math.abs(this.z) > t);
  }
  /**
   * Check if the vector is anti-parallel to another vector.
   * @param precision Set to zero for exact comparisons
   */
  isAntiparallelTo(t, e) {
    return this.negate(pe), pe.almostEquals(t, e);
  }
  /**
   * Clone the vector
   */
  clone() {
    return new r(this.x, this.y, this.z);
  }
}
r.ZERO = new r(0, 0, 0);
r.UNIT_X = new r(1, 0, 0);
r.UNIT_Y = new r(0, 1, 0);
r.UNIT_Z = new r(0, 0, 1);
const Ti = new r(), Ci = new r(), pe = new r();
class J {
  /**
   * The lower bound of the bounding box
   */
  /**
   * The upper bound of the bounding box
   */
  constructor(t) {
    t === void 0 && (t = {}), this.lowerBound = new r(), this.upperBound = new r(), t.lowerBound && this.lowerBound.copy(t.lowerBound), t.upperBound && this.upperBound.copy(t.upperBound);
  }
  /**
   * Set the AABB bounds from a set of points.
   * @param points An array of Vec3's.
   * @return The self object
   */
  setFromPoints(t, e, i, s) {
    const n = this.lowerBound, o = this.upperBound, a = i;
    n.copy(t[0]), a && a.vmult(n, n), o.copy(n);
    for (let h = 1; h < t.length; h++) {
      let l = t[h];
      a && (a.vmult(l, ue), l = ue), l.x > o.x && (o.x = l.x), l.x < n.x && (n.x = l.x), l.y > o.y && (o.y = l.y), l.y < n.y && (n.y = l.y), l.z > o.z && (o.z = l.z), l.z < n.z && (n.z = l.z);
    }
    return e && (e.vadd(n, n), e.vadd(o, o)), s && (n.x -= s, n.y -= s, n.z -= s, o.x += s, o.y += s, o.z += s), this;
  }
  /**
   * Copy bounds from an AABB to this AABB
   * @param aabb Source to copy from
   * @return The this object, for chainability
   */
  copy(t) {
    return this.lowerBound.copy(t.lowerBound), this.upperBound.copy(t.upperBound), this;
  }
  /**
   * Clone an AABB
   */
  clone() {
    return new J().copy(this);
  }
  /**
   * Extend this AABB so that it covers the given AABB too.
   */
  extend(t) {
    this.lowerBound.x = Math.min(this.lowerBound.x, t.lowerBound.x), this.upperBound.x = Math.max(this.upperBound.x, t.upperBound.x), this.lowerBound.y = Math.min(this.lowerBound.y, t.lowerBound.y), this.upperBound.y = Math.max(this.upperBound.y, t.upperBound.y), this.lowerBound.z = Math.min(this.lowerBound.z, t.lowerBound.z), this.upperBound.z = Math.max(this.upperBound.z, t.upperBound.z);
  }
  /**
   * Returns true if the given AABB overlaps this AABB.
   */
  overlaps(t) {
    const e = this.lowerBound, i = this.upperBound, s = t.lowerBound, n = t.upperBound, o = s.x <= i.x && i.x <= n.x || e.x <= n.x && n.x <= i.x, a = s.y <= i.y && i.y <= n.y || e.y <= n.y && n.y <= i.y, h = s.z <= i.z && i.z <= n.z || e.z <= n.z && n.z <= i.z;
    return o && a && h;
  }
  // Mostly for debugging
  volume() {
    const t = this.lowerBound, e = this.upperBound;
    return (e.x - t.x) * (e.y - t.y) * (e.z - t.z);
  }
  /**
   * Returns true if the given AABB is fully contained in this AABB.
   */
  contains(t) {
    const e = this.lowerBound, i = this.upperBound, s = t.lowerBound, n = t.upperBound;
    return e.x <= s.x && i.x >= n.x && e.y <= s.y && i.y >= n.y && e.z <= s.z && i.z >= n.z;
  }
  getCorners(t, e, i, s, n, o, a, h) {
    const l = this.lowerBound, c = this.upperBound;
    t.copy(l), e.set(c.x, l.y, l.z), i.set(c.x, c.y, l.z), s.set(l.x, c.y, c.z), n.set(c.x, l.y, c.z), o.set(l.x, c.y, l.z), a.set(l.x, l.y, c.z), h.copy(c);
  }
  /**
   * Get the representation of an AABB in another frame.
   * @return The "target" AABB object.
   */
  toLocalFrame(t, e) {
    const i = fe, s = i[0], n = i[1], o = i[2], a = i[3], h = i[4], l = i[5], c = i[6], d = i[7];
    this.getCorners(s, n, o, a, h, l, c, d);
    for (let u = 0; u !== 8; u++) {
      const f = i[u];
      t.pointToLocal(f, f);
    }
    return e.setFromPoints(i);
  }
  /**
   * Get the representation of an AABB in the global frame.
   * @return The "target" AABB object.
   */
  toWorldFrame(t, e) {
    const i = fe, s = i[0], n = i[1], o = i[2], a = i[3], h = i[4], l = i[5], c = i[6], d = i[7];
    this.getCorners(s, n, o, a, h, l, c, d);
    for (let u = 0; u !== 8; u++) {
      const f = i[u];
      t.pointToWorld(f, f);
    }
    return e.setFromPoints(i);
  }
  /**
   * Check if the AABB is hit by a ray.
   */
  overlapsRay(t) {
    const {
      direction: e,
      from: i
    } = t, s = 1 / e.x, n = 1 / e.y, o = 1 / e.z, a = (this.lowerBound.x - i.x) * s, h = (this.upperBound.x - i.x) * s, l = (this.lowerBound.y - i.y) * n, c = (this.upperBound.y - i.y) * n, d = (this.lowerBound.z - i.z) * o, u = (this.upperBound.z - i.z) * o, f = Math.max(Math.max(Math.min(a, h), Math.min(l, c)), Math.min(d, u)), m = Math.min(Math.min(Math.max(a, h), Math.max(l, c)), Math.max(d, u));
    return !(m < 0 || f > m);
  }
}
const ue = new r(), fe = [new r(), new r(), new r(), new r(), new r(), new r(), new r(), new r()];
class Ii {
  /**
   * Add an event listener
   * @return The self object, for chainability.
   */
  addEventListener(t, e) {
    this._listeners === void 0 && (this._listeners = {});
    const i = this._listeners;
    return i[t] === void 0 && (i[t] = []), i[t].includes(e) || i[t].push(e), this;
  }
  /**
   * Check if an event listener is added
   */
  hasEventListener(t, e) {
    if (this._listeners === void 0)
      return !1;
    const i = this._listeners;
    return !!(i[t] !== void 0 && i[t].includes(e));
  }
  /**
   * Check if any event listener of the given type is added
   */
  hasAnyEventListener(t) {
    return this._listeners === void 0 ? !1 : this._listeners[t] !== void 0;
  }
  /**
   * Remove an event listener
   * @return The self object, for chainability.
   */
  removeEventListener(t, e) {
    if (this._listeners === void 0)
      return this;
    const i = this._listeners;
    if (i[t] === void 0)
      return this;
    const s = i[t].indexOf(e);
    return s !== -1 && i[t].splice(s, 1), this;
  }
  /**
   * Emit an event.
   * @return The self object, for chainability.
   */
  dispatchEvent(t) {
    if (this._listeners === void 0)
      return this;
    const i = this._listeners[t.type];
    if (i !== void 0) {
      t.target = this;
      for (let s = 0, n = i.length; s < n; s++)
        i[s].call(this, t);
    }
    return this;
  }
}
class j {
  constructor(t, e, i, s) {
    t === void 0 && (t = 0), e === void 0 && (e = 0), i === void 0 && (i = 0), s === void 0 && (s = 1), this.x = t, this.y = e, this.z = i, this.w = s;
  }
  /**
   * Set the value of the quaternion.
   */
  set(t, e, i, s) {
    return this.x = t, this.y = e, this.z = i, this.w = s, this;
  }
  /**
   * Convert to a readable format
   * @return "x,y,z,w"
   */
  toString() {
    return `${this.x},${this.y},${this.z},${this.w}`;
  }
  /**
   * Convert to an Array
   * @return [x, y, z, w]
   */
  toArray() {
    return [this.x, this.y, this.z, this.w];
  }
  /**
   * Set the quaternion components given an axis and an angle in radians.
   */
  setFromAxisAngle(t, e) {
    const i = Math.sin(e * 0.5);
    return this.x = t.x * i, this.y = t.y * i, this.z = t.z * i, this.w = Math.cos(e * 0.5), this;
  }
  /**
   * Converts the quaternion to [ axis, angle ] representation.
   * @param targetAxis A vector object to reuse for storing the axis.
   * @return An array, first element is the axis and the second is the angle in radians.
   */
  toAxisAngle(t) {
    t === void 0 && (t = new r()), this.normalize();
    const e = 2 * Math.acos(this.w), i = Math.sqrt(1 - this.w * this.w);
    return i < 1e-3 ? (t.x = this.x, t.y = this.y, t.z = this.z) : (t.x = this.x / i, t.y = this.y / i, t.z = this.z / i), [t, e];
  }
  /**
   * Set the quaternion value given two vectors. The resulting rotation will be the needed rotation to rotate u to v.
   */
  setFromVectors(t, e) {
    if (t.isAntiparallelTo(e)) {
      const i = Li, s = Di;
      t.tangents(i, s), this.setFromAxisAngle(i, Math.PI);
    } else {
      const i = t.cross(e);
      this.x = i.x, this.y = i.y, this.z = i.z, this.w = Math.sqrt(t.length() ** 2 * e.length() ** 2) + t.dot(e), this.normalize();
    }
    return this;
  }
  /**
   * Multiply the quaternion with an other quaternion.
   */
  mult(t, e) {
    e === void 0 && (e = new j());
    const i = this.x, s = this.y, n = this.z, o = this.w, a = t.x, h = t.y, l = t.z, c = t.w;
    return e.x = i * c + o * a + s * l - n * h, e.y = s * c + o * h + n * a - i * l, e.z = n * c + o * l + i * h - s * a, e.w = o * c - i * a - s * h - n * l, e;
  }
  /**
   * Get the inverse quaternion rotation.
   */
  inverse(t) {
    t === void 0 && (t = new j());
    const e = this.x, i = this.y, s = this.z, n = this.w;
    this.conjugate(t);
    const o = 1 / (e * e + i * i + s * s + n * n);
    return t.x *= o, t.y *= o, t.z *= o, t.w *= o, t;
  }
  /**
   * Get the quaternion conjugate
   */
  conjugate(t) {
    return t === void 0 && (t = new j()), t.x = -this.x, t.y = -this.y, t.z = -this.z, t.w = this.w, t;
  }
  /**
   * Normalize the quaternion. Note that this changes the values of the quaternion.
   */
  normalize() {
    let t = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    return t === 0 ? (this.x = 0, this.y = 0, this.z = 0, this.w = 0) : (t = 1 / t, this.x *= t, this.y *= t, this.z *= t, this.w *= t), this;
  }
  /**
   * Approximation of quaternion normalization. Works best when quat is already almost-normalized.
   * @author unphased, https://github.com/unphased
   */
  normalizeFast() {
    const t = (3 - (this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)) / 2;
    return t === 0 ? (this.x = 0, this.y = 0, this.z = 0, this.w = 0) : (this.x *= t, this.y *= t, this.z *= t, this.w *= t), this;
  }
  /**
   * Multiply the quaternion by a vector
   */
  vmult(t, e) {
    e === void 0 && (e = new r());
    const i = t.x, s = t.y, n = t.z, o = this.x, a = this.y, h = this.z, l = this.w, c = l * i + a * n - h * s, d = l * s + h * i - o * n, u = l * n + o * s - a * i, f = -o * i - a * s - h * n;
    return e.x = c * l + f * -o + d * -h - u * -a, e.y = d * l + f * -a + u * -o - c * -h, e.z = u * l + f * -h + c * -a - d * -o, e;
  }
  /**
   * Copies value of source to this quaternion.
   * @return this
   */
  copy(t) {
    return this.x = t.x, this.y = t.y, this.z = t.z, this.w = t.w, this;
  }
  /**
   * Convert the quaternion to euler angle representation. Order: YZX, as this page describes: https://www.euclideanspace.com/maths/standards/index.htm
   * @param order Three-character string, defaults to "YZX"
   */
  toEuler(t, e) {
    e === void 0 && (e = "YZX");
    let i, s, n;
    const o = this.x, a = this.y, h = this.z, l = this.w;
    switch (e) {
      case "YZX":
        const c = o * a + h * l;
        if (c > 0.499 && (i = 2 * Math.atan2(o, l), s = Math.PI / 2, n = 0), c < -0.499 && (i = -2 * Math.atan2(o, l), s = -Math.PI / 2, n = 0), i === void 0) {
          const d = o * o, u = a * a, f = h * h;
          i = Math.atan2(2 * a * l - 2 * o * h, 1 - 2 * u - 2 * f), s = Math.asin(2 * c), n = Math.atan2(2 * o * l - 2 * a * h, 1 - 2 * d - 2 * f);
        }
        break;
      default:
        throw new Error(`Euler order ${e} not supported yet.`);
    }
    t.y = i, t.z = s, t.x = n;
  }
  /**
   * Set the quaternion components given Euler angle representation.
   *
   * @param order The order to apply angles: 'XYZ' or 'YXZ' or any other combination.
   *
   * See {@link https://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors MathWorks} reference
   */
  setFromEuler(t, e, i, s) {
    s === void 0 && (s = "XYZ");
    const n = Math.cos(t / 2), o = Math.cos(e / 2), a = Math.cos(i / 2), h = Math.sin(t / 2), l = Math.sin(e / 2), c = Math.sin(i / 2);
    return s === "XYZ" ? (this.x = h * o * a + n * l * c, this.y = n * l * a - h * o * c, this.z = n * o * c + h * l * a, this.w = n * o * a - h * l * c) : s === "YXZ" ? (this.x = h * o * a + n * l * c, this.y = n * l * a - h * o * c, this.z = n * o * c - h * l * a, this.w = n * o * a + h * l * c) : s === "ZXY" ? (this.x = h * o * a - n * l * c, this.y = n * l * a + h * o * c, this.z = n * o * c + h * l * a, this.w = n * o * a - h * l * c) : s === "ZYX" ? (this.x = h * o * a - n * l * c, this.y = n * l * a + h * o * c, this.z = n * o * c - h * l * a, this.w = n * o * a + h * l * c) : s === "YZX" ? (this.x = h * o * a + n * l * c, this.y = n * l * a + h * o * c, this.z = n * o * c - h * l * a, this.w = n * o * a - h * l * c) : s === "XZY" && (this.x = h * o * a - n * l * c, this.y = n * l * a - h * o * c, this.z = n * o * c + h * l * a, this.w = n * o * a + h * l * c), this;
  }
  clone() {
    return new j(this.x, this.y, this.z, this.w);
  }
  /**
   * Performs a spherical linear interpolation between two quat
   *
   * @param toQuat second operand
   * @param t interpolation amount between the self quaternion and toQuat
   * @param target A quaternion to store the result in. If not provided, a new one will be created.
   * @returns {Quaternion} The "target" object
   */
  slerp(t, e, i) {
    i === void 0 && (i = new j());
    const s = this.x, n = this.y, o = this.z, a = this.w;
    let h = t.x, l = t.y, c = t.z, d = t.w, u, f, m, y, x;
    return f = s * h + n * l + o * c + a * d, f < 0 && (f = -f, h = -h, l = -l, c = -c, d = -d), 1 - f > 1e-6 ? (u = Math.acos(f), m = Math.sin(u), y = Math.sin((1 - e) * u) / m, x = Math.sin(e * u) / m) : (y = 1 - e, x = e), i.x = y * s + x * h, i.y = y * n + x * l, i.z = y * o + x * c, i.w = y * a + x * d, i;
  }
  /**
   * Rotate an absolute orientation quaternion given an angular velocity and a time step.
   */
  integrate(t, e, i, s) {
    s === void 0 && (s = new j());
    const n = t.x * i.x, o = t.y * i.y, a = t.z * i.z, h = this.x, l = this.y, c = this.z, d = this.w, u = e * 0.5;
    return s.x += u * (n * d + o * c - a * l), s.y += u * (o * d + a * h - n * c), s.z += u * (a * d + n * l - o * h), s.w += u * (-n * h - o * l - a * c), s;
  }
}
const Li = new r(), Di = new r(), Oi = {
  /** SPHERE */
  SPHERE: 1,
  /** PLANE */
  PLANE: 2,
  /** BOX */
  BOX: 4,
  /** COMPOUND */
  COMPOUND: 8,
  /** CONVEXPOLYHEDRON */
  CONVEXPOLYHEDRON: 16,
  /** HEIGHTFIELD */
  HEIGHTFIELD: 32,
  /** PARTICLE */
  PARTICLE: 64,
  /** CYLINDER */
  CYLINDER: 128,
  /** TRIMESH */
  TRIMESH: 256
};
class _ {
  /**
   * Identifier of the Shape.
   */
  /**
   * The type of this shape. Must be set to an int > 0 by subclasses.
   */
  /**
   * The local bounding sphere radius of this shape.
   */
  /**
   * Whether to produce contact forces when in contact with other bodies. Note that contacts will be generated, but they will be disabled.
   * @default true
   */
  /**
   * @default 1
   */
  /**
   * @default -1
   */
  /**
   * Optional material of the shape that regulates contact properties.
   */
  /**
   * The body to which the shape is added to.
   */
  /**
   * All the Shape types.
   */
  constructor(t) {
    t === void 0 && (t = {}), this.id = _.idCounter++, this.type = t.type || 0, this.boundingSphereRadius = 0, this.collisionResponse = t.collisionResponse ? t.collisionResponse : !0, this.collisionFilterGroup = t.collisionFilterGroup !== void 0 ? t.collisionFilterGroup : 1, this.collisionFilterMask = t.collisionFilterMask !== void 0 ? t.collisionFilterMask : -1, this.material = t.material ? t.material : null, this.body = null;
  }
  /**
   * Computes the bounding sphere radius.
   * The result is stored in the property `.boundingSphereRadius`
   */
  updateBoundingSphereRadius() {
    throw `computeBoundingSphereRadius() not implemented for shape type ${this.type}`;
  }
  /**
   * Get the volume of this shape
   */
  volume() {
    throw `volume() not implemented for shape type ${this.type}`;
  }
  /**
   * Calculates the inertia in the local frame for this shape.
   * @see http://en.wikipedia.org/wiki/List_of_moments_of_inertia
   */
  calculateLocalInertia(t, e) {
    throw `calculateLocalInertia() not implemented for shape type ${this.type}`;
  }
  /**
   * @todo use abstract for these kind of methods
   */
  calculateWorldAABB(t, e, i, s) {
    throw `calculateWorldAABB() not implemented for shape type ${this.type}`;
  }
}
_.idCounter = 0;
_.types = Oi;
class W {
  /**
   * position
   */
  /**
   * quaternion
   */
  constructor(t) {
    t === void 0 && (t = {}), this.position = new r(), this.quaternion = new j(), t.position && this.position.copy(t.position), t.quaternion && this.quaternion.copy(t.quaternion);
  }
  /**
   * Get a global point in local transform coordinates.
   */
  pointToLocal(t, e) {
    return W.pointToLocalFrame(this.position, this.quaternion, t, e);
  }
  /**
   * Get a local point in global transform coordinates.
   */
  pointToWorld(t, e) {
    return W.pointToWorldFrame(this.position, this.quaternion, t, e);
  }
  /**
   * vectorToWorldFrame
   */
  vectorToWorldFrame(t, e) {
    return e === void 0 && (e = new r()), this.quaternion.vmult(t, e), e;
  }
  /**
   * pointToLocalFrame
   */
  static pointToLocalFrame(t, e, i, s) {
    return s === void 0 && (s = new r()), i.vsub(t, s), e.conjugate(me), me.vmult(s, s), s;
  }
  /**
   * pointToWorldFrame
   */
  static pointToWorldFrame(t, e, i, s) {
    return s === void 0 && (s = new r()), e.vmult(i, s), s.vadd(t, s), s;
  }
  /**
   * vectorToWorldFrame
   */
  static vectorToWorldFrame(t, e, i) {
    return i === void 0 && (i = new r()), t.vmult(e, i), i;
  }
  /**
   * vectorToLocalFrame
   */
  static vectorToLocalFrame(t, e, i, s) {
    return s === void 0 && (s = new r()), e.w *= -1, e.vmult(i, s), e.w *= -1, s;
  }
}
const me = new j();
class At extends _ {
  /** vertices */
  /**
   * Array of integer arrays, indicating which vertices each face consists of
   */
  /** faceNormals */
  /** worldVertices */
  /** worldVerticesNeedsUpdate */
  /** worldFaceNormals */
  /** worldFaceNormalsNeedsUpdate */
  /**
   * If given, these locally defined, normalized axes are the only ones being checked when doing separating axis check.
   */
  /** uniqueEdges */
  /**
   * @param vertices An array of Vec3's
   * @param faces Array of integer arrays, describing which vertices that is included in each face.
   */
  constructor(t) {
    t === void 0 && (t = {});
    const {
      vertices: e = [],
      faces: i = [],
      normals: s = [],
      axes: n,
      boundingSphereRadius: o
    } = t;
    super({
      type: _.types.CONVEXPOLYHEDRON
    }), this.vertices = e, this.faces = i, this.faceNormals = s, this.faceNormals.length === 0 && this.computeNormals(), o ? this.boundingSphereRadius = o : this.updateBoundingSphereRadius(), this.worldVertices = [], this.worldVerticesNeedsUpdate = !0, this.worldFaceNormals = [], this.worldFaceNormalsNeedsUpdate = !0, this.uniqueAxes = n ? n.slice() : null, this.uniqueEdges = [], this.computeEdges();
  }
  /**
   * Computes uniqueEdges
   */
  computeEdges() {
    const t = this.faces, e = this.vertices, i = this.uniqueEdges;
    i.length = 0;
    const s = new r();
    for (let n = 0; n !== t.length; n++) {
      const o = t[n], a = o.length;
      for (let h = 0; h !== a; h++) {
        const l = (h + 1) % a;
        e[o[h]].vsub(e[o[l]], s), s.normalize();
        let c = !1;
        for (let d = 0; d !== i.length; d++)
          if (i[d].almostEquals(s) || i[d].almostEquals(s)) {
            c = !0;
            break;
          }
        c || i.push(s.clone());
      }
    }
  }
  /**
   * Compute the normals of the faces.
   * Will reuse existing Vec3 objects in the `faceNormals` array if they exist.
   */
  computeNormals() {
    this.faceNormals.length = this.faces.length;
    for (let t = 0; t < this.faces.length; t++) {
      for (let s = 0; s < this.faces[t].length; s++)
        if (!this.vertices[this.faces[t][s]])
          throw new Error(`Vertex ${this.faces[t][s]} not found!`);
      const e = this.faceNormals[t] || new r();
      this.getFaceNormal(t, e), e.negate(e), this.faceNormals[t] = e;
      const i = this.vertices[this.faces[t][0]];
      if (e.dot(i) < 0) {
        console.error(`.faceNormals[${t}] = Vec3(${e.toString()}) looks like it points into the shape? The vertices follow. Make sure they are ordered CCW around the normal, using the right hand rule.`);
        for (let s = 0; s < this.faces[t].length; s++)
          console.warn(`.vertices[${this.faces[t][s]}] = Vec3(${this.vertices[this.faces[t][s]].toString()})`);
      }
    }
  }
  /**
   * Compute the normal of a face from its vertices
   */
  getFaceNormal(t, e) {
    const i = this.faces[t], s = this.vertices[i[0]], n = this.vertices[i[1]], o = this.vertices[i[2]];
    At.computeNormal(s, n, o, e);
  }
  /**
   * Get face normal given 3 vertices
   */
  static computeNormal(t, e, i, s) {
    const n = new r(), o = new r();
    e.vsub(t, o), i.vsub(e, n), n.cross(o, s), s.isZero() || s.normalize();
  }
  /**
   * @param minDist Clamp distance
   * @param result The an array of contact point objects, see clipFaceAgainstHull
   */
  clipAgainstHull(t, e, i, s, n, o, a, h, l) {
    const c = new r();
    let d = -1, u = -Number.MAX_VALUE;
    for (let m = 0; m < i.faces.length; m++) {
      c.copy(i.faceNormals[m]), n.vmult(c, c);
      const y = c.dot(o);
      y > u && (u = y, d = m);
    }
    const f = [];
    for (let m = 0; m < i.faces[d].length; m++) {
      const y = i.vertices[i.faces[d][m]], x = new r();
      x.copy(y), n.vmult(x, x), s.vadd(x, x), f.push(x);
    }
    d >= 0 && this.clipFaceAgainstHull(o, t, e, f, a, h, l);
  }
  /**
   * Find the separating axis between this hull and another
   * @param target The target vector to save the axis in
   * @return Returns false if a separation is found, else true
   */
  findSeparatingAxis(t, e, i, s, n, o, a, h) {
    const l = new r(), c = new r(), d = new r(), u = new r(), f = new r(), m = new r();
    let y = Number.MAX_VALUE;
    const x = this;
    if (x.uniqueAxes)
      for (let g = 0; g !== x.uniqueAxes.length; g++) {
        i.vmult(x.uniqueAxes[g], l);
        const w = x.testSepAxis(l, t, e, i, s, n);
        if (w === !1)
          return !1;
        w < y && (y = w, o.copy(l));
      }
    else {
      const g = a ? a.length : x.faces.length;
      for (let w = 0; w < g; w++) {
        const M = a ? a[w] : w;
        l.copy(x.faceNormals[M]), i.vmult(l, l);
        const I = x.testSepAxis(l, t, e, i, s, n);
        if (I === !1)
          return !1;
        I < y && (y = I, o.copy(l));
      }
    }
    if (t.uniqueAxes)
      for (let g = 0; g !== t.uniqueAxes.length; g++) {
        n.vmult(t.uniqueAxes[g], c);
        const w = x.testSepAxis(c, t, e, i, s, n);
        if (w === !1)
          return !1;
        w < y && (y = w, o.copy(c));
      }
    else {
      const g = h ? h.length : t.faces.length;
      for (let w = 0; w < g; w++) {
        const M = h ? h[w] : w;
        c.copy(t.faceNormals[M]), n.vmult(c, c);
        const I = x.testSepAxis(c, t, e, i, s, n);
        if (I === !1)
          return !1;
        I < y && (y = I, o.copy(c));
      }
    }
    for (let g = 0; g !== x.uniqueEdges.length; g++) {
      i.vmult(x.uniqueEdges[g], u);
      for (let w = 0; w !== t.uniqueEdges.length; w++)
        if (n.vmult(t.uniqueEdges[w], f), u.cross(f, m), !m.almostZero()) {
          m.normalize();
          const M = x.testSepAxis(m, t, e, i, s, n);
          if (M === !1)
            return !1;
          M < y && (y = M, o.copy(m));
        }
    }
    return s.vsub(e, d), d.dot(o) > 0 && o.negate(o), !0;
  }
  /**
   * Test separating axis against two hulls. Both hulls are projected onto the axis and the overlap size is returned if there is one.
   * @return The overlap depth, or FALSE if no penetration.
   */
  testSepAxis(t, e, i, s, n, o) {
    const a = this;
    At.project(a, t, i, s, Vt), At.project(e, t, n, o, Zt);
    const h = Vt[0], l = Vt[1], c = Zt[0], d = Zt[1];
    if (h < d || c < l)
      return !1;
    const u = h - d, f = c - l;
    return u < f ? u : f;
  }
  /**
   * calculateLocalInertia
   */
  calculateLocalInertia(t, e) {
    const i = new r(), s = new r();
    this.computeLocalAABB(s, i);
    const n = i.x - s.x, o = i.y - s.y, a = i.z - s.z;
    e.x = 1 / 12 * t * (2 * o * 2 * o + 2 * a * 2 * a), e.y = 1 / 12 * t * (2 * n * 2 * n + 2 * a * 2 * a), e.z = 1 / 12 * t * (2 * o * 2 * o + 2 * n * 2 * n);
  }
  /**
   * @param face_i Index of the face
   */
  getPlaneConstantOfFace(t) {
    const e = this.faces[t], i = this.faceNormals[t], s = this.vertices[e[0]];
    return -i.dot(s);
  }
  /**
   * Clip a face against a hull.
   * @param worldVertsB1 An array of Vec3 with vertices in the world frame.
   * @param minDist Distance clamping
   * @param Array result Array to store resulting contact points in. Will be objects with properties: point, depth, normal. These are represented in world coordinates.
   */
  clipFaceAgainstHull(t, e, i, s, n, o, a) {
    const h = new r(), l = new r(), c = new r(), d = new r(), u = new r(), f = new r(), m = new r(), y = new r(), x = this, g = [], w = s, M = g;
    let I = -1, F = Number.MAX_VALUE;
    for (let E = 0; E < x.faces.length; E++) {
      h.copy(x.faceNormals[E]), i.vmult(h, h);
      const P = h.dot(t);
      P < F && (F = P, I = E);
    }
    if (I < 0)
      return;
    const Y = x.faces[I];
    Y.connectedFaces = [];
    for (let E = 0; E < x.faces.length; E++)
      for (let P = 0; P < x.faces[E].length; P++)
        /* Sharing a vertex*/
        Y.indexOf(x.faces[E][P]) !== -1 && /* Not the one we are looking for connections from */
        E !== I && /* Not already added */
        Y.connectedFaces.indexOf(E) === -1 && Y.connectedFaces.push(E);
    const X = Y.length;
    for (let E = 0; E < X; E++) {
      const P = x.vertices[Y[E]], z = x.vertices[Y[(E + 1) % X]];
      P.vsub(z, l), c.copy(l), i.vmult(c, c), e.vadd(c, c), d.copy(this.faceNormals[I]), i.vmult(d, d), e.vadd(d, d), c.cross(d, u), u.negate(u), f.copy(P), i.vmult(f, f), e.vadd(f, f);
      const T = Y.connectedFaces[E];
      m.copy(this.faceNormals[T]);
      const D = this.getPlaneConstantOfFace(T);
      y.copy(m), i.vmult(y, y);
      const L = D - y.dot(e);
      for (this.clipFaceAgainstPlane(w, M, y, L); w.length; )
        w.shift();
      for (; M.length; )
        w.push(M.shift());
    }
    m.copy(this.faceNormals[I]);
    const S = this.getPlaneConstantOfFace(I);
    y.copy(m), i.vmult(y, y);
    const b = S - y.dot(e);
    for (let E = 0; E < w.length; E++) {
      let P = y.dot(w[E]) + b;
      if (P <= n && (console.log(`clamped: depth=${P} to minDist=${n}`), P = n), P <= o) {
        const z = w[E];
        if (P <= 1e-6) {
          const T = {
            point: z,
            normal: y,
            depth: P
          };
          a.push(T);
        }
      }
    }
  }
  /**
   * Clip a face in a hull against the back of a plane.
   * @param planeConstant The constant in the mathematical plane equation
   */
  clipFaceAgainstPlane(t, e, i, s) {
    let n, o;
    const a = t.length;
    if (a < 2)
      return e;
    let h = t[t.length - 1], l = t[0];
    n = i.dot(h) + s;
    for (let c = 0; c < a; c++) {
      if (l = t[c], o = i.dot(l) + s, n < 0)
        if (o < 0) {
          const d = new r();
          d.copy(l), e.push(d);
        } else {
          const d = new r();
          h.lerp(l, n / (n - o), d), e.push(d);
        }
      else if (o < 0) {
        const d = new r();
        h.lerp(l, n / (n - o), d), e.push(d), e.push(l);
      }
      h = l, n = o;
    }
    return e;
  }
  /**
   * Updates `.worldVertices` and sets `.worldVerticesNeedsUpdate` to false.
   */
  computeWorldVertices(t, e) {
    for (; this.worldVertices.length < this.vertices.length; )
      this.worldVertices.push(new r());
    const i = this.vertices, s = this.worldVertices;
    for (let n = 0; n !== this.vertices.length; n++)
      e.vmult(i[n], s[n]), t.vadd(s[n], s[n]);
    this.worldVerticesNeedsUpdate = !1;
  }
  computeLocalAABB(t, e) {
    const i = this.vertices;
    t.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE), e.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
    for (let s = 0; s < this.vertices.length; s++) {
      const n = i[s];
      n.x < t.x ? t.x = n.x : n.x > e.x && (e.x = n.x), n.y < t.y ? t.y = n.y : n.y > e.y && (e.y = n.y), n.z < t.z ? t.z = n.z : n.z > e.z && (e.z = n.z);
    }
  }
  /**
   * Updates `worldVertices` and sets `worldVerticesNeedsUpdate` to false.
   */
  computeWorldFaceNormals(t) {
    const e = this.faceNormals.length;
    for (; this.worldFaceNormals.length < e; )
      this.worldFaceNormals.push(new r());
    const i = this.faceNormals, s = this.worldFaceNormals;
    for (let n = 0; n !== e; n++)
      t.vmult(i[n], s[n]);
    this.worldFaceNormalsNeedsUpdate = !1;
  }
  /**
   * updateBoundingSphereRadius
   */
  updateBoundingSphereRadius() {
    let t = 0;
    const e = this.vertices;
    for (let i = 0; i !== e.length; i++) {
      const s = e[i].lengthSquared();
      s > t && (t = s);
    }
    this.boundingSphereRadius = Math.sqrt(t);
  }
  /**
   * calculateWorldAABB
   */
  calculateWorldAABB(t, e, i, s) {
    const n = this.vertices;
    let o, a, h, l, c, d, u = new r();
    for (let f = 0; f < n.length; f++) {
      u.copy(n[f]), e.vmult(u, u), t.vadd(u, u);
      const m = u;
      (o === void 0 || m.x < o) && (o = m.x), (l === void 0 || m.x > l) && (l = m.x), (a === void 0 || m.y < a) && (a = m.y), (c === void 0 || m.y > c) && (c = m.y), (h === void 0 || m.z < h) && (h = m.z), (d === void 0 || m.z > d) && (d = m.z);
    }
    i.set(o, a, h), s.set(l, c, d);
  }
  /**
   * Get approximate convex volume
   */
  volume() {
    return 4 * Math.PI * this.boundingSphereRadius / 3;
  }
  /**
   * Get an average of all the vertices positions
   */
  getAveragePointLocal(t) {
    t === void 0 && (t = new r());
    const e = this.vertices;
    for (let i = 0; i < e.length; i++)
      t.vadd(e[i], t);
    return t.scale(1 / e.length, t), t;
  }
  /**
   * Transform all local points. Will change the .vertices
   */
  transformAllPoints(t, e) {
    const i = this.vertices.length, s = this.vertices;
    if (e) {
      for (let n = 0; n < i; n++) {
        const o = s[n];
        e.vmult(o, o);
      }
      for (let n = 0; n < this.faceNormals.length; n++) {
        const o = this.faceNormals[n];
        e.vmult(o, o);
      }
    }
    if (t)
      for (let n = 0; n < i; n++) {
        const o = s[n];
        o.vadd(t, o);
      }
  }
  /**
   * Checks whether p is inside the polyhedra. Must be in local coords.
   * The point lies outside of the convex hull of the other points if and only if the direction
   * of all the vectors from it to those other points are on less than one half of a sphere around it.
   * @param p A point given in local coordinates
   */
  pointIsInside(t) {
    const e = this.vertices, i = this.faces, s = this.faceNormals, n = null, o = new r();
    this.getAveragePointLocal(o);
    for (let a = 0; a < this.faces.length; a++) {
      let h = s[a];
      const l = e[i[a][0]], c = new r();
      t.vsub(l, c);
      const d = h.dot(c), u = new r();
      o.vsub(l, u);
      const f = h.dot(u);
      if (d < 0 && f > 0 || d > 0 && f < 0)
        return !1;
    }
    return n ? 1 : -1;
  }
  /**
   * Get max and min dot product of a convex hull at position (pos,quat) projected onto an axis.
   * Results are saved in the array maxmin.
   * @param result result[0] and result[1] will be set to maximum and minimum, respectively.
   */
  static project(t, e, i, s, n) {
    const o = t.vertices.length, a = ki;
    let h = 0, l = 0;
    const c = Ni, d = t.vertices;
    c.setZero(), W.vectorToLocalFrame(i, s, e, a), W.pointToLocalFrame(i, s, c, c);
    const u = c.dot(a);
    l = h = d[0].dot(a);
    for (let f = 1; f < o; f++) {
      const m = d[f].dot(a);
      m > h && (h = m), m < l && (l = m);
    }
    if (l -= u, h -= u, l > h) {
      const f = l;
      l = h, h = f;
    }
    n[0] = h, n[1] = l;
  }
}
const Vt = [], Zt = [];
new r();
const ki = new r(), Ni = new r();
class se extends _ {
  /**
   * The half extents of the box.
   */
  /**
   * Used by the contact generator to make contacts with other convex polyhedra for example.
   */
  constructor(t) {
    super({
      type: _.types.BOX
    }), this.halfExtents = t, this.convexPolyhedronRepresentation = null, this.updateConvexPolyhedronRepresentation(), this.updateBoundingSphereRadius();
  }
  /**
   * Updates the local convex polyhedron representation used for some collisions.
   */
  updateConvexPolyhedronRepresentation() {
    const t = this.halfExtents.x, e = this.halfExtents.y, i = this.halfExtents.z, s = r, n = [new s(-t, -e, -i), new s(t, -e, -i), new s(t, e, -i), new s(-t, e, -i), new s(-t, -e, i), new s(t, -e, i), new s(t, e, i), new s(-t, e, i)], o = [
      [3, 2, 1, 0],
      // -z
      [4, 5, 6, 7],
      // +z
      [5, 4, 0, 1],
      // -y
      [2, 3, 7, 6],
      // +y
      [0, 4, 7, 3],
      // -x
      [1, 2, 6, 5]
      // +x
    ], a = [new s(0, 0, 1), new s(0, 1, 0), new s(1, 0, 0)], h = new At({
      vertices: n,
      faces: o,
      axes: a
    });
    this.convexPolyhedronRepresentation = h, h.material = this.material;
  }
  /**
   * Calculate the inertia of the box.
   */
  calculateLocalInertia(t, e) {
    return e === void 0 && (e = new r()), se.calculateInertia(this.halfExtents, t, e), e;
  }
  static calculateInertia(t, e, i) {
    const s = t;
    i.x = 1 / 12 * e * (2 * s.y * 2 * s.y + 2 * s.z * 2 * s.z), i.y = 1 / 12 * e * (2 * s.x * 2 * s.x + 2 * s.z * 2 * s.z), i.z = 1 / 12 * e * (2 * s.y * 2 * s.y + 2 * s.x * 2 * s.x);
  }
  /**
   * Get the box 6 side normals
   * @param sixTargetVectors An array of 6 vectors, to store the resulting side normals in.
   * @param quat Orientation to apply to the normal vectors. If not provided, the vectors will be in respect to the local frame.
   */
  getSideNormals(t, e) {
    const i = t, s = this.halfExtents;
    if (i[0].set(s.x, 0, 0), i[1].set(0, s.y, 0), i[2].set(0, 0, s.z), i[3].set(-s.x, 0, 0), i[4].set(0, -s.y, 0), i[5].set(0, 0, -s.z), e !== void 0)
      for (let n = 0; n !== i.length; n++)
        e.vmult(i[n], i[n]);
    return i;
  }
  /**
   * Returns the volume of the box.
   */
  volume() {
    return 8 * this.halfExtents.x * this.halfExtents.y * this.halfExtents.z;
  }
  /**
   * updateBoundingSphereRadius
   */
  updateBoundingSphereRadius() {
    this.boundingSphereRadius = this.halfExtents.length();
  }
  /**
   * forEachWorldCorner
   */
  forEachWorldCorner(t, e, i) {
    const s = this.halfExtents, n = [[s.x, s.y, s.z], [-s.x, s.y, s.z], [-s.x, -s.y, s.z], [-s.x, -s.y, -s.z], [s.x, -s.y, -s.z], [s.x, s.y, -s.z], [-s.x, s.y, -s.z], [s.x, -s.y, s.z]];
    for (let o = 0; o < n.length; o++)
      ct.set(n[o][0], n[o][1], n[o][2]), e.vmult(ct, ct), t.vadd(ct, ct), i(ct.x, ct.y, ct.z);
  }
  /**
   * calculateWorldAABB
   */
  calculateWorldAABB(t, e, i, s) {
    const n = this.halfExtents;
    nt[0].set(n.x, n.y, n.z), nt[1].set(-n.x, n.y, n.z), nt[2].set(-n.x, -n.y, n.z), nt[3].set(-n.x, -n.y, -n.z), nt[4].set(n.x, -n.y, -n.z), nt[5].set(n.x, n.y, -n.z), nt[6].set(-n.x, n.y, -n.z), nt[7].set(n.x, -n.y, n.z);
    const o = nt[0];
    e.vmult(o, o), t.vadd(o, o), s.copy(o), i.copy(o);
    for (let a = 1; a < 8; a++) {
      const h = nt[a];
      e.vmult(h, h), t.vadd(h, h);
      const l = h.x, c = h.y, d = h.z;
      l > s.x && (s.x = l), c > s.y && (s.y = c), d > s.z && (s.z = d), l < i.x && (i.x = l), c < i.y && (i.y = c), d < i.z && (i.z = d);
    }
  }
}
const ct = new r(), nt = [new r(), new r(), new r(), new r(), new r(), new r(), new r(), new r()], ne = {
  /** DYNAMIC */
  DYNAMIC: 1,
  /** STATIC */
  STATIC: 2,
  /** KINEMATIC */
  KINEMATIC: 4
}, oe = {
  /** AWAKE */
  AWAKE: 0,
  /** SLEEPY */
  SLEEPY: 1,
  /** SLEEPING */
  SLEEPING: 2
};
class A extends Ii {
  /**
   * Dispatched after two bodies collide. This event is dispatched on each
   * of the two bodies involved in the collision.
   * @event collide
   * @param body The body that was involved in the collision.
   * @param contact The details of the collision.
   */
  /**
   * A dynamic body is fully simulated. Can be moved manually by the user, but normally they move according to forces. A dynamic body can collide with all body types. A dynamic body always has finite, non-zero mass.
   */
  /**
   * A static body does not move during simulation and behaves as if it has infinite mass. Static bodies can be moved manually by setting the position of the body. The velocity of a static body is always zero. Static bodies do not collide with other static or kinematic bodies.
   */
  /**
   * A kinematic body moves under simulation according to its velocity. They do not respond to forces. They can be moved manually, but normally a kinematic body is moved by setting its velocity. A kinematic body behaves as if it has infinite mass. Kinematic bodies do not collide with other static or kinematic bodies.
   */
  /**
   * AWAKE
   */
  /**
   * SLEEPY
   */
  /**
   * SLEEPING
   */
  /**
   * Dispatched after a sleeping body has woken up.
   * @event wakeup
   */
  /**
   * Dispatched after a body has gone in to the sleepy state.
   * @event sleepy
   */
  /**
   * Dispatched after a body has fallen asleep.
   * @event sleep
   */
  constructor(t) {
    t === void 0 && (t = {}), super(), this.id = A.idCounter++, this.index = -1, this.world = null, this.vlambda = new r(), this.collisionFilterGroup = typeof t.collisionFilterGroup == "number" ? t.collisionFilterGroup : 1, this.collisionFilterMask = typeof t.collisionFilterMask == "number" ? t.collisionFilterMask : -1, this.collisionResponse = typeof t.collisionResponse == "boolean" ? t.collisionResponse : !0, this.position = new r(), this.previousPosition = new r(), this.interpolatedPosition = new r(), this.initPosition = new r(), t.position && (this.position.copy(t.position), this.previousPosition.copy(t.position), this.interpolatedPosition.copy(t.position), this.initPosition.copy(t.position)), this.velocity = new r(), t.velocity && this.velocity.copy(t.velocity), this.initVelocity = new r(), this.force = new r();
    const e = typeof t.mass == "number" ? t.mass : 0;
    this.mass = e, this.invMass = e > 0 ? 1 / e : 0, this.material = t.material || null, this.linearDamping = typeof t.linearDamping == "number" ? t.linearDamping : 0.01, this.type = e <= 0 ? A.STATIC : A.DYNAMIC, typeof t.type == typeof A.STATIC && (this.type = t.type), this.allowSleep = typeof t.allowSleep < "u" ? t.allowSleep : !0, this.sleepState = A.AWAKE, this.sleepSpeedLimit = typeof t.sleepSpeedLimit < "u" ? t.sleepSpeedLimit : 0.1, this.sleepTimeLimit = typeof t.sleepTimeLimit < "u" ? t.sleepTimeLimit : 1, this.timeLastSleepy = 0, this.wakeUpAfterNarrowphase = !1, this.torque = new r(), this.quaternion = new j(), this.initQuaternion = new j(), this.previousQuaternion = new j(), this.interpolatedQuaternion = new j(), t.quaternion && (this.quaternion.copy(t.quaternion), this.initQuaternion.copy(t.quaternion), this.previousQuaternion.copy(t.quaternion), this.interpolatedQuaternion.copy(t.quaternion)), this.angularVelocity = new r(), t.angularVelocity && this.angularVelocity.copy(t.angularVelocity), this.initAngularVelocity = new r(), this.shapes = [], this.shapeOffsets = [], this.shapeOrientations = [], this.inertia = new r(), this.invInertia = new r(), this.invInertiaWorld = new st(), this.invMassSolve = 0, this.invInertiaSolve = new r(), this.invInertiaWorldSolve = new st(), this.fixedRotation = typeof t.fixedRotation < "u" ? t.fixedRotation : !1, this.angularDamping = typeof t.angularDamping < "u" ? t.angularDamping : 0.01, this.linearFactor = new r(1, 1, 1), t.linearFactor && this.linearFactor.copy(t.linearFactor), this.angularFactor = new r(1, 1, 1), t.angularFactor && this.angularFactor.copy(t.angularFactor), this.aabb = new J(), this.aabbNeedsUpdate = !0, this.boundingRadius = 0, this.wlambda = new r(), this.isTrigger = !!t.isTrigger, t.shape && this.addShape(t.shape), this.updateMassProperties();
  }
  /**
   * Wake the body up.
   */
  wakeUp() {
    const t = this.sleepState;
    this.sleepState = A.AWAKE, this.wakeUpAfterNarrowphase = !1, t === A.SLEEPING && this.dispatchEvent(A.wakeupEvent);
  }
  /**
   * Force body sleep
   */
  sleep() {
    this.sleepState = A.SLEEPING, this.velocity.set(0, 0, 0), this.angularVelocity.set(0, 0, 0), this.wakeUpAfterNarrowphase = !1;
  }
  /**
   * Called every timestep to update internal sleep timer and change sleep state if needed.
   * @param time The world time in seconds
   */
  sleepTick(t) {
    if (this.allowSleep) {
      const e = this.sleepState, i = this.velocity.lengthSquared() + this.angularVelocity.lengthSquared(), s = this.sleepSpeedLimit ** 2;
      e === A.AWAKE && i < s ? (this.sleepState = A.SLEEPY, this.timeLastSleepy = t, this.dispatchEvent(A.sleepyEvent)) : e === A.SLEEPY && i > s ? this.wakeUp() : e === A.SLEEPY && t - this.timeLastSleepy > this.sleepTimeLimit && (this.sleep(), this.dispatchEvent(A.sleepEvent));
    }
  }
  /**
   * If the body is sleeping, it should be immovable / have infinite mass during solve. We solve it by having a separate "solve mass".
   */
  updateSolveMassProperties() {
    this.sleepState === A.SLEEPING || this.type === A.KINEMATIC ? (this.invMassSolve = 0, this.invInertiaSolve.setZero(), this.invInertiaWorldSolve.setZero()) : (this.invMassSolve = this.invMass, this.invInertiaSolve.copy(this.invInertia), this.invInertiaWorldSolve.copy(this.invInertiaWorld));
  }
  /**
   * Convert a world point to local body frame.
   */
  pointToLocalFrame(t, e) {
    return e === void 0 && (e = new r()), t.vsub(this.position, e), this.quaternion.conjugate().vmult(e, e), e;
  }
  /**
   * Convert a world vector to local body frame.
   */
  vectorToLocalFrame(t, e) {
    return e === void 0 && (e = new r()), this.quaternion.conjugate().vmult(t, e), e;
  }
  /**
   * Convert a local body point to world frame.
   */
  pointToWorldFrame(t, e) {
    return e === void 0 && (e = new r()), this.quaternion.vmult(t, e), e.vadd(this.position, e), e;
  }
  /**
   * Convert a local body point to world frame.
   */
  vectorToWorldFrame(t, e) {
    return e === void 0 && (e = new r()), this.quaternion.vmult(t, e), e;
  }
  /**
   * Add a shape to the body with a local offset and orientation.
   * @return The body object, for chainability.
   */
  addShape(t, e, i) {
    const s = new r(), n = new j();
    return e && s.copy(e), i && n.copy(i), this.shapes.push(t), this.shapeOffsets.push(s), this.shapeOrientations.push(n), this.updateMassProperties(), this.updateBoundingRadius(), this.aabbNeedsUpdate = !0, t.body = this, this;
  }
  /**
   * Remove a shape from the body.
   * @return The body object, for chainability.
   */
  removeShape(t) {
    const e = this.shapes.indexOf(t);
    return e === -1 ? (console.warn("Shape does not belong to the body"), this) : (this.shapes.splice(e, 1), this.shapeOffsets.splice(e, 1), this.shapeOrientations.splice(e, 1), this.updateMassProperties(), this.updateBoundingRadius(), this.aabbNeedsUpdate = !0, t.body = null, this);
  }
  /**
   * Update the bounding radius of the body. Should be done if any of the shapes are changed.
   */
  updateBoundingRadius() {
    const t = this.shapes, e = this.shapeOffsets, i = t.length;
    let s = 0;
    for (let n = 0; n !== i; n++) {
      const o = t[n];
      o.updateBoundingSphereRadius();
      const a = e[n].length(), h = o.boundingSphereRadius;
      a + h > s && (s = a + h);
    }
    this.boundingRadius = s;
  }
  /**
   * Updates the .aabb
   */
  updateAABB() {
    const t = this.shapes, e = this.shapeOffsets, i = this.shapeOrientations, s = t.length, n = Fi, o = Ri, a = this.quaternion, h = this.aabb, l = Yi;
    for (let c = 0; c !== s; c++) {
      const d = t[c];
      a.vmult(e[c], n), n.vadd(this.position, n), a.mult(i[c], o), d.calculateWorldAABB(n, o, l.lowerBound, l.upperBound), c === 0 ? h.copy(l) : h.extend(l);
    }
    this.aabbNeedsUpdate = !1;
  }
  /**
   * Update `.inertiaWorld` and `.invInertiaWorld`
   */
  updateInertiaWorld(t) {
    const e = this.invInertia;
    if (!(e.x === e.y && e.y === e.z && !t)) {
      const i = $i, s = Hi;
      i.setRotationFromQuaternion(this.quaternion), i.transpose(s), i.scale(e, i), i.mmult(s, this.invInertiaWorld);
    }
  }
  /**
   * Apply force to a point of the body. This could for example be a point on the Body surface.
   * Applying force this way will add to Body.force and Body.torque.
   * @param force The amount of force to add.
   * @param relativePoint A point relative to the center of mass to apply the force on.
   */
  applyForce(t, e) {
    if (e === void 0 && (e = new r()), this.type !== A.DYNAMIC)
      return;
    this.sleepState === A.SLEEPING && this.wakeUp();
    const i = ji;
    e.cross(t, i), this.force.vadd(t, this.force), this.torque.vadd(i, this.torque);
  }
  /**
   * Apply force to a local point in the body.
   * @param force The force vector to apply, defined locally in the body frame.
   * @param localPoint A local point in the body to apply the force on.
   */
  applyLocalForce(t, e) {
    if (e === void 0 && (e = new r()), this.type !== A.DYNAMIC)
      return;
    const i = Bi, s = Vi;
    this.vectorToWorldFrame(t, i), this.vectorToWorldFrame(e, s), this.applyForce(i, s);
  }
  /**
   * Apply torque to the body.
   * @param torque The amount of torque to add.
   */
  applyTorque(t) {
    this.type === A.DYNAMIC && (this.sleepState === A.SLEEPING && this.wakeUp(), this.torque.vadd(t, this.torque));
  }
  /**
   * Apply impulse to a point of the body. This could for example be a point on the Body surface.
   * An impulse is a force added to a body during a short period of time (impulse = force * time).
   * Impulses will be added to Body.velocity and Body.angularVelocity.
   * @param impulse The amount of impulse to add.
   * @param relativePoint A point relative to the center of mass to apply the force on.
   */
  applyImpulse(t, e) {
    if (e === void 0 && (e = new r()), this.type !== A.DYNAMIC)
      return;
    this.sleepState === A.SLEEPING && this.wakeUp();
    const i = e, s = Zi;
    s.copy(t), s.scale(this.invMass, s), this.velocity.vadd(s, this.velocity);
    const n = Wi;
    i.cross(t, n), this.invInertiaWorld.vmult(n, n), this.angularVelocity.vadd(n, this.angularVelocity);
  }
  /**
   * Apply locally-defined impulse to a local point in the body.
   * @param force The force vector to apply, defined locally in the body frame.
   * @param localPoint A local point in the body to apply the force on.
   */
  applyLocalImpulse(t, e) {
    if (e === void 0 && (e = new r()), this.type !== A.DYNAMIC)
      return;
    const i = Ui, s = qi;
    this.vectorToWorldFrame(t, i), this.vectorToWorldFrame(e, s), this.applyImpulse(i, s);
  }
  /**
   * Should be called whenever you change the body shape or mass.
   */
  updateMassProperties() {
    const t = Gi;
    this.invMass = this.mass > 0 ? 1 / this.mass : 0;
    const e = this.inertia, i = this.fixedRotation;
    this.updateAABB(), t.set((this.aabb.upperBound.x - this.aabb.lowerBound.x) / 2, (this.aabb.upperBound.y - this.aabb.lowerBound.y) / 2, (this.aabb.upperBound.z - this.aabb.lowerBound.z) / 2), se.calculateInertia(t, this.mass, e), this.invInertia.set(e.x > 0 && !i ? 1 / e.x : 0, e.y > 0 && !i ? 1 / e.y : 0, e.z > 0 && !i ? 1 / e.z : 0), this.updateInertiaWorld(!0);
  }
  /**
   * Get world velocity of a point in the body.
   * @param worldPoint
   * @param result
   * @return The result vector.
   */
  getVelocityAtWorldPoint(t, e) {
    const i = new r();
    return t.vsub(this.position, i), this.angularVelocity.cross(i, e), this.velocity.vadd(e, e), e;
  }
  /**
   * Move the body forward in time.
   * @param dt Time step
   * @param quatNormalize Set to true to normalize the body quaternion
   * @param quatNormalizeFast If the quaternion should be normalized using "fast" quaternion normalization
   */
  integrate(t, e, i) {
    if (this.previousPosition.copy(this.position), this.previousQuaternion.copy(this.quaternion), !(this.type === A.DYNAMIC || this.type === A.KINEMATIC) || this.sleepState === A.SLEEPING)
      return;
    const s = this.velocity, n = this.angularVelocity, o = this.position, a = this.force, h = this.torque, l = this.quaternion, c = this.invMass, d = this.invInertiaWorld, u = this.linearFactor, f = c * t;
    s.x += a.x * f * u.x, s.y += a.y * f * u.y, s.z += a.z * f * u.z;
    const m = d.elements, y = this.angularFactor, x = h.x * y.x, g = h.y * y.y, w = h.z * y.z;
    n.x += t * (m[0] * x + m[1] * g + m[2] * w), n.y += t * (m[3] * x + m[4] * g + m[5] * w), n.z += t * (m[6] * x + m[7] * g + m[8] * w), o.x += s.x * t, o.y += s.y * t, o.z += s.z * t, l.integrate(this.angularVelocity, t, this.angularFactor, l), e && (i ? l.normalizeFast() : l.normalize()), this.aabbNeedsUpdate = !0, this.updateInertiaWorld();
  }
}
A.idCounter = 0;
A.COLLIDE_EVENT_NAME = "collide";
A.DYNAMIC = ne.DYNAMIC;
A.STATIC = ne.STATIC;
A.KINEMATIC = ne.KINEMATIC;
A.AWAKE = oe.AWAKE;
A.SLEEPY = oe.SLEEPY;
A.SLEEPING = oe.SLEEPING;
A.wakeupEvent = {
  type: "wakeup"
};
A.sleepyEvent = {
  type: "sleepy"
};
A.sleepEvent = {
  type: "sleep"
};
const Fi = new r(), Ri = new j(), Yi = new J(), $i = new st(), Hi = new st(), Xi = new st(), ji = new r(), Bi = new r(), Vi = new r(), Zi = new r(), Wi = new r(), Ui = new r(), qi = new r(), Gi = new r();
new r();
new r();
new j();
new r();
new r();
new r();
new r();
class ee {
  /**
   * rayFromWorld
   */
  /**
   * rayToWorld
   */
  /**
   * hitNormalWorld
   */
  /**
   * hitPointWorld
   */
  /**
   * hasHit
   */
  /**
   * shape
   */
  /**
   * body
   */
  /**
   * The index of the hit triangle, if the hit shape was a trimesh
   */
  /**
   * Distance to the hit. Will be set to -1 if there was no hit
   */
  /**
   * If the ray should stop traversing the bodies
   */
  constructor() {
    this.rayFromWorld = new r(), this.rayToWorld = new r(), this.hitNormalWorld = new r(), this.hitPointWorld = new r(), this.hasHit = !1, this.shape = null, this.body = null, this.hitFaceIndex = -1, this.distance = -1, this.shouldStop = !1;
  }
  /**
   * Reset all result data.
   */
  reset() {
    this.rayFromWorld.setZero(), this.rayToWorld.setZero(), this.hitNormalWorld.setZero(), this.hitPointWorld.setZero(), this.hasHit = !1, this.shape = null, this.body = null, this.hitFaceIndex = -1, this.distance = -1, this.shouldStop = !1;
  }
  /**
   * abort
   */
  abort() {
    this.shouldStop = !0;
  }
  /**
   * Set result data.
   */
  set(t, e, i, s, n, o, a) {
    this.rayFromWorld.copy(t), this.rayToWorld.copy(e), this.hitNormalWorld.copy(i), this.hitPointWorld.copy(s), this.shape = n, this.body = o, this.distance = a;
  }
}
let De, Oe, ke, Ne, Fe, Re, Ye;
const re = {
  /** CLOSEST */
  CLOSEST: 1,
  /** ANY */
  ANY: 2,
  /** ALL */
  ALL: 4
};
De = _.types.SPHERE;
Oe = _.types.PLANE;
ke = _.types.BOX;
Ne = _.types.CYLINDER;
Fe = _.types.CONVEXPOLYHEDRON;
Re = _.types.HEIGHTFIELD;
Ye = _.types.TRIMESH;
class U {
  /**
   * from
   */
  /**
   * to
   */
  /**
   * direction
   */
  /**
   * The precision of the ray. Used when checking parallelity etc.
   * @default 0.0001
   */
  /**
   * Set to `false` if you don't want the Ray to take `collisionResponse` flags into account on bodies and shapes.
   * @default true
   */
  /**
   * If set to `true`, the ray skips any hits with normal.dot(rayDirection) < 0.
   * @default false
   */
  /**
   * collisionFilterMask
   * @default -1
   */
  /**
   * collisionFilterGroup
   * @default -1
   */
  /**
   * The intersection mode. Should be Ray.ANY, Ray.ALL or Ray.CLOSEST.
   * @default RAY.ANY
   */
  /**
   * Current result object.
   */
  /**
   * Will be set to `true` during intersectWorld() if the ray hit anything.
   */
  /**
   * User-provided result callback. Will be used if mode is Ray.ALL.
   */
  /**
   * CLOSEST
   */
  /**
   * ANY
   */
  /**
   * ALL
   */
  get [De]() {
    return this._intersectSphere;
  }
  get [Oe]() {
    return this._intersectPlane;
  }
  get [ke]() {
    return this._intersectBox;
  }
  get [Ne]() {
    return this._intersectConvex;
  }
  get [Fe]() {
    return this._intersectConvex;
  }
  get [Re]() {
    return this._intersectHeightfield;
  }
  get [Ye]() {
    return this._intersectTrimesh;
  }
  constructor(t, e) {
    t === void 0 && (t = new r()), e === void 0 && (e = new r()), this.from = t.clone(), this.to = e.clone(), this.direction = new r(), this.precision = 1e-4, this.checkCollisionResponse = !0, this.skipBackfaces = !1, this.collisionFilterMask = -1, this.collisionFilterGroup = -1, this.mode = U.ANY, this.result = new ee(), this.hasHit = !1, this.callback = (i) => {
    };
  }
  /**
   * Do itersection against all bodies in the given World.
   * @return True if the ray hit anything, otherwise false.
   */
  intersectWorld(t, e) {
    return this.mode = e.mode || U.ANY, this.result = e.result || new ee(), this.skipBackfaces = !!e.skipBackfaces, this.collisionFilterMask = typeof e.collisionFilterMask < "u" ? e.collisionFilterMask : -1, this.collisionFilterGroup = typeof e.collisionFilterGroup < "u" ? e.collisionFilterGroup : -1, this.checkCollisionResponse = typeof e.checkCollisionResponse < "u" ? e.checkCollisionResponse : !0, e.from && this.from.copy(e.from), e.to && this.to.copy(e.to), this.callback = e.callback || (() => {
    }), this.hasHit = !1, this.result.reset(), this.updateDirection(), this.getAABB(we), Wt.length = 0, t.broadphase.aabbQuery(t, we, Wt), this.intersectBodies(Wt), this.hasHit;
  }
  /**
   * Shoot a ray at a body, get back information about the hit.
   * @deprecated @param result set the result property of the Ray instead.
   */
  intersectBody(t, e) {
    e && (this.result = e, this.updateDirection());
    const i = this.checkCollisionResponse;
    if (i && !t.collisionResponse || !(this.collisionFilterGroup & t.collisionFilterMask) || !(t.collisionFilterGroup & this.collisionFilterMask))
      return;
    const s = Qi, n = Ki;
    for (let o = 0, a = t.shapes.length; o < a; o++) {
      const h = t.shapes[o];
      if (!(i && !h.collisionResponse) && (t.quaternion.mult(t.shapeOrientations[o], n), t.quaternion.vmult(t.shapeOffsets[o], s), s.vadd(t.position, s), this.intersectShape(h, n, s, t), this.result.shouldStop))
        break;
    }
  }
  /**
   * Shoot a ray at an array bodies, get back information about the hit.
   * @param bodies An array of Body objects.
   * @deprecated @param result set the result property of the Ray instead.
   *
   */
  intersectBodies(t, e) {
    e && (this.result = e, this.updateDirection());
    for (let i = 0, s = t.length; !this.result.shouldStop && i < s; i++)
      this.intersectBody(t[i]);
  }
  /**
   * Updates the direction vector.
   */
  updateDirection() {
    this.to.vsub(this.from, this.direction), this.direction.normalize();
  }
  intersectShape(t, e, i, s) {
    const n = this.from;
    if (ps(n, this.direction, i) > t.boundingSphereRadius)
      return;
    const a = this[t.type];
    a && a.call(this, t, e, i, s, t);
  }
  _intersectBox(t, e, i, s, n) {
    return this._intersectConvex(t.convexPolyhedronRepresentation, e, i, s, n);
  }
  _intersectPlane(t, e, i, s, n) {
    const o = this.from, a = this.to, h = this.direction, l = new r(0, 0, 1);
    e.vmult(l, l);
    const c = new r();
    o.vsub(i, c);
    const d = c.dot(l);
    a.vsub(i, c);
    const u = c.dot(l);
    if (d * u > 0 || o.distanceTo(a) < d)
      return;
    const f = l.dot(h);
    if (Math.abs(f) < this.precision)
      return;
    const m = new r(), y = new r(), x = new r();
    o.vsub(i, m);
    const g = -l.dot(m) / f;
    h.scale(g, y), o.vadd(y, x), this.reportIntersection(l, x, n, s, -1);
  }
  /**
   * Get the world AABB of the ray.
   */
  getAABB(t) {
    const {
      lowerBound: e,
      upperBound: i
    } = t, s = this.to, n = this.from;
    e.x = Math.min(s.x, n.x), e.y = Math.min(s.y, n.y), e.z = Math.min(s.z, n.z), i.x = Math.max(s.x, n.x), i.y = Math.max(s.y, n.y), i.z = Math.max(s.z, n.z);
  }
  _intersectHeightfield(t, e, i, s, n) {
    t.data, t.elementSize;
    const o = Ji;
    o.from.copy(this.from), o.to.copy(this.to), W.pointToLocalFrame(i, e, o.from, o.from), W.pointToLocalFrame(i, e, o.to, o.to), o.updateDirection();
    const a = ts;
    let h, l, c, d;
    h = l = 0, c = d = t.data.length - 1;
    const u = new J();
    o.getAABB(u), t.getIndexOfPosition(u.lowerBound.x, u.lowerBound.y, a, !0), h = Math.max(h, a[0]), l = Math.max(l, a[1]), t.getIndexOfPosition(u.upperBound.x, u.upperBound.y, a, !0), c = Math.min(c, a[0] + 1), d = Math.min(d, a[1] + 1);
    for (let f = h; f < c; f++)
      for (let m = l; m < d; m++) {
        if (this.result.shouldStop)
          return;
        if (t.getAabbAtIndex(f, m, u), !!u.overlapsRay(o)) {
          if (t.getConvexTrianglePillar(f, m, !1), W.pointToWorldFrame(i, e, t.pillarOffset, kt), this._intersectConvex(t.pillarConvex, e, kt, s, n, ye), this.result.shouldStop)
            return;
          t.getConvexTrianglePillar(f, m, !0), W.pointToWorldFrame(i, e, t.pillarOffset, kt), this._intersectConvex(t.pillarConvex, e, kt, s, n, ye);
        }
      }
  }
  _intersectSphere(t, e, i, s, n) {
    const o = this.from, a = this.to, h = t.radius, l = (a.x - o.x) ** 2 + (a.y - o.y) ** 2 + (a.z - o.z) ** 2, c = 2 * ((a.x - o.x) * (o.x - i.x) + (a.y - o.y) * (o.y - i.y) + (a.z - o.z) * (o.z - i.z)), d = (o.x - i.x) ** 2 + (o.y - i.y) ** 2 + (o.z - i.z) ** 2 - h ** 2, u = c ** 2 - 4 * l * d, f = es, m = is;
    if (!(u < 0))
      if (u === 0)
        o.lerp(a, u, f), f.vsub(i, m), m.normalize(), this.reportIntersection(m, f, n, s, -1);
      else {
        const y = (-c - Math.sqrt(u)) / (2 * l), x = (-c + Math.sqrt(u)) / (2 * l);
        if (y >= 0 && y <= 1 && (o.lerp(a, y, f), f.vsub(i, m), m.normalize(), this.reportIntersection(m, f, n, s, -1)), this.result.shouldStop)
          return;
        x >= 0 && x <= 1 && (o.lerp(a, x, f), f.vsub(i, m), m.normalize(), this.reportIntersection(m, f, n, s, -1));
      }
  }
  _intersectConvex(t, e, i, s, n, o) {
    const a = ss, h = ge, l = o && o.faceList || null, c = t.faces, d = t.vertices, u = t.faceNormals, f = this.direction, m = this.from, y = this.to, x = m.distanceTo(y), g = l ? l.length : c.length, w = this.result;
    for (let M = 0; !w.shouldStop && M < g; M++) {
      const I = l ? l[M] : M, F = c[I], Y = u[I], X = e, S = i;
      h.copy(d[F[0]]), X.vmult(h, h), h.vadd(S, h), h.vsub(m, h), X.vmult(Y, a);
      const b = f.dot(a);
      if (Math.abs(b) < this.precision)
        continue;
      const E = a.dot(h) / b;
      if (!(E < 0)) {
        f.scale(E, K), K.vadd(m, K), it.copy(d[F[0]]), X.vmult(it, it), S.vadd(it, it);
        for (let P = 1; !w.shouldStop && P < F.length - 1; P++) {
          ot.copy(d[F[P]]), rt.copy(d[F[P + 1]]), X.vmult(ot, ot), X.vmult(rt, rt), S.vadd(ot, ot), S.vadd(rt, rt);
          const z = K.distanceTo(m);
          !(U.pointInTriangle(K, it, ot, rt) || U.pointInTriangle(K, ot, it, rt)) || z > x || this.reportIntersection(a, K, n, s, I);
        }
      }
    }
  }
  /**
   * @todo Optimize by transforming the world to local space first.
   * @todo Use Octree lookup
   */
  _intersectTrimesh(t, e, i, s, n, o) {
    const a = ns, h = cs, l = ds, c = ge, d = os, u = rs, f = as, m = hs, y = ls, x = t.indices;
    t.vertices;
    const g = this.from, w = this.to, M = this.direction;
    l.position.copy(i), l.quaternion.copy(e), W.vectorToLocalFrame(i, e, M, d), W.pointToLocalFrame(i, e, g, u), W.pointToLocalFrame(i, e, w, f), f.x *= t.scale.x, f.y *= t.scale.y, f.z *= t.scale.z, u.x *= t.scale.x, u.y *= t.scale.y, u.z *= t.scale.z, f.vsub(u, d), d.normalize();
    const I = u.distanceSquared(f);
    t.tree.rayQuery(this, l, h);
    for (let F = 0, Y = h.length; !this.result.shouldStop && F !== Y; F++) {
      const X = h[F];
      t.getNormal(X, a), t.getVertex(x[X * 3], it), it.vsub(u, c);
      const S = d.dot(a), b = a.dot(c) / S;
      if (b < 0)
        continue;
      d.scale(b, K), K.vadd(u, K), t.getVertex(x[X * 3 + 1], ot), t.getVertex(x[X * 3 + 2], rt);
      const E = K.distanceSquared(u);
      !(U.pointInTriangle(K, ot, it, rt) || U.pointInTriangle(K, it, ot, rt)) || E > I || (W.vectorToWorldFrame(e, a, y), W.pointToWorldFrame(i, e, K, m), this.reportIntersection(y, m, n, s, X));
    }
    h.length = 0;
  }
  /**
   * @return True if the intersections should continue
   */
  reportIntersection(t, e, i, s, n) {
    const o = this.from, a = this.to, h = o.distanceTo(e), l = this.result;
    if (!(this.skipBackfaces && t.dot(this.direction) > 0))
      switch (l.hitFaceIndex = typeof n < "u" ? n : -1, this.mode) {
        case U.ALL:
          this.hasHit = !0, l.set(o, a, t, e, i, s, h), l.hasHit = !0, this.callback(l);
          break;
        case U.CLOSEST:
          (h < l.distance || !l.hasHit) && (this.hasHit = !0, l.hasHit = !0, l.set(o, a, t, e, i, s, h));
          break;
        case U.ANY:
          this.hasHit = !0, l.hasHit = !0, l.set(o, a, t, e, i, s, h), l.shouldStop = !0;
          break;
      }
  }
  /**
   * As per "Barycentric Technique" as named
   * {@link https://www.blackpawn.com/texts/pointinpoly/default.html here} but without the division
   */
  static pointInTriangle(t, e, i, s) {
    s.vsub(e, ft), i.vsub(e, xt), t.vsub(e, Ut);
    const n = ft.dot(ft), o = ft.dot(xt), a = ft.dot(Ut), h = xt.dot(xt), l = xt.dot(Ut);
    let c, d;
    return (c = h * a - o * l) >= 0 && (d = n * l - o * a) >= 0 && c + d < n * h - o * o;
  }
}
U.CLOSEST = re.CLOSEST;
U.ANY = re.ANY;
U.ALL = re.ALL;
const we = new J(), Wt = [], xt = new r(), Ut = new r(), Qi = new r(), Ki = new j(), K = new r(), it = new r(), ot = new r(), rt = new r();
new r();
new ee();
const ye = {
  faceList: [0]
}, kt = new r(), Ji = new U(), ts = [], es = new r(), is = new r(), ss = new r();
new r();
new r();
const ge = new r(), ns = new r(), os = new r(), rs = new r(), as = new r(), ls = new r(), hs = new r();
new J();
const cs = [], ds = new W(), ft = new r(), Nt = new r();
function ps(p, t, e) {
  e.vsub(p, ft);
  const i = ft.dot(t);
  return t.scale(i, Nt), Nt.vadd(p, Nt), e.distanceTo(Nt);
}
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new U();
new r();
new r();
new r();
new r(1, 0, 0), new r(0, 1, 0), new r(0, 0, 1);
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new J();
new r();
new J();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new J();
new r();
new W();
new J();
_.types.SPHERE, _.types.SPHERE | _.types.PLANE, _.types.BOX | _.types.BOX, _.types.SPHERE | _.types.BOX, _.types.PLANE | _.types.BOX, _.types.CONVEXPOLYHEDRON, _.types.SPHERE | _.types.CONVEXPOLYHEDRON, _.types.PLANE | _.types.CONVEXPOLYHEDRON, _.types.BOX | _.types.CONVEXPOLYHEDRON, _.types.SPHERE | _.types.HEIGHTFIELD, _.types.BOX | _.types.HEIGHTFIELD, _.types.CONVEXPOLYHEDRON | _.types.HEIGHTFIELD, _.types.PARTICLE | _.types.SPHERE, _.types.PLANE | _.types.PARTICLE, _.types.BOX | _.types.PARTICLE, _.types.PARTICLE | _.types.CONVEXPOLYHEDRON, _.types.CYLINDER, _.types.SPHERE | _.types.CYLINDER, _.types.PLANE | _.types.CYLINDER, _.types.BOX | _.types.CYLINDER, _.types.CONVEXPOLYHEDRON | _.types.CYLINDER, _.types.HEIGHTFIELD | _.types.CYLINDER, _.types.PARTICLE | _.types.CYLINDER, _.types.SPHERE | _.types.TRIMESH, _.types.PLANE | _.types.TRIMESH;
new r();
new r();
new r();
new r();
new r();
new j();
new j();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new J();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r(), new r(), new r(), new r(), new r(), new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new j();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new r();
new J();
new U();
const _t = globalThis.performance || {};
if (!_t.now) {
  let p = Date.now();
  _t.timing && _t.timing.navigationStart && (p = _t.timing.navigationStart), _t.now = () => Date.now() - p;
}
new r();
class $t {
  constructor() {
    k(this, "activeObjectUuid", "");
    k(this, "panel");
  }
  createPanel() {
    return new Tt({ title: "Object Props", width: 200 });
  }
  adjustPlacement(t) {
    this.panel || (this.panel = this.createPanel(), this.panel.hide()), this.panel.domElement.style.right = t ? "200px" : "0px";
  }
  toggle(t, e) {
    this.panel || this.action(e), this.panel.show(t);
  }
  action(t, e) {
    if (!t.options.props || (this.panel || (this.panel = this.createPanel(), this.panel.close(), this.adjustPlacement(t.options.scene === !0)), !e))
      return;
    if (this.activeObjectUuid === e.uuid) {
      this.panel.open();
      return;
    }
    this.activeObjectUuid = e.uuid, this.clearPanel();
    const i = e.name || e.type || "Object";
    this.panel.title(`${i} props`), this.panel.open(), this.parseObject(e);
  }
  clearPanel() {
    for (const t of this.panel.children)
      t.destroy();
    for (const t of this.panel.folders)
      t.destroy();
    for (const t of this.panel.controllers)
      t.destroy();
  }
  parseObject(t) {
    if ("isLight" in t && this.showLightProps(t), "material" in t) {
      const { material: e } = t, i = Array.isArray(e) ? e : [e];
      for (const [s, n] of i.entries())
        this.showMaterialProps(t, n, s);
    }
    t.children.length && this.showGroupProps(t), "body" in t && this.showPhysicsBodyProps(t);
  }
  showLightProps(t) {
    this.handleColor(this.panel, t, "color"), this.handleColor(this.panel, t, "groundColor"), this.panel.add(t, "intensity", 0, 3, 0.1);
  }
  showMaterialProps(t, e, i) {
    var o;
    const s = i > 0 ? `Material${i}` : "Material", n = this.panel.addFolder(s);
    n.add(e, "type"), n.add(t, "visible"), this.handleColor(n, e, "color"), this.handleColor(n, e, "emissive"), this.handleColor(n, e, "specular"), n.add(e, "transparent"), n.add(e, "opacity", 0, 1), n.add(e, "side", { FrontSide: Ze, BackSide: We, DoubleSide: ze }).onChange((a) => e.side = a), (e instanceof Ue || e instanceof Xt || e instanceof qe || e instanceof Ge) && (Object.hasOwn(e, "wireframe") && n.add(e, "wireframe"), (o = e.color) != null && o.getHex() && (this.handleFunction(
      n,
      "LinearToSRGB",
      () => e.color.convertLinearToSRGB()
    ), this.handleFunction(
      n,
      "SRGBToLinear",
      () => e.color.convertSRGBToLinear()
    )), this.showMaterialTextureProps(n, e));
  }
  showMaterialTextureProps(t, e) {
    const i = t.addFolder("Texture"), s = e.map;
    s && (i.add(s, "flipY"), i.add(s, "rotation").min(0).max(Math.PI * 2).step(0.01), i.add(s.offset, "x").name("offsetX").min(0).max(1).step(0.01), i.add(s.offset, "y").name("offsetY").min(0).max(1).step(0.01), i.add(s.repeat, "x").name("repeatX"), i.add(s.repeat, "y").name("repeatY"), i.add(s, "wrapS", {
      ClampToEdgeWrapping: Qe,
      RepeatWrapping: Ke,
      MirroredRepeatWrapping: Je
    }).onChange((n) => {
      s.wrapS = n, s.wrapT = n, s.needsUpdate = !0;
    }).name("wrap"));
  }
  showPhysicsBodyProps(t) {
    const { body: e } = t, i = this.panel.addFolder("Physical Body");
    i.add(e, "type", {
      dynamic: A.DYNAMIC,
      static: A.STATIC,
      kinematic: A.KINEMATIC
    }), i.add(e, "mass"), i.add(e, "angularDamping").min(0).max(1).step(0.01), i.add(e, "linearDamping").min(0).max(1).step(0.01);
  }
  showGroupProps(t) {
    this.panel.add(t, "visible");
  }
  handleColor(t, e, i) {
    if (!e[i])
      return;
    const s = { [i]: e[i].getHex() };
    t.addColor(s, i).onChange((n) => e[i].set(n));
  }
  handleFunction(t, e, i) {
    const s = { fn: () => i() };
    t.add(s, "fn").name(e);
  }
}
function us(p, t, e) {
  let {
    color: i = 65280,
    scale: s = 1,
    onInit: n,
    onUpdate: o
  } = e === void 0 ? {} : e;
  const a = [], h = new Xt({
    color: i ?? 65280,
    wireframe: !0
  }), l = new r(), c = new r(), d = new r(), u = new j(), f = new Qt(1), m = new V(1, 1, 1), y = new Kt(10, 10, 10, 10);
  y.translate(0, 0, 1e-4);
  function x(S) {
    const b = new Mt(), E = [];
    for (let z = 0; z < S.vertices.length; z++) {
      const T = S.vertices[z];
      E.push(T.x, T.y, T.z);
    }
    b.setAttribute("position", new Pt(E, 3));
    const P = [];
    for (let z = 0; z < S.faces.length; z++) {
      const T = S.faces[z], D = T[0];
      for (let L = 1; L < T.length - 1; L++) {
        const $ = T[L], O = T[L + 1];
        P.push(D, $, O);
      }
    }
    return b.setIndex(P), b.computeBoundingSphere(), b.computeVertexNormals(), b;
  }
  function g(S) {
    const b = new Mt(), E = [], P = l, z = c, T = d;
    for (let D = 0; D < S.indices.length / 3; D++)
      S.getTriangleVertices(D, P, z, T), E.push(P.x, P.y, P.z), E.push(z.x, z.y, z.z), E.push(T.x, T.y, T.z);
    return b.setAttribute("position", new Pt(E, 3)), b.computeBoundingSphere(), b.computeVertexNormals(), b;
  }
  function w(S) {
    const b = new Mt(), E = S.elementSize || 1, P = S.data.flatMap((T, D) => T.flatMap((L, $) => [D * E, $ * E, L])), z = [];
    for (let T = 0; T < S.data.length - 1; T++)
      for (let D = 0; D < S.data[T].length - 1; D++) {
        const L = S.data[T].length, $ = T * L + D;
        z.push($ + 1, $ + L, $ + L + 1), z.push($ + L, $ + 1, $);
      }
    return b.setIndex(z), b.setAttribute("position", new Pt(P, 3)), b.computeBoundingSphere(), b.computeVertexNormals(), b;
  }
  function M(S) {
    let b = new v();
    const {
      SPHERE: E,
      BOX: P,
      PLANE: z,
      CYLINDER: T,
      CONVEXPOLYHEDRON: D,
      TRIMESH: L,
      HEIGHTFIELD: $
    } = _.types;
    switch (S.type) {
      case E: {
        b = new v(f, h);
        break;
      }
      case P: {
        b = new v(m, h);
        break;
      }
      case z: {
        b = new v(y, h);
        break;
      }
      case T: {
        const O = new q(S.radiusTop, S.radiusBottom, S.height, S.numSegments);
        b = new v(O, h), S.geometryId = O.id;
        break;
      }
      case D: {
        const O = x(S);
        b = new v(O, h), S.geometryId = O.id;
        break;
      }
      case L: {
        const O = g(S);
        b = new v(O, h), S.geometryId = O.id;
        break;
      }
      case $: {
        const O = w(S);
        b = new v(O, h), S.geometryId = O.id;
        break;
      }
    }
    return p.add(b), b;
  }
  function I(S, b) {
    const {
      SPHERE: E,
      BOX: P,
      PLANE: z,
      CYLINDER: T,
      CONVEXPOLYHEDRON: D,
      TRIMESH: L,
      HEIGHTFIELD: $
    } = _.types;
    switch (b.type) {
      case E: {
        const {
          radius: O
        } = b;
        S.scale.set(O * s, O * s, O * s);
        break;
      }
      case P: {
        S.scale.copy(b.halfExtents), S.scale.multiplyScalar(2 * s);
        break;
      }
      case z:
        break;
      case T: {
        S.scale.set(1 * s, 1 * s, 1 * s);
        break;
      }
      case D: {
        S.scale.set(1 * s, 1 * s, 1 * s);
        break;
      }
      case L: {
        S.scale.copy(b.scale).multiplyScalar(s);
        break;
      }
      case $: {
        S.scale.set(1 * s, 1 * s, 1 * s);
        break;
      }
    }
  }
  function F(S, b) {
    if (!S) return !1;
    const {
      geometry: E
    } = S;
    return E instanceof Qt && b.type === _.types.SPHERE || E instanceof V && b.type === _.types.BOX || E instanceof Kt && b.type === _.types.PLANE || E.id === b.geometryId && b.type === _.types.CYLINDER || E.id === b.geometryId && b.type === _.types.CONVEXPOLYHEDRON || E.id === b.geometryId && b.type === _.types.TRIMESH || E.id === b.geometryId && b.type === _.types.HEIGHTFIELD;
  }
  function Y(S, b) {
    let E = a[S], P = !1;
    return F(E, b) || (E && p.remove(E), a[S] = E = M(b), P = !0), I(E, b), P;
  }
  function X() {
    const S = a, b = l, E = u;
    let P = 0;
    for (const z of t.bodies)
      for (let T = 0; T !== z.shapes.length; T++) {
        const D = z.shapes[T], L = Y(P, D), $ = S[P];
        $ && (z.quaternion.vmult(z.shapeOffsets[T], b), z.position.vadd(b, b), z.quaternion.mult(z.shapeOrientations[T], E), $.position.copy(b), $.quaternion.copy(E), L && n instanceof Function && n(z, $, D), !L && o instanceof Function && o(z, $, D)), P++;
      }
    for (let z = P; z < S.length; z++) {
      const T = S[z];
      T && p.remove(T);
    }
    S.length = P;
  }
  return {
    update: X
  };
}
class fs {
  constructor() {
    k(this, "debugger", null);
    k(this, "meshes", []);
  }
  action({ scene: t, physics: e }) {
    e && (this.debugger = us(t, e.world, {
      onInit: (i, s) => {
        this.meshes.push(s);
      }
    }));
  }
  toggle(t, e) {
    this.debugger || this.action(e);
    for (const i of this.meshes)
      i.visible = t;
  }
  update() {
    var t;
    (t = this.debugger) == null || t.update();
  }
}
class ms {
  constructor(t) {
    k(this, "exclude", ["transform-controls", "TransformControlsGizmo"]);
    k(this, "keepClosed", ["mixamorig_Hips"]);
    k(this, "lightsFolder");
    k(this, "panel");
    k(this, "onActionComplete");
    this.onActionComplete = t;
  }
  action(t) {
    this.panel = new Tt({ title: "Scene Tree", width: 200 }), this.panel.domElement.style.right = "0px", this.lightsFolder = this.panel.addFolder("Lights"), this.tweakPanelStyle();
    for (const e of t.scene.children)
      this.traverseScene(e, this.panel);
  }
  tweakPanelStyle() {
    const t = document.createElement("style");
    t.textContent = `
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
        `, document.head.appendChild(t);
  }
  traverseScene(t, e) {
    const i = t.name !== "" ? t.name : t.type;
    if (this.exclude.includes(i))
      return;
    const s = "isLight" in t && t.isLight, n = "isMesh" in t && t.isMesh, a = (s ? this.lightsFolder : e).addFolder(i), h = a.domElement.querySelector(".lil-title");
    h == null || h.addEventListener("click", () => {
      var l;
      (l = this.onActionComplete) == null || l.call(this, t, i);
    }), (this.keepClosed.includes(i) || s || n) && a.close();
    for (const l of t.children)
      this.traverseScene(l, a);
  }
  toggle(t, e) {
    this.panel || this.action(e), this.panel.show(t), e.components.props instanceof $t && e.components.props.adjustPlacement(t);
  }
}
const pt = new Te(), Z = new C(), dt = new C(), H = new et(), xe = {
  X: new C(1, 0, 0),
  Y: new C(0, 1, 0),
  Z: new C(0, 0, 1)
}, qt = { type: "change" }, _e = { type: "mouseDown", mode: null }, ve = { type: "mouseUp", mode: null }, be = { type: "objectChange" };
class ws extends Ae {
  /**
   * Constructs a new controls instance.
   *
   * @param {Camera} camera - The camera of the rendered scene.
   * @param {?HTMLDOMElement} domElement - The HTML element used for event listeners.
   */
  constructor(t, e = null) {
    super(void 0, e);
    const i = new bs(this);
    this._root = i;
    const s = new Es();
    this._gizmo = s, i.add(s);
    const n = new Ss();
    this._plane = n, i.add(n);
    const o = this;
    function a(M, I) {
      let F = I;
      Object.defineProperty(o, M, {
        get: function() {
          return F !== void 0 ? F : I;
        },
        set: function(Y) {
          F !== Y && (F = Y, n[M] = Y, s[M] = Y, o.dispatchEvent({ type: M + "-changed", value: Y }), o.dispatchEvent(qt));
        }
      }), o[M] = I, n[M] = I, s[M] = I;
    }
    a("camera", t), a("object", void 0), a("enabled", !0), a("axis", null), a("mode", "translate"), a("translationSnap", null), a("rotationSnap", null), a("scaleSnap", null), a("space", "world"), a("size", 1), a("dragging", !1), a("showX", !0), a("showY", !0), a("showZ", !0), a("minX", -1 / 0), a("maxX", 1 / 0), a("minY", -1 / 0), a("maxY", 1 / 0), a("minZ", -1 / 0), a("maxZ", 1 / 0);
    const h = new C(), l = new C(), c = new et(), d = new et(), u = new C(), f = new et(), m = new C(), y = new C(), x = new C(), g = 0, w = new C();
    a("worldPosition", h), a("worldPositionStart", l), a("worldQuaternion", c), a("worldQuaternionStart", d), a("cameraPosition", u), a("cameraQuaternion", f), a("pointStart", m), a("pointEnd", y), a("rotationAxis", x), a("rotationAngle", g), a("eye", w), this._offset = new C(), this._startNorm = new C(), this._endNorm = new C(), this._cameraScale = new C(), this._parentPosition = new C(), this._parentQuaternion = new et(), this._parentQuaternionInv = new et(), this._parentScale = new C(), this._worldScaleStart = new C(), this._worldQuaternionInv = new et(), this._worldScale = new C(), this._positionStart = new C(), this._quaternionStart = new et(), this._scaleStart = new C(), this._getPointer = ys.bind(this), this._onPointerDown = xs.bind(this), this._onPointerHover = gs.bind(this), this._onPointerMove = _s.bind(this), this._onPointerUp = vs.bind(this), e !== null && this.connect(e);
  }
  connect(t) {
    super.connect(t), this.domElement.addEventListener("pointerdown", this._onPointerDown), this.domElement.addEventListener("pointermove", this._onPointerHover), this.domElement.addEventListener("pointerup", this._onPointerUp), this.domElement.style.touchAction = "none";
  }
  disconnect() {
    this.domElement.removeEventListener("pointerdown", this._onPointerDown), this.domElement.removeEventListener("pointermove", this._onPointerHover), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.domElement.style.touchAction = "auto";
  }
  /**
   * Returns the visual representation of the controls. Add the helper to your scene to
   * visually transform the attached  3D object.
   *
   * @return {TransformControlsRoot} The helper.
   */
  getHelper() {
    return this._root;
  }
  pointerHover(t) {
    if (this.object === void 0 || this.dragging === !0) return;
    t !== null && pt.setFromCamera(t, this.camera);
    const e = Gt(this._gizmo.picker[this.mode], pt);
    e ? this.axis = e.object.name : this.axis = null;
  }
  pointerDown(t) {
    if (!(this.object === void 0 || this.dragging === !0 || t != null && t.button !== 0) && this.axis !== null) {
      t !== null && pt.setFromCamera(t, this.camera);
      const e = Gt(this._plane, pt, !0);
      e && (this.object.updateMatrixWorld(), this.object.parent.updateMatrixWorld(), this._positionStart.copy(this.object.position), this._quaternionStart.copy(this.object.quaternion), this._scaleStart.copy(this.object.scale), this.object.matrixWorld.decompose(this.worldPositionStart, this.worldQuaternionStart, this._worldScaleStart), this.pointStart.copy(e.point).sub(this.worldPositionStart)), this.dragging = !0, _e.mode = this.mode, this.dispatchEvent(_e);
    }
  }
  pointerMove(t) {
    const e = this.axis, i = this.mode, s = this.object;
    let n = this.space;
    if (i === "scale" ? n = "local" : (e === "E" || e === "XYZE" || e === "XYZ") && (n = "world"), s === void 0 || e === null || this.dragging === !1 || t !== null && t.button !== -1) return;
    t !== null && pt.setFromCamera(t, this.camera);
    const o = Gt(this._plane, pt, !0);
    if (o) {
      if (this.pointEnd.copy(o.point).sub(this.worldPositionStart), i === "translate")
        this._offset.copy(this.pointEnd).sub(this.pointStart), n === "local" && e !== "XYZ" && this._offset.applyQuaternion(this._worldQuaternionInv), e.indexOf("X") === -1 && (this._offset.x = 0), e.indexOf("Y") === -1 && (this._offset.y = 0), e.indexOf("Z") === -1 && (this._offset.z = 0), n === "local" && e !== "XYZ" ? this._offset.applyQuaternion(this._quaternionStart).divide(this._parentScale) : this._offset.applyQuaternion(this._parentQuaternionInv).divide(this._parentScale), s.position.copy(this._offset).add(this._positionStart), this.translationSnap && (n === "local" && (s.position.applyQuaternion(H.copy(this._quaternionStart).invert()), e.search("X") !== -1 && (s.position.x = Math.round(s.position.x / this.translationSnap) * this.translationSnap), e.search("Y") !== -1 && (s.position.y = Math.round(s.position.y / this.translationSnap) * this.translationSnap), e.search("Z") !== -1 && (s.position.z = Math.round(s.position.z / this.translationSnap) * this.translationSnap), s.position.applyQuaternion(this._quaternionStart)), n === "world" && (s.parent && s.position.add(Z.setFromMatrixPosition(s.parent.matrixWorld)), e.search("X") !== -1 && (s.position.x = Math.round(s.position.x / this.translationSnap) * this.translationSnap), e.search("Y") !== -1 && (s.position.y = Math.round(s.position.y / this.translationSnap) * this.translationSnap), e.search("Z") !== -1 && (s.position.z = Math.round(s.position.z / this.translationSnap) * this.translationSnap), s.parent && s.position.sub(Z.setFromMatrixPosition(s.parent.matrixWorld)))), s.position.x = Math.max(this.minX, Math.min(this.maxX, s.position.x)), s.position.y = Math.max(this.minY, Math.min(this.maxY, s.position.y)), s.position.z = Math.max(this.minZ, Math.min(this.maxZ, s.position.z));
      else if (i === "scale") {
        if (e.search("XYZ") !== -1) {
          let a = this.pointEnd.length() / this.pointStart.length();
          this.pointEnd.dot(this.pointStart) < 0 && (a *= -1), dt.set(a, a, a);
        } else
          Z.copy(this.pointStart), dt.copy(this.pointEnd), Z.applyQuaternion(this._worldQuaternionInv), dt.applyQuaternion(this._worldQuaternionInv), dt.divide(Z), e.search("X") === -1 && (dt.x = 1), e.search("Y") === -1 && (dt.y = 1), e.search("Z") === -1 && (dt.z = 1);
        s.scale.copy(this._scaleStart).multiply(dt), this.scaleSnap && (e.search("X") !== -1 && (s.scale.x = Math.round(s.scale.x / this.scaleSnap) * this.scaleSnap || this.scaleSnap), e.search("Y") !== -1 && (s.scale.y = Math.round(s.scale.y / this.scaleSnap) * this.scaleSnap || this.scaleSnap), e.search("Z") !== -1 && (s.scale.z = Math.round(s.scale.z / this.scaleSnap) * this.scaleSnap || this.scaleSnap));
      } else if (i === "rotate") {
        this._offset.copy(this.pointEnd).sub(this.pointStart);
        const a = 20 / this.worldPosition.distanceTo(Z.setFromMatrixPosition(this.camera.matrixWorld));
        let h = !1;
        e === "XYZE" ? (this.rotationAxis.copy(this._offset).cross(this.eye).normalize(), this.rotationAngle = this._offset.dot(Z.copy(this.rotationAxis).cross(this.eye)) * a) : (e === "X" || e === "Y" || e === "Z") && (this.rotationAxis.copy(xe[e]), Z.copy(xe[e]), n === "local" && Z.applyQuaternion(this.worldQuaternion), Z.cross(this.eye), Z.length() === 0 ? h = !0 : this.rotationAngle = this._offset.dot(Z.normalize()) * a), (e === "E" || h) && (this.rotationAxis.copy(this.eye), this.rotationAngle = this.pointEnd.angleTo(this.pointStart), this._startNorm.copy(this.pointStart).normalize(), this._endNorm.copy(this.pointEnd).normalize(), this.rotationAngle *= this._endNorm.cross(this._startNorm).dot(this.eye) < 0 ? 1 : -1), this.rotationSnap && (this.rotationAngle = Math.round(this.rotationAngle / this.rotationSnap) * this.rotationSnap), n === "local" && e !== "E" && e !== "XYZE" ? (s.quaternion.copy(this._quaternionStart), s.quaternion.multiply(H.setFromAxisAngle(this.rotationAxis, this.rotationAngle)).normalize()) : (this.rotationAxis.applyQuaternion(this._parentQuaternionInv), s.quaternion.copy(H.setFromAxisAngle(this.rotationAxis, this.rotationAngle)), s.quaternion.multiply(this._quaternionStart).normalize());
      }
      this.dispatchEvent(qt), this.dispatchEvent(be);
    }
  }
  pointerUp(t) {
    t !== null && t.button !== 0 || (this.dragging && this.axis !== null && (ve.mode = this.mode, this.dispatchEvent(ve)), this.dragging = !1, this.axis = null);
  }
  dispose() {
    this.disconnect(), this._root.dispose();
  }
  /**
   * Sets the 3D object that should be transformed and ensures the controls UI is visible.
   *
   * @param {Object3D} object -  The 3D object that should be transformed.
   * @return {TransformControls} A reference to this controls.
   */
  attach(t) {
    return this.object = t, this._root.visible = !0, this;
  }
  /**
   * Removes the current 3D object from the controls and makes the helper UI invisible.
   *
   * @return {TransformControls} A reference to this controls.
   */
  detach() {
    return this.object = void 0, this.axis = null, this._root.visible = !1, this;
  }
  /**
   * Resets the object's position, rotation and scale to when the current transform began.
   */
  reset() {
    this.enabled && this.dragging && (this.object.position.copy(this._positionStart), this.object.quaternion.copy(this._quaternionStart), this.object.scale.copy(this._scaleStart), this.dispatchEvent(qt), this.dispatchEvent(be), this.pointStart.copy(this.pointEnd));
  }
  /**
   * Returns the raycaster that is used for user interaction. This object is shared between all
   * instances of `TransformControls`.
   *
   * @returns {Raycaster} The internal raycaster.
   */
  getRaycaster() {
    return pt;
  }
  /**
   * Returns the transformation mode.
   *
   * @returns {'translate'|'rotate'|'scale'} The transformation mode.
   */
  getMode() {
    return this.mode;
  }
  /**
   * Sets the given transformation mode.
   *
   * @param {'translate'|'rotate'|'scale'} mode - The transformation mode to set.
   */
  setMode(t) {
    this.mode = t;
  }
  /**
   * Sets the translation snap.
   *
   * @param {?number} translationSnap - The translation snap to set.
   */
  setTranslationSnap(t) {
    this.translationSnap = t;
  }
  /**
   * Sets the rotation snap.
   *
   * @param {?number} rotationSnap - The rotation snap to set.
   */
  setRotationSnap(t) {
    this.rotationSnap = t;
  }
  /**
   * Sets the scale snap.
   *
   * @param {?number} scaleSnap - The scale snap to set.
   */
  setScaleSnap(t) {
    this.scaleSnap = t;
  }
  /**
   * Sets the size of the helper UI.
   *
   * @param {number} size - The size to set.
   */
  setSize(t) {
    this.size = t;
  }
  /**
   * Sets the coordinate space in which transformations are applied.
   *
   * @param {'world'|'local'} space - The space to set.
   */
  setSpace(t) {
    this.space = t;
  }
  /**
   * Sets the colors of the control's gizmo.
   *
   * @param {number|Color|string} xAxis - The x-axis color.
   * @param {number|Color|string} yAxis - The y-axis color.
   * @param {number|Color|string} zAxis - The z-axis color.
   * @param {number|Color|string} active - The color for active elements.
   */
  setColors(t, e, i, s) {
    const n = this._gizmo.materialLib;
    n.xAxis.color.set(t), n.yAxis.color.set(e), n.zAxis.color.set(i), n.active.color.set(s), n.xAxisTransparent.color.set(t), n.yAxisTransparent.color.set(e), n.zAxisTransparent.color.set(i), n.activeTransparent.color.set(s), n.xAxis._color && n.xAxis._color.set(t), n.yAxis._color && n.yAxis._color.set(e), n.zAxis._color && n.zAxis._color.set(i), n.active._color && n.active._color.set(s), n.xAxisTransparent._color && n.xAxisTransparent._color.set(t), n.yAxisTransparent._color && n.yAxisTransparent._color.set(e), n.zAxisTransparent._color && n.zAxisTransparent._color.set(i), n.activeTransparent._color && n.activeTransparent._color.set(s);
  }
}
function ys(p) {
  if (this.domElement.ownerDocument.pointerLockElement)
    return {
      x: 0,
      y: 0,
      button: p.button
    };
  {
    const t = this.domElement.getBoundingClientRect();
    return {
      x: (p.clientX - t.left) / t.width * 2 - 1,
      y: -(p.clientY - t.top) / t.height * 2 + 1,
      button: p.button
    };
  }
}
function gs(p) {
  if (this.enabled)
    switch (p.pointerType) {
      case "mouse":
      case "pen":
        this.pointerHover(this._getPointer(p));
        break;
    }
}
function xs(p) {
  this.enabled && (document.pointerLockElement || this.domElement.setPointerCapture(p.pointerId), this.domElement.addEventListener("pointermove", this._onPointerMove), this.pointerHover(this._getPointer(p)), this.pointerDown(this._getPointer(p)));
}
function _s(p) {
  this.enabled && this.pointerMove(this._getPointer(p));
}
function vs(p) {
  this.enabled && (this.domElement.releasePointerCapture(p.pointerId), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.pointerUp(this._getPointer(p)));
}
function Gt(p, t, e) {
  const i = t.intersectObject(p, !0);
  for (let s = 0; s < i.length; s++)
    if (i[s].object.visible || e)
      return i[s];
  return !1;
}
const Ft = new ti(), R = new C(0, 1, 0), Ee = new C(0, 0, 0), Se = new Ce(), Rt = new et(), Ht = new et(), at = new C(), Me = new Ce(), Et = new C(1, 0, 0), ut = new C(0, 1, 0), St = new C(0, 0, 1), Yt = new C(), vt = new C(), bt = new C();
class bs extends Jt {
  constructor(t) {
    super(), this.isTransformControlsRoot = !0, this.controls = t, this.visible = !1;
  }
  // updateMatrixWorld updates key transformation variables
  updateMatrixWorld(t) {
    const e = this.controls;
    e.object !== void 0 && (e.object.updateMatrixWorld(), e.object.parent === null ? console.error("TransformControls: The attached 3D object must be a part of the scene graph.") : e.object.parent.matrixWorld.decompose(e._parentPosition, e._parentQuaternion, e._parentScale), e.object.matrixWorld.decompose(e.worldPosition, e.worldQuaternion, e._worldScale), e._parentQuaternionInv.copy(e._parentQuaternion).invert(), e._worldQuaternionInv.copy(e.worldQuaternion).invert()), e.camera.updateMatrixWorld(), e.camera.matrixWorld.decompose(e.cameraPosition, e.cameraQuaternion, e._cameraScale), e.camera.isOrthographicCamera ? e.camera.getWorldDirection(e.eye).negate() : e.eye.copy(e.cameraPosition).sub(e.worldPosition).normalize(), super.updateMatrixWorld(t);
  }
  dispose() {
    this.traverse(function(t) {
      t.geometry && t.geometry.dispose(), t.material && t.material.dispose();
    });
  }
}
class Es extends Jt {
  constructor() {
    super(), this.isTransformControlsGizmo = !0, this.type = "TransformControlsGizmo";
    const t = new Xt({
      depthTest: !1,
      depthWrite: !1,
      fog: !1,
      toneMapped: !1,
      transparent: !0
    }), e = new ei({
      depthTest: !1,
      depthWrite: !1,
      fog: !1,
      toneMapped: !1,
      transparent: !0
    }), i = t.clone();
    i.opacity = 0.15;
    const s = e.clone();
    s.opacity = 0.5;
    const n = t.clone();
    n.color.setHex(16711680);
    const o = t.clone();
    o.color.setHex(65280);
    const a = t.clone();
    a.color.setHex(255);
    const h = t.clone();
    h.color.setHex(16711680), h.opacity = 0.5;
    const l = t.clone();
    l.color.setHex(65280), l.opacity = 0.5;
    const c = t.clone();
    c.color.setHex(255), c.opacity = 0.5;
    const d = t.clone();
    d.opacity = 0.25;
    const u = t.clone();
    u.color.setHex(16776960), u.opacity = 0.25;
    const f = t.clone();
    f.color.setHex(16776960);
    const m = t.clone();
    m.color.setHex(7895160), this.materialLib = {
      xAxis: n,
      yAxis: o,
      zAxis: a,
      active: f,
      xAxisTransparent: h,
      yAxisTransparent: l,
      zAxisTransparent: c,
      activeTransparent: u
    };
    const y = new q(0, 0.04, 0.1, 12);
    y.translate(0, 0.05, 0);
    const x = new V(0.08, 0.08, 0.08);
    x.translate(0, 0.04, 0);
    const g = new Mt();
    g.setAttribute("position", new Pt([0, 0, 0, 1, 0, 0], 3));
    const w = new q(75e-4, 75e-4, 0.5, 3);
    w.translate(0, 0.25, 0);
    function M(L, $) {
      const O = new gt(L, 75e-4, 3, 64, $ * Math.PI * 2);
      return O.rotateY(Math.PI / 2), O.rotateX(Math.PI / 2), O;
    }
    function I() {
      const L = new Mt();
      return L.setAttribute("position", new Pt([0, 0, 0, 1, 1, 1], 3)), L;
    }
    const F = {
      X: [
        [new v(y, n), [0.5, 0, 0], [0, 0, -Math.PI / 2]],
        [new v(y, n), [-0.5, 0, 0], [0, 0, Math.PI / 2]],
        [new v(w, n), [0, 0, 0], [0, 0, -Math.PI / 2]]
      ],
      Y: [
        [new v(y, o), [0, 0.5, 0]],
        [new v(y, o), [0, -0.5, 0], [Math.PI, 0, 0]],
        [new v(w, o)]
      ],
      Z: [
        [new v(y, a), [0, 0, 0.5], [Math.PI / 2, 0, 0]],
        [new v(y, a), [0, 0, -0.5], [-Math.PI / 2, 0, 0]],
        [new v(w, a), null, [Math.PI / 2, 0, 0]]
      ],
      XYZ: [
        [new v(new Dt(0.1, 0), d), [0, 0, 0]]
      ],
      XY: [
        [new v(new V(0.15, 0.15, 0.01), c), [0.15, 0.15, 0]]
      ],
      YZ: [
        [new v(new V(0.15, 0.15, 0.01), h), [0, 0.15, 0.15], [0, Math.PI / 2, 0]]
      ],
      XZ: [
        [new v(new V(0.15, 0.15, 0.01), l), [0.15, 0, 0.15], [-Math.PI / 2, 0, 0]]
      ]
    }, Y = {
      X: [
        [new v(new q(0.2, 0, 0.6, 4), i), [0.3, 0, 0], [0, 0, -Math.PI / 2]],
        [new v(new q(0.2, 0, 0.6, 4), i), [-0.3, 0, 0], [0, 0, Math.PI / 2]]
      ],
      Y: [
        [new v(new q(0.2, 0, 0.6, 4), i), [0, 0.3, 0]],
        [new v(new q(0.2, 0, 0.6, 4), i), [0, -0.3, 0], [0, 0, Math.PI]]
      ],
      Z: [
        [new v(new q(0.2, 0, 0.6, 4), i), [0, 0, 0.3], [Math.PI / 2, 0, 0]],
        [new v(new q(0.2, 0, 0.6, 4), i), [0, 0, -0.3], [-Math.PI / 2, 0, 0]]
      ],
      XYZ: [
        [new v(new Dt(0.2, 0), i)]
      ],
      XY: [
        [new v(new V(0.2, 0.2, 0.01), i), [0.15, 0.15, 0]]
      ],
      YZ: [
        [new v(new V(0.2, 0.2, 0.01), i), [0, 0.15, 0.15], [0, Math.PI / 2, 0]]
      ],
      XZ: [
        [new v(new V(0.2, 0.2, 0.01), i), [0.15, 0, 0.15], [-Math.PI / 2, 0, 0]]
      ]
    }, X = {
      START: [
        [new v(new Dt(0.01, 2), s), null, null, null, "helper"]
      ],
      END: [
        [new v(new Dt(0.01, 2), s), null, null, null, "helper"]
      ],
      DELTA: [
        [new ht(I(), s), null, null, null, "helper"]
      ],
      X: [
        [new ht(g, s), [-1e3, 0, 0], null, [1e6, 1, 1], "helper"]
      ],
      Y: [
        [new ht(g, s), [0, -1e3, 0], [0, 0, Math.PI / 2], [1e6, 1, 1], "helper"]
      ],
      Z: [
        [new ht(g, s), [0, 0, -1e3], [0, -Math.PI / 2, 0], [1e6, 1, 1], "helper"]
      ]
    }, S = {
      XYZE: [
        [new v(M(0.5, 1), m), null, [0, Math.PI / 2, 0]]
      ],
      X: [
        [new v(M(0.5, 0.5), n)]
      ],
      Y: [
        [new v(M(0.5, 0.5), o), null, [0, 0, -Math.PI / 2]]
      ],
      Z: [
        [new v(M(0.5, 0.5), a), null, [0, Math.PI / 2, 0]]
      ],
      E: [
        [new v(M(0.75, 1), u), null, [0, Math.PI / 2, 0]]
      ]
    }, b = {
      AXIS: [
        [new ht(g, s), [-1e3, 0, 0], null, [1e6, 1, 1], "helper"]
      ]
    }, E = {
      XYZE: [
        [new v(new Qt(0.25, 10, 8), i)]
      ],
      X: [
        [new v(new gt(0.5, 0.1, 4, 24), i), [0, 0, 0], [0, -Math.PI / 2, -Math.PI / 2]]
      ],
      Y: [
        [new v(new gt(0.5, 0.1, 4, 24), i), [0, 0, 0], [Math.PI / 2, 0, 0]]
      ],
      Z: [
        [new v(new gt(0.5, 0.1, 4, 24), i), [0, 0, 0], [0, 0, -Math.PI / 2]]
      ],
      E: [
        [new v(new gt(0.75, 0.1, 2, 24), i)]
      ]
    }, P = {
      X: [
        [new v(x, n), [0.5, 0, 0], [0, 0, -Math.PI / 2]],
        [new v(w, n), [0, 0, 0], [0, 0, -Math.PI / 2]],
        [new v(x, n), [-0.5, 0, 0], [0, 0, Math.PI / 2]]
      ],
      Y: [
        [new v(x, o), [0, 0.5, 0]],
        [new v(w, o)],
        [new v(x, o), [0, -0.5, 0], [0, 0, Math.PI]]
      ],
      Z: [
        [new v(x, a), [0, 0, 0.5], [Math.PI / 2, 0, 0]],
        [new v(w, a), [0, 0, 0], [Math.PI / 2, 0, 0]],
        [new v(x, a), [0, 0, -0.5], [-Math.PI / 2, 0, 0]]
      ],
      XY: [
        [new v(new V(0.15, 0.15, 0.01), c), [0.15, 0.15, 0]]
      ],
      YZ: [
        [new v(new V(0.15, 0.15, 0.01), h), [0, 0.15, 0.15], [0, Math.PI / 2, 0]]
      ],
      XZ: [
        [new v(new V(0.15, 0.15, 0.01), l), [0.15, 0, 0.15], [-Math.PI / 2, 0, 0]]
      ],
      XYZ: [
        [new v(new V(0.1, 0.1, 0.1), d)]
      ]
    }, z = {
      X: [
        [new v(new q(0.2, 0, 0.6, 4), i), [0.3, 0, 0], [0, 0, -Math.PI / 2]],
        [new v(new q(0.2, 0, 0.6, 4), i), [-0.3, 0, 0], [0, 0, Math.PI / 2]]
      ],
      Y: [
        [new v(new q(0.2, 0, 0.6, 4), i), [0, 0.3, 0]],
        [new v(new q(0.2, 0, 0.6, 4), i), [0, -0.3, 0], [0, 0, Math.PI]]
      ],
      Z: [
        [new v(new q(0.2, 0, 0.6, 4), i), [0, 0, 0.3], [Math.PI / 2, 0, 0]],
        [new v(new q(0.2, 0, 0.6, 4), i), [0, 0, -0.3], [-Math.PI / 2, 0, 0]]
      ],
      XY: [
        [new v(new V(0.2, 0.2, 0.01), i), [0.15, 0.15, 0]]
      ],
      YZ: [
        [new v(new V(0.2, 0.2, 0.01), i), [0, 0.15, 0.15], [0, Math.PI / 2, 0]]
      ],
      XZ: [
        [new v(new V(0.2, 0.2, 0.01), i), [0.15, 0, 0.15], [-Math.PI / 2, 0, 0]]
      ],
      XYZ: [
        [new v(new V(0.2, 0.2, 0.2), i), [0, 0, 0]]
      ]
    }, T = {
      X: [
        [new ht(g, s), [-1e3, 0, 0], null, [1e6, 1, 1], "helper"]
      ],
      Y: [
        [new ht(g, s), [0, -1e3, 0], [0, 0, Math.PI / 2], [1e6, 1, 1], "helper"]
      ],
      Z: [
        [new ht(g, s), [0, 0, -1e3], [0, -Math.PI / 2, 0], [1e6, 1, 1], "helper"]
      ]
    };
    function D(L) {
      const $ = new Jt();
      for (const O in L)
        for (let mt = L[O].length; mt--; ) {
          const G = L[O][mt][0].clone(), Ct = L[O][mt][1], It = L[O][mt][2], Lt = L[O][mt][3], $e = L[O][mt][4];
          G.name = O, G.tag = $e, Ct && G.position.set(Ct[0], Ct[1], Ct[2]), It && G.rotation.set(It[0], It[1], It[2]), Lt && G.scale.set(Lt[0], Lt[1], Lt[2]), G.updateMatrix();
          const ae = G.geometry.clone();
          ae.applyMatrix4(G.matrix), G.geometry = ae, G.renderOrder = 1 / 0, G.position.set(0, 0, 0), G.rotation.set(0, 0, 0), G.scale.set(1, 1, 1), $.add(G);
        }
      return $;
    }
    this.gizmo = {}, this.picker = {}, this.helper = {}, this.add(this.gizmo.translate = D(F)), this.add(this.gizmo.rotate = D(S)), this.add(this.gizmo.scale = D(P)), this.add(this.picker.translate = D(Y)), this.add(this.picker.rotate = D(E)), this.add(this.picker.scale = D(z)), this.add(this.helper.translate = D(X)), this.add(this.helper.rotate = D(b)), this.add(this.helper.scale = D(T)), this.picker.translate.visible = !1, this.picker.rotate.visible = !1, this.picker.scale.visible = !1;
  }
  // updateMatrixWorld will update transformations and appearance of individual handles
  updateMatrixWorld(t) {
    const i = (this.mode === "scale" ? "local" : this.space) === "local" ? this.worldQuaternion : Ht;
    this.gizmo.translate.visible = this.mode === "translate", this.gizmo.rotate.visible = this.mode === "rotate", this.gizmo.scale.visible = this.mode === "scale", this.helper.translate.visible = this.mode === "translate", this.helper.rotate.visible = this.mode === "rotate", this.helper.scale.visible = this.mode === "scale";
    let s = [];
    s = s.concat(this.picker[this.mode].children), s = s.concat(this.gizmo[this.mode].children), s = s.concat(this.helper[this.mode].children);
    for (let n = 0; n < s.length; n++) {
      const o = s[n];
      o.visible = !0, o.rotation.set(0, 0, 0), o.position.copy(this.worldPosition);
      let a;
      if (this.camera.isOrthographicCamera ? a = (this.camera.top - this.camera.bottom) / this.camera.zoom : a = this.worldPosition.distanceTo(this.cameraPosition) * Math.min(1.9 * Math.tan(Math.PI * this.camera.fov / 360) / this.camera.zoom, 7), o.scale.set(1, 1, 1).multiplyScalar(a * this.size / 4), o.tag === "helper") {
        o.visible = !1, o.name === "AXIS" ? (o.visible = !!this.axis, this.axis === "X" && (H.setFromEuler(Ft.set(0, 0, 0)), o.quaternion.copy(i).multiply(H), Math.abs(R.copy(Et).applyQuaternion(i).dot(this.eye)) > 0.9 && (o.visible = !1)), this.axis === "Y" && (H.setFromEuler(Ft.set(0, 0, Math.PI / 2)), o.quaternion.copy(i).multiply(H), Math.abs(R.copy(ut).applyQuaternion(i).dot(this.eye)) > 0.9 && (o.visible = !1)), this.axis === "Z" && (H.setFromEuler(Ft.set(0, Math.PI / 2, 0)), o.quaternion.copy(i).multiply(H), Math.abs(R.copy(St).applyQuaternion(i).dot(this.eye)) > 0.9 && (o.visible = !1)), this.axis === "XYZE" && (H.setFromEuler(Ft.set(0, Math.PI / 2, 0)), R.copy(this.rotationAxis), o.quaternion.setFromRotationMatrix(Se.lookAt(Ee, R, ut)), o.quaternion.multiply(H), o.visible = this.dragging), this.axis === "E" && (o.visible = !1)) : o.name === "START" ? (o.position.copy(this.worldPositionStart), o.visible = this.dragging) : o.name === "END" ? (o.position.copy(this.worldPosition), o.visible = this.dragging) : o.name === "DELTA" ? (o.position.copy(this.worldPositionStart), o.quaternion.copy(this.worldQuaternionStart), Z.set(1e-10, 1e-10, 1e-10).add(this.worldPositionStart).sub(this.worldPosition).multiplyScalar(-1), Z.applyQuaternion(this.worldQuaternionStart.clone().invert()), o.scale.copy(Z), o.visible = this.dragging) : (o.quaternion.copy(i), this.dragging ? o.position.copy(this.worldPositionStart) : o.position.copy(this.worldPosition), this.axis && (o.visible = this.axis.search(o.name) !== -1));
        continue;
      }
      o.quaternion.copy(i), this.mode === "translate" || this.mode === "scale" ? (o.name === "X" && Math.abs(R.copy(Et).applyQuaternion(i).dot(this.eye)) > 0.99 && (o.scale.set(1e-10, 1e-10, 1e-10), o.visible = !1), o.name === "Y" && Math.abs(R.copy(ut).applyQuaternion(i).dot(this.eye)) > 0.99 && (o.scale.set(1e-10, 1e-10, 1e-10), o.visible = !1), o.name === "Z" && Math.abs(R.copy(St).applyQuaternion(i).dot(this.eye)) > 0.99 && (o.scale.set(1e-10, 1e-10, 1e-10), o.visible = !1), o.name === "XY" && Math.abs(R.copy(St).applyQuaternion(i).dot(this.eye)) < 0.2 && (o.scale.set(1e-10, 1e-10, 1e-10), o.visible = !1), o.name === "YZ" && Math.abs(R.copy(Et).applyQuaternion(i).dot(this.eye)) < 0.2 && (o.scale.set(1e-10, 1e-10, 1e-10), o.visible = !1), o.name === "XZ" && Math.abs(R.copy(ut).applyQuaternion(i).dot(this.eye)) < 0.2 && (o.scale.set(1e-10, 1e-10, 1e-10), o.visible = !1)) : this.mode === "rotate" && (Rt.copy(i), R.copy(this.eye).applyQuaternion(H.copy(i).invert()), o.name.search("E") !== -1 && o.quaternion.setFromRotationMatrix(Se.lookAt(this.eye, Ee, ut)), o.name === "X" && (H.setFromAxisAngle(Et, Math.atan2(-R.y, R.z)), H.multiplyQuaternions(Rt, H), o.quaternion.copy(H)), o.name === "Y" && (H.setFromAxisAngle(ut, Math.atan2(R.x, R.z)), H.multiplyQuaternions(Rt, H), o.quaternion.copy(H)), o.name === "Z" && (H.setFromAxisAngle(St, Math.atan2(R.y, R.x)), H.multiplyQuaternions(Rt, H), o.quaternion.copy(H))), o.visible = o.visible && (o.name.indexOf("X") === -1 || this.showX), o.visible = o.visible && (o.name.indexOf("Y") === -1 || this.showY), o.visible = o.visible && (o.name.indexOf("Z") === -1 || this.showZ), o.visible = o.visible && (o.name.indexOf("E") === -1 || this.showX && this.showY && this.showZ), o.material._color = o.material._color || o.material.color.clone(), o.material._opacity = o.material._opacity || o.material.opacity, o.material.color.copy(o.material._color), o.material.opacity = o.material._opacity, this.enabled && this.axis && (o.name === this.axis ? (o.material.color.copy(this.materialLib.active.color), o.material.opacity = 1) : this.axis.split("").some(function(h) {
        return o.name === h;
      }) && (o.material.color.copy(this.materialLib.active.color), o.material.opacity = 1));
    }
    super.updateMatrixWorld(t);
  }
}
class Ss extends v {
  constructor() {
    super(
      new Kt(1e5, 1e5, 2, 2),
      new Xt({ visible: !1, wireframe: !0, side: ze, transparent: !0, opacity: 0.1, toneMapped: !1 })
    ), this.isTransformControlsPlane = !0, this.type = "TransformControlsPlane";
  }
  updateMatrixWorld(t) {
    let e = this.space;
    switch (this.position.copy(this.worldPosition), this.mode === "scale" && (e = "local"), Yt.copy(Et).applyQuaternion(e === "local" ? this.worldQuaternion : Ht), vt.copy(ut).applyQuaternion(e === "local" ? this.worldQuaternion : Ht), bt.copy(St).applyQuaternion(e === "local" ? this.worldQuaternion : Ht), R.copy(vt), this.mode) {
      case "translate":
      case "scale":
        switch (this.axis) {
          case "X":
            R.copy(this.eye).cross(Yt), at.copy(Yt).cross(R);
            break;
          case "Y":
            R.copy(this.eye).cross(vt), at.copy(vt).cross(R);
            break;
          case "Z":
            R.copy(this.eye).cross(bt), at.copy(bt).cross(R);
            break;
          case "XY":
            at.copy(bt);
            break;
          case "YZ":
            at.copy(Yt);
            break;
          case "XZ":
            R.copy(bt), at.copy(vt);
            break;
          case "XYZ":
          case "E":
            at.set(0, 0, 0);
            break;
        }
        break;
      case "rotate":
      default:
        at.set(0, 0, 0);
    }
    at.length() === 0 ? this.quaternion.copy(this.cameraQuaternion) : (Me.lookAt(Z.set(0, 0, 0), at, R), this.quaternion.setFromRotationMatrix(Me)), super.updateMatrixWorld(t);
  }
}
class Pe {
  constructor(t) {
    k(this, "onActionComplete");
    k(this, "controls");
    k(this, "isShiftPressed", !1);
    k(this, "camera");
    k(this, "actions");
    k(this, "keymap");
    k(this, "selectable", []);
    k(this, "intersected", null);
    k(this, "raycaster", new Te());
    k(this, "pointer", new tt());
    k(this, "excludeTypes", ["LineSegments", "DirectionalLight", "HemisphereLight", "Line"]);
    this.onActionComplete = t;
  }
  action({ camera: t, renderer: e, scene: i, components: { orbit: s } }) {
    this.camera = t, this.controls = new ws(t, e.domElement);
    const n = this.controls.getHelper();
    n.name = "transform-controls", i.add(n), this.actions = this.initActionsList(this.controls), this.keymap = this.initKeymap(this.actions), this.selectable = i.children.filter(({ type: o }) => !this.excludeTypes.includes(o)).filter(({ children: o }) => o.every((a) => a.type !== "Line")).filter(({ name: o }) => o !== "transform-controls"), this.bindEvents(s);
  }
  initActionsList(t) {
    return {
      translate: () => {
        t.setMode("translate");
      },
      rotate: () => {
        t.setMode("rotate");
      },
      scale: () => {
        t.setMode("scale");
      },
      xAxis: () => {
        t.showX = !0, t.showY = t.showY === t.showZ ? !t.showY : !1, t.showZ = t.showY;
      },
      yAxis: () => {
        t.showX = t.showX === t.showZ ? !t.showX : !1, t.showY = !0, t.showZ = t.showX;
      },
      zAxis: () => {
        t.showX = t.showX === t.showY ? !t.showX : !1, t.showY = t.showX, t.showZ = !0;
      },
      pick: (e = !0) => {
        this.isShiftPressed = e;
      },
      snap: () => {
        t.translationSnap ? (t.setTranslationSnap(null), t.setRotationSnap(null)) : (t.setTranslationSnap(1), t.setRotationSnap(15 * (Math.PI / 180)));
      },
      worldLocalSpace: () => {
        t.setSpace(t.space === "local" ? "world" : "local");
      },
      reset: () => {
        t.detach(), t.showX = t.showY = t.showZ = !0;
      },
      controlsSizeBigger: () => {
        t.setSize(t.size + 0.1);
      },
      controlsSizeSmaller: () => {
        t.setSize(Math.max(t.size - 0.1, 0.1));
      }
    };
  }
  initKeymap(t) {
    return {
      x: () => t.xAxis(),
      y: () => t.yAxis(),
      z: () => t.zAxis(),
      w: () => t.translate(),
      g: () => t.translate(),
      r: () => t.rotate(),
      s: () => t.scale(),
      q: () => t.worldLocalSpace(),
      shift: (e) => t.pick(e),
      control: () => t.snap(),
      escape: () => t.reset(),
      "+": () => t.controlsSizeBigger(),
      "=": () => t.controlsSizeBigger(),
      "-": () => t.controlsSizeSmaller(),
      _: () => t.controlsSizeSmaller()
    };
  }
  bindEvents(t) {
    var o, a;
    if (!(t instanceof Le))
      return;
    (o = this.controls) == null || o.addEventListener("mouseUp", () => {
      var h, l;
      (l = this.onActionComplete) == null || l.call(this, (h = this.controls) == null ? void 0 : h.object);
    }), (a = this.controls) == null || a.addEventListener("dragging-changed", (h) => {
      t != null && t.controls && (t.controls.enabled = !h.value);
    }), window.addEventListener("keydown", (h) => {
      var d, u;
      const l = h.key.toLowerCase(), c = l === "shift";
      (u = (d = this.keymap)[l]) == null || u.call(d, c);
    }), window.addEventListener("keyup", (h) => {
      var c;
      const l = h.key.toLowerCase();
      l === "shift" && ((c = this.keymap) == null || c[l](!1));
    });
    const e = "ontouchstart" in document.documentElement, i = window.navigator.maxTouchPoints >= 1, n = e || i ? "touchstart" : "mousedown";
    window.addEventListener(n, (h) => {
      this.handleClick(h instanceof TouchEvent ? h.changedTouches[0] : h);
    });
  }
  handleClick(t) {
    var i, s;
    if (!((i = this.controls) != null && i.enabled) || !this.isShiftPressed)
      return;
    this.pointer.x = t.clientX / window.innerWidth * 2 - 1, this.pointer.y = -(t.clientY / window.innerHeight) * 2 + 1, this.raycaster.setFromCamera(this.pointer, this.camera);
    const [e] = this.raycaster.intersectObjects(
      this.selectable,
      !0
    );
    e && e.object !== this.intersected && (this.intersected = e.object), this.intersected && (this.controls.attach(this.intersected), (s = this.onActionComplete) == null || s.call(this, this.intersected));
  }
  toggle(t, e) {
    this.controls || this.action(e), this.controls && (this.controls.enabled = t, this.controls.detach());
  }
}
class Ms {
  constructor() {
    k(this, "options");
    k(this, "components");
    k(this, "panel");
    k(this, "scene");
    k(this, "renderer");
    k(this, "camera");
    k(this, "physics");
    this.options = {
      scene: !1,
      props: !1,
      transform: !1,
      orbit: !1,
      physics: !1
    };
  }
  init({ scene: t, renderer: e, camera: i, physics: s }, n = {}) {
    var o, a;
    if (!this.panel) {
      this.scene = t, this.renderer = e, this.camera = i, this.physics = s, this.options = { ...this.options, ...n }, this.panel = new Tt({ width: 100, title: "Debug" }), this.panel.domElement.setAttribute("id", "debug-panel"), this.components = {
        props: new $t(),
        orbit: new Le(),
        physics: new fs(),
        scene: new ms(this.onSceneAction.bind(this)),
        transform: new Pe(this.onTransformAction.bind(this))
      };
      for (const h of Object.keys(this.options))
        this.createToggle(h), this.options[h] && ((a = (o = this.components[h]).action) == null || a.call(o, this));
      this.tweakPanelStyle();
    }
  }
  tweakPanelStyle() {
    const t = document.createElement("style");
    t.textContent = `
            #debug-panel {
                top: 0;
                left: 0;
            }
            #debug-panel .lil-controller > .lil-name {
                width: 80%;
            }
        `, document.head.appendChild(t);
  }
  createToggle(t) {
    this.panel.add(this.options, t).onChange((e) => {
      var i;
      this.options[t] = e, (i = this.components[t]) == null || i.toggle(e, this);
    });
  }
  addCustomToggle({ label: t, initialValue: e, handler: i }) {
    if (Object.hasOwn(this.options, t)) {
      console.error(`a toggle with the name '${t}' already exists`);
      return;
    }
    this.options[t] = e, this.components[t] = {
      toggle: (s) => i(s)
    }, this.createToggle(t);
  }
  onSceneAction(t) {
    this.components.props instanceof $t && this.components.props.action(this, t), this.components.transform instanceof Pe && this.components.transform.controls.attach(t), this.logObject(t);
  }
  onTransformAction(t) {
    this.components.props instanceof $t && this.components.props.action(this, t), this.logObject(t);
  }
  logObject(t) {
    t && (console.log(`
`), console.log("target:   ", t), console.log("position: ", t.position), console.log("rotation: ", t.rotation), console.log("scale:    ", t.scale));
  }
  update(t) {
    var e, i, s, n;
    (i = (e = this.components.orbit).update) == null || i.call(e), (n = (s = this.components.physics).update) == null || n.call(s, t);
  }
}
const zs = new Ms();
export {
  Ms as Debug,
  zs as debug
};
