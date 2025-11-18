var Qt = Object.defineProperty;
var qt = (o, t, e) => t in o ? Qt(o, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : o[t] = e;
var _ = (o, t, e) => qt(o, typeof t != "symbol" ? t + "" : t, e);
import { Ray as Wt, Plane as Bt, MathUtils as Kt, Vector3 as d, Controls as $t, MOUSE as q, TOUCH as Q, Quaternion as O, Spherical as xt, Vector2 as k, FrontSide as Gt, BackSide as Jt, DoubleSide as It, MeshLambertMaterial as te, MeshBasicMaterial as yt, MeshPhongMaterial as ee, MeshStandardMaterial as ie, ClampToEdgeWrapping as se, RepeatWrapping as ne, MirroredRepeatWrapping as oe, Raycaster as Yt, Euler as ae, Matrix4 as Rt, Object3D as gt, LineBasicMaterial as re, CylinderGeometry as A, BoxGeometry as P, BufferGeometry as vt, Float32BufferAttribute as Et, Mesh as l, OctahedronGeometry as at, Line as H, SphereGeometry as le, TorusGeometry as W, PlaneGeometry as he } from "three";
/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.21.0
 * @author George Michael Brower
 * @license MIT
 */
class Y {
  constructor(t, e, i, s, a = "div") {
    this.parent = t, this.object = e, this.property = i, this._disabled = !1, this._hidden = !1, this.initialValue = this.getValue(), this.domElement = document.createElement(a), this.domElement.classList.add("lil-controller"), this.domElement.classList.add(s), this.$name = document.createElement("div"), this.$name.classList.add("lil-name"), Y.nextNameID = Y.nextNameID || 0, this.$name.id = `lil-gui-name-${++Y.nextNameID}`, this.$widget = document.createElement("div"), this.$widget.classList.add("lil-widget"), this.$disable = this.$widget, this.domElement.appendChild(this.$name), this.domElement.appendChild(this.$widget), this.domElement.addEventListener("keydown", (n) => n.stopPropagation()), this.domElement.addEventListener("keyup", (n) => n.stopPropagation()), this.parent.children.push(this), this.parent.controllers.push(this), this.parent.$children.appendChild(this.domElement), this._listenCallback = this._listenCallback.bind(this), this.name(i);
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
class ce extends Y {
  constructor(t, e, i) {
    super(t, e, i, "lil-boolean", "label"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "checkbox"), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$widget.appendChild(this.$input), this.$input.addEventListener("change", () => {
      this.setValue(this.$input.checked), this._callOnFinishChange();
    }), this.$disable = this.$input, this.updateDisplay();
  }
  updateDisplay() {
    return this.$input.checked = this.getValue(), this;
  }
}
function _t(o) {
  let t, e;
  return (t = o.match(/(#|0x)?([a-f0-9]{6})/i)) ? e = t[2] : (t = o.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/)) ? e = parseInt(t[1]).toString(16).padStart(2, 0) + parseInt(t[2]).toString(16).padStart(2, 0) + parseInt(t[3]).toString(16).padStart(2, 0) : (t = o.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i)) && (e = t[1] + t[1] + t[2] + t[2] + t[3] + t[3]), e ? "#" + e : !1;
}
const de = {
  isPrimitive: !0,
  match: (o) => typeof o == "string",
  fromHexString: _t,
  toHexString: _t
}, tt = {
  isPrimitive: !0,
  match: (o) => typeof o == "number",
  fromHexString: (o) => parseInt(o.substring(1), 16),
  toHexString: (o) => "#" + o.toString(16).padStart(6, 0)
}, pe = {
  isPrimitive: !1,
  match: (o) => Array.isArray(o) || ArrayBuffer.isView(o),
  fromHexString(o, t, e = 1) {
    const i = tt.fromHexString(o);
    t[0] = (i >> 16 & 255) / 255 * e, t[1] = (i >> 8 & 255) / 255 * e, t[2] = (i & 255) / 255 * e;
  },
  toHexString([o, t, e], i = 1) {
    i = 255 / i;
    const s = o * i << 16 ^ t * i << 8 ^ e * i << 0;
    return tt.toHexString(s);
  }
}, ue = {
  isPrimitive: !1,
  match: (o) => Object(o) === o,
  fromHexString(o, t, e = 1) {
    const i = tt.fromHexString(o);
    t.r = (i >> 16 & 255) / 255 * e, t.g = (i >> 8 & 255) / 255 * e, t.b = (i & 255) / 255 * e;
  },
  toHexString({ r: o, g: t, b: e }, i = 1) {
    i = 255 / i;
    const s = o * i << 16 ^ t * i << 8 ^ e * i << 0;
    return tt.toHexString(s);
  }
}, me = [de, tt, pe, ue];
function fe(o) {
  return me.find((t) => t.match(o));
}
class ge extends Y {
  constructor(t, e, i, s) {
    super(t, e, i, "lil-color"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "color"), this.$input.setAttribute("tabindex", -1), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$text = document.createElement("input"), this.$text.setAttribute("type", "text"), this.$text.setAttribute("spellcheck", "false"), this.$text.setAttribute("aria-labelledby", this.$name.id), this.$display = document.createElement("div"), this.$display.classList.add("lil-display"), this.$display.appendChild(this.$input), this.$widget.appendChild(this.$display), this.$widget.appendChild(this.$text), this._format = fe(this.initialValue), this._rgbScale = s, this._initialValueHexString = this.save(), this._textFocused = !1, this.$input.addEventListener("input", () => {
      this._setValueFromHexString(this.$input.value);
    }), this.$input.addEventListener("blur", () => {
      this._callOnFinishChange();
    }), this.$text.addEventListener("input", () => {
      const a = _t(this.$text.value);
      a && this._setValueFromHexString(a);
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
class pt extends Y {
  constructor(t, e, i) {
    super(t, e, i, "lil-function"), this.$button = document.createElement("button"), this.$button.appendChild(this.$name), this.$widget.appendChild(this.$button), this.$button.addEventListener("click", (s) => {
      s.preventDefault(), this.getValue().call(this.object), this._callOnChange();
    }), this.$button.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$disable = this.$button;
  }
}
class _e extends Y {
  constructor(t, e, i, s, a, n) {
    super(t, e, i, "lil-number"), this._initInput(), this.min(s), this.max(a);
    const r = n !== void 0;
    this.step(r ? n : this._getImplicitStep(), r), this.updateDisplay();
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
      let h = parseFloat(this.$input.value);
      isNaN(h) || (this._stepExplicit && (h = this._snap(h)), this.setValue(this._clamp(h)));
    }, i = (h) => {
      const m = parseFloat(this.$input.value);
      isNaN(m) || (this._snapClampSetValue(m + h), this.$input.value = this.getValue());
    }, s = (h) => {
      h.key === "Enter" && this.$input.blur(), h.code === "ArrowUp" && (h.preventDefault(), i(this._step * this._arrowKeyMultiplier(h))), h.code === "ArrowDown" && (h.preventDefault(), i(this._step * this._arrowKeyMultiplier(h) * -1));
    }, a = (h) => {
      this._inputFocused && (h.preventDefault(), i(this._step * this._normalizeMouseWheel(h)));
    };
    let n = !1, r, c, u, w, b;
    const v = 5, z = (h) => {
      r = h.clientX, c = u = h.clientY, n = !0, w = this.getValue(), b = 0, window.addEventListener("mousemove", R), window.addEventListener("mouseup", E);
    }, R = (h) => {
      if (n) {
        const m = h.clientX - r, D = h.clientY - c;
        Math.abs(D) > v ? (h.preventDefault(), this.$input.blur(), n = !1, this._setDraggingStyle(!0, "vertical")) : Math.abs(m) > v && E();
      }
      if (!n) {
        const m = h.clientY - u;
        b -= m * this._step * this._arrowKeyMultiplier(h), w + b > this._max ? b = this._max - w : w + b < this._min && (b = this._min - w), this._snapClampSetValue(w + b);
      }
      u = h.clientY;
    }, E = () => {
      this._setDraggingStyle(!1, "vertical"), this._callOnFinishChange(), window.removeEventListener("mousemove", R), window.removeEventListener("mouseup", E);
    }, T = () => {
      this._inputFocused = !0;
    }, p = () => {
      this._inputFocused = !1, this.updateDisplay(), this._callOnFinishChange();
    };
    this.$input.addEventListener("input", e), this.$input.addEventListener("keydown", s), this.$input.addEventListener("wheel", a, { passive: !1 }), this.$input.addEventListener("mousedown", z), this.$input.addEventListener("focus", T), this.$input.addEventListener("blur", p);
  }
  _initSlider() {
    this._hasSlider = !0, this.$slider = document.createElement("div"), this.$slider.classList.add("lil-slider"), this.$fill = document.createElement("div"), this.$fill.classList.add("lil-fill"), this.$slider.appendChild(this.$fill), this.$widget.insertBefore(this.$slider, this.$input), this.domElement.classList.add("lil-has-slider");
    const t = (p, h, m, D, X) => (p - h) / (m - h) * (X - D) + D, e = (p) => {
      const h = this.$slider.getBoundingClientRect();
      let m = t(p, h.left, h.right, this._min, this._max);
      this._snapClampSetValue(m);
    }, i = (p) => {
      this._setDraggingStyle(!0), e(p.clientX), window.addEventListener("mousemove", s), window.addEventListener("mouseup", a);
    }, s = (p) => {
      e(p.clientX);
    }, a = () => {
      this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("mousemove", s), window.removeEventListener("mouseup", a);
    };
    let n = !1, r, c;
    const u = (p) => {
      p.preventDefault(), this._setDraggingStyle(!0), e(p.touches[0].clientX), n = !1;
    }, w = (p) => {
      p.touches.length > 1 || (this._hasScrollBar ? (r = p.touches[0].clientX, c = p.touches[0].clientY, n = !0) : u(p), window.addEventListener("touchmove", b, { passive: !1 }), window.addEventListener("touchend", v));
    }, b = (p) => {
      if (n) {
        const h = p.touches[0].clientX - r, m = p.touches[0].clientY - c;
        Math.abs(h) > Math.abs(m) ? u(p) : (window.removeEventListener("touchmove", b), window.removeEventListener("touchend", v));
      } else
        p.preventDefault(), e(p.touches[0].clientX);
    }, v = () => {
      this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("touchmove", b), window.removeEventListener("touchend", v);
    }, z = this._callOnFinishChange.bind(this), R = 400;
    let E;
    const T = (p) => {
      if (Math.abs(p.deltaX) < Math.abs(p.deltaY) && this._hasScrollBar) return;
      p.preventDefault();
      const m = this._normalizeMouseWheel(p) * this._step;
      this._snapClampSetValue(this.getValue() + m), this.$input.value = this.getValue(), clearTimeout(E), E = setTimeout(z, R);
    };
    this.$slider.addEventListener("mousedown", i), this.$slider.addEventListener("touchstart", w, { passive: !1 }), this.$slider.addEventListener("wheel", T, { passive: !1 });
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
class ye extends Y {
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
class we extends Y {
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
var be = `.lil-gui {
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
function xe(o) {
  const t = document.createElement("style");
  t.innerHTML = o;
  const e = document.querySelector("head link[rel=stylesheet], head style");
  e ? document.head.insertBefore(t, e) : document.head.appendChild(t);
}
let St = !1;
class et {
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
    title: a = "Controls",
    closeFolders: n = !1,
    injectStyles: r = !0,
    touchStyles: c = !0
  } = {}) {
    if (this.parent = t, this.root = t ? t.root : this, this.children = [], this.controllers = [], this.folders = [], this._closed = !1, this._hidden = !1, this.domElement = document.createElement("div"), this.domElement.classList.add("lil-gui"), this.$title = document.createElement("button"), this.$title.classList.add("lil-title"), this.$title.setAttribute("aria-expanded", !0), this.$title.addEventListener("click", () => this.openAnimated(this._closed)), this.$title.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$children = document.createElement("div"), this.$children.classList.add("lil-children"), this.domElement.appendChild(this.$title), this.domElement.appendChild(this.$children), this.title(a), this.parent) {
      this.parent.children.push(this), this.parent.folders.push(this), this.parent.$children.appendChild(this.domElement);
      return;
    }
    this.domElement.classList.add("lil-root"), c && this.domElement.classList.add("lil-allow-touch-styles"), !St && r && (xe(be), St = !0), i ? i.appendChild(this.domElement) : e && (this.domElement.classList.add("lil-auto-place", "autoPlace"), document.body.appendChild(this.domElement)), s && this.domElement.style.setProperty("--width", s + "px"), this._closeFolders = n;
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
  add(t, e, i, s, a) {
    if (Object(i) === i)
      return new ye(this, t, e, i);
    const n = t[e];
    switch (typeof n) {
      case "number":
        return new _e(this, t, e, i, s, a);
      case "boolean":
        return new ce(this, t, e);
      case "string":
        return new we(this, t, e);
      case "function":
        return new pt(this, t, e);
    }
    console.error(`gui.add failed
	property:`, e, `
	object:`, t, `
	value:`, n);
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
    return new ge(this, t, e, i);
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
    const e = new et({ parent: this, title: t });
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
      i instanceof pt || i._name in t.controllers && i.load(t.controllers[i._name]);
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
      if (!(i instanceof pt)) {
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
      const i = (a) => {
        a.target === this.$children && (this.$children.style.height = "", this.domElement.classList.remove("lil-transition"), this.$children.removeEventListener("transitionend", i));
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
const Pt = { type: "change" }, wt = { type: "start" }, jt = { type: "end" }, rt = new Wt(), Mt = new Bt(), ve = Math.cos(70 * Kt.DEG2RAD), x = new d(), C = 2 * Math.PI, f = {
  NONE: -1,
  ROTATE: 0,
  DOLLY: 1,
  PAN: 2,
  TOUCH_ROTATE: 3,
  TOUCH_PAN: 4,
  TOUCH_DOLLY_PAN: 5,
  TOUCH_DOLLY_ROTATE: 6
}, ut = 1e-6;
class Ee extends $t {
  /**
   * Constructs a new controls instance.
   *
   * @param {Object3D} object - The object that is managed by the controls.
   * @param {?HTMLDOMElement} domElement - The HTML element used for event listeners.
   */
  constructor(t, e = null) {
    super(t, e), this.state = f.NONE, this.target = new d(), this.cursor = new d(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minTargetRadius = 0, this.maxTargetRadius = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = 0.05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.keyRotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.zoomToCursor = !1, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: q.ROTATE, MIDDLE: q.DOLLY, RIGHT: q.PAN }, this.touches = { ONE: Q.ROTATE, TWO: Q.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this._lastPosition = new d(), this._lastQuaternion = new O(), this._lastTargetPosition = new d(), this._quat = new O().setFromUnitVectors(t.up, new d(0, 1, 0)), this._quatInverse = this._quat.clone().invert(), this._spherical = new xt(), this._sphericalDelta = new xt(), this._scale = 1, this._panOffset = new d(), this._rotateStart = new k(), this._rotateEnd = new k(), this._rotateDelta = new k(), this._panStart = new k(), this._panEnd = new k(), this._panDelta = new k(), this._dollyStart = new k(), this._dollyEnd = new k(), this._dollyDelta = new k(), this._dollyDirection = new d(), this._mouse = new k(), this._performCursorZoom = !1, this._pointers = [], this._pointerPositions = {}, this._controlActive = !1, this._onPointerMove = Pe.bind(this), this._onPointerDown = Se.bind(this), this._onPointerUp = Me.bind(this), this._onContextMenu = Oe.bind(this), this._onMouseWheel = Te.bind(this), this._onKeyDown = De.bind(this), this._onTouchStart = Le.bind(this), this._onTouchMove = ke.bind(this), this._onMouseDown = Ae.bind(this), this._onMouseMove = Ce.bind(this), this._interceptControlDown = $e.bind(this), this._interceptControlUp = Ie.bind(this), this.domElement !== null && this.connect(this.domElement), this.update();
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
    this.target.copy(this.target0), this.object.position.copy(this.position0), this.object.zoom = this.zoom0, this.object.updateProjectionMatrix(), this.dispatchEvent(Pt), this.update(), this.state = f.NONE;
  }
  update(t = null) {
    const e = this.object.position;
    x.copy(e).sub(this.target), x.applyQuaternion(this._quat), this._spherical.setFromVector3(x), this.autoRotate && this.state === f.NONE && this._rotateLeft(this._getAutoRotationAngle(t)), this.enableDamping ? (this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor, this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor) : (this._spherical.theta += this._sphericalDelta.theta, this._spherical.phi += this._sphericalDelta.phi);
    let i = this.minAzimuthAngle, s = this.maxAzimuthAngle;
    isFinite(i) && isFinite(s) && (i < -Math.PI ? i += C : i > Math.PI && (i -= C), s < -Math.PI ? s += C : s > Math.PI && (s -= C), i <= s ? this._spherical.theta = Math.max(i, Math.min(s, this._spherical.theta)) : this._spherical.theta = this._spherical.theta > (i + s) / 2 ? Math.max(i, this._spherical.theta) : Math.min(s, this._spherical.theta)), this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi)), this._spherical.makeSafe(), this.enableDamping === !0 ? this.target.addScaledVector(this._panOffset, this.dampingFactor) : this.target.add(this._panOffset), this.target.sub(this.cursor), this.target.clampLength(this.minTargetRadius, this.maxTargetRadius), this.target.add(this.cursor);
    let a = !1;
    if (this.zoomToCursor && this._performCursorZoom || this.object.isOrthographicCamera)
      this._spherical.radius = this._clampDistance(this._spherical.radius);
    else {
      const n = this._spherical.radius;
      this._spherical.radius = this._clampDistance(this._spherical.radius * this._scale), a = n != this._spherical.radius;
    }
    if (x.setFromSpherical(this._spherical), x.applyQuaternion(this._quatInverse), e.copy(this.target).add(x), this.object.lookAt(this.target), this.enableDamping === !0 ? (this._sphericalDelta.theta *= 1 - this.dampingFactor, this._sphericalDelta.phi *= 1 - this.dampingFactor, this._panOffset.multiplyScalar(1 - this.dampingFactor)) : (this._sphericalDelta.set(0, 0, 0), this._panOffset.set(0, 0, 0)), this.zoomToCursor && this._performCursorZoom) {
      let n = null;
      if (this.object.isPerspectiveCamera) {
        const r = x.length();
        n = this._clampDistance(r * this._scale);
        const c = r - n;
        this.object.position.addScaledVector(this._dollyDirection, c), this.object.updateMatrixWorld(), a = !!c;
      } else if (this.object.isOrthographicCamera) {
        const r = new d(this._mouse.x, this._mouse.y, 0);
        r.unproject(this.object);
        const c = this.object.zoom;
        this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), this.object.updateProjectionMatrix(), a = c !== this.object.zoom;
        const u = new d(this._mouse.x, this._mouse.y, 0);
        u.unproject(this.object), this.object.position.sub(u).add(r), this.object.updateMatrixWorld(), n = x.length();
      } else
        console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), this.zoomToCursor = !1;
      n !== null && (this.screenSpacePanning ? this.target.set(0, 0, -1).transformDirection(this.object.matrix).multiplyScalar(n).add(this.object.position) : (rt.origin.copy(this.object.position), rt.direction.set(0, 0, -1).transformDirection(this.object.matrix), Math.abs(this.object.up.dot(rt.direction)) < ve ? this.object.lookAt(this.target) : (Mt.setFromNormalAndCoplanarPoint(this.object.up, this.target), rt.intersectPlane(Mt, this.target))));
    } else if (this.object.isOrthographicCamera) {
      const n = this.object.zoom;
      this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), n !== this.object.zoom && (this.object.updateProjectionMatrix(), a = !0);
    }
    return this._scale = 1, this._performCursorZoom = !1, a || this._lastPosition.distanceToSquared(this.object.position) > ut || 8 * (1 - this._lastQuaternion.dot(this.object.quaternion)) > ut || this._lastTargetPosition.distanceToSquared(this.target) > ut ? (this.dispatchEvent(Pt), this._lastPosition.copy(this.object.position), this._lastQuaternion.copy(this.object.quaternion), this._lastTargetPosition.copy(this.target), !0) : !1;
  }
  _getAutoRotationAngle(t) {
    return t !== null ? C / 60 * this.autoRotateSpeed * t : C / 60 / 60 * this.autoRotateSpeed;
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
    x.setFromMatrixColumn(e, 0), x.multiplyScalar(-t), this._panOffset.add(x);
  }
  _panUp(t, e) {
    this.screenSpacePanning === !0 ? x.setFromMatrixColumn(e, 1) : (x.setFromMatrixColumn(e, 0), x.crossVectors(this.object.up, x)), x.multiplyScalar(t), this._panOffset.add(x);
  }
  // deltaX and deltaY are in pixels; right and down are positive
  _pan(t, e) {
    const i = this.domElement;
    if (this.object.isPerspectiveCamera) {
      const s = this.object.position;
      x.copy(s).sub(this.target);
      let a = x.length();
      a *= Math.tan(this.object.fov / 2 * Math.PI / 180), this._panLeft(2 * t * a / i.clientHeight, this.object.matrix), this._panUp(2 * e * a / i.clientHeight, this.object.matrix);
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
    const i = this.domElement.getBoundingClientRect(), s = t - i.left, a = e - i.top, n = i.width, r = i.height;
    this._mouse.x = s / n * 2 - 1, this._mouse.y = -(a / r) * 2 + 1, this._dollyDirection.set(this._mouse.x, this._mouse.y, 1).unproject(this.object).sub(this.object.position).normalize();
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
    this._rotateLeft(C * this._rotateDelta.x / e.clientHeight), this._rotateUp(C * this._rotateDelta.y / e.clientHeight), this._rotateStart.copy(this._rotateEnd), this.update();
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
        t.ctrlKey || t.metaKey || t.shiftKey ? this.enableRotate && this._rotateUp(C * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(0, this.keyPanSpeed), e = !0;
        break;
      case this.keys.BOTTOM:
        t.ctrlKey || t.metaKey || t.shiftKey ? this.enableRotate && this._rotateUp(-C * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(0, -this.keyPanSpeed), e = !0;
        break;
      case this.keys.LEFT:
        t.ctrlKey || t.metaKey || t.shiftKey ? this.enableRotate && this._rotateLeft(C * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(this.keyPanSpeed, 0), e = !0;
        break;
      case this.keys.RIGHT:
        t.ctrlKey || t.metaKey || t.shiftKey ? this.enableRotate && this._rotateLeft(-C * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(-this.keyPanSpeed, 0), e = !0;
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
    const e = this._getSecondPointerPosition(t), i = t.pageX - e.x, s = t.pageY - e.y, a = Math.sqrt(i * i + s * s);
    this._dollyStart.set(0, a);
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
      const i = this._getSecondPointerPosition(t), s = 0.5 * (t.pageX + i.x), a = 0.5 * (t.pageY + i.y);
      this._rotateEnd.set(s, a);
    }
    this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const e = this.domElement;
    this._rotateLeft(C * this._rotateDelta.x / e.clientHeight), this._rotateUp(C * this._rotateDelta.y / e.clientHeight), this._rotateStart.copy(this._rotateEnd);
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
    const e = this._getSecondPointerPosition(t), i = t.pageX - e.x, s = t.pageY - e.y, a = Math.sqrt(i * i + s * s);
    this._dollyEnd.set(0, a), this._dollyDelta.set(0, Math.pow(this._dollyEnd.y / this._dollyStart.y, this.zoomSpeed)), this._dollyOut(this._dollyDelta.y), this._dollyStart.copy(this._dollyEnd);
    const n = (t.pageX + e.x) * 0.5, r = (t.pageY + e.y) * 0.5;
    this._updateZoomParameters(n, r);
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
    e === void 0 && (e = new k(), this._pointerPositions[t.pointerId] = e), e.set(t.pageX, t.pageY);
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
function Se(o) {
  this.enabled !== !1 && (this._pointers.length === 0 && (this.domElement.setPointerCapture(o.pointerId), this.domElement.addEventListener("pointermove", this._onPointerMove), this.domElement.addEventListener("pointerup", this._onPointerUp)), !this._isTrackingPointer(o) && (this._addPointer(o), o.pointerType === "touch" ? this._onTouchStart(o) : this._onMouseDown(o)));
}
function Pe(o) {
  this.enabled !== !1 && (o.pointerType === "touch" ? this._onTouchMove(o) : this._onMouseMove(o));
}
function Me(o) {
  switch (this._removePointer(o), this._pointers.length) {
    case 0:
      this.domElement.releasePointerCapture(o.pointerId), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.dispatchEvent(jt), this.state = f.NONE;
      break;
    case 1:
      const t = this._pointers[0], e = this._pointerPositions[t];
      this._onTouchStart({ pointerId: t, pageX: e.x, pageY: e.y });
      break;
  }
}
function Ae(o) {
  let t;
  switch (o.button) {
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
    case q.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseDownDolly(o), this.state = f.DOLLY;
      break;
    case q.ROTATE:
      if (o.ctrlKey || o.metaKey || o.shiftKey) {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(o), this.state = f.PAN;
      } else {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(o), this.state = f.ROTATE;
      }
      break;
    case q.PAN:
      if (o.ctrlKey || o.metaKey || o.shiftKey) {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(o), this.state = f.ROTATE;
      } else {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(o), this.state = f.PAN;
      }
      break;
    default:
      this.state = f.NONE;
  }
  this.state !== f.NONE && this.dispatchEvent(wt);
}
function Ce(o) {
  switch (this.state) {
    case f.ROTATE:
      if (this.enableRotate === !1) return;
      this._handleMouseMoveRotate(o);
      break;
    case f.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseMoveDolly(o);
      break;
    case f.PAN:
      if (this.enablePan === !1) return;
      this._handleMouseMovePan(o);
      break;
  }
}
function Te(o) {
  this.enabled === !1 || this.enableZoom === !1 || this.state !== f.NONE || (o.preventDefault(), this.dispatchEvent(wt), this._handleMouseWheel(this._customWheelEvent(o)), this.dispatchEvent(jt));
}
function De(o) {
  this.enabled !== !1 && this._handleKeyDown(o);
}
function Le(o) {
  switch (this._trackPointer(o), this._pointers.length) {
    case 1:
      switch (this.touches.ONE) {
        case Q.ROTATE:
          if (this.enableRotate === !1) return;
          this._handleTouchStartRotate(o), this.state = f.TOUCH_ROTATE;
          break;
        case Q.PAN:
          if (this.enablePan === !1) return;
          this._handleTouchStartPan(o), this.state = f.TOUCH_PAN;
          break;
        default:
          this.state = f.NONE;
      }
      break;
    case 2:
      switch (this.touches.TWO) {
        case Q.DOLLY_PAN:
          if (this.enableZoom === !1 && this.enablePan === !1) return;
          this._handleTouchStartDollyPan(o), this.state = f.TOUCH_DOLLY_PAN;
          break;
        case Q.DOLLY_ROTATE:
          if (this.enableZoom === !1 && this.enableRotate === !1) return;
          this._handleTouchStartDollyRotate(o), this.state = f.TOUCH_DOLLY_ROTATE;
          break;
        default:
          this.state = f.NONE;
      }
      break;
    default:
      this.state = f.NONE;
  }
  this.state !== f.NONE && this.dispatchEvent(wt);
}
function ke(o) {
  switch (this._trackPointer(o), this.state) {
    case f.TOUCH_ROTATE:
      if (this.enableRotate === !1) return;
      this._handleTouchMoveRotate(o), this.update();
      break;
    case f.TOUCH_PAN:
      if (this.enablePan === !1) return;
      this._handleTouchMovePan(o), this.update();
      break;
    case f.TOUCH_DOLLY_PAN:
      if (this.enableZoom === !1 && this.enablePan === !1) return;
      this._handleTouchMoveDollyPan(o), this.update();
      break;
    case f.TOUCH_DOLLY_ROTATE:
      if (this.enableZoom === !1 && this.enableRotate === !1) return;
      this._handleTouchMoveDollyRotate(o), this.update();
      break;
    default:
      this.state = f.NONE;
  }
}
function Oe(o) {
  this.enabled !== !1 && o.preventDefault();
}
function $e(o) {
  o.key === "Control" && (this._controlActive = !0, this.domElement.getRootNode().addEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
function Ie(o) {
  o.key === "Control" && (this._controlActive = !1, this.domElement.getRootNode().removeEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
class Ye {
  constructor() {
    _(this, "controls");
  }
  action({ camera: t, renderer: e }) {
    this.controls = new Ee(t, e.domElement), this.controls.update();
  }
  toggle(t, e) {
    this.controls || this.action(e), this.controls.enabled = t;
  }
  update(t) {
    var e;
    (e = this.controls) == null || e.update(t);
  }
}
class Re {
  constructor() {
    _(this, "activeObjectUuid", "");
    _(this, "panel");
  }
  createPanel() {
    return new et({ title: "Object Props", width: 200 });
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
      for (const [s, a] of i.entries())
        this.showMaterialProps(t, a, s);
    }
    t.children.length && this.showGroupProps(t);
  }
  showLightProps(t) {
    this.handleColor(this.panel, t, "color"), this.handleColor(this.panel, t, "groundColor"), this.panel.add(t, "intensity", 0, 3, 0.1);
  }
  showMaterialProps(t, e, i) {
    var n;
    const s = i > 0 ? `Material${i}` : "Material", a = this.panel.addFolder(s);
    a.add(e, "type"), a.add(t, "visible"), this.handleColor(a, e, "color"), this.handleColor(a, e, "emissive"), this.handleColor(a, e, "specular"), a.add(e, "transparent"), a.add(e, "opacity", 0, 1), a.add(e, "side", { FrontSide: Gt, BackSide: Jt, DoubleSide: It }).onChange((r) => e.side = r), (e instanceof te || e instanceof yt || e instanceof ee || e instanceof ie) && (Object.hasOwn(e, "wireframe") && a.add(e, "wireframe"), (n = e.color) != null && n.getHex() && (this.handleFunction(
      a,
      "LinearToSRGB",
      () => e.color.convertLinearToSRGB()
    ), this.handleFunction(
      a,
      "SRGBToLinear",
      () => e.color.convertSRGBToLinear()
    )), this.showMaterialTextureProps(a, e));
  }
  showMaterialTextureProps(t, e) {
    const i = t.addFolder("Texture"), s = e.map;
    s && (i.add(s, "flipY"), i.add(s, "rotation").min(0).max(Math.PI * 2).step(0.01), i.add(s.offset, "x").name("offsetX").min(0).max(1).step(0.01), i.add(s.offset, "y").name("offsetY").min(0).max(1).step(0.01), i.add(s.repeat, "x").name("repeatX"), i.add(s.repeat, "y").name("repeatY"), i.add(s, "wrapS", {
      ClampToEdgeWrapping: se,
      RepeatWrapping: ne,
      MirroredRepeatWrapping: oe
    }).onChange((a) => {
      s.wrapS = a, s.wrapT = a, s.needsUpdate = !0;
    }).name("wrap"));
  }
  showGroupProps(t) {
    this.panel.add(t, "visible");
  }
  handleColor(t, e, i) {
    if (!e[i])
      return;
    const s = { [i]: e[i].getHex() };
    t.addColor(s, i).onChange((a) => e[i].set(a));
  }
  handleFunction(t, e, i) {
    const s = { fn: () => i() };
    t.add(s, "fn").name(e);
  }
}
class je {
  constructor(t) {
    _(this, "exclude", ["transform-controls", "TransformControlsGizmo"]);
    _(this, "keepClosed", ["mixamorig_Hips"]);
    _(this, "lightsFolder");
    _(this, "panel");
    _(this, "onActionComplete");
    this.onActionComplete = t;
  }
  action(t) {
    this.panel = new et({ title: "Scene Tree", width: 200 }), this.panel.domElement.style.right = "0px", this.lightsFolder = this.panel.addFolder("Lights"), this.tweakPanelStyle();
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
    const s = "isLight" in t && t.isLight, a = "isMesh" in t && t.isMesh, r = (s ? this.lightsFolder : e).addFolder(i), c = r.domElement.querySelector(".lil-title");
    c == null || c.addEventListener("click", () => {
      var u;
      (u = this.onActionComplete) == null || u.call(this, t, i);
    }), (this.keepClosed.includes(i) || s || a) && r.close();
    for (const u of t.children)
      this.traverseScene(u, r);
  }
  toggle(t, e) {
    this.panel || this.action(e), this.panel.show(t), e.components.props.adjustPlacement(t);
  }
}
const N = new Yt(), S = new d(), F = new d(), y = new O(), At = {
  X: new d(1, 0, 0),
  Y: new d(0, 1, 0),
  Z: new d(0, 0, 1)
}, mt = { type: "change" }, Ct = { type: "mouseDown", mode: null }, Tt = { type: "mouseUp", mode: null }, Dt = { type: "objectChange" };
class ze extends $t {
  /**
   * Constructs a new controls instance.
   *
   * @param {Camera} camera - The camera of the rendered scene.
   * @param {?HTMLDOMElement} domElement - The HTML element used for event listeners.
   */
  constructor(t, e = null) {
    super(void 0, e);
    const i = new Ue(this);
    this._root = i;
    const s = new Ve();
    this._gizmo = s, i.add(s);
    const a = new Qe();
    this._plane = a, i.add(a);
    const n = this;
    function r(m, D) {
      let X = D;
      Object.defineProperty(n, m, {
        get: function() {
          return X !== void 0 ? X : D;
        },
        set: function(Z) {
          X !== Z && (X = Z, a[m] = Z, s[m] = Z, n.dispatchEvent({ type: m + "-changed", value: Z }), n.dispatchEvent(mt));
        }
      }), n[m] = D, a[m] = D, s[m] = D;
    }
    r("camera", t), r("object", void 0), r("enabled", !0), r("axis", null), r("mode", "translate"), r("translationSnap", null), r("rotationSnap", null), r("scaleSnap", null), r("space", "world"), r("size", 1), r("dragging", !1), r("showX", !0), r("showY", !0), r("showZ", !0), r("minX", -1 / 0), r("maxX", 1 / 0), r("minY", -1 / 0), r("maxY", 1 / 0), r("minZ", -1 / 0), r("maxZ", 1 / 0);
    const c = new d(), u = new d(), w = new O(), b = new O(), v = new d(), z = new O(), R = new d(), E = new d(), T = new d(), p = 0, h = new d();
    r("worldPosition", c), r("worldPositionStart", u), r("worldQuaternion", w), r("worldQuaternionStart", b), r("cameraPosition", v), r("cameraQuaternion", z), r("pointStart", R), r("pointEnd", E), r("rotationAxis", T), r("rotationAngle", p), r("eye", h), this._offset = new d(), this._startNorm = new d(), this._endNorm = new d(), this._cameraScale = new d(), this._parentPosition = new d(), this._parentQuaternion = new O(), this._parentQuaternionInv = new O(), this._parentScale = new d(), this._worldScaleStart = new d(), this._worldQuaternionInv = new O(), this._worldScale = new d(), this._positionStart = new d(), this._quaternionStart = new O(), this._scaleStart = new d(), this._getPointer = Xe.bind(this), this._onPointerDown = Fe.bind(this), this._onPointerHover = He.bind(this), this._onPointerMove = Ze.bind(this), this._onPointerUp = Ne.bind(this), e !== null && this.connect(e);
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
    t !== null && N.setFromCamera(t, this.camera);
    const e = ft(this._gizmo.picker[this.mode], N);
    e ? this.axis = e.object.name : this.axis = null;
  }
  pointerDown(t) {
    if (!(this.object === void 0 || this.dragging === !0 || t != null && t.button !== 0) && this.axis !== null) {
      t !== null && N.setFromCamera(t, this.camera);
      const e = ft(this._plane, N, !0);
      e && (this.object.updateMatrixWorld(), this.object.parent.updateMatrixWorld(), this._positionStart.copy(this.object.position), this._quaternionStart.copy(this.object.quaternion), this._scaleStart.copy(this.object.scale), this.object.matrixWorld.decompose(this.worldPositionStart, this.worldQuaternionStart, this._worldScaleStart), this.pointStart.copy(e.point).sub(this.worldPositionStart)), this.dragging = !0, Ct.mode = this.mode, this.dispatchEvent(Ct);
    }
  }
  pointerMove(t) {
    const e = this.axis, i = this.mode, s = this.object;
    let a = this.space;
    if (i === "scale" ? a = "local" : (e === "E" || e === "XYZE" || e === "XYZ") && (a = "world"), s === void 0 || e === null || this.dragging === !1 || t !== null && t.button !== -1) return;
    t !== null && N.setFromCamera(t, this.camera);
    const n = ft(this._plane, N, !0);
    if (n) {
      if (this.pointEnd.copy(n.point).sub(this.worldPositionStart), i === "translate")
        this._offset.copy(this.pointEnd).sub(this.pointStart), a === "local" && e !== "XYZ" && this._offset.applyQuaternion(this._worldQuaternionInv), e.indexOf("X") === -1 && (this._offset.x = 0), e.indexOf("Y") === -1 && (this._offset.y = 0), e.indexOf("Z") === -1 && (this._offset.z = 0), a === "local" && e !== "XYZ" ? this._offset.applyQuaternion(this._quaternionStart).divide(this._parentScale) : this._offset.applyQuaternion(this._parentQuaternionInv).divide(this._parentScale), s.position.copy(this._offset).add(this._positionStart), this.translationSnap && (a === "local" && (s.position.applyQuaternion(y.copy(this._quaternionStart).invert()), e.search("X") !== -1 && (s.position.x = Math.round(s.position.x / this.translationSnap) * this.translationSnap), e.search("Y") !== -1 && (s.position.y = Math.round(s.position.y / this.translationSnap) * this.translationSnap), e.search("Z") !== -1 && (s.position.z = Math.round(s.position.z / this.translationSnap) * this.translationSnap), s.position.applyQuaternion(this._quaternionStart)), a === "world" && (s.parent && s.position.add(S.setFromMatrixPosition(s.parent.matrixWorld)), e.search("X") !== -1 && (s.position.x = Math.round(s.position.x / this.translationSnap) * this.translationSnap), e.search("Y") !== -1 && (s.position.y = Math.round(s.position.y / this.translationSnap) * this.translationSnap), e.search("Z") !== -1 && (s.position.z = Math.round(s.position.z / this.translationSnap) * this.translationSnap), s.parent && s.position.sub(S.setFromMatrixPosition(s.parent.matrixWorld)))), s.position.x = Math.max(this.minX, Math.min(this.maxX, s.position.x)), s.position.y = Math.max(this.minY, Math.min(this.maxY, s.position.y)), s.position.z = Math.max(this.minZ, Math.min(this.maxZ, s.position.z));
      else if (i === "scale") {
        if (e.search("XYZ") !== -1) {
          let r = this.pointEnd.length() / this.pointStart.length();
          this.pointEnd.dot(this.pointStart) < 0 && (r *= -1), F.set(r, r, r);
        } else
          S.copy(this.pointStart), F.copy(this.pointEnd), S.applyQuaternion(this._worldQuaternionInv), F.applyQuaternion(this._worldQuaternionInv), F.divide(S), e.search("X") === -1 && (F.x = 1), e.search("Y") === -1 && (F.y = 1), e.search("Z") === -1 && (F.z = 1);
        s.scale.copy(this._scaleStart).multiply(F), this.scaleSnap && (e.search("X") !== -1 && (s.scale.x = Math.round(s.scale.x / this.scaleSnap) * this.scaleSnap || this.scaleSnap), e.search("Y") !== -1 && (s.scale.y = Math.round(s.scale.y / this.scaleSnap) * this.scaleSnap || this.scaleSnap), e.search("Z") !== -1 && (s.scale.z = Math.round(s.scale.z / this.scaleSnap) * this.scaleSnap || this.scaleSnap));
      } else if (i === "rotate") {
        this._offset.copy(this.pointEnd).sub(this.pointStart);
        const r = 20 / this.worldPosition.distanceTo(S.setFromMatrixPosition(this.camera.matrixWorld));
        let c = !1;
        e === "XYZE" ? (this.rotationAxis.copy(this._offset).cross(this.eye).normalize(), this.rotationAngle = this._offset.dot(S.copy(this.rotationAxis).cross(this.eye)) * r) : (e === "X" || e === "Y" || e === "Z") && (this.rotationAxis.copy(At[e]), S.copy(At[e]), a === "local" && S.applyQuaternion(this.worldQuaternion), S.cross(this.eye), S.length() === 0 ? c = !0 : this.rotationAngle = this._offset.dot(S.normalize()) * r), (e === "E" || c) && (this.rotationAxis.copy(this.eye), this.rotationAngle = this.pointEnd.angleTo(this.pointStart), this._startNorm.copy(this.pointStart).normalize(), this._endNorm.copy(this.pointEnd).normalize(), this.rotationAngle *= this._endNorm.cross(this._startNorm).dot(this.eye) < 0 ? 1 : -1), this.rotationSnap && (this.rotationAngle = Math.round(this.rotationAngle / this.rotationSnap) * this.rotationSnap), a === "local" && e !== "E" && e !== "XYZE" ? (s.quaternion.copy(this._quaternionStart), s.quaternion.multiply(y.setFromAxisAngle(this.rotationAxis, this.rotationAngle)).normalize()) : (this.rotationAxis.applyQuaternion(this._parentQuaternionInv), s.quaternion.copy(y.setFromAxisAngle(this.rotationAxis, this.rotationAngle)), s.quaternion.multiply(this._quaternionStart).normalize());
      }
      this.dispatchEvent(mt), this.dispatchEvent(Dt);
    }
  }
  pointerUp(t) {
    t !== null && t.button !== 0 || (this.dragging && this.axis !== null && (Tt.mode = this.mode, this.dispatchEvent(Tt)), this.dragging = !1, this.axis = null);
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
    this.enabled && this.dragging && (this.object.position.copy(this._positionStart), this.object.quaternion.copy(this._quaternionStart), this.object.scale.copy(this._scaleStart), this.dispatchEvent(mt), this.dispatchEvent(Dt), this.pointStart.copy(this.pointEnd));
  }
  /**
   * Returns the raycaster that is used for user interaction. This object is shared between all
   * instances of `TransformControls`.
   *
   * @returns {Raycaster} The internal raycaster.
   */
  getRaycaster() {
    return N;
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
    const a = this._gizmo.materialLib;
    a.xAxis.color.set(t), a.yAxis.color.set(e), a.zAxis.color.set(i), a.active.color.set(s), a.xAxisTransparent.color.set(t), a.yAxisTransparent.color.set(e), a.zAxisTransparent.color.set(i), a.activeTransparent.color.set(s), a.xAxis._color && a.xAxis._color.set(t), a.yAxis._color && a.yAxis._color.set(e), a.zAxis._color && a.zAxis._color.set(i), a.active._color && a.active._color.set(s), a.xAxisTransparent._color && a.xAxisTransparent._color.set(t), a.yAxisTransparent._color && a.yAxisTransparent._color.set(e), a.zAxisTransparent._color && a.zAxisTransparent._color.set(i), a.activeTransparent._color && a.activeTransparent._color.set(s);
  }
}
function Xe(o) {
  if (this.domElement.ownerDocument.pointerLockElement)
    return {
      x: 0,
      y: 0,
      button: o.button
    };
  {
    const t = this.domElement.getBoundingClientRect();
    return {
      x: (o.clientX - t.left) / t.width * 2 - 1,
      y: -(o.clientY - t.top) / t.height * 2 + 1,
      button: o.button
    };
  }
}
function He(o) {
  if (this.enabled)
    switch (o.pointerType) {
      case "mouse":
      case "pen":
        this.pointerHover(this._getPointer(o));
        break;
    }
}
function Fe(o) {
  this.enabled && (document.pointerLockElement || this.domElement.setPointerCapture(o.pointerId), this.domElement.addEventListener("pointermove", this._onPointerMove), this.pointerHover(this._getPointer(o)), this.pointerDown(this._getPointer(o)));
}
function Ze(o) {
  this.enabled && this.pointerMove(this._getPointer(o));
}
function Ne(o) {
  this.enabled && (this.domElement.releasePointerCapture(o.pointerId), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.pointerUp(this._getPointer(o)));
}
function ft(o, t, e) {
  const i = t.intersectObject(o, !0);
  for (let s = 0; s < i.length; s++)
    if (i[s].object.visible || e)
      return i[s];
  return !1;
}
const lt = new ae(), g = new d(0, 1, 0), Lt = new d(0, 0, 0), kt = new Rt(), ht = new O(), dt = new O(), I = new d(), Ot = new Rt(), G = new d(1, 0, 0), U = new d(0, 1, 0), J = new d(0, 0, 1), ct = new d(), B = new d(), K = new d();
class Ue extends gt {
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
class Ve extends gt {
  constructor() {
    super(), this.isTransformControlsGizmo = !0, this.type = "TransformControlsGizmo";
    const t = new yt({
      depthTest: !1,
      depthWrite: !1,
      fog: !1,
      toneMapped: !1,
      transparent: !0
    }), e = new re({
      depthTest: !1,
      depthWrite: !1,
      fog: !1,
      toneMapped: !1,
      transparent: !0
    }), i = t.clone();
    i.opacity = 0.15;
    const s = e.clone();
    s.opacity = 0.5;
    const a = t.clone();
    a.color.setHex(16711680);
    const n = t.clone();
    n.color.setHex(65280);
    const r = t.clone();
    r.color.setHex(255);
    const c = t.clone();
    c.color.setHex(16711680), c.opacity = 0.5;
    const u = t.clone();
    u.color.setHex(65280), u.opacity = 0.5;
    const w = t.clone();
    w.color.setHex(255), w.opacity = 0.5;
    const b = t.clone();
    b.opacity = 0.25;
    const v = t.clone();
    v.color.setHex(16776960), v.opacity = 0.25;
    const z = t.clone();
    z.color.setHex(16776960);
    const R = t.clone();
    R.color.setHex(7895160), this.materialLib = {
      xAxis: a,
      yAxis: n,
      zAxis: r,
      active: z,
      xAxisTransparent: c,
      yAxisTransparent: u,
      zAxisTransparent: w,
      activeTransparent: v
    };
    const E = new A(0, 0.04, 0.1, 12);
    E.translate(0, 0.05, 0);
    const T = new P(0.08, 0.08, 0.08);
    T.translate(0, 0.04, 0);
    const p = new vt();
    p.setAttribute("position", new Et([0, 0, 0, 1, 0, 0], 3));
    const h = new A(75e-4, 75e-4, 0.5, 3);
    h.translate(0, 0.25, 0);
    function m(L, it) {
      const $ = new W(L, 75e-4, 3, 64, it * Math.PI * 2);
      return $.rotateY(Math.PI / 2), $.rotateX(Math.PI / 2), $;
    }
    function D() {
      const L = new vt();
      return L.setAttribute("position", new Et([0, 0, 0, 1, 1, 1], 3)), L;
    }
    const X = {
      X: [
        [new l(E, a), [0.5, 0, 0], [0, 0, -Math.PI / 2]],
        [new l(E, a), [-0.5, 0, 0], [0, 0, Math.PI / 2]],
        [new l(h, a), [0, 0, 0], [0, 0, -Math.PI / 2]]
      ],
      Y: [
        [new l(E, n), [0, 0.5, 0]],
        [new l(E, n), [0, -0.5, 0], [Math.PI, 0, 0]],
        [new l(h, n)]
      ],
      Z: [
        [new l(E, r), [0, 0, 0.5], [Math.PI / 2, 0, 0]],
        [new l(E, r), [0, 0, -0.5], [-Math.PI / 2, 0, 0]],
        [new l(h, r), null, [Math.PI / 2, 0, 0]]
      ],
      XYZ: [
        [new l(new at(0.1, 0), b), [0, 0, 0]]
      ],
      XY: [
        [new l(new P(0.15, 0.15, 0.01), w), [0.15, 0.15, 0]]
      ],
      YZ: [
        [new l(new P(0.15, 0.15, 0.01), c), [0, 0.15, 0.15], [0, Math.PI / 2, 0]]
      ],
      XZ: [
        [new l(new P(0.15, 0.15, 0.01), u), [0.15, 0, 0.15], [-Math.PI / 2, 0, 0]]
      ]
    }, Z = {
      X: [
        [new l(new A(0.2, 0, 0.6, 4), i), [0.3, 0, 0], [0, 0, -Math.PI / 2]],
        [new l(new A(0.2, 0, 0.6, 4), i), [-0.3, 0, 0], [0, 0, Math.PI / 2]]
      ],
      Y: [
        [new l(new A(0.2, 0, 0.6, 4), i), [0, 0.3, 0]],
        [new l(new A(0.2, 0, 0.6, 4), i), [0, -0.3, 0], [0, 0, Math.PI]]
      ],
      Z: [
        [new l(new A(0.2, 0, 0.6, 4), i), [0, 0, 0.3], [Math.PI / 2, 0, 0]],
        [new l(new A(0.2, 0, 0.6, 4), i), [0, 0, -0.3], [-Math.PI / 2, 0, 0]]
      ],
      XYZ: [
        [new l(new at(0.2, 0), i)]
      ],
      XY: [
        [new l(new P(0.2, 0.2, 0.01), i), [0.15, 0.15, 0]]
      ],
      YZ: [
        [new l(new P(0.2, 0.2, 0.01), i), [0, 0.15, 0.15], [0, Math.PI / 2, 0]]
      ],
      XZ: [
        [new l(new P(0.2, 0.2, 0.01), i), [0.15, 0, 0.15], [-Math.PI / 2, 0, 0]]
      ]
    }, zt = {
      START: [
        [new l(new at(0.01, 2), s), null, null, null, "helper"]
      ],
      END: [
        [new l(new at(0.01, 2), s), null, null, null, "helper"]
      ],
      DELTA: [
        [new H(D(), s), null, null, null, "helper"]
      ],
      X: [
        [new H(p, s), [-1e3, 0, 0], null, [1e6, 1, 1], "helper"]
      ],
      Y: [
        [new H(p, s), [0, -1e3, 0], [0, 0, Math.PI / 2], [1e6, 1, 1], "helper"]
      ],
      Z: [
        [new H(p, s), [0, 0, -1e3], [0, -Math.PI / 2, 0], [1e6, 1, 1], "helper"]
      ]
    }, Xt = {
      XYZE: [
        [new l(m(0.5, 1), R), null, [0, Math.PI / 2, 0]]
      ],
      X: [
        [new l(m(0.5, 0.5), a)]
      ],
      Y: [
        [new l(m(0.5, 0.5), n), null, [0, 0, -Math.PI / 2]]
      ],
      Z: [
        [new l(m(0.5, 0.5), r), null, [0, Math.PI / 2, 0]]
      ],
      E: [
        [new l(m(0.75, 1), v), null, [0, Math.PI / 2, 0]]
      ]
    }, Ht = {
      AXIS: [
        [new H(p, s), [-1e3, 0, 0], null, [1e6, 1, 1], "helper"]
      ]
    }, Ft = {
      XYZE: [
        [new l(new le(0.25, 10, 8), i)]
      ],
      X: [
        [new l(new W(0.5, 0.1, 4, 24), i), [0, 0, 0], [0, -Math.PI / 2, -Math.PI / 2]]
      ],
      Y: [
        [new l(new W(0.5, 0.1, 4, 24), i), [0, 0, 0], [Math.PI / 2, 0, 0]]
      ],
      Z: [
        [new l(new W(0.5, 0.1, 4, 24), i), [0, 0, 0], [0, 0, -Math.PI / 2]]
      ],
      E: [
        [new l(new W(0.75, 0.1, 2, 24), i)]
      ]
    }, Zt = {
      X: [
        [new l(T, a), [0.5, 0, 0], [0, 0, -Math.PI / 2]],
        [new l(h, a), [0, 0, 0], [0, 0, -Math.PI / 2]],
        [new l(T, a), [-0.5, 0, 0], [0, 0, Math.PI / 2]]
      ],
      Y: [
        [new l(T, n), [0, 0.5, 0]],
        [new l(h, n)],
        [new l(T, n), [0, -0.5, 0], [0, 0, Math.PI]]
      ],
      Z: [
        [new l(T, r), [0, 0, 0.5], [Math.PI / 2, 0, 0]],
        [new l(h, r), [0, 0, 0], [Math.PI / 2, 0, 0]],
        [new l(T, r), [0, 0, -0.5], [-Math.PI / 2, 0, 0]]
      ],
      XY: [
        [new l(new P(0.15, 0.15, 0.01), w), [0.15, 0.15, 0]]
      ],
      YZ: [
        [new l(new P(0.15, 0.15, 0.01), c), [0, 0.15, 0.15], [0, Math.PI / 2, 0]]
      ],
      XZ: [
        [new l(new P(0.15, 0.15, 0.01), u), [0.15, 0, 0.15], [-Math.PI / 2, 0, 0]]
      ],
      XYZ: [
        [new l(new P(0.1, 0.1, 0.1), b)]
      ]
    }, Nt = {
      X: [
        [new l(new A(0.2, 0, 0.6, 4), i), [0.3, 0, 0], [0, 0, -Math.PI / 2]],
        [new l(new A(0.2, 0, 0.6, 4), i), [-0.3, 0, 0], [0, 0, Math.PI / 2]]
      ],
      Y: [
        [new l(new A(0.2, 0, 0.6, 4), i), [0, 0.3, 0]],
        [new l(new A(0.2, 0, 0.6, 4), i), [0, -0.3, 0], [0, 0, Math.PI]]
      ],
      Z: [
        [new l(new A(0.2, 0, 0.6, 4), i), [0, 0, 0.3], [Math.PI / 2, 0, 0]],
        [new l(new A(0.2, 0, 0.6, 4), i), [0, 0, -0.3], [-Math.PI / 2, 0, 0]]
      ],
      XY: [
        [new l(new P(0.2, 0.2, 0.01), i), [0.15, 0.15, 0]]
      ],
      YZ: [
        [new l(new P(0.2, 0.2, 0.01), i), [0, 0.15, 0.15], [0, Math.PI / 2, 0]]
      ],
      XZ: [
        [new l(new P(0.2, 0.2, 0.01), i), [0.15, 0, 0.15], [-Math.PI / 2, 0, 0]]
      ],
      XYZ: [
        [new l(new P(0.2, 0.2, 0.2), i), [0, 0, 0]]
      ]
    }, Ut = {
      X: [
        [new H(p, s), [-1e3, 0, 0], null, [1e6, 1, 1], "helper"]
      ],
      Y: [
        [new H(p, s), [0, -1e3, 0], [0, 0, Math.PI / 2], [1e6, 1, 1], "helper"]
      ],
      Z: [
        [new H(p, s), [0, 0, -1e3], [0, -Math.PI / 2, 0], [1e6, 1, 1], "helper"]
      ]
    };
    function j(L) {
      const it = new gt();
      for (const $ in L)
        for (let V = L[$].length; V--; ) {
          const M = L[$][V][0].clone(), st = L[$][V][1], nt = L[$][V][2], ot = L[$][V][3], Vt = L[$][V][4];
          M.name = $, M.tag = Vt, st && M.position.set(st[0], st[1], st[2]), nt && M.rotation.set(nt[0], nt[1], nt[2]), ot && M.scale.set(ot[0], ot[1], ot[2]), M.updateMatrix();
          const bt = M.geometry.clone();
          bt.applyMatrix4(M.matrix), M.geometry = bt, M.renderOrder = 1 / 0, M.position.set(0, 0, 0), M.rotation.set(0, 0, 0), M.scale.set(1, 1, 1), it.add(M);
        }
      return it;
    }
    this.gizmo = {}, this.picker = {}, this.helper = {}, this.add(this.gizmo.translate = j(X)), this.add(this.gizmo.rotate = j(Xt)), this.add(this.gizmo.scale = j(Zt)), this.add(this.picker.translate = j(Z)), this.add(this.picker.rotate = j(Ft)), this.add(this.picker.scale = j(Nt)), this.add(this.helper.translate = j(zt)), this.add(this.helper.rotate = j(Ht)), this.add(this.helper.scale = j(Ut)), this.picker.translate.visible = !1, this.picker.rotate.visible = !1, this.picker.scale.visible = !1;
  }
  // updateMatrixWorld will update transformations and appearance of individual handles
  updateMatrixWorld(t) {
    const i = (this.mode === "scale" ? "local" : this.space) === "local" ? this.worldQuaternion : dt;
    this.gizmo.translate.visible = this.mode === "translate", this.gizmo.rotate.visible = this.mode === "rotate", this.gizmo.scale.visible = this.mode === "scale", this.helper.translate.visible = this.mode === "translate", this.helper.rotate.visible = this.mode === "rotate", this.helper.scale.visible = this.mode === "scale";
    let s = [];
    s = s.concat(this.picker[this.mode].children), s = s.concat(this.gizmo[this.mode].children), s = s.concat(this.helper[this.mode].children);
    for (let a = 0; a < s.length; a++) {
      const n = s[a];
      n.visible = !0, n.rotation.set(0, 0, 0), n.position.copy(this.worldPosition);
      let r;
      if (this.camera.isOrthographicCamera ? r = (this.camera.top - this.camera.bottom) / this.camera.zoom : r = this.worldPosition.distanceTo(this.cameraPosition) * Math.min(1.9 * Math.tan(Math.PI * this.camera.fov / 360) / this.camera.zoom, 7), n.scale.set(1, 1, 1).multiplyScalar(r * this.size / 4), n.tag === "helper") {
        n.visible = !1, n.name === "AXIS" ? (n.visible = !!this.axis, this.axis === "X" && (y.setFromEuler(lt.set(0, 0, 0)), n.quaternion.copy(i).multiply(y), Math.abs(g.copy(G).applyQuaternion(i).dot(this.eye)) > 0.9 && (n.visible = !1)), this.axis === "Y" && (y.setFromEuler(lt.set(0, 0, Math.PI / 2)), n.quaternion.copy(i).multiply(y), Math.abs(g.copy(U).applyQuaternion(i).dot(this.eye)) > 0.9 && (n.visible = !1)), this.axis === "Z" && (y.setFromEuler(lt.set(0, Math.PI / 2, 0)), n.quaternion.copy(i).multiply(y), Math.abs(g.copy(J).applyQuaternion(i).dot(this.eye)) > 0.9 && (n.visible = !1)), this.axis === "XYZE" && (y.setFromEuler(lt.set(0, Math.PI / 2, 0)), g.copy(this.rotationAxis), n.quaternion.setFromRotationMatrix(kt.lookAt(Lt, g, U)), n.quaternion.multiply(y), n.visible = this.dragging), this.axis === "E" && (n.visible = !1)) : n.name === "START" ? (n.position.copy(this.worldPositionStart), n.visible = this.dragging) : n.name === "END" ? (n.position.copy(this.worldPosition), n.visible = this.dragging) : n.name === "DELTA" ? (n.position.copy(this.worldPositionStart), n.quaternion.copy(this.worldQuaternionStart), S.set(1e-10, 1e-10, 1e-10).add(this.worldPositionStart).sub(this.worldPosition).multiplyScalar(-1), S.applyQuaternion(this.worldQuaternionStart.clone().invert()), n.scale.copy(S), n.visible = this.dragging) : (n.quaternion.copy(i), this.dragging ? n.position.copy(this.worldPositionStart) : n.position.copy(this.worldPosition), this.axis && (n.visible = this.axis.search(n.name) !== -1));
        continue;
      }
      n.quaternion.copy(i), this.mode === "translate" || this.mode === "scale" ? (n.name === "X" && Math.abs(g.copy(G).applyQuaternion(i).dot(this.eye)) > 0.99 && (n.scale.set(1e-10, 1e-10, 1e-10), n.visible = !1), n.name === "Y" && Math.abs(g.copy(U).applyQuaternion(i).dot(this.eye)) > 0.99 && (n.scale.set(1e-10, 1e-10, 1e-10), n.visible = !1), n.name === "Z" && Math.abs(g.copy(J).applyQuaternion(i).dot(this.eye)) > 0.99 && (n.scale.set(1e-10, 1e-10, 1e-10), n.visible = !1), n.name === "XY" && Math.abs(g.copy(J).applyQuaternion(i).dot(this.eye)) < 0.2 && (n.scale.set(1e-10, 1e-10, 1e-10), n.visible = !1), n.name === "YZ" && Math.abs(g.copy(G).applyQuaternion(i).dot(this.eye)) < 0.2 && (n.scale.set(1e-10, 1e-10, 1e-10), n.visible = !1), n.name === "XZ" && Math.abs(g.copy(U).applyQuaternion(i).dot(this.eye)) < 0.2 && (n.scale.set(1e-10, 1e-10, 1e-10), n.visible = !1)) : this.mode === "rotate" && (ht.copy(i), g.copy(this.eye).applyQuaternion(y.copy(i).invert()), n.name.search("E") !== -1 && n.quaternion.setFromRotationMatrix(kt.lookAt(this.eye, Lt, U)), n.name === "X" && (y.setFromAxisAngle(G, Math.atan2(-g.y, g.z)), y.multiplyQuaternions(ht, y), n.quaternion.copy(y)), n.name === "Y" && (y.setFromAxisAngle(U, Math.atan2(g.x, g.z)), y.multiplyQuaternions(ht, y), n.quaternion.copy(y)), n.name === "Z" && (y.setFromAxisAngle(J, Math.atan2(g.y, g.x)), y.multiplyQuaternions(ht, y), n.quaternion.copy(y))), n.visible = n.visible && (n.name.indexOf("X") === -1 || this.showX), n.visible = n.visible && (n.name.indexOf("Y") === -1 || this.showY), n.visible = n.visible && (n.name.indexOf("Z") === -1 || this.showZ), n.visible = n.visible && (n.name.indexOf("E") === -1 || this.showX && this.showY && this.showZ), n.material._color = n.material._color || n.material.color.clone(), n.material._opacity = n.material._opacity || n.material.opacity, n.material.color.copy(n.material._color), n.material.opacity = n.material._opacity, this.enabled && this.axis && (n.name === this.axis ? (n.material.color.copy(this.materialLib.active.color), n.material.opacity = 1) : this.axis.split("").some(function(c) {
        return n.name === c;
      }) && (n.material.color.copy(this.materialLib.active.color), n.material.opacity = 1));
    }
    super.updateMatrixWorld(t);
  }
}
class Qe extends l {
  constructor() {
    super(
      new he(1e5, 1e5, 2, 2),
      new yt({ visible: !1, wireframe: !0, side: It, transparent: !0, opacity: 0.1, toneMapped: !1 })
    ), this.isTransformControlsPlane = !0, this.type = "TransformControlsPlane";
  }
  updateMatrixWorld(t) {
    let e = this.space;
    switch (this.position.copy(this.worldPosition), this.mode === "scale" && (e = "local"), ct.copy(G).applyQuaternion(e === "local" ? this.worldQuaternion : dt), B.copy(U).applyQuaternion(e === "local" ? this.worldQuaternion : dt), K.copy(J).applyQuaternion(e === "local" ? this.worldQuaternion : dt), g.copy(B), this.mode) {
      case "translate":
      case "scale":
        switch (this.axis) {
          case "X":
            g.copy(this.eye).cross(ct), I.copy(ct).cross(g);
            break;
          case "Y":
            g.copy(this.eye).cross(B), I.copy(B).cross(g);
            break;
          case "Z":
            g.copy(this.eye).cross(K), I.copy(K).cross(g);
            break;
          case "XY":
            I.copy(K);
            break;
          case "YZ":
            I.copy(ct);
            break;
          case "XZ":
            g.copy(K), I.copy(B);
            break;
          case "XYZ":
          case "E":
            I.set(0, 0, 0);
            break;
        }
        break;
      case "rotate":
      default:
        I.set(0, 0, 0);
    }
    I.length() === 0 ? this.quaternion.copy(this.cameraQuaternion) : (Ot.lookAt(S.set(0, 0, 0), I, g), this.quaternion.setFromRotationMatrix(Ot)), super.updateMatrixWorld(t);
  }
}
class qe {
  constructor(t) {
    _(this, "onActionComplete");
    _(this, "controls");
    _(this, "isShiftPressed", !1);
    _(this, "camera");
    _(this, "actions");
    _(this, "keymap");
    _(this, "selectable", []);
    _(this, "intersected", null);
    _(this, "raycaster", new Yt());
    _(this, "pointer", new k());
    _(this, "excludeTypes", ["LineSegments", "DirectionalLight", "HemisphereLight", "Line"]);
    this.onActionComplete = t;
  }
  action({ camera: t, renderer: e, scene: i, components: s }) {
    this.camera = t, this.controls = new ze(t, e.domElement);
    const a = this.controls.getHelper();
    a.name = "transform-controls", i.add(a), this.actions = this.initActionsList(this.controls), this.keymap = this.initKeymap(this.actions), this.selectable = i.children.filter(({ type: n }) => !this.excludeTypes.includes(n)).filter(({ children: n }) => n.every((r) => r.type !== "Line")).filter(({ name: n }) => n !== "transform-controls"), this.bindEvents(s.orbit);
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
    var n, r;
    (n = this.controls) == null || n.addEventListener("mouseUp", () => {
      var c, u;
      (u = this.onActionComplete) == null || u.call(this, (c = this.controls) == null ? void 0 : c.object);
    }), (r = this.controls) == null || r.addEventListener("dragging-changed", (c) => {
      t != null && t.controls && (t.controls.enabled = !c.value);
    }), window.addEventListener("keydown", (c) => {
      var b, v;
      const u = c.key.toLowerCase(), w = u === "shift";
      (v = (b = this.keymap)[u]) == null || v.call(b, w);
    }), window.addEventListener("keyup", (c) => {
      var w;
      const u = c.key.toLowerCase();
      u === "shift" && ((w = this.keymap) == null || w[u](!1));
    });
    const e = "ontouchstart" in document.documentElement, i = window.navigator.maxTouchPoints >= 1, a = e || i ? "touchstart" : "mousedown";
    window.addEventListener(a, (c) => {
      this.handleClick(c instanceof TouchEvent ? c.changedTouches[0] : c);
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
class We {
  constructor() {
    _(this, "options");
    _(this, "components");
    _(this, "panel");
    _(this, "scene");
    _(this, "renderer");
    _(this, "camera");
    this.options = {
      scene: !1,
      props: !1,
      transform: !1,
      orbit: !1
      // physics: false,
    };
  }
  init({ scene: t, renderer: e, camera: i }, s = {}) {
    var a, n;
    if (!this.panel) {
      this.scene = t, this.renderer = e, this.camera = i, this.options = { ...this.options, ...s }, this.panel = new et({ width: 100, title: "Debug" }), this.panel.domElement.setAttribute("id", "debug-panel"), this.components = {
        props: new Re(),
        orbit: new Ye(),
        scene: new je(this.onSceneAction.bind(this)),
        transform: new qe(this.onTransformAction.bind(this))
      };
      for (const r of Object.keys(this.options))
        this.createToggle(r), this.options[r] && ((n = (a = this.components[r]) == null ? void 0 : a.action) == null || n.call(a, this));
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
  addCustomToggle({ label: t, handler: e, initialValue: i = !1 }) {
    if (Object.hasOwn(this.options, t)) {
      console.error(`a toggle with the name '${t}' already exists`);
      return;
    }
    this.options[t] = i, this.components[t] = {
      toggle: (s) => e(s)
    }, this.createToggle(t);
  }
  registerComponent({ label: t, instance: e, initialValue: i = !1 }) {
    var s;
    this.options[t] = i, this.components[t] = e, this.createToggle(t), i === !0 && ((s = e.action) == null || s.call(e, this));
  }
  onSceneAction(t) {
    var e;
    this.components.props.action(this, t), (e = this.components.transform.controls) == null || e.attach(t), this.logObject(t);
  }
  onTransformAction(t) {
    this.components.props.action(this, t), this.logObject(t);
  }
  logObject(t) {
    t && (console.log(`
`), console.log("target:   ", t), console.log("position: ", t.position), console.log("rotation: ", t.rotation), console.log("scale:    ", t.scale));
  }
  update(t) {
    var e, i, s, a;
    (i = (e = this.components.orbit).update) == null || i.call(e, t), (a = (s = this.components.physics) == null ? void 0 : s.update) == null || a.call(s);
  }
}
const Ge = new We();
export {
  We as Debug,
  Ge as debug
};
