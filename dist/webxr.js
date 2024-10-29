var le = Object.defineProperty;
var ce = (t, i, e) => i in t ? le(t, i, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[i] = e;
var L = (t, i, e) => (ce(t, typeof i != "symbol" ? i + "" : i, e), e);
import z from "@lookingglass/webxr-polyfill/src/api/index";
import ue from "@lookingglass/webxr-polyfill/src/api/XRSystem";
import he from "@lookingglass/webxr-polyfill/src/WebXRPolyfill";
import * as de from "holoplay-core";
import { Shader as pe } from "holoplay-core";
import fe from "@lookingglass/webxr-polyfill/src/devices/XRDevice";
import me from "@lookingglass/webxr-polyfill/src/api/XRSpace";
import { mat4 as E } from "gl-matrix";
import be, { PRIVATE as ve } from "@lookingglass/webxr-polyfill/src/api/XRWebGLLayer";
const Y = 1.6;
var q;
(function(t) {
  t[t.Swizzled = 0] = "Swizzled", t[t.Center = 1] = "Center", t[t.Quilt = 2] = "Quilt";
})(q || (q = {}));
class we extends EventTarget {
  constructor(e) {
    super();
    L(this, "_calibration", {
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
    L(this, "_viewControls", {
      tileHeight: 512,
      numViews: 48,
      trackballX: 0,
      trackballY: 0,
      targetX: 0,
      targetY: Y,
      targetZ: -0.5,
      targetDiam: 2,
      fovy: 14 / 180 * Math.PI,
      depthiness: 1.25,
      inlineView: q.Center,
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
    L(this, "LookingGlassDetected");
    this._viewControls = { ...this._viewControls, ...e }, this.syncCalibration();
  }
  syncCalibration() {
    new de.Client((e) => {
      if (e.devices.length < 1) {
        console.log("No Looking Glass devices found");
        return;
      }
      e.devices.length > 1 && console.log("More than one Looking Glass device found... using the first one"), this.calibration = e.devices[0].calibration;
    });
  }
  addEventListener(e, n, s) {
    super.addEventListener(e, n, s);
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
    return this._calibration.subpixelCells.forEach((n, s) => {
      n.ROffsetX /= this.calibration.screenW.value, n.ROffsetY /= this.calibration.screenH.value, n.GOffsetX /= this.calibration.screenW.value, n.GOffsetY /= this.calibration.screenH.value, n.BOffsetX /= this.calibration.screenW.value, n.BOffsetY /= this.calibration.screenH.value, e[s * 6 + 0] = n.ROffsetX, e[s * 6 + 1] = n.ROffsetY, e[s * 6 + 2] = n.GOffsetX, e[s * 6 + 3] = n.GOffsetY, e[s * 6 + 4] = n.BOffsetX, e[s * 6 + 5] = n.BOffsetY;
    }), e;
  }
}
let O = null;
function S() {
  return O == null && (O = new we()), O;
}
function j(t) {
  const i = S();
  t != null && i.updateViewControls(t);
}
async function ge() {
  const t = S();
  let i = 2;
  async function e() {
    if (t.appCanvas != null)
      try {
        t.capturing = !0, await new Promise((u) => {
          requestAnimationFrame(u);
        }), t.appCanvas.width = t.quiltResolution.width, t.appCanvas.height = t.quiltResolution.height;
        let s = t.appCanvas.toDataURL();
        const l = document.createElement("a");
        l.style.display = "none", l.href = s, l.download = `hologram_qs${t.quiltWidth}x${t.quiltHeight}a${t.aspect}.png`, document.body.appendChild(l), l.click(), document.body.removeChild(l), window.URL.revokeObjectURL(s);
      } catch (s) {
        console.error("Error while capturing canvas data:", s), t.capturing = !1;
      } finally {
        t.inlineView = i, t.capturing = !1, t.appCanvas.width = t.calibration.screenW.value, t.appCanvas.height = t.calibration.screenH.value;
      }
  }
  const n = document.getElementById("screenshotbutton");
  n && n.addEventListener("click", () => {
    i = t.inlineView;
    const s = X.getInstance();
    if (!s) {
      console.warn("LookingGlassXRDevice not initialized");
      return;
    }
    t.inlineView = 2, s.captureScreenshot = !0, setTimeout(() => {
      s.screenshotCallback = e;
    }, 100);
  });
}
function ye() {
  var e, n, s, l, u;
  const t = S();
  if (t.lkgCanvas == null)
    console.warn("window placement called without a valid XR Session!");
  else {
    const m = document.createElement("style");
    document.head.appendChild(m), (e = m.sheet) == null || e.insertRule("#LookingGlassWebXRControls * { all: revert; font-family: sans-serif }");
    const o = document.createElement("div");
    o.id = "LookingGlassWebXRControls", o.style.position = "fixed", o.style.zIndex = "1000", o.style.padding = "15px", o.style.width = "320px", o.style.maxWidth = "calc(100vw - 18px)", o.style.maxHeight = "calc(100vh - 18px)", o.style.whiteSpace = "nowrap", o.style.background = "rgba(0, 0, 0, 0.6)", o.style.color = "white", o.style.borderRadius = "10px", o.style.right = "15px", o.style.bottom = "15px", o.style.flex = "row";
    const f = document.createElement("div");
    o.appendChild(f), f.style.width = "100%", f.style.textAlign = "center", f.style.fontWeight = "bold", f.style.marginBottom = "8px", f.innerText = "Looking Glass Controls";
    const h = document.createElement("button");
    h.style.display = "block", h.style.margin = "auto", h.style.width = "100%", h.style.height = "35px", h.style.padding = "4px", h.style.marginBottom = "8px", h.style.borderRadius = "8px", h.id = "screenshotbutton", o.appendChild(h), h.innerText = "Save Hologram", t.quiltResolution.height * t.quiltResolution.width > 33177600 ? (h.style.backgroundColor = "#ccc", h.style.color = "#999", h.style.cursor = "not-allowed", h.title = "Button is disabled because the quilt resolution is too large.") : (h.style.backgroundColor = "", h.style.color = "", h.style.cursor = "", h.title = "");
    const v = document.createElement("button");
    v.style.display = "block", v.style.margin = "auto", v.style.width = "100%", v.style.height = "35px", v.style.padding = "4px", v.style.marginBottom = "8px", v.style.borderRadius = "8px", v.id = "copybutton", o.appendChild(v), v.innerText = "Copy Config", v.addEventListener("click", () => {
      Ee(t);
    });
    const w = document.createElement("div");
    o.appendChild(w), w.style.width = "290px", w.style.whiteSpace = "normal", w.style.color = "rgba(255,255,255,0.7)", w.style.fontSize = "14px", w.style.margin = "5px 0", w.innerHTML = "mousetest23 Click the popup and use WASD, mouse left/right drag, and scroll.";
    const T = document.createElement("div");
    o.appendChild(T);
    const R = (a, d, r) => {
      const p = r.stringify, b = document.createElement("div");
      b.style.marginBottom = "8px", T.appendChild(b);
      const k = a, x = t[a], g = document.createElement("label");
      b.appendChild(g), g.innerText = r.label, g.setAttribute("for", k), g.style.width = "100px", g.style.display = "inline-block", g.style.textDecoration = "dotted underline 1px", g.style.fontFamily = '"Courier New"', g.style.fontSize = "13px", g.style.fontWeight = "bold", g.title = r.title;
      const y = document.createElement("input");
      b.appendChild(y), Object.assign(y, d), y.id = k, y.title = r.title, y.value = d.value !== void 0 ? d.value : x;
      const A = (C) => {
        t[a] = C, B(C);
      };
      y.oninput = () => {
        const C = d.type === "range" ? parseFloat(y.value) : d.type === "checkbox" ? y.checked : y.value;
        A(C);
      };
      const K = (C) => {
        let P = C(t[a]);
        r.fixRange && (P = r.fixRange(P), y.max = Math.max(parseFloat(y.max), P).toString(), y.min = Math.min(parseFloat(y.min), P).toString()), y.value = P, A(P);
      };
      d.type === "range" && (y.style.width = "110px", y.style.height = "8px", y.onwheel = (C) => {
        K((P) => P + Math.sign(C.deltaX - C.deltaY) * d.step);
      });
      let B = (C) => {
      };
      if (p) {
        const C = document.createElement("span");
        C.style.fontFamily = '"Courier New"', C.style.fontSize = "13px", C.style.marginLeft = "3px", b.appendChild(C), B = (P) => {
          C.innerHTML = p(P);
        }, B(x);
      }
      return K;
    };
    R("fovy", {
      type: "range",
      min: 1 / 180 * Math.PI,
      max: 120.1 / 180 * Math.PI,
      step: 1 / 180 * Math.PI
    }, {
      label: "fov",
      title: "perspective fov (degrades stereo effect)",
      fixRange: (a) => Math.max(1 / 180 * Math.PI, Math.min(a, 120.1 / 180 * Math.PI)),
      stringify: (a) => {
        const d = a / Math.PI * 180, r = Math.atan(Math.tan(a / 2) * t.aspect) * 2 / Math.PI * 180;
        return `${d.toFixed()}&deg;&times;${r.toFixed()}&deg;`;
      }
    }), R("depthiness", { type: "range", min: 0, max: 2, step: 0.01 }, {
      label: "depthiness",
      title: "exaggerates depth by multiplying the width of the view cone (as reported by the firmware) - can somewhat compensate for depthiness lost using higher fov.",
      fixRange: (a) => Math.max(0, a),
      stringify: (a) => `${a.toFixed(2)}x`
    }), R("inlineView", { type: "range", min: 0, max: 2, step: 1 }, {
      label: "inline view",
      title: "what to show inline on the original canvas (swizzled = no overwrite)",
      fixRange: (a) => Math.max(0, Math.min(a, 2)),
      stringify: (a) => a === 0 ? "swizzled" : a === 1 ? "center" : a === 2 ? "quilt" : "?"
    }), R("filterMode", { type: "range", min: 0, max: 3, step: 1 }, {
      label: "view filtering mode",
      title: "controls the method used for view blending",
      fixRange: (a) => Math.max(0, Math.min(a, 2)),
      stringify: (a) => a === 0 ? "old, studio style" : a === 1 ? "2 view" : a === 2 ? "gaussian" : a === 3 ? "10 view gaussian" : "?"
    }), R("gaussianSigma", { type: "range", min: -1, max: 1, step: 0.01 }, {
      label: "gaussian sigma",
      title: "control view blending",
      fixRange: (a) => Math.max(-1, Math.min(a, 1)),
      stringify: (a) => a
    }), t.lkgCanvas.oncontextmenu = (a) => {
      a.preventDefault();
    }, t.lkgCanvas.addEventListener("wheel", (a) => {
      const d = t.targetDiam, r = 1.1, p = Math.log(d) / Math.log(r);
      return t.targetDiam = Math.pow(r, p + a.deltaY * 0.01);
    }, { passive: !1 }), t.lkgCanvas.addEventListener("mousemove", (a) => {
      const d = a.movementX, r = -a.movementY;
      if (a.buttons & 1 && a.ctrlKey) {
        const p = t.trackballX, b = t.trackballY, k = -Math.cos(p) * d + Math.sin(p) * Math.sin(b) * r, x = -Math.cos(b) * r, g = Math.sin(p) * d + Math.cos(p) * Math.sin(b) * r;
        t.targetX = t.targetX + k * t.targetDiam * 1e-3, t.targetY = t.targetY + x * t.targetDiam * 1e-3, t.targetZ = t.targetZ + g * t.targetDiam * 1e-3;
      } else
        t.trackballY = t.trackballY - r * 0.01, t.trackballX = t.trackballX - d * 0.01;
    }), t.lkgCanvas.addEventListener("keydown", (a) => {
      switch (a.code) {
      }
    }), t.lkgCanvas.addEventListener("keyup", (a) => {
      switch (a.code) {
      }
    }), (n = t.appCanvas) == null || n.addEventListener("wheel", (a) => {
      const d = t.targetDiam, r = 1.1, p = Math.log(d) / Math.log(r);
      return t.targetDiam = Math.pow(r, p + a.deltaY * 0.01);
    }, { passive: !1 }), (s = t.appCanvas) == null || s.addEventListener("mousemove", (a) => {
      const d = a.movementX, r = -a.movementY;
      if (a.buttons & 1 && a.ctrlKey) {
        const p = t.trackballX, b = t.trackballY, k = -Math.cos(p) * d + Math.sin(p) * Math.sin(b) * r, x = -Math.cos(b) * r, g = Math.sin(p) * d + Math.cos(p) * Math.sin(b) * r;
        t.targetX = t.targetX + k * t.targetDiam * 1e-3, t.targetY = t.targetY + x * t.targetDiam * 1e-3, t.targetZ = t.targetZ + g * t.targetDiam * 1e-3;
      } else
        w.innerHTML = t.trackballY.toString(), -0.5 <= t.trackballY && t.trackballY <= 0.5 && (t.trackballY = t.trackballY - r * 0.01, t.trackballX = t.trackballX - d * 0.01);
    });
  }
  (l = t.appCanvas) == null || l.addEventListener("keydown", (m) => {
    switch (m.code) {
      case "KeyW":
        keys.w = 1;
        break;
      case "KeyA":
        keys.a = 1;
        break;
      case "KeyS":
        keys.s = 1;
        break;
      case "KeyD":
        keys.d = 1;
        break;
    }
  }), (u = t.appCanvas) == null || u.addEventListener("keyup", (m) => {
    switch (m.code) {
      case "KeyW":
        keys.w = 0;
        break;
      case "KeyA":
        keys.a = 0;
        break;
      case "KeyS":
        keys.s = 0;
        break;
      case "KeyD":
        keys.d = 0;
        break;
    }
  }), requestAnimationFrame(i);
  function i() {
    let m = keys.d - keys.a, o = keys.w - keys.s;
    m && o && (m *= Math.sqrt(0.5), o *= Math.sqrt(0.5));
    const f = t.trackballX, h = t.trackballY, F = Math.cos(f) * m - Math.sin(f) * Math.cos(h) * o, v = -Math.sin(h) * o, w = -Math.sin(f) * m - Math.cos(f) * Math.cos(h) * o;
    t.targetX = t.targetX + F * t.targetDiam * 0.03, t.targetY = t.targetY + v * t.targetDiam * 0.03, t.targetZ = t.targetZ + w * t.targetDiam * 0.03, requestAnimationFrame(i);
  }
  return setTimeout(() => {
    ge();
  }, 1e3), c;
}
function Ee(t) {
  const i = {
    targetX: t.targetX,
    targetY: t.targetY,
    targetZ: t.targetZ,
    fovy: `${Math.round(t.fovy / Math.PI * 180)} * Math.PI / 180`,
    targetDiam: t.targetDiam,
    trackballX: t.trackballX,
    trackballY: t.trackballY,
    depthiness: t.depthiness
  };
  let e = JSON.stringify(i, null, 4).replace(/"/g, "").replace(/{/g, "").replace(/}/g, "");
  navigator.clipboard.writeText(e);
}
let U;
const Ce = (t, i) => {
  const e = S();
  if (e.lkgCanvas == null) {
    console.warn("window placement called without a valid XR Session!");
    return;
  } else
    t == !1 ? Re(e, U) : (U == null && (U = ye()), e.lkgCanvas.style.position = "fixed", e.lkgCanvas.style.bottom = "0", e.lkgCanvas.style.left = "0", e.lkgCanvas.width = e.calibration.screenW.value, e.lkgCanvas.height = e.calibration.screenH.value, document.body.appendChild(U), "getScreenDetails" in window ? Le(e.lkgCanvas, e, i) : Z(e, e.lkgCanvas, i));
};
async function Le(t, i, e) {
  const s = (await window.getScreenDetails()).screens.filter((l) => l.label.includes("LKG"))[0];
  if (s === void 0) {
    console.log("no Looking Glass monitor detected - manually opening popup window"), Z(i, t, e);
    return;
  } else {
    const l = [
      `left=${s.left}`,
      `top=${s.top}`,
      `width=${s.width}`,
      `height=${s.height}`,
      "menubar=no",
      "toolbar=no",
      "location=no",
      "status=no",
      "resizable=yes",
      "scrollbars=no",
      "fullscreenEnabled=true"
    ].join(",");
    i.popup = window.open("", "new", l), i.popup && (i.popup.document.body.style.background = "black", i.popup.document.body.style.transform = "1.0", $(i), i.popup.document.body.appendChild(t), console.assert(e), i.popup.onbeforeunload = e);
  }
}
function Z(t, i, e) {
  t.popup = window.open("", void 0, "width=640,height=360"), t.popup && (t.popup.document.title = "Looking Glass Window (fullscreen me on Looking Glass!)", t.popup.document.body.style.background = "black", t.popup.document.body.style.transform = "1.0", $(t), t.popup.document.body.appendChild(i), console.assert(e), t.popup.onbeforeunload = e);
}
function Re(t, i) {
  var e;
  (e = i.parentElement) == null || e.removeChild(i), t.popup && (t.popup.onbeforeunload = null, t.popup.close(), t.popup = null);
}
function $(t) {
  t.popup && t.popup.document.addEventListener("keydown", (i) => {
    i.ctrlKey && (i.key === "=" || i.key === "-" || i.key === "+") && i.preventDefault();
  });
}
const G = Symbol("LookingGlassXRWebGLLayer");
class Te extends be {
  constructor(i, e, n) {
    super(i, e, n);
    const s = S();
    s.appCanvas = e.canvas, s.lkgCanvas = document.createElement("canvas"), s.lkgCanvas.tabIndex = 0;
    const l = s.lkgCanvas.getContext("2d", { alpha: !1 });
    s.lkgCanvas.addEventListener("dblclick", function() {
      this.requestFullscreen();
    });
    const u = this[ve].config, m = e.createTexture();
    let o, f;
    const h = e.createFramebuffer(), F = e.enable.bind(e), v = e.disable.bind(e), w = e.getExtension("OES_vertex_array_object"), T = 34229, R = w ? w.bindVertexArrayOES.bind(w) : e.bindVertexArray.bind(e), a = () => {
      const _ = e.getParameter(e.TEXTURE_BINDING_2D);
      if (e.bindTexture(e.TEXTURE_2D, m), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, s.framebufferWidth, s.framebufferHeight, 0, e.RGBA, e.UNSIGNED_BYTE, null), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_BASE_LEVEL, 0), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAX_LEVEL, 0), e.bindTexture(e.TEXTURE_2D, _), o) {
        const D = e.getParameter(e.RENDERBUFFER_BINDING);
        e.bindRenderbuffer(e.RENDERBUFFER, o), e.renderbufferStorage(e.RENDERBUFFER, f.format, s.framebufferWidth, s.framebufferHeight), e.bindRenderbuffer(e.RENDERBUFFER, D);
      }
    };
    (u.depth || u.stencil) && (u.depth && u.stencil ? f = { format: e.DEPTH_STENCIL, attachment: e.DEPTH_STENCIL_ATTACHMENT } : u.depth ? f = { format: e.DEPTH_COMPONENT16, attachment: e.DEPTH_ATTACHMENT } : u.stencil && (f = { format: e.STENCIL_INDEX8, attachment: e.STENCIL_ATTACHMENT }), o = e.createRenderbuffer()), a(), s.addEventListener("on-config-changed", a);
    const d = e.getParameter(e.FRAMEBUFFER_BINDING);
    e.bindFramebuffer(e.FRAMEBUFFER, h), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, m, 0), (u.depth || u.stencil) && e.framebufferRenderbuffer(e.FRAMEBUFFER, f.attachment, e.RENDERBUFFER, o), e.bindFramebuffer(e.FRAMEBUFFER, d);
    const r = e.createProgram();
    if (!r)
      return;
    const p = e.createShader(e.VERTEX_SHADER);
    if (!p)
      return;
    e.attachShader(r, p);
    const b = e.createShader(e.FRAGMENT_SHADER);
    if (!b)
      return;
    e.attachShader(r, b);
    {
      const _ = `#version 300 es
			in vec2 a_position;
			out vec2 v_texcoord;
			void main() {
			  gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);
			  v_texcoord = a_position;
			}
		  `;
      e.shaderSource(p, _), e.compileShader(p), e.getShaderParameter(p, e.COMPILE_STATUS) || console.warn(e.getShaderInfoLog(p));
    }
    let k, x, g;
    const y = () => {
      const _ = pe(s);
      if (_ === k || (k = _, !b))
        return;
      if (e.shaderSource(b, _), e.compileShader(b), !e.getShaderParameter(b, e.COMPILE_STATUS)) {
        console.warn(e.getShaderInfoLog(b));
        return;
      }
      if (!r)
        return;
      if (e.linkProgram(r), !e.getProgramParameter(r, e.LINK_STATUS)) {
        console.warn(e.getProgramInfoLog(r));
        return;
      }
      x = e.getAttribLocation(r, "a_position"), g = e.getUniformLocation(r, "u_viewType");
      const D = e.getUniformLocation(r, "u_texture"), V = e.getUniformLocation(r, "subpixelData"), H = e.getParameter(e.CURRENT_PROGRAM);
      e.useProgram(r), e.uniform1i(D, 0), e.uniform1fv(V, s.subpixelCells), e.useProgram(H);
    };
    s.addEventListener("on-config-changed", y);
    const A = w ? w.createVertexArrayOES() : e.createVertexArray(), K = e.createBuffer(), B = e.getParameter(e.ARRAY_BUFFER_BINDING), C = e.getParameter(T);
    R(A), e.bindBuffer(e.ARRAY_BUFFER, K), e.bufferData(e.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), e.STATIC_DRAW), e.enableVertexAttribArray(x), e.vertexAttribPointer(x, 2, e.FLOAT, !1, 0, 0), R(C), e.bindBuffer(e.ARRAY_BUFFER, B);
    const P = () => {
      console.assert(this[G].LookingGlassEnabled), e.bindFramebuffer(e.FRAMEBUFFER, h);
      const _ = e.getParameter(e.COLOR_CLEAR_VALUE), D = e.getParameter(e.DEPTH_CLEAR_VALUE), V = e.getParameter(e.STENCIL_CLEAR_VALUE);
      e.clearColor(0, 0, 0, 0), e.clearDepth(1), e.clearStencil(0), e.clear(e.DEPTH_BUFFER_BIT | e.COLOR_BUFFER_BIT | e.STENCIL_BUFFER_BIT), e.clearColor(_[0], _[1], _[2], _[3]), e.clearDepth(D), e.clearStencil(V);
    }, M = e.canvas;
    let I, W;
    const Q = () => {
      if (!this[G].LookingGlassEnabled)
        return;
      (M.width !== s.calibration.screenW.value || M.height !== s.calibration.screenH.value) && s.capturing === !1 ? (I = M.width, W = M.height, M.width = s.calibration.screenW.value, M.height = s.calibration.screenH.value) : s.capturing === !0 && (I = M.width, W = M.height, M.width = s.framebufferWidth, M.height = s.framebufferHeight);
      const _ = e.getParameter(T), D = e.getParameter(e.CULL_FACE), V = e.getParameter(e.BLEND), H = e.getParameter(e.DEPTH_TEST), ee = e.getParameter(e.STENCIL_TEST), te = e.getParameter(e.SCISSOR_TEST), ie = e.getParameter(e.VIEWPORT), se = e.getParameter(e.FRAMEBUFFER_BINDING), ae = e.getParameter(e.RENDERBUFFER_BINDING), ne = e.getParameter(e.CURRENT_PROGRAM), re = e.getParameter(e.ACTIVE_TEXTURE);
      {
        const oe = e.getParameter(e.TEXTURE_BINDING_2D);
        e.bindFramebuffer(e.FRAMEBUFFER, null), e.useProgram(r), R(A), e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, m), e.disable(e.BLEND), e.disable(e.CULL_FACE), e.disable(e.DEPTH_TEST), e.disable(e.STENCIL_TEST), e.viewport(0, 0, e.drawingBufferWidth, e.drawingBufferHeight), e.uniform1i(g, 0), e.drawArrays(e.TRIANGLES, 0, 6), l == null || l.clearRect(0, 0, s.calibration.screenW.value, s.calibration.screenH.value), l == null || l.drawImage(M, 0, 0), s.inlineView !== 0 && (e.uniform1i(g, s.inlineView), e.drawArrays(e.TRIANGLES, 0, 6)), e.bindTexture(e.TEXTURE_2D, oe);
      }
      e.activeTexture(re), e.useProgram(ne), e.bindRenderbuffer(e.RENDERBUFFER, ae), e.bindFramebuffer(e.FRAMEBUFFER, se), e.viewport(...ie), (te ? F : v)(e.SCISSOR_TEST), (ee ? F : v)(e.STENCIL_TEST), (H ? F : v)(e.DEPTH_TEST), (V ? F : v)(e.BLEND), (D ? F : v)(e.CULL_FACE), R(_);
    };
    this[G] = {
      LookingGlassEnabled: !1,
      framebuffer: h,
      clearFramebuffer: P,
      blitTextureToDefaultFramebufferIfNeeded: Q,
      moveCanvasToWindow: Ce,
      restoreOriginalCanvasDimensions: () => {
        I && W && (M.width = I, M.height = W, I = W = void 0);
      }
    };
  }
  get framebuffer() {
    return this[G].LookingGlassEnabled ? this[G].framebuffer : null;
  }
  get framebufferWidth() {
    return S().framebufferWidth;
  }
  get framebufferHeight() {
    return S().framebufferHeight;
  }
}
const N = class extends fe {
  constructor(i) {
    super(i), this.sessions = /* @__PURE__ */ new Map(), this.viewSpaces = [], this.basePoseMatrix = E.create(), this.inlineProjectionMatrix = E.create(), this.inlineInverseViewMatrix = E.create(), this.LookingGlassProjectionMatrices = [], this.LookingGlassInverseViewMatrices = [], this.captureScreenshot = !1, this.screenshotCallback = null, N.instance || (N.instance = this);
  }
  static getInstance() {
    return N.instance;
  }
  onBaseLayerSet(i, e) {
    const n = this.sessions.get(i);
    n.baseLayer = e;
    const s = S(), l = e[G];
    l.LookingGlassEnabled = n.immersive, n.immersive && (s.XRSession = this.sessions.get(i), s.popup == null ? l.moveCanvasToWindow(!0, () => {
      this.endSession(i);
    }) : console.warn("attempted to assign baselayer twice?"));
  }
  isSessionSupported(i) {
    return i === "inline" || i === "immersive-vr";
  }
  isFeatureSupported(i) {
    switch (i) {
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
        return console.warn("LookingGlassXRDevice.isFeatureSupported: feature not understood:", i), !1;
    }
  }
  async requestSession(i, e) {
    if (!this.isSessionSupported(i))
      return Promise.reject();
    const n = i !== "inline", s = new _e(i, e), l = S();
    return this.sessions.set(s.id, s), n && (this.dispatchEvent("@@webxr-polyfill/vr-present-start", s.id), window.addEventListener("unload", () => {
      l.popup && l.popup.close(), l.popup = null;
    })), Promise.resolve(s.id);
  }
  requestAnimationFrame(i) {
    return this.global.requestAnimationFrame(i);
  }
  cancelAnimationFrame(i) {
    this.global.cancelAnimationFrame(i);
  }
  onFrameStart(i, e) {
    const n = this.sessions.get(i), s = S();
    if (n.immersive) {
      const l = Math.tan(0.5 * s.fovy), u = 0.5 * s.targetDiam / l, m = u - s.targetDiam, o = this.basePoseMatrix;
      E.fromTranslation(o, [s.targetX, s.targetY, s.targetZ]), E.rotate(o, o, s.trackballX, [0, 1, 0]), E.rotate(o, o, -s.trackballY, [1, 0, 0]), E.translate(o, o, [0, 0, u]);
      for (let f = 0; f < s.numViews; ++f) {
        const h = (f + 0.5) / s.numViews - 0.5, F = Math.tan(s.viewCone * h), v = u * F, w = this.LookingGlassInverseViewMatrices[f] = this.LookingGlassInverseViewMatrices[f] || E.create();
        E.translate(w, o, [v, 0, 0]), E.invert(w, w);
        const T = Math.max(m + e.depthNear, 0.01), R = m + e.depthFar, a = T * l, d = a, r = -a, p = T * -F, b = s.aspect * a, k = p + b, x = p - b, g = this.LookingGlassProjectionMatrices[f] = this.LookingGlassProjectionMatrices[f] || E.create();
        E.set(g, 2 * T / (k - x), 0, 0, 0, 0, 2 * T / (d - r), 0, 0, (k + x) / (k - x), (d + r) / (d - r), -(R + T) / (R - T), -1, 0, 0, -2 * R * T / (R - T), 0);
      }
    } else {
      const l = n.baseLayer.context, u = l.drawingBufferWidth / l.drawingBufferHeight;
      E.perspective(this.inlineProjectionMatrix, e.inlineVerticalFieldOfView, u, e.depthNear, e.depthFar), E.fromTranslation(this.basePoseMatrix, [0, Y, 0]), E.invert(this.inlineInverseViewMatrix, this.basePoseMatrix), n.baseLayer[G].clearFramebuffer();
    }
  }
  onFrameEnd(i) {
    this.sessions.get(i).baseLayer[G].blitTextureToDefaultFramebufferIfNeeded(), this.captureScreenshot && this.screenshotCallback && (this.screenshotCallback(), this.captureScreenshot = !1);
  }
  async requestFrameOfReferenceTransform(i, e) {
    const n = E.create();
    switch (i) {
      case "viewer":
      case "local":
        return E.fromTranslation(n, [0, -Y, 0]), n;
      case "local-floor":
        return n;
      default:
        throw new Error("XRReferenceSpaceType not understood");
    }
  }
  endSession(i) {
    const e = this.sessions.get(i);
    e.immersive && e.baseLayer && (e.baseLayer[G].moveCanvasToWindow(!1), e.baseLayer[G].LookingGlassEnabled = !1, e.baseLayer[G].restoreOriginalCanvasDimensions(), this.dispatchEvent("@@webxr-polyfill/vr-present-end", i)), e.ended = !0;
  }
  doesSessionSupportReferenceSpace(i, e) {
    const n = this.sessions.get(i);
    return n.ended ? !1 : n.enabledFeatures.has(e);
  }
  getViewSpaces(i) {
    if (i === "immersive-vr") {
      const e = S();
      for (let n = this.viewSpaces.length; n < e.numViews; ++n)
        this.viewSpaces[n] = new ke(n);
      return this.viewSpaces.length = e.numViews, this.viewSpaces;
    }
  }
  getViewport(i, e, n, s, l) {
    if (l === void 0) {
      const m = this.sessions.get(i).baseLayer.context;
      s.x = 0, s.y = 0, s.width = m.drawingBufferWidth, s.height = m.drawingBufferHeight;
    } else {
      const u = S(), m = l % u.quiltWidth, o = Math.floor(l / u.quiltWidth);
      s.x = u.framebufferWidth / u.quiltWidth * m, s.y = u.framebufferHeight / u.quiltHeight * o, s.width = u.framebufferWidth / u.quiltWidth, s.height = u.framebufferHeight / u.quiltHeight;
    }
    return !0;
  }
  getProjectionMatrix(i, e) {
    return e === void 0 ? this.inlineProjectionMatrix : this.LookingGlassProjectionMatrices[e] || E.create();
  }
  getBasePoseMatrix() {
    return this.basePoseMatrix;
  }
  getBaseViewMatrix() {
    return this.inlineInverseViewMatrix;
  }
  _getViewMatrixByIndex(i) {
    return this.LookingGlassInverseViewMatrices[i] = this.LookingGlassInverseViewMatrices[i] || E.create();
  }
  getInputSources() {
    return [];
  }
  getInputPose(i, e, n) {
    return null;
  }
  onWindowResize() {
  }
};
let X = N;
L(X, "instance", null);
let xe = 0;
class _e {
  constructor(i, e) {
    L(this, "mode");
    L(this, "immersive");
    L(this, "id");
    L(this, "baseLayer");
    L(this, "inlineVerticalFieldOfView");
    L(this, "ended");
    L(this, "enabledFeatures");
    this.mode = i, this.immersive = i === "immersive-vr" || i === "immersive-ar", this.id = ++xe, this.baseLayer = null, this.inlineVerticalFieldOfView = Math.PI * 0.5, this.ended = !1, this.enabledFeatures = e;
  }
}
class ke extends me {
  constructor(e) {
    super();
    L(this, "viewIndex");
    this.viewIndex = e;
  }
  get eye() {
    return "none";
  }
  _onPoseUpdate(e) {
    this._inverseBaseMatrix = e._getViewMatrixByIndex(this.viewIndex);
  }
}
class J extends he {
  constructor(e) {
    super();
    L(this, "vrButton");
    L(this, "device");
    L(this, "isPresenting", !1);
    j(e), this.loadPolyfill();
  }
  static async init(e) {
    new J(e);
  }
  async loadPolyfill() {
    this.overrideDefaultVRButton(), console.warn('Looking Glass WebXR "polyfill" overriding native WebXR API.');
    for (const e in z)
      this.global[e] = z[e];
    this.global.XRWebGLLayer = Te, this.injected = !0, this.device = new X(this.global), this.xr = new ue(Promise.resolve(this.device)), Object.defineProperty(this.global.navigator, "xr", {
      value: this.xr,
      configurable: !0
    });
  }
  async overrideDefaultVRButton() {
    this.vrButton = await Me("VRButton"), this.vrButton && this.device ? (this.device.addEventListener("@@webxr-polyfill/vr-present-start", () => {
      this.isPresenting = !0, this.updateVRButtonUI();
    }), this.device.addEventListener("@@webxr-polyfill/vr-present-end", () => {
      this.isPresenting = !1, this.updateVRButtonUI();
    }), this.vrButton.addEventListener("click", (e) => {
      this.updateVRButtonUI();
    }), this.updateVRButtonUI()) : console.warn("Unable to find VRButton");
  }
  async updateVRButtonUI() {
    if (this.vrButton) {
      await Se(100), this.isPresenting ? this.vrButton.innerHTML = "EXIT LOOKING GLASS" : this.vrButton.innerHTML = "ENTER LOOKING GLASS";
      const e = 220;
      this.vrButton.style.width = `${e}px`, this.vrButton.style.left = `calc(50% - ${e / 2}px)`;
    }
  }
  update(e) {
    j(e);
  }
}
async function Me(t) {
  return new Promise((i) => {
    const e = new MutationObserver(function(n) {
      n.forEach(function(s) {
        s.addedNodes.forEach(function(l) {
          const u = l;
          u.id === t && (i(u), e.disconnect());
        });
      });
    });
    e.observe(document.body, { subtree: !1, childList: !0 }), setTimeout(() => {
      e.disconnect(), i(null);
    }, 5e3);
  });
}
function Se(t) {
  return new Promise((i) => setTimeout(i, t));
}
const Xe = S();
export {
  Xe as LookingGlassConfig,
  J as LookingGlassWebXRPolyfill
};
