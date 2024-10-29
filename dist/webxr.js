var oe = Object.defineProperty;
var le = (t, a, e) => a in t ? oe(t, a, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[a] = e;
var R = (t, a, e) => (le(t, typeof a != "symbol" ? a + "" : a, e), e);
import q from "@lookingglass/webxr-polyfill/src/api/index";
import ce from "@lookingglass/webxr-polyfill/src/api/XRSystem";
import ue from "@lookingglass/webxr-polyfill/src/WebXRPolyfill";
import * as he from "holoplay-core";
import { Shader as de } from "holoplay-core";
import fe from "@lookingglass/webxr-polyfill/src/devices/XRDevice";
import pe from "@lookingglass/webxr-polyfill/src/api/XRSpace";
import { mat4 as g } from "gl-matrix";
import me, { PRIVATE as be } from "@lookingglass/webxr-polyfill/src/api/XRWebGLLayer";
const H = 1.6;
var O;
(function(t) {
  t[t.Swizzled = 0] = "Swizzled", t[t.Center = 1] = "Center", t[t.Quilt = 2] = "Quilt";
})(O || (O = {}));
class ve extends EventTarget {
  constructor(e) {
    super();
    R(this, "_calibration", {
      configVersion: "1.0",
      pitch: { value: 45 },
      slope: { value: -5 },
      center: { value: -0.5 },
      viewCone: { value: 40 },
      invView: { value: 1 },
      verticalAngle: { value: 0 },
      DPI: { value: 338 },
      screenW: { value: 3840 },
      screenH: { value: 2160 },
      flipImageX: { value: 0 },
      flipImageY: { value: 0 },
      flipSubp: { value: 0 },
      serial: "",
      subpixelCells: [],
      CellPatternMode: { value: 0 }
    });
    R(this, "_viewControls", {
      tileHeight: 512,
      numViews: 48,
      trackballX: 0,
      trackballY: 0,
      targetX: 0,
      targetY: H,
      targetZ: -0.5,
      targetDiam: 2,
      fovy: 14 / 180 * Math.PI,
      depthiness: 1.25,
      inlineView: O.Center,
      capturing: !1,
      quiltResolution: null,
      columns: null,
      rows: null,
      popup: null,
      XRSession: null,
      lkgCanvas: null,
      appCanvas: null,
      subpixelMode: 1,
      filterMode: 1,
      gaussianSigma: 0.01
    });
    R(this, "LookingGlassDetected");
    this._viewControls = { ...this._viewControls, ...e }, this.syncCalibration();
  }
  syncCalibration() {
    new he.Client((e) => {
      if (e.devices.length < 1) {
        console.log("No Looking Glass devices found");
        return;
      }
      e.devices.length > 1 && console.log("More than one Looking Glass device found... using the first one"), this.calibration = e.devices[0].calibration;
    });
  }
  addEventListener(e, n, i) {
    super.addEventListener(e, n, i);
  }
  onConfigChange() {
    this.dispatchEvent(new Event("on-config-changed"));
  }
  get calibration() {
    return this._calibration;
  }
  set calibration(e) {
    this._calibration = {
      ...this._calibration,
      ...e
    }, this.onConfigChange();
  }
  updateViewControls(e) {
    e != null && (this._viewControls = {
      ...this._viewControls,
      ...e
    }, this.onConfigChange());
  }
  get tileHeight() {
    return Math.round(this.framebufferHeight / this.quiltHeight);
  }
  get quiltResolution() {
    if (this._viewControls.quiltResolution != null)
      return { width: this._viewControls.quiltResolution.width, height: this._viewControls.quiltResolution.height };
    {
      const e = this._calibration.serial;
      switch (!0) {
        case e.startsWith("LKG-2K"):
          return { width: 4096, height: 4096 };
        case e.startsWith("LKG-4K"):
          return { width: 4096, height: 4096 };
        case e.startsWith("LKG-8K"):
          return { width: 8192, height: 8192 };
        case e.startsWith("LKG-P"):
          return { width: 3360, height: 3360 };
        case e.startsWith("LKG-A"):
          return { width: 4096, height: 4096 };
        case e.startsWith("LKG-B"):
          return { width: 8192, height: 8192 };
        case e.startsWith("LKG-D"):
          return { width: 8192, height: 8192 };
        case e.startsWith("LKG-F"):
          return { width: 3360, height: 3360 };
        case e.startsWith("LKG-E"):
          return { width: 4092, height: 4092 };
        case e.startsWith("LKG-H"):
          return { width: 5995, height: 6e3 };
        case e.startsWith("LKG-J"):
          return { width: 5999, height: 5999 };
        case e.startsWith("LKG-K"):
          return { width: 8184, height: 8184 };
        case e.startsWith("LKG-L"):
          return { width: 8190, height: 8190 };
        default:
          return { width: 4096, height: 4096 };
      }
    }
  }
  set quiltResolution(e) {
    this.updateViewControls({ quiltResolution: e });
  }
  get numViews() {
    return this.quiltWidth * this.quiltHeight;
  }
  get targetX() {
    return this._viewControls.targetX;
  }
  set targetX(e) {
    this.updateViewControls({ targetX: e });
  }
  get targetY() {
    return this._viewControls.targetY;
  }
  set targetY(e) {
    this.updateViewControls({ targetY: e });
  }
  get targetZ() {
    return this._viewControls.targetZ;
  }
  set targetZ(e) {
    this.updateViewControls({ targetZ: e });
  }
  get trackballX() {
    return this._viewControls.trackballX;
  }
  set trackballX(e) {
    this.updateViewControls({ trackballX: e });
  }
  get trackballY() {
    return this._viewControls.trackballY;
  }
  set trackballY(e) {
    this.updateViewControls({ trackballY: e });
  }
  get targetDiam() {
    return this._viewControls.targetDiam;
  }
  set targetDiam(e) {
    this.updateViewControls({ targetDiam: e });
  }
  get fovy() {
    return this._viewControls.fovy;
  }
  set fovy(e) {
    this.updateViewControls({ fovy: e });
  }
  get depthiness() {
    return this._viewControls.depthiness;
  }
  set depthiness(e) {
    this.updateViewControls({ depthiness: e });
  }
  get inlineView() {
    return this._viewControls.inlineView;
  }
  set inlineView(e) {
    this.updateViewControls({ inlineView: e });
  }
  get capturing() {
    return this._viewControls.capturing;
  }
  set capturing(e) {
    this.updateViewControls({ capturing: e });
  }
  get subpixelMode() {
    return this._viewControls.subpixelMode;
  }
  set subpixelMode(e) {
    this.updateViewControls({ subpixelMode: e });
  }
  get filterMode() {
    return this._viewControls.filterMode;
  }
  set filterMode(e) {
    this.updateViewControls({ filterMode: e });
  }
  get gaussianSigma() {
    return this._viewControls.gaussianSigma;
  }
  set gaussianSigma(e) {
    this.updateViewControls({ gaussianSigma: e });
  }
  get popup() {
    return this._viewControls.popup;
  }
  set popup(e) {
    this.updateViewControls({ popup: e });
  }
  get XRSession() {
    return this._viewControls.XRSession;
  }
  set XRSession(e) {
    this.updateViewControls({ XRSession: e });
  }
  get lkgCanvas() {
    return this._viewControls.lkgCanvas;
  }
  set lkgCanvas(e) {
    this.updateViewControls({ lkgCanvas: e });
  }
  get appCanvas() {
    return this._viewControls.appCanvas;
  }
  set appCanvas(e) {
    this.updateViewControls({ appCanvas: e });
  }
  get columns() {
    return this._viewControls.columns;
  }
  set columns(e) {
    this.updateViewControls({ columns: e });
  }
  get rows() {
    return this._viewControls.rows;
  }
  set rows(e) {
    this.updateViewControls({ rows: e });
  }
  get aspect() {
    return this._calibration.screenW.value / this._calibration.screenH.value;
  }
  get tileWidth() {
    return Math.round(this.framebufferWidth / this.quiltWidth);
  }
  get framebufferWidth() {
    return this.quiltResolution.width;
  }
  get quiltWidth() {
    if (this._viewControls.columns != null)
      return this._viewControls.columns;
    const e = this._calibration.serial;
    switch (!0) {
      case e.startsWith("LKG-2K"):
        return 5;
      case e.startsWith("LKG-4K"):
        return 5;
      case e.startsWith("LKG-8K"):
        return 5;
      case e.startsWith("LKG-P"):
        return 8;
      case e.startsWith("LKG-A"):
        return 5;
      case e.startsWith("LKG-B"):
        return 5;
      case e.startsWith("LKG-D"):
        return 8;
      case e.startsWith("LKG-F"):
        return 8;
      case e.startsWith("LKG-E"):
        return 11;
      case e.startsWith("LKG-H"):
        return 11;
      case e.startsWith("LKG-J"):
        return 7;
      case e.startsWith("LKG-K"):
        return 11;
      case e.startsWith("LKG-L"):
        return 7;
      default:
        return 1;
    }
  }
  get quiltHeight() {
    if (this._viewControls.rows != null)
      return this._viewControls.rows;
    const e = this._calibration.serial;
    switch (!0) {
      case e.startsWith("LKG-2K"):
        return 9;
      case e.startsWith("LKG-4K"):
        return 9;
      case e.startsWith("LKG-8K"):
        return 9;
      case e.startsWith("LKG-P"):
        return 6;
      case e.startsWith("LKG-A"):
        return 9;
      case e.startsWith("LKG-B"):
        return 9;
      case e.startsWith("LKG-D"):
        return 9;
      case e.startsWith("LKG-F"):
        return 6;
      case e.startsWith("LKG-E"):
        return 6;
      case e.startsWith("LKG-H"):
        return 6;
      case e.startsWith("LKG-J"):
        return 7;
      case e.startsWith("LKG-K"):
        return 6;
      case e.startsWith("LKG-L"):
        return 7;
      default:
        return 1;
    }
  }
  get framebufferHeight() {
    return this.quiltResolution.height;
  }
  get viewCone() {
    return this._calibration.viewCone.value * this.depthiness / 180 * Math.PI;
  }
  get tilt() {
    return this._calibration.screenH.value / (this._calibration.screenW.value * this._calibration.slope.value) * (this._calibration.flipImageX.value ? -1 : 1);
  }
  get subp() {
    return 1 / (this._calibration.screenW.value * 3) * (this._calibration.flipImageX.value ? -1 : 1);
  }
  get pitch() {
    return this._calibration.pitch.value * this._calibration.screenW.value / this._calibration.DPI.value * Math.cos(Math.atan(1 / this._calibration.slope.value));
  }
  get subpixelCells() {
    const e = new Float32Array(6 * this._calibration.subpixelCells.length);
    return this._calibration.subpixelCells.forEach((n, i) => {
      n.ROffsetX /= this.calibration.screenW.value, n.ROffsetY /= this.calibration.screenH.value, n.GOffsetX /= this.calibration.screenW.value, n.GOffsetY /= this.calibration.screenH.value, n.BOffsetX /= this.calibration.screenW.value, n.BOffsetY /= this.calibration.screenH.value, e[i * 6 + 0] = n.ROffsetX, e[i * 6 + 1] = n.ROffsetY, e[i * 6 + 2] = n.GOffsetX, e[i * 6 + 3] = n.GOffsetY, e[i * 6 + 4] = n.BOffsetX, e[i * 6 + 5] = n.BOffsetY;
    }), e;
  }
}
let Y = null;
function S() {
  return Y == null && (Y = new ve()), Y;
}
function z(t) {
  const a = S();
  t != null && a.updateViewControls(t);
}
async function we() {
  const t = S();
  let a = 2;
  async function e() {
    if (t.appCanvas != null)
      try {
        t.capturing = !0, await new Promise((u) => {
          requestAnimationFrame(u);
        }), t.appCanvas.width = t.quiltResolution.width, t.appCanvas.height = t.quiltResolution.height;
        let i = t.appCanvas.toDataURL();
        const l = document.createElement("a");
        l.style.display = "none", l.href = i, l.download = `hologram_qs${t.quiltWidth}x${t.quiltHeight}a${t.aspect}.png`, document.body.appendChild(l), l.click(), document.body.removeChild(l), window.URL.revokeObjectURL(i);
      } catch (i) {
        console.error("Error while capturing canvas data:", i), t.capturing = !1;
      } finally {
        t.inlineView = a, t.capturing = !1, t.appCanvas.width = t.calibration.screenW.value, t.appCanvas.height = t.calibration.screenH.value;
      }
  }
  const n = document.getElementById("screenshotbutton");
  n && n.addEventListener("click", () => {
    a = t.inlineView;
    const i = W.getInstance();
    if (!i) {
      console.warn("LookingGlassXRDevice not initialized");
      return;
    }
    t.inlineView = 2, i.captureScreenshot = !0, setTimeout(() => {
      i.screenshotCallback = e;
    }, 100);
  });
}
function ge() {
  var a, e, n, i, l;
  const t = S();
  if (t.lkgCanvas == null)
    console.warn("window placement called without a valid XR Session!");
  else {
    let u = function() {
      let s = d.d - d.a, r = d.w - d.s;
      s && r && (s *= Math.sqrt(0.5), r *= Math.sqrt(0.5));
      const o = t.trackballX, h = t.trackballY, m = Math.cos(o) * s - Math.sin(o) * Math.cos(h) * r, C = -Math.sin(h) * r, _ = -Math.sin(o) * s - Math.cos(o) * Math.cos(h) * r;
      t.targetX = t.targetX + m * t.targetDiam * 0.03, t.targetY = t.targetY + C * t.targetDiam * 0.03, t.targetZ = t.targetZ + _ * t.targetDiam * 0.03, requestAnimationFrame(u);
    };
    t.trackballY = 0, t.trackballX = 0;
    const k = document.createElement("style");
    document.head.appendChild(k), (a = k.sheet) == null || a.insertRule("#LookingGlassWebXRControls * { all: revert; font-family: sans-serif }");
    const c = document.createElement("div");
    c.id = "LookingGlassWebXRControls", c.style.position = "fixed", c.style.zIndex = "1000", c.style.padding = "15px", c.style.width = "320px", c.style.maxWidth = "calc(100vw - 18px)", c.style.maxHeight = "calc(100vh - 18px)", c.style.whiteSpace = "nowrap", c.style.background = "rgba(0, 0, 0, 0.6)", c.style.color = "white", c.style.borderRadius = "10px", c.style.right = "15px", c.style.bottom = "15px", c.style.flex = "row";
    const b = document.createElement("div");
    c.appendChild(b), b.style.width = "100%", b.style.textAlign = "center", b.style.fontWeight = "bold", b.style.marginBottom = "8px", b.innerText = "Looking Glass Controls";
    const f = document.createElement("button");
    f.style.display = "block", f.style.margin = "auto", f.style.width = "100%", f.style.height = "35px", f.style.padding = "4px", f.style.marginBottom = "8px", f.style.borderRadius = "8px", f.id = "screenshotbutton", c.appendChild(f), f.innerText = "Save Hologram", t.quiltResolution.height * t.quiltResolution.width > 33177600 ? (f.style.backgroundColor = "#ccc", f.style.color = "#999", f.style.cursor = "not-allowed", f.title = "Button is disabled because the quilt resolution is too large.") : (f.style.backgroundColor = "", f.style.color = "", f.style.cursor = "", f.title = "");
    const w = document.createElement("button");
    w.style.display = "block", w.style.margin = "auto", w.style.width = "100%", w.style.height = "35px", w.style.padding = "4px", w.style.marginBottom = "8px", w.style.borderRadius = "8px", w.id = "copybutton", c.appendChild(w), w.innerText = "Copy Config", w.addEventListener("click", () => {
      ye(t);
    });
    const E = document.createElement("div");
    c.appendChild(E), E.style.width = "290px", E.style.whiteSpace = "normal", E.style.color = "rgba(255,255,255,0.7)", E.style.fontSize = "14px", E.style.margin = "5px 0", E.innerHTML = "Click the popup and use WASD, mouse left/right drag, and scroll.";
    const T = document.createElement("div");
    c.appendChild(T);
    const x = (s, r, o) => {
      const h = o.stringify, m = document.createElement("div");
      m.style.marginBottom = "8px", T.appendChild(m);
      const C = s, _ = t[s], L = document.createElement("label");
      m.appendChild(L), L.innerText = o.label, L.setAttribute("for", C), L.style.width = "100px", L.style.display = "inline-block", L.style.textDecoration = "dotted underline 1px", L.style.fontFamily = '"Courier New"', L.style.fontSize = "13px", L.style.fontWeight = "bold", L.title = o.title;
      const v = document.createElement("input");
      m.appendChild(v), Object.assign(v, r), v.id = C, v.title = o.title, v.value = r.value !== void 0 ? r.value : _;
      const V = (y) => {
        t[s] = y, G(y);
      };
      v.oninput = () => {
        const y = r.type === "range" ? parseFloat(v.value) : r.type === "checkbox" ? v.checked : v.value;
        V(y);
      };
      const K = (y) => {
        let p = y(t[s]);
        o.fixRange && (p = o.fixRange(p), v.max = Math.max(parseFloat(v.max), p).toString(), v.min = Math.min(parseFloat(v.min), p).toString()), v.value = p, V(p);
      };
      r.type === "range" && (v.style.width = "110px", v.style.height = "8px", v.onwheel = (y) => {
        K((p) => p + Math.sign(y.deltaX - y.deltaY) * r.step);
      });
      let G = (y) => {
      };
      if (h) {
        const y = document.createElement("span");
        y.style.fontFamily = '"Courier New"', y.style.fontSize = "13px", y.style.marginLeft = "3px", m.appendChild(y), G = (p) => {
          y.innerHTML = h(p);
        }, G(_);
      }
      return K;
    };
    x("fovy", {
      type: "range",
      min: 1 / 180 * Math.PI,
      max: 120.1 / 180 * Math.PI,
      step: 1 / 180 * Math.PI
    }, {
      label: "fov",
      title: "perspective fov (degrades stereo effect)",
      fixRange: (s) => Math.max(1 / 180 * Math.PI, Math.min(s, 120.1 / 180 * Math.PI)),
      stringify: (s) => {
        const r = s / Math.PI * 180, o = Math.atan(Math.tan(s / 2) * t.aspect) * 2 / Math.PI * 180;
        return `${r.toFixed()}&deg;&times;${o.toFixed()}&deg;`;
      }
    }), x("depthiness", { type: "range", min: 0, max: 2, step: 0.01 }, {
      label: "depthiness",
      title: "exaggerates depth by multiplying the width of the view cone (as reported by the firmware) - can somewhat compensate for depthiness lost using higher fov.",
      fixRange: (s) => Math.max(0, s),
      stringify: (s) => `${s.toFixed(2)}x`
    }), x("inlineView", { type: "range", min: 0, max: 2, step: 1 }, {
      label: "inline view",
      title: "what to show inline on the original canvas (swizzled = no overwrite)",
      fixRange: (s) => Math.max(0, Math.min(s, 2)),
      stringify: (s) => s === 0 ? "swizzled" : s === 1 ? "center" : s === 2 ? "quilt" : "?"
    }), x("filterMode", { type: "range", min: 0, max: 3, step: 1 }, {
      label: "view filtering mode",
      title: "controls the method used for view blending",
      fixRange: (s) => Math.max(0, Math.min(s, 2)),
      stringify: (s) => s === 0 ? "old, studio style" : s === 1 ? "2 view" : s === 2 ? "gaussian" : s === 3 ? "10 view gaussian" : "?"
    }), x("gaussianSigma", { type: "range", min: -1, max: 1, step: 0.01 }, {
      label: "gaussian sigma",
      title: "control view blending",
      fixRange: (s) => Math.max(-1, Math.min(s, 1)),
      stringify: (s) => s
    }), t.lkgCanvas.oncontextmenu = (s) => {
      s.preventDefault();
    }, t.lkgCanvas.addEventListener("wheel", (s) => {
      const r = t.targetDiam, o = 1.1, h = Math.log(r) / Math.log(o);
      return t.targetDiam = Math.pow(o, h + s.deltaY * 0.01);
    }, { passive: !1 }), t.lkgCanvas.addEventListener("mousemove", (s) => {
      const r = s.movementX, o = -s.movementY;
      if (s.buttons & 1 && s.ctrlKey) {
        const h = t.trackballX, m = t.trackballY, C = -Math.cos(h) * r + Math.sin(h) * Math.sin(m) * o, _ = -Math.cos(m) * o, L = Math.sin(h) * r + Math.cos(h) * Math.sin(m) * o;
        t.targetX = t.targetX + C * t.targetDiam * 1e-3, t.targetY = t.targetY + _ * t.targetDiam * 1e-3, t.targetZ = t.targetZ + L * t.targetDiam * 1e-3;
      } else
        t.trackballX > 0.75 ? -r * 0.01 < 0 && (t.trackballX = t.trackballX - r * 0.01) : t.trackballX < -0.75 ? -r * 0.01 > 0 && (t.trackballX = t.trackballX - r * 0.01) : -0.75 <= t.trackballX && t.trackballX <= 0.75 && (t.trackballX = t.trackballX - r * 0.01), t.trackballY > 0.5 ? -o * 0.01 < 0 && (t.trackballY = t.trackballY - o * 0.01) : t.trackballY < -0.5 ? -o * 0.01 > 0 && (t.trackballY = t.trackballY - o * 0.01) : -0.5 <= t.trackballY && t.trackballY <= 0.5 && (t.trackballY = t.trackballY - o * 0.01);
    });
    const d = { w: 0, a: 0, s: 0, d: 0 };
    return t.lkgCanvas.addEventListener("keydown", (s) => {
      switch (s.code) {
        case "KeyW":
          d.w = 1;
          break;
        case "KeyA":
          d.a = 1;
          break;
        case "KeyS":
          d.s = 1;
          break;
        case "KeyD":
          d.d = 1;
          break;
      }
    }), t.lkgCanvas.addEventListener("keyup", (s) => {
      switch (s.code) {
        case "KeyW":
          d.w = 0;
          break;
        case "KeyA":
          d.a = 0;
          break;
        case "KeyS":
          d.s = 0;
          break;
        case "KeyD":
          d.d = 0;
          break;
      }
    }), (e = t.appCanvas) == null || e.addEventListener("wheel", (s) => {
      const r = t.targetDiam, o = 1.1, h = Math.log(r) / Math.log(o);
      return t.targetDiam = Math.pow(o, h + s.deltaY * 0.01);
    }, { passive: !1 }), (n = t.appCanvas) == null || n.addEventListener("mousemove", (s) => {
      const r = s.movementX, o = -s.movementY;
      if (s.buttons & 1 && s.ctrlKey) {
        const h = t.trackballX, m = t.trackballY, C = -Math.cos(h) * r + Math.sin(h) * Math.sin(m) * o, _ = -Math.cos(m) * o, L = Math.sin(h) * r + Math.cos(h) * Math.sin(m) * o;
        t.targetX = t.targetX + C * t.targetDiam * 1e-3, t.targetY = t.targetY + _ * t.targetDiam * 1e-3, t.targetZ = t.targetZ + L * t.targetDiam * 1e-3;
      } else
        t.trackballX > 0.75 ? -r * 0.01 < 0 && (t.trackballX = t.trackballX - r * 0.01) : t.trackballX < -0.75 ? -r * 0.01 > 0 && (t.trackballX = t.trackballX - r * 0.01) : -0.75 <= t.trackballX && t.trackballX <= 0.75 && (t.trackballX = t.trackballX - r * 0.01), t.trackballY > 0.5 ? -o * 0.01 < 0 && (t.trackballY = t.trackballY - o * 0.01) : t.trackballY < -0.5 ? -o * 0.01 > 0 && (t.trackballY = t.trackballY - o * 0.01) : -0.5 <= t.trackballY && t.trackballY <= 0.5 && (t.trackballY = t.trackballY - o * 0.01);
    }), (i = t.appCanvas) == null || i.addEventListener("keydown", (s) => {
      switch (s.code) {
        case "KeyW":
          d.w = 1;
          break;
        case "KeyA":
          d.a = 1;
          break;
        case "KeyS":
          d.s = 1;
          break;
        case "KeyD":
          d.d = 1;
          break;
      }
    }), (l = t.appCanvas) == null || l.addEventListener("keyup", (s) => {
      switch (s.code) {
        case "KeyW":
          d.w = 0;
          break;
        case "KeyA":
          d.a = 0;
          break;
        case "KeyS":
          d.s = 0;
          break;
        case "KeyD":
          d.d = 0;
          break;
      }
    }), requestAnimationFrame(u), setTimeout(() => {
      we();
    }, 1e3), c;
  }
}
function ye(t) {
  const a = {
    targetX: t.targetX,
    targetY: t.targetY,
    targetZ: t.targetZ,
    fovy: `${Math.round(t.fovy / Math.PI * 180)} * Math.PI / 180`,
    targetDiam: t.targetDiam,
    trackballX: t.trackballX,
    trackballY: t.trackballY,
    depthiness: t.depthiness
  };
  let e = JSON.stringify(a, null, 4).replace(/"/g, "").replace(/{/g, "").replace(/}/g, "");
  navigator.clipboard.writeText(e);
}
let N;
const Ee = (t, a) => {
  const e = S();
  if (e.lkgCanvas == null) {
    console.warn("window placement called without a valid XR Session!");
    return;
  } else
    t == !1 ? Le(e, N) : (N == null && (N = ge()), e.lkgCanvas.style.position = "fixed", e.lkgCanvas.style.bottom = "0", e.lkgCanvas.style.left = "0", e.lkgCanvas.width = e.calibration.screenW.value, e.lkgCanvas.height = e.calibration.screenH.value, document.body.appendChild(N), "getScreenDetails" in window ? Ce(e.lkgCanvas, e, a) : j(e, e.lkgCanvas, a));
};
async function Ce(t, a, e) {
  const i = (await window.getScreenDetails()).screens.filter((l) => l.label.includes("LKG"))[0];
  if (i === void 0) {
    console.log("no Looking Glass monitor detected - manually opening popup window"), j(a, t, e);
    return;
  } else {
    const l = [
      `left=${i.left}`,
      `top=${i.top}`,
      `width=${i.width}`,
      `height=${i.height}`,
      "menubar=no",
      "toolbar=no",
      "location=no",
      "status=no",
      "resizable=yes",
      "scrollbars=no",
      "fullscreenEnabled=true"
    ].join(",");
    a.popup = window.open("", "new", l), a.popup && (a.popup.document.body.style.background = "black", a.popup.document.body.style.transform = "1.0", Z(a), a.popup.document.body.appendChild(t), console.assert(e), a.popup.onbeforeunload = e);
  }
}
function j(t, a, e) {
  t.popup = window.open("", void 0, "width=640,height=360"), t.popup && (t.popup.document.title = "Looking Glass Window (fullscreen me on Looking Glass!)", t.popup.document.body.style.background = "black", t.popup.document.body.style.transform = "1.0", Z(t), t.popup.document.body.appendChild(a), console.assert(e), t.popup.onbeforeunload = e);
}
function Le(t, a) {
  var e;
  (e = a.parentElement) == null || e.removeChild(a), t.popup && (t.popup.onbeforeunload = null, t.popup.close(), t.popup = null);
}
function Z(t) {
  t.popup && t.popup.document.addEventListener("keydown", (a) => {
    a.ctrlKey && (a.key === "=" || a.key === "-" || a.key === "+") && a.preventDefault();
  });
}
const P = Symbol("LookingGlassXRWebGLLayer");
class Re extends me {
  constructor(a, e, n) {
    super(a, e, n);
    const i = S();
    i.appCanvas = e.canvas, i.lkgCanvas = document.createElement("canvas"), i.lkgCanvas.tabIndex = 0;
    const l = i.lkgCanvas.getContext("2d", { alpha: !1 });
    i.lkgCanvas.addEventListener("dblclick", function() {
      this.requestFullscreen();
    });
    const u = this[be].config, k = e.createTexture();
    let c, b;
    const f = e.createFramebuffer(), F = e.enable.bind(e), w = e.disable.bind(e), E = e.getExtension("OES_vertex_array_object"), T = 34229, x = E ? E.bindVertexArrayOES.bind(E) : e.bindVertexArray.bind(e), d = () => {
      const M = e.getParameter(e.TEXTURE_BINDING_2D);
      if (e.bindTexture(e.TEXTURE_2D, k), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, i.framebufferWidth, i.framebufferHeight, 0, e.RGBA, e.UNSIGNED_BYTE, null), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_BASE_LEVEL, 0), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAX_LEVEL, 0), e.bindTexture(e.TEXTURE_2D, M), c) {
        const D = e.getParameter(e.RENDERBUFFER_BINDING);
        e.bindRenderbuffer(e.RENDERBUFFER, c), e.renderbufferStorage(e.RENDERBUFFER, b.format, i.framebufferWidth, i.framebufferHeight), e.bindRenderbuffer(e.RENDERBUFFER, D);
      }
    };
    (u.depth || u.stencil) && (u.depth && u.stencil ? b = { format: e.DEPTH_STENCIL, attachment: e.DEPTH_STENCIL_ATTACHMENT } : u.depth ? b = { format: e.DEPTH_COMPONENT16, attachment: e.DEPTH_ATTACHMENT } : u.stencil && (b = { format: e.STENCIL_INDEX8, attachment: e.STENCIL_ATTACHMENT }), c = e.createRenderbuffer()), d(), i.addEventListener("on-config-changed", d);
    const s = e.getParameter(e.FRAMEBUFFER_BINDING);
    e.bindFramebuffer(e.FRAMEBUFFER, f), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, k, 0), (u.depth || u.stencil) && e.framebufferRenderbuffer(e.FRAMEBUFFER, b.attachment, e.RENDERBUFFER, c), e.bindFramebuffer(e.FRAMEBUFFER, s);
    const r = e.createProgram();
    if (!r)
      return;
    const o = e.createShader(e.VERTEX_SHADER);
    if (!o)
      return;
    e.attachShader(r, o);
    const h = e.createShader(e.FRAGMENT_SHADER);
    if (!h)
      return;
    e.attachShader(r, h);
    {
      const M = `#version 300 es
			in vec2 a_position;
			out vec2 v_texcoord;
			void main() {
			  gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);
			  v_texcoord = a_position;
			}
		  `;
      e.shaderSource(o, M), e.compileShader(o), e.getShaderParameter(o, e.COMPILE_STATUS) || console.warn(e.getShaderInfoLog(o));
    }
    let m, C, _;
    const L = () => {
      const M = de(i);
      if (M === m || (m = M, !h))
        return;
      if (e.shaderSource(h, M), e.compileShader(h), !e.getShaderParameter(h, e.COMPILE_STATUS)) {
        console.warn(e.getShaderInfoLog(h));
        return;
      }
      if (!r)
        return;
      if (e.linkProgram(r), !e.getProgramParameter(r, e.LINK_STATUS)) {
        console.warn(e.getProgramInfoLog(r));
        return;
      }
      C = e.getAttribLocation(r, "a_position"), _ = e.getUniformLocation(r, "u_viewType");
      const D = e.getUniformLocation(r, "u_texture"), B = e.getUniformLocation(r, "subpixelData"), U = e.getParameter(e.CURRENT_PROGRAM);
      e.useProgram(r), e.uniform1i(D, 0), e.uniform1fv(B, i.subpixelCells), e.useProgram(U);
    };
    i.addEventListener("on-config-changed", L);
    const v = E ? E.createVertexArrayOES() : e.createVertexArray(), V = e.createBuffer(), K = e.getParameter(e.ARRAY_BUFFER_BINDING), G = e.getParameter(T);
    x(v), e.bindBuffer(e.ARRAY_BUFFER, V), e.bufferData(e.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), e.STATIC_DRAW), e.enableVertexAttribArray(C), e.vertexAttribPointer(C, 2, e.FLOAT, !1, 0, 0), x(G), e.bindBuffer(e.ARRAY_BUFFER, K);
    const y = () => {
      console.assert(this[P].LookingGlassEnabled), e.bindFramebuffer(e.FRAMEBUFFER, f);
      const M = e.getParameter(e.COLOR_CLEAR_VALUE), D = e.getParameter(e.DEPTH_CLEAR_VALUE), B = e.getParameter(e.STENCIL_CLEAR_VALUE);
      e.clearColor(0, 0, 0, 0), e.clearDepth(1), e.clearStencil(0), e.clear(e.DEPTH_BUFFER_BIT | e.COLOR_BUFFER_BIT | e.STENCIL_BUFFER_BIT), e.clearColor(M[0], M[1], M[2], M[3]), e.clearDepth(D), e.clearStencil(B);
    }, p = e.canvas;
    let A, X;
    const J = () => {
      if (!this[P].LookingGlassEnabled)
        return;
      (p.width !== i.calibration.screenW.value || p.height !== i.calibration.screenH.value) && i.capturing === !1 ? (A = p.width, X = p.height, p.width = i.calibration.screenW.value, p.height = i.calibration.screenH.value) : i.capturing === !0 && (A = p.width, X = p.height, p.width = i.framebufferWidth, p.height = i.framebufferHeight);
      const M = e.getParameter(T), D = e.getParameter(e.CULL_FACE), B = e.getParameter(e.BLEND), U = e.getParameter(e.DEPTH_TEST), Q = e.getParameter(e.STENCIL_TEST), ee = e.getParameter(e.SCISSOR_TEST), te = e.getParameter(e.VIEWPORT), ae = e.getParameter(e.FRAMEBUFFER_BINDING), ie = e.getParameter(e.RENDERBUFFER_BINDING), se = e.getParameter(e.CURRENT_PROGRAM), re = e.getParameter(e.ACTIVE_TEXTURE);
      {
        const ne = e.getParameter(e.TEXTURE_BINDING_2D);
        e.bindFramebuffer(e.FRAMEBUFFER, null), e.useProgram(r), x(v), e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, k), e.disable(e.BLEND), e.disable(e.CULL_FACE), e.disable(e.DEPTH_TEST), e.disable(e.STENCIL_TEST), e.viewport(0, 0, e.drawingBufferWidth, e.drawingBufferHeight), e.uniform1i(_, 0), e.drawArrays(e.TRIANGLES, 0, 6), l == null || l.clearRect(0, 0, i.calibration.screenW.value, i.calibration.screenH.value), l == null || l.drawImage(p, 0, 0), i.inlineView !== 0 && (e.uniform1i(_, i.inlineView), e.drawArrays(e.TRIANGLES, 0, 6)), e.bindTexture(e.TEXTURE_2D, ne);
      }
      e.activeTexture(re), e.useProgram(se), e.bindRenderbuffer(e.RENDERBUFFER, ie), e.bindFramebuffer(e.FRAMEBUFFER, ae), e.viewport(...te), (ee ? F : w)(e.SCISSOR_TEST), (Q ? F : w)(e.STENCIL_TEST), (U ? F : w)(e.DEPTH_TEST), (B ? F : w)(e.BLEND), (D ? F : w)(e.CULL_FACE), x(M);
    };
    this[P] = {
      LookingGlassEnabled: !1,
      framebuffer: f,
      clearFramebuffer: y,
      blitTextureToDefaultFramebufferIfNeeded: J,
      moveCanvasToWindow: Ee,
      restoreOriginalCanvasDimensions: () => {
        A && X && (p.width = A, p.height = X, A = X = void 0);
      }
    };
  }
  get framebuffer() {
    return this[P].LookingGlassEnabled ? this[P].framebuffer : null;
  }
  get framebufferWidth() {
    return S().framebufferWidth;
  }
  get framebufferHeight() {
    return S().framebufferHeight;
  }
}
const I = class extends fe {
  constructor(a) {
    super(a), this.sessions = /* @__PURE__ */ new Map(), this.viewSpaces = [], this.basePoseMatrix = g.create(), this.inlineProjectionMatrix = g.create(), this.inlineInverseViewMatrix = g.create(), this.LookingGlassProjectionMatrices = [], this.LookingGlassInverseViewMatrices = [], this.captureScreenshot = !1, this.screenshotCallback = null, I.instance || (I.instance = this);
  }
  static getInstance() {
    return I.instance;
  }
  onBaseLayerSet(a, e) {
    const n = this.sessions.get(a);
    n.baseLayer = e;
    const i = S(), l = e[P];
    l.LookingGlassEnabled = n.immersive, n.immersive && (i.XRSession = this.sessions.get(a), i.popup == null ? l.moveCanvasToWindow(!0, () => {
      this.endSession(a);
    }) : console.warn("attempted to assign baselayer twice?"));
  }
  isSessionSupported(a) {
    return a === "inline" || a === "immersive-vr";
  }
  isFeatureSupported(a) {
    switch (a) {
      case "viewer":
        return !0;
      case "local":
        return !0;
      case "local-floor":
        return !0;
      case "bounded-floor":
        return !1;
      case "unbounded":
        return !1;
      default:
        return console.warn("LookingGlassXRDevice.isFeatureSupported: feature not understood:", a), !1;
    }
  }
  async requestSession(a, e) {
    if (!this.isSessionSupported(a))
      return Promise.reject();
    const n = a !== "inline", i = new xe(a, e), l = S();
    return this.sessions.set(i.id, i), n && (this.dispatchEvent("@@webxr-polyfill/vr-present-start", i.id), window.addEventListener("unload", () => {
      l.popup && l.popup.close(), l.popup = null;
    })), Promise.resolve(i.id);
  }
  requestAnimationFrame(a) {
    return this.global.requestAnimationFrame(a);
  }
  cancelAnimationFrame(a) {
    this.global.cancelAnimationFrame(a);
  }
  onFrameStart(a, e) {
    const n = this.sessions.get(a), i = S();
    if (n.immersive) {
      const l = Math.tan(0.5 * i.fovy), u = 0.5 * i.targetDiam / l, k = u - i.targetDiam, c = this.basePoseMatrix;
      g.fromTranslation(c, [i.targetX, i.targetY, i.targetZ]), g.rotate(c, c, i.trackballX, [0, 1, 0]), g.rotate(c, c, -i.trackballY, [1, 0, 0]), g.translate(c, c, [0, 0, u]);
      for (let b = 0; b < i.numViews; ++b) {
        const f = (b + 0.5) / i.numViews - 0.5, F = Math.tan(i.viewCone * f), w = u * F, E = this.LookingGlassInverseViewMatrices[b] = this.LookingGlassInverseViewMatrices[b] || g.create();
        g.translate(E, c, [w, 0, 0]), g.invert(E, E);
        const T = Math.max(k + e.depthNear, 0.01), x = k + e.depthFar, d = T * l, s = d, r = -d, o = T * -F, h = i.aspect * d, m = o + h, C = o - h, _ = this.LookingGlassProjectionMatrices[b] = this.LookingGlassProjectionMatrices[b] || g.create();
        g.set(_, 2 * T / (m - C), 0, 0, 0, 0, 2 * T / (s - r), 0, 0, (m + C) / (m - C), (s + r) / (s - r), -(x + T) / (x - T), -1, 0, 0, -2 * x * T / (x - T), 0);
      }
    } else {
      const l = n.baseLayer.context, u = l.drawingBufferWidth / l.drawingBufferHeight;
      g.perspective(this.inlineProjectionMatrix, e.inlineVerticalFieldOfView, u, e.depthNear, e.depthFar), g.fromTranslation(this.basePoseMatrix, [0, H, 0]), g.invert(this.inlineInverseViewMatrix, this.basePoseMatrix), n.baseLayer[P].clearFramebuffer();
    }
  }
  onFrameEnd(a) {
    this.sessions.get(a).baseLayer[P].blitTextureToDefaultFramebufferIfNeeded(), this.captureScreenshot && this.screenshotCallback && (this.screenshotCallback(), this.captureScreenshot = !1);
  }
  async requestFrameOfReferenceTransform(a, e) {
    const n = g.create();
    switch (a) {
      case "viewer":
      case "local":
        return g.fromTranslation(n, [0, -H, 0]), n;
      case "local-floor":
        return n;
      default:
        throw new Error("XRReferenceSpaceType not understood");
    }
  }
  endSession(a) {
    const e = this.sessions.get(a);
    e.immersive && e.baseLayer && (e.baseLayer[P].moveCanvasToWindow(!1), e.baseLayer[P].LookingGlassEnabled = !1, e.baseLayer[P].restoreOriginalCanvasDimensions(), this.dispatchEvent("@@webxr-polyfill/vr-present-end", a)), e.ended = !0;
  }
  doesSessionSupportReferenceSpace(a, e) {
    const n = this.sessions.get(a);
    return n.ended ? !1 : n.enabledFeatures.has(e);
  }
  getViewSpaces(a) {
    if (a === "immersive-vr") {
      const e = S();
      for (let n = this.viewSpaces.length; n < e.numViews; ++n)
        this.viewSpaces[n] = new Te(n);
      return this.viewSpaces.length = e.numViews, this.viewSpaces;
    }
  }
  getViewport(a, e, n, i, l) {
    if (l === void 0) {
      const k = this.sessions.get(a).baseLayer.context;
      i.x = 0, i.y = 0, i.width = k.drawingBufferWidth, i.height = k.drawingBufferHeight;
    } else {
      const u = S(), k = l % u.quiltWidth, c = Math.floor(l / u.quiltWidth);
      i.x = u.framebufferWidth / u.quiltWidth * k, i.y = u.framebufferHeight / u.quiltHeight * c, i.width = u.framebufferWidth / u.quiltWidth, i.height = u.framebufferHeight / u.quiltHeight;
    }
    return !0;
  }
  getProjectionMatrix(a, e) {
    return e === void 0 ? this.inlineProjectionMatrix : this.LookingGlassProjectionMatrices[e] || g.create();
  }
  getBasePoseMatrix() {
    return this.basePoseMatrix;
  }
  getBaseViewMatrix() {
    return this.inlineInverseViewMatrix;
  }
  _getViewMatrixByIndex(a) {
    return this.LookingGlassInverseViewMatrices[a] = this.LookingGlassInverseViewMatrices[a] || g.create();
  }
  getInputSources() {
    return [];
  }
  getInputPose(a, e, n) {
    return null;
  }
  onWindowResize() {
  }
};
let W = I;
R(W, "instance", null);
let ke = 0;
class xe {
  constructor(a, e) {
    R(this, "mode");
    R(this, "immersive");
    R(this, "id");
    R(this, "baseLayer");
    R(this, "inlineVerticalFieldOfView");
    R(this, "ended");
    R(this, "enabledFeatures");
    this.mode = a, this.immersive = a === "immersive-vr" || a === "immersive-ar", this.id = ++ke, this.baseLayer = null, this.inlineVerticalFieldOfView = Math.PI * 0.5, this.ended = !1, this.enabledFeatures = e;
  }
}
class Te extends pe {
  constructor(e) {
    super();
    R(this, "viewIndex");
    this.viewIndex = e;
  }
  get eye() {
    return "none";
  }
  _onPoseUpdate(e) {
    this._inverseBaseMatrix = e._getViewMatrixByIndex(this.viewIndex);
  }
}
class $ extends ue {
  constructor(e) {
    super();
    R(this, "vrButton");
    R(this, "device");
    R(this, "isPresenting", !1);
    z(e), this.loadPolyfill();
  }
  static async init(e) {
    new $(e);
  }
  async loadPolyfill() {
    this.overrideDefaultVRButton(), console.warn('Looking Glass WebXR "polyfill" overriding native WebXR API.');
    for (const e in q)
      this.global[e] = q[e];
    this.global.XRWebGLLayer = Re, this.injected = !0, this.device = new W(this.global), this.xr = new ce(Promise.resolve(this.device)), Object.defineProperty(this.global.navigator, "xr", {
      value: this.xr,
      configurable: !0
    });
  }
  async overrideDefaultVRButton() {
    this.vrButton = await _e("VRButton"), this.vrButton && this.device ? (this.device.addEventListener("@@webxr-polyfill/vr-present-start", () => {
      this.isPresenting = !0, this.updateVRButtonUI();
    }), this.device.addEventListener("@@webxr-polyfill/vr-present-end", () => {
      this.isPresenting = !1, this.updateVRButtonUI();
    }), this.vrButton.addEventListener("click", (e) => {
      this.updateVRButtonUI();
    }), this.updateVRButtonUI()) : console.warn("Unable to find VRButton");
  }
  async updateVRButtonUI() {
    if (this.vrButton) {
      await Me(100), this.isPresenting ? this.vrButton.innerHTML = "EXIT LOOKING GLASS" : this.vrButton.innerHTML = "ENTER LOOKING GLASS";
      const e = 220;
      this.vrButton.style.width = `${e}px`, this.vrButton.style.left = `calc(50% - ${e / 2}px)`;
    }
  }
  update(e) {
    z(e);
  }
}
async function _e(t) {
  return new Promise((a) => {
    const e = new MutationObserver(function(n) {
      n.forEach(function(i) {
        i.addedNodes.forEach(function(l) {
          const u = l;
          u.id === t && (a(u), e.disconnect());
        });
      });
    });
    e.observe(document.body, { subtree: !1, childList: !0 }), setTimeout(() => {
      e.disconnect(), a(null);
    }, 5e3);
  });
}
function Me(t) {
  return new Promise((a) => setTimeout(a, t));
}
const Ie = S();
export {
  Ie as LookingGlassConfig,
  $ as LookingGlassWebXRPolyfill
};
