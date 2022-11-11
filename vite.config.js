import { resolve } from "path"
import path from "path"
import { defineConfig } from "vite"
import replace from "@rollup/plugin-replace"

export default defineConfig(({ mode }) => {
	// if dev, we want to bundle the dependencies into the webXR library so it can be used in script tags.
	if (mode === "dev") {
		return {
			build: {
				minify: false,
				lib: {
					entry: resolve(__dirname, "src/LookingGlassWebXRPolyfill.js"),
					name: "Looking Glass WebXR",
					// the proper extensions will be added
					fileName: "@lookingglass/bundle/webxr",
				},
				emptyOutDir: false,
				rollupOptions: {
					output: {
						sourcemapExcludeSources: true,
						// Provide global variables to use in the UMD build
						// for externalized deps
					},
				},
				// specically fix an issue when bundling the webxr-polyfill library
				plugins: [
					replace({
						"process.env.NODE_ENV": JSON.stringify("production"),
					}),
				],
			},
		}
	}
	// if build, build the normal non-bundled version of the library. This is the version installed from npm
	else if (mode === "build") {
		return {
			build: {
				minify: true,
				lib: {
					entry: resolve(__dirname, "src/LookingGlassWebXRPolyfill.js"),
					name: "Looking Glass WebXR",
					// the proper extensions will be added
					fileName: "@lookingglass/webxr",
				},
				emptyOutDir: false,
				rollupOptions: {
					// make sure to externalize deps that shouldn't be bundled
					// into your library
					external: (id) => !id.startsWith(".") && !path.isAbsolute(id),
					output: {
						sourcemapExcludeSources: true,
						// Provide global variables to use in the UMD build
						// for externalized deps
						globals: {
							"@lookingglass/webxr-polyfill/src/WebXRPolyfill": "@lookingglass/webxr-polyfill/src/WebXRPolyfill",
							"@lookingglass/webxr-polyfill/src/api/index": "@lookingglass/webxr-polyfill/src/api/index",
							"@lookingglass/webxr-polyfill/src/api/XRSpace": "@lookingglass/webxr-polyfill/src/api/XRSpace",
							"@lookingglass/webxr-polyfill/src/api/XRSystem": "@lookingglass/webxr-polyfill/src/api/XRSystem",
							"@lookingglass/webxr-polyfill/src/devices/XRDevice": "@lookingglass/webxr-polyfill/src/devices/XRDevice",
							"@lookingglass/webxr-polyfill/src/api/XRWebGLLayer": "@lookingglass/webxr-polyfill/src/api/XRWebGLLayer",
							"gl-matrix": "glMatrix",
							"holoplay-core": "holoPlayCore",
							"holoplay-core/dist/holoplaycore.module.js": "holoPlayCore",
						},
					},
				},
			},
		}
	}
	// If no argument is passed, build the library normally, without bundling. Note, the mode argument should always be passed in, if this is called there's an error in the package.json
	else {
		console.log("you didn't pass a build argument in, please make sure the package.json file is configured properly")
	}
})
