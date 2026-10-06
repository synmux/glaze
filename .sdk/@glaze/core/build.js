var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// cli/build/app-context.ts
import { existsSync } from "fs";
import { basename, dirname, join } from "path";
function isSourcesDirName(name) {
  return name === SOURCES_DIR_NAME || name === LEGACY_SOURCES_DIR_NAME;
}
function resolveDeployedRuntimeDir(cwd) {
  const name = basename(cwd);
  const parentDir = dirname(cwd);
  if (name === SOURCES_DIR_NAME && basename(parentDir) === LEGACY_RUNTIME_DIR_NAME) {
    return parentDir;
  }
  const legacySibling = join(cwd, "..", LEGACY_RUNTIME_DIR_NAME);
  if (existsSync(legacySibling)) {
    return legacySibling;
  }
  if (!isSourcesDirName(name)) {
    return null;
  }
  const currentSibling = join(cwd, "..", RUNTIME_DIR_NAME);
  if (existsSync(currentSibling)) {
    return currentSibling;
  }
  return name === SOURCES_DIR_NAME ? join(cwd, "..", RUNTIME_DIR_NAME) : join(cwd, "..", LEGACY_RUNTIME_DIR_NAME);
}
var SOURCES_DIR_NAME, RUNTIME_DIR_NAME, LEGACY_SOURCES_DIR_NAME, LEGACY_RUNTIME_DIR_NAME, BUILD_OUTPUT_DIR_NAME;
var init_app_context = __esm({
  "cli/build/app-context.ts"() {
    "use strict";
    SOURCES_DIR_NAME = "sources";
    RUNTIME_DIR_NAME = "runtime";
    LEGACY_SOURCES_DIR_NAME = ".glaze-sources";
    LEGACY_RUNTIME_DIR_NAME = ".glaze";
    BUILD_OUTPUT_DIR_NAME = "build";
  }
});

// cli/build/config.ts
import { existsSync as existsSync2 } from "fs";
import { join as join2, resolve } from "path";
function defineConfig(config) {
  return config;
}
function detectAppContext(cwd = process.cwd()) {
  const runtimeDir = resolveDeployedRuntimeDir(cwd);
  const appRoot = cwd;
  const buildOutDirOverride = process.env.GLAZE_BUILD_OUT_DIR;
  const buildOutDir = buildOutDirOverride ? resolve(cwd, buildOutDirOverride) : runtimeDir ? resolve(runtimeDir, BUILD_OUTPUT_DIR_NAME) : resolve(cwd, `./${BUILD_OUTPUT_DIR_NAME}`);
  return { isDeployed: runtimeDir !== null, appRoot, buildOutDir };
}
async function loadConfig(appRoot) {
  const configPath = join2(appRoot, "glaze.config.ts");
  if (!existsSync2(configPath)) {
    return {};
  }
  try {
    const mod = await import(configPath);
    return mod.default ?? mod;
  } catch (err) {
    console.warn(`[glaze] Warning: failed to load glaze.config.ts:`, err?.message);
    return {};
  }
}
var init_config = __esm({
  "cli/build/config.ts"() {
    "use strict";
    init_app_context();
  }
});

// cli/build/build-renderer.ts
var build_renderer_exports = {};
__export(build_renderer_exports, {
  buildRenderer: () => buildRenderer,
  createViteConfig: () => createViteConfig,
  createViteDevServer: () => createViteDevServer,
  resolveGlazeCorePath: () => resolveGlazeCorePath
});
import { existsSync as existsSync7, readFileSync as readFileSync3, readdirSync as readdirSync2, rmSync as rmSync3 } from "fs";
import { createRequire as createRequire2 } from "module";
import { basename as basename3, join as join5, resolve as resolve4 } from "path";
import { pathToFileURL } from "url";
function createAppToolingRequire(appRoot) {
  return {
    app: createRequire2(resolve4(appRoot, "package.json")),
    core: createRequire2(import.meta.url)
  };
}
function resolveToolingPath(specifier, appRoot, requires) {
  try {
    return requires.app.resolve(specifier);
  } catch {
    try {
      return requires.core.resolve(specifier);
    } catch {
      throw new Error(
        `[glaze] Missing build dependency "${specifier}". Install app dependencies in ${appRoot} (npm install).`
      );
    }
  }
}
async function importToolingModule(specifier, appRoot, requires) {
  const resolvedPath = resolveToolingPath(specifier, appRoot, requires);
  return await import(pathToFileURL(resolvedPath).href);
}
function resolveModuleDefault(mod) {
  return mod.default ?? mod;
}
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function resolveGlazeCorePath(appRoot) {
  const devPath = resolve4(appRoot, "../glaze-core");
  if (existsSync7(devPath)) return devPath;
  const envSdkPath = process.env.GLAZE_SDK_PATH;
  if (envSdkPath) {
    const envCorePath = join5(envSdkPath, "@glaze", "core");
    if (existsSync7(envCorePath)) return envCorePath;
    const directPkg = join5(envSdkPath, "package.json");
    if (existsSync7(directPkg)) {
      const meta = JSON.parse(readFileSync3(directPkg, "utf-8"));
      if (meta.name === "@glaze/core") return envSdkPath;
    }
  }
  const projectedSdkPath = resolve4(appRoot, "../../.sdk/@glaze/core");
  if (existsSync7(projectedSdkPath)) return projectedSdkPath;
  const sdkPath = resolve4(appRoot, "../../../sdk/current/@glaze/core");
  if (existsSync7(sdkPath)) return sdkPath;
  throw new Error(
    `[glaze] Cannot resolve @glaze/core. Looked in:
  - ${devPath}
` + (envSdkPath ? `  - ${join5(envSdkPath, "@glaze", "core")}
` : "") + (envSdkPath ? `  - ${envSdkPath} (direct)
` : "") + `  - ${projectedSdkPath}
  - ${sdkPath}
Set GLAZE_SDK_PATH or ensure glaze-core is a sibling package.`
  );
}
async function createViteConfig(appRoot, overrides) {
  const toolingRequires = createAppToolingRequire(appRoot);
  const [reactModule, tailwindModule, viteModule, babelModule] = await Promise.all([
    importToolingModule("@vitejs/plugin-react", appRoot, toolingRequires),
    importToolingModule("@tailwindcss/vite", appRoot, toolingRequires),
    importToolingModule("vite", appRoot, toolingRequires),
    importToolingModule("@rolldown/plugin-babel", appRoot, toolingRequires).catch(() => null)
  ]);
  const react = resolveModuleDefault(reactModule);
  const tailwindcss = resolveModuleDefault(tailwindModule);
  const reactCompilerPreset = reactModule.reactCompilerPreset;
  const babel = babelModule ? resolveModuleDefault(babelModule) : null;
  const viteApi = resolveModuleDefault(viteModule);
  const defineConfig2 = viteApi.defineConfig;
  if (typeof defineConfig2 !== "function") {
    throw new Error("[glaze] Failed to load Vite API: defineConfig is not available");
  }
  const esmExternalRequirePlugin = viteApi.esmExternalRequirePlugin;
  const { buildOutDir } = detectAppContext(appRoot);
  const glazeCorePath = resolveGlazeCorePath(appRoot);
  const { isExternalDep, sharedDeps, sharedDepsDedupe } = await import(resolve4(glazeCorePath, "shared-externals.mjs"));
  const packageJsonPath = join5(appRoot, "package.json");
  const packageJson = existsSync7(packageJsonPath) ? JSON.parse(readFileSync3(packageJsonPath, "utf-8")) : {};
  const windowHtmlEntries = readdirSync2(appRoot).filter((file) => file.endsWith("-window.html")).reduce((inputs, file) => {
    const entryName = file.replace(/\.html$/, "");
    inputs[entryName] = resolve4(appRoot, file);
    return inputs;
  }, {});
  const serverPort = overrides?.server?.port ?? 4143;
  const serverHost = overrides?.server?.host ?? "localhost";
  const esbuildPath = resolveToolingPath("esbuild", appRoot, toolingRequires);
  const includeDevHarness = existsSync7(resolve4(appRoot, "main/dev"));
  function devHarnessStubPlugin2() {
    const namespace = "glaze-dev-harness-stub";
    return {
      name: "glaze-dev-harness-stub",
      setup(build) {
        build.onResolve({ filter: /^\.\/dev\// }, () => ({ path: "dev-harness", namespace }));
        build.onLoad({ filter: /.*/, namespace }, () => ({ contents: "export {};", loader: "js" }));
      }
    };
  }
  const preloadIIFEPlugin = {
    name: "vite-plugin-preload-iife",
    apply: "build",
    async closeBundle() {
      const { build: esbuild } = await import(pathToFileURL(esbuildPath).href);
      const preloadPath = resolve4(buildOutDir, "assets/preload.js");
      await esbuild({
        entryPoints: [resolve4(appRoot, "renderer/preload.ts")],
        bundle: true,
        format: "iife",
        outfile: preloadPath,
        alias: {
          "@glaze/core/preload": existsSync7(resolve4(glazeCorePath, "src/preload/index.ts")) ? resolve4(glazeCorePath, "src/preload/index.ts") : resolve4(glazeCorePath, "preload.js"),
          "@glaze/core": glazeCorePath
        },
        platform: "browser",
        target: "safari17",
        // No sourcemap: WKUserScripts run at user-script://null/ which can't serve .map files
        sourcemap: false,
        minify: process.env.NODE_ENV === "production",
        logLevel: "warning",
        define: {
          "process.env.GLAZE_DEV_HARNESS": JSON.stringify(includeDevHarness ? "1" : "0")
        },
        plugins: includeDevHarness ? [] : [devHarnessStubPlugin2()]
      });
    }
  };
  const FRAMEWORK_CSS_IMPORTS = ['@import "@glaze/core/components.tailwind.css";', '@import "tailwindcss";'];
  const frameworkCssPrefix = FRAMEWORK_CSS_IMPORTS.join("\n") + "\n\n";
  const stylesPath = resolve4(appRoot, "renderer/styles.css");
  const frameworkCssPlugin = {
    name: "vite-plugin-glaze-framework-css",
    enforce: "pre",
    transform(code, id) {
      const cleanId = id.includes("?") ? id.slice(0, id.indexOf("?")) : id;
      if (resolve4(cleanId) === stylesPath) {
        return { code: frameworkCssPrefix + code, map: null };
      }
    }
  };
  const appDisplayName = packageJson.productName || packageJson.appConfig?.displayName || "Glaze App";
  const escapedAppDisplayName = escapeHtml(appDisplayName);
  const windowTitlePlugin = {
    name: "vite-plugin-glaze-window-title",
    transformIndexHtml: {
      order: "pre",
      handler(html, ctx) {
        if (basename3(ctx?.filename ?? "") !== "main-window.html") {
          return html;
        }
        return html.replace(/<title>.*?<\/title>/i, `<title>${escapedAppDisplayName}</title>`);
      }
    }
  };
  const bundleInputOptions = {
    input: windowHtmlEntries,
    external: isExternalDep,
    output: {
      chunkFileNames: "assets/[name]-[hash].js",
      entryFileNames: "assets/[name]-[hash].js",
      assetFileNames: "assets/[name]-[hash].[ext]"
    }
  };
  return defineConfig2({
    plugins: [
      ...esmExternalRequirePlugin ? [esmExternalRequirePlugin({ external: [...sharedDeps, /^@glaze\/core\//] })] : [],
      react(),
      ...babel && reactCompilerPreset ? [babel({ presets: [reactCompilerPreset()] })] : [],
      frameworkCssPlugin,
      windowTitlePlugin,
      tailwindcss(),
      preloadIIFEPlugin,
      ...overrides?.plugins ?? []
    ],
    define: {
      __APP_DISPLAY_NAME__: JSON.stringify(appDisplayName),
      ...overrides?.define ?? {}
    },
    base: "./",
    server: {
      port: serverPort,
      host: serverHost,
      cors: true,
      open: false
    },
    build: {
      outDir: buildOutDir,
      emptyOutDir: false,
      sourcemap: process.env.GLAZE_SOURCEMAP !== "false",
      assetsDir: "assets",
      // Provide both keys so generated apps still on Vite 5/6 can rebuild,
      // while newer Vite/Rolldown builds keep using the modern option name.
      rollupOptions: bundleInputOptions,
      rolldownOptions: bundleInputOptions
    },
    resolve: {
      alias: [
        { find: "@glaze/core", replacement: glazeCorePath },
        { find: "@renderer", replacement: resolve4(appRoot, "./renderer") },
        { find: "@main", replacement: resolve4(appRoot, "./main") },
        // ESM shims for CJS packages that require("react") — Rolldown preserves require() for externals,
        // which fails in WKWebView. React 19 has useSyncExternalStore built-in so these shims are trivial.
        // Covers both /shim/with-selector (pre-React 18 compat) and /with-selector (used by react-redux).
        {
          find: /^use-sync-external-store\/(shim\/)?with-selector(\.js)?$/,
          replacement: resolve4(glazeCorePath, "cli/build/shims/use-sync-external-store-with-selector-shim.js")
        },
        {
          find: /^use-sync-external-store(\/shim)?(\/index(\.js)?)?$/,
          replacement: resolve4(glazeCorePath, "cli/build/shims/use-sync-external-store-shim.js")
        }
      ],
      dedupe: sharedDepsDedupe,
      preserveSymlinks: true
    }
  });
}
async function buildRenderer(appRoot, overrides) {
  const toolingRequires = createAppToolingRequire(appRoot);
  const viteModule = await importToolingModule("vite", appRoot, toolingRequires);
  const viteApi = resolveModuleDefault(viteModule);
  const build = viteApi.build;
  if (typeof build !== "function") {
    throw new Error("[glaze] Failed to load Vite API: build is not available");
  }
  const { buildOutDir } = detectAppContext(appRoot);
  const assetsDir = resolve4(buildOutDir, "assets");
  if (existsSync7(assetsDir)) {
    rmSync3(assetsDir, { recursive: true, force: true });
  }
  const config = await createViteConfig(appRoot, overrides);
  await build(config);
  console.log("[glaze] Renderer built successfully");
}
async function createViteDevServer(appRoot, overrides) {
  const toolingRequires = createAppToolingRequire(appRoot);
  const viteModule = await importToolingModule("vite", appRoot, toolingRequires);
  const viteApi = resolveModuleDefault(viteModule);
  const createServer = viteApi.createServer;
  if (typeof createServer !== "function") {
    throw new Error("[glaze] Failed to load Vite API: createServer is not available");
  }
  const config = await createViteConfig(appRoot, overrides);
  const server = await createServer(config);
  await server.listen();
  const resolvedUrls = server.resolvedUrls;
  const url = resolvedUrls?.local?.[0] ?? `http://localhost:${overrides?.server?.port ?? 4143}`;
  server.printUrls();
  return {
    url,
    close: () => server.close()
  };
}
var init_build_renderer = __esm({
  "cli/build/build-renderer.ts"() {
    "use strict";
    init_config();
  }
});

// cli/build/index.ts
init_config();

// cli/build/build-backend.ts
init_config();
import { createRequire } from "module";
import { existsSync as existsSync6, mkdirSync as mkdirSync2 } from "fs";
import { resolve as resolve3 } from "path";

// cli/build/swift-sidecars-plugin.ts
import { existsSync as existsSync5, readFileSync as readFileSync2, realpathSync } from "fs";
import { basename as basename2, relative, resolve as resolve2, sep } from "path";

// cli/build/compile-native-sidecars.ts
init_config();
import { execFileSync } from "child_process";
import {
  cpSync,
  copyFileSync,
  existsSync as existsSync4,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync as rmSync2,
  statSync,
  writeFileSync
} from "fs";
import { dirname as dirname2, join as join4 } from "path";

// cli/build/promote-native-sidecars.ts
import { existsSync as existsSync3, renameSync, rmSync } from "fs";
function promoteNativeSidecarBinaries(stagedBinDir, binDir) {
  const previousBinDir = `${stagedBinDir}-previous`;
  rmSync(previousBinDir, { recursive: true, force: true });
  if (existsSync3(binDir)) {
    renameSync(binDir, previousBinDir);
  }
  try {
    renameSync(stagedBinDir, binDir);
  } catch (error) {
    if (existsSync3(previousBinDir) && !existsSync3(binDir)) {
      renameSync(previousBinDir, binDir);
    }
    throw error;
  }
  rmSync(previousBinDir, { recursive: true, force: true });
}

// cli/build/swift-module.ts
import { join as join3 } from "path";
var SWIFT_MODULE_FILENAME = "glaze-swift-module.mjs";
function swiftSidecarModulePath(derivedDataPath) {
  return join3(derivedDataPath, SWIFT_MODULE_FILENAME);
}
function generateSwiftModule(name, implementation) {
  return `
import {
  getSidecarBinaryPath,
  invokeSwiftFunction,
  SwiftError,
} from "@glaze/core/backend/internal";

const executablePath = getSidecarBinaryPath(${JSON.stringify(name)});
const runSwiftFunction = (command, ...args) => invokeSwiftFunction(executablePath, command, ...args);

export default executablePath;
export { SwiftError };

${implementation}
`;
}

// cli/build/compile-native-sidecars.ts
var TRUSTED_BUILD_TOOL_LOCATIONS = /* @__PURE__ */ new Map([
  ["extensions-swift-tools", "https://github.com/raycast/extensions-swift-tools"],
  ["swift-syntax", "https://github.com/swiftlang/swift-syntax"]
]);
function discoverNativeSidecars(appRoot) {
  const nativeDir = join4(appRoot, "native");
  if (!existsSync4(nativeDir)) {
    return [];
  }
  const targets = [];
  for (const entry of readdirSync(nativeDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }
    const packageDir = join4(nativeDir, entry.name);
    if (existsSync4(join4(packageDir, "Package.swift"))) {
      targets.push({ name: entry.name, packageDir });
    }
  }
  return targets.sort((a, b) => a.name.localeCompare(b.name));
}
function assertXcodeToolchain() {
  try {
    const output = execFileSync("xcodebuild", ["-version"], { encoding: "utf8" });
    const match = output.match(/^Xcode (\d+)\.(\d+)/m);
    if (!match || Number(match[1]) < 16 || Number(match[1]) === 16 && Number(match[2]) < 3) {
      throw new Error(`unsupported Xcode version: ${output.split("\n")[0] ?? "unknown"}`);
    }
  } catch {
    throw new Error(
      "[glaze] Native sidecars require Xcode 16.3 or later. Install Xcode, open it once to finish setup, then select it with: sudo xcode-select -s /Applications/Xcode.app/Contents/Developer"
    );
  }
}
var ALWAYS_DISALLOWED_TARGET_TYPES = /* @__PURE__ */ new Set(["binary", "system"]);
function validateTargetSafety(label, dump, trustedBuildTooling = false) {
  const disallowed = dump.targets?.find(
    (target) => target.type !== void 0 && (ALWAYS_DISALLOWED_TARGET_TYPES.has(target.type) || !trustedBuildTooling && (target.type === "plugin" || target.type === "macro"))
  );
  if (disallowed) {
    throw new Error(
      `[glaze] ${label}: target "${disallowed.name}" has unsupported type "${disallowed.type}". Native sidecars cannot use binary or system-library targets, and only trusted SDK tooling may provide plugins or macros.`
    );
  }
  const dynamicLibrary = dump.products?.find(
    (product) => product.type !== void 0 && Array.isArray(product.type.library) && product.type.library.includes("dynamic")
  );
  if (dynamicLibrary) {
    throw new Error(
      `[glaze] ${label}: dynamic library product "${dynamicLibrary.name}" is unsupported. Native sidecar dependencies must link statically so the published executable remains self-contained.`
    );
  }
  if (!trustedBuildTooling) {
    const unsafeSetting = dump.targets?.flatMap((target) => target.settings?.map((setting) => ({ target: target.name, setting })) ?? []).find(({ setting }) => setting.kind !== void 0 && "unsafeFlags" in setting.kind);
    if (unsafeSetting) {
      throw new Error(
        `[glaze] ${label}: target "${unsafeSetting.target}" uses unsafe ${unsafeSetting.setting.tool ?? "build"} flags. Native sidecars cannot use unsafeFlags because they can compile or link code outside the resolved SwiftPM graph.`
      );
    }
  }
}
function validatePackageDump(name, dump) {
  validateTargetSafety(`native/${name}`, dump);
  const unsupportedDependency = dump.dependencies?.find((dependency) => {
    const sourceControl = dependency.sourceControl?.[0];
    if (!sourceControl) {
      return true;
    }
    const { location } = sourceControl;
    const sourceUrl = typeof location === "string" ? location : location?.remote?.find(({ urlString }) => typeof urlString === "string")?.urlString;
    if (!sourceUrl) {
      return true;
    }
    try {
      return new URL(sourceUrl).protocol !== "https:";
    } catch {
      return true;
    }
  });
  if (unsupportedDependency) {
    throw new Error(
      `[glaze] native/${name}: unsupported SwiftPM dependency. Native sidecars currently support HTTPS source-control packages pinned in Package.resolved.`
    );
  }
  const hasExecutableProduct = dump.products?.some(
    (product) => product.name === name && product.type !== void 0 && "executable" in product.type
  );
  const hasExecutableTarget = dump.targets?.some((target) => target.name === name && target.type === "executable");
  if (!hasExecutableProduct && !hasExecutableTarget) {
    throw new Error(
      `[glaze] native/${name}: Package.swift must define an executable named "${name}" (an executable product or .executableTarget matching the directory name).`
    );
  }
}
function validateDependencyPackageDump(sidecarName, dependencyIdentity, dump, trustedBuildTooling = false) {
  validateTargetSafety(`native/${sidecarName} dependency "${dependencyIdentity}"`, dump, trustedBuildTooling);
}
function resolvedDependencyPins(name, resolved) {
  if (Array.isArray(resolved.pins)) {
    return resolved.pins;
  }
  if (Array.isArray(resolved.object?.pins)) {
    return resolved.object.pins.map((pin) => ({
      identity: pin.package?.toLowerCase(),
      kind: "remoteSourceControl",
      location: pin.repositoryURL,
      state: pin.state
    }));
  }
  throw new Error(
    `[glaze] native/${name}: Package.resolved does not contain a supported pins array. Resolve the package with Xcode and commit the updated lockfile.`
  );
}
function validateResolvedDependencies(name, resolved) {
  for (const pin of resolvedDependencyPins(name, resolved)) {
    if (!pin.identity || !pin.location || !pin.state?.revision) {
      throw new Error(
        `[glaze] native/${name}: Package.resolved contains an incomplete dependency pin. Run \`swift package resolve\` and commit the updated Package.resolved.`
      );
    }
    if (pin.kind !== "remoteSourceControl") {
      throw new Error(
        `[glaze] native/${name}: dependency "${pin.identity}" uses unsupported resolved kind "${pin.kind ?? "unknown"}". Native sidecars currently support source-control Swift packages.`
      );
    }
    let dependencyUrl;
    try {
      dependencyUrl = new URL(pin.location);
    } catch {
      throw new Error(`[glaze] native/${name}: dependency "${pin.identity}" has an invalid source URL.`);
    }
    if (dependencyUrl.protocol !== "https:") {
      throw new Error(
        `[glaze] native/${name}: dependency "${pin.identity}" must use an HTTPS source URL, not ${dependencyUrl.protocol}`
      );
    }
  }
}
function normalizeSourceLocation(location) {
  return location.toLowerCase().replace(/\.git\/?$/, "").replace(/\/$/, "");
}
function isTrustedBuildToolPackage(pin) {
  if (!pin.identity || !pin.location) {
    return false;
  }
  const trustedLocation = TRUSTED_BUILD_TOOL_LOCATIONS.get(pin.identity);
  return trustedLocation !== void 0 && normalizeSourceLocation(pin.location) === trustedLocation;
}
function xcodeBuildArguments(name, derivedDataPath, configuration, hasDependencies = false) {
  const arguments_ = [
    "build",
    "-quiet",
    "-skipMacroValidation",
    "-skipPackagePluginValidation",
    "-configuration",
    configuration === "release" ? "Release" : "Debug",
    "-scheme",
    name,
    "-destination",
    "generic/platform=macOS",
    "-derivedDataPath",
    derivedDataPath,
    "-clonedSourcePackagesDirPath",
    join4(derivedDataPath, "SourcePackages")
  ];
  if (hasDependencies) {
    arguments_.push("-onlyUsePackageVersionsFromResolvedFile");
  }
  arguments_.push("ARCHS=arm64", "EXCLUDED_ARCHS=x86_64");
  return arguments_;
}
function nativeSidecarDerivedDataPath(appRoot, name) {
  return join4(appRoot, "node_modules", ".cache", "glaze", "swift", name);
}
function generatedSwiftBindingsPaths(derivedDataPath, name) {
  const outputDirectories = [
    join4(derivedDataPath, "SourcePackages", "plugins", `${name.toLowerCase()}.output`, name, "RaycastTypeScriptPlugin"),
    join4(
      derivedDataPath,
      "Build",
      "Intermediates.noindex",
      "BuildToolPluginIntermediates",
      `${name}.output`,
      name,
      "RaycastTypeScriptPlugin"
    )
  ];
  return outputDirectories.map((outputDir) => ({
    definitions: join4(outputDir, "raycast.d.ts"),
    implementation: join4(outputDir, "raycast.js")
  }));
}
function discoverGeneratedSwiftBindingsPaths(derivedDataPath) {
  const roots = [
    join4(derivedDataPath, "SourcePackages", "plugins"),
    join4(derivedDataPath, "Build", "Intermediates.noindex", "BuildToolPluginIntermediates")
  ];
  const paths = [];
  for (const root of roots) {
    if (!existsSync4(root)) {
      continue;
    }
    for (const packageOutput of readdirSync(root, { withFileTypes: true })) {
      if (!packageOutput.isDirectory()) {
        continue;
      }
      const packageOutputPath = join4(root, packageOutput.name);
      for (const targetOutput of readdirSync(packageOutputPath, { withFileTypes: true })) {
        if (!targetOutput.isDirectory()) {
          continue;
        }
        const outputDir = join4(packageOutputPath, targetOutput.name, "RaycastTypeScriptPlugin");
        paths.push({
          definitions: join4(outputDir, "raycast.d.ts"),
          implementation: join4(outputDir, "raycast.js")
        });
      }
    }
  }
  return paths;
}
function removeGeneratedSwiftBindings(derivedDataPath) {
  for (const bindings of discoverGeneratedSwiftBindingsPaths(derivedDataPath)) {
    rmSync2(dirname2(bindings.implementation), { recursive: true, force: true });
  }
}
function findGeneratedSwiftBindings(derivedDataPath, name) {
  const candidates = [
    ...generatedSwiftBindingsPaths(derivedDataPath, name),
    ...discoverGeneratedSwiftBindingsPaths(derivedDataPath)
  ];
  const existing = [
    ...new Map(
      candidates.filter(({ definitions, implementation }) => existsSync4(definitions) && existsSync4(implementation)).map((bindings) => [bindings.implementation, bindings])
    ).values()
  ];
  return existing.sort(
    (left, right) => statSync(right.implementation).mtimeMs - statSync(left.implementation).mtimeMs
  )[0];
}
function assertArm64Executable(path, name) {
  const architectures = execFileSync("xcrun", ["lipo", "-archs", path], { encoding: "utf8" }).trim().split(/\s+/);
  if (architectures.length !== 1 || architectures[0] !== "arm64") {
    throw new Error(
      `[glaze] native/${name}: expected an arm64-only executable, but Xcode produced: ${architectures.join(", ")}`
    );
  }
}
function copyResourceBundles(productsDirectory, binDir) {
  for (const entry of readdirSync(productsDirectory, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name.endsWith(".bundle")) {
      cpSync(join4(productsDirectory, entry.name), join4(binDir, entry.name), {
        recursive: true,
        force: true
      });
    }
  }
}
function dumpPackage(packageDir, moduleCachePath) {
  const swiftEnvironment = {
    ...process.env,
    CLANG_MODULE_CACHE_PATH: moduleCachePath,
    SWIFTPM_MODULECACHE_OVERRIDE: moduleCachePath
  };
  const dumpRaw = execFileSync("xcrun", ["swift", "package", "dump-package", "--package-path", packageDir], {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    env: swiftEnvironment
  });
  return JSON.parse(dumpRaw);
}
function validateDependencies(name, packageDir, derivedDataPath) {
  const resolvedPath = join4(packageDir, "Package.resolved");
  const sourcePackagesPath = join4(derivedDataPath, "SourcePackages");
  const resolveArguments = [
    "-resolvePackageDependencies",
    "-quiet",
    "-scheme",
    name,
    "-clonedSourcePackagesDirPath",
    sourcePackagesPath
  ];
  const hadResolvedFile = existsSync4(resolvedPath);
  if (hadResolvedFile) {
    resolveArguments.push("-onlyUsePackageVersionsFromResolvedFile");
  }
  execFileSync("xcodebuild", resolveArguments, { cwd: packageDir, stdio: "inherit" });
  if (!existsSync4(resolvedPath)) {
    throw new Error(`[glaze] native/${name}: Xcode did not produce Package.resolved for the package dependencies.`);
  }
  if (!hadResolvedFile) {
    console.log(`[glaze] Generated native/${name}/Package.resolved. Commit it so builds stay reproducible.`);
  }
  const resolved = JSON.parse(readFileSync(resolvedPath, "utf8"));
  const pins = resolvedDependencyPins(name, resolved);
  if (pins.length === 0) {
    throw new Error(`[glaze] native/${name}: Package.resolved does not pin any of the package's dependencies.`);
  }
  validateResolvedDependencies(name, resolved);
  const checkoutsDir = join4(sourcePackagesPath, "checkouts");
  for (const pin of pins) {
    const identity = pin.identity;
    const checkoutDir = join4(checkoutsDir, identity);
    if (!existsSync4(join4(checkoutDir, "Package.swift"))) {
      throw new Error(
        `[glaze] native/${name}: resolved dependency "${identity}" was not available for validation after Xcode resolved the package graph.`
      );
    }
    const dependencyDump = dumpPackage(checkoutDir, join4(derivedDataPath, "ModuleCache.noindex"));
    validateDependencyPackageDump(name, identity, dependencyDump, isTrustedBuildToolPackage(pin));
  }
}
function writeGeneratedSwiftDefinitions(appRoot, modules) {
  const outputPath = join4(appRoot, "main", "glaze-swift.d.ts");
  if (modules.length === 0) {
    rmSync2(outputPath, { force: true });
    return;
  }
  const content = modules.map(({ name, definitions }) => {
    const callableDefinitions = definitions.trim() ? `
${definitions.trim().split("\n").map((line) => `  ${line}`).join("\n")}
` : "";
    return `declare module "swift:*/${name}" {
  const executablePath: string;
  export default executablePath;
${callableDefinitions}

  export class SwiftError extends Error {
    stderr: string;
    stdout: string;
  }
}`;
  }).join("\n\n");
  mkdirSync(dirname2(outputPath), { recursive: true });
  writeFileSync(outputPath, `// Generated by Glaze. Do not edit.

${content}
`);
}
async function compileNativeSidecars(appRoot, options = {}) {
  const targets = discoverNativeSidecars(appRoot);
  const { buildOutDir } = detectAppContext(appRoot);
  const binDir = join4(buildOutDir, "bin");
  const emitBinaries = options.emitBinaries ?? true;
  if (targets.length === 0) {
    if (emitBinaries) {
      rmSync2(binDir, { recursive: true, force: true });
    }
    writeGeneratedSwiftDefinitions(appRoot, []);
    return;
  }
  assertXcodeToolchain();
  const stagedBinDir = join4(buildOutDir, `.native-sidecars-${process.pid}`);
  if (emitBinaries) {
    rmSync2(stagedBinDir, { recursive: true, force: true });
    mkdirSync(stagedBinDir, { recursive: true });
  }
  const generatedModules = [];
  try {
    for (const target of targets) {
      console.log(`[glaze] Compiling native sidecar: ${target.name}`);
      const derivedDataPath = nativeSidecarDerivedDataPath(appRoot, target.name);
      const moduleCachePath = join4(derivedDataPath, "ModuleCache.noindex");
      const dump = dumpPackage(target.packageDir, moduleCachePath);
      validatePackageDump(target.name, dump);
      if ((dump.dependencies?.length ?? 0) > 0) {
        validateDependencies(target.name, target.packageDir, derivedDataPath);
      }
      removeGeneratedSwiftBindings(derivedDataPath);
      const configuration = options.configuration ?? "release";
      const buildArguments = xcodeBuildArguments(
        target.name,
        derivedDataPath,
        configuration,
        (dump.dependencies?.length ?? 0) > 0
      );
      execFileSync("xcodebuild", buildArguments, {
        cwd: target.packageDir,
        stdio: "inherit"
      });
      const productsConfiguration = configuration === "release" ? "Release" : "Debug";
      const artifact = join4(derivedDataPath, "Build", "Products", productsConfiguration, target.name);
      if (!existsSync4(artifact)) {
        throw new Error(
          `[glaze] native/${target.name}: build succeeded but no executable named "${target.name}" was produced. The executable product/target in Package.swift must match the directory name.`
        );
      }
      assertArm64Executable(artifact, target.name);
      if (emitBinaries) {
        copyFileSync(artifact, join4(stagedBinDir, target.name));
        copyResourceBundles(join4(derivedDataPath, "Build", "Products", productsConfiguration), stagedBinDir);
      }
      const generatedBindings = findGeneratedSwiftBindings(derivedDataPath, target.name);
      const implementation = generatedBindings ? readFileSync(generatedBindings.implementation, "utf8") : "";
      writeFileSync(swiftSidecarModulePath(derivedDataPath), generateSwiftModule(target.name, implementation));
      generatedModules.push({
        name: target.name,
        definitions: generatedBindings ? readFileSync(generatedBindings.definitions, "utf8") : ""
      });
      console.log(`[glaze] Native sidecar ${emitBinaries ? "built" : "prepared"}: ${target.name}`);
    }
    if (emitBinaries) {
      promoteNativeSidecarBinaries(stagedBinDir, binDir);
    }
    writeGeneratedSwiftDefinitions(appRoot, generatedModules);
  } catch (error) {
    if (emitBinaries) {
      rmSync2(stagedBinDir, { recursive: true, force: true });
    }
    throw error;
  }
}

// cli/build/swift-sidecars-plugin.ts
function createSwiftSidecarsPlugin(appRoot) {
  const nativeRootPath = resolve2(appRoot, "native");
  const nativeRoot = existsSync5(nativeRootPath) ? realpathSync(nativeRootPath) : nativeRootPath;
  return {
    name: "glaze-swift-sidecars",
    setup(build) {
      build.onResolve({ filter: /^swift:/ }, (args) => {
        const unresolvedPackagePath = resolve2(args.resolveDir, args.path.replace(/^swift:/, ""));
        const packagePath = existsSync5(unresolvedPackagePath) ? realpathSync(unresolvedPackagePath) : unresolvedPackagePath;
        const pathFromNativeRoot = relative(nativeRoot, packagePath);
        if (!pathFromNativeRoot || pathFromNativeRoot === ".." || pathFromNativeRoot.startsWith(`..${sep}`) || pathFromNativeRoot.includes(sep)) {
          return {
            errors: [
              {
                text: `Swift imports must reference one package directly beneath ${nativeRoot}`
              }
            ]
          };
        }
        if (!existsSync5(resolve2(packagePath, "Package.swift"))) {
          return {
            errors: [
              {
                text: `Swift package not found at ${packagePath}`
              }
            ]
          };
        }
        return { path: packagePath, namespace: "glaze-swift" };
      });
      build.onLoad({ filter: /.*/, namespace: "glaze-swift" }, (args) => {
        const name = basename2(args.path);
        const generated = findGeneratedSwiftBindings(nativeSidecarDerivedDataPath(appRoot, name), name);
        return {
          contents: generateSwiftModule(name, generated ? readFileSync2(generated.implementation, "utf8") : ""),
          loader: "js",
          resolveDir: args.path
        };
      });
    }
  };
}

// cli/build/build-backend.ts
var DEFAULT_EXTERNAL = [
  "fsevents",
  "@glaze/core/backend",
  "@glaze/core/backend/internal",
  "@glaze/core/backend/internal/network",
  "@glaze/core/backend/internal/network-runtime",
  "@glaze/core/backend/runtime",
  "@glaze/core/oauth",
  "@glaze/core/ai",
  "@glaze/core/ipc",
  "@glaze/core/preload",
  "@glaze/core/components",
  "@glaze/core/hooks",
  "@glaze/core/utils"
];
var CJS_REQUIRE_BANNER = `
import { createRequire as __createRequire__ } from 'module';
const require = __createRequire__(import.meta.url);
`;
function restrictedImportsPlugin() {
  return {
    name: "glaze-restricted-imports",
    setup(build) {
      build.onResolve({ filter: /^@glaze\/core\/backend\/internal$/ }, (args) => {
        if (args.namespace === "glaze-swift") {
          return void 0;
        }
        const importer = typeof args.importer === "string" ? args.importer.replaceAll("\\", "/") : "";
        if (importer.includes("/main/dev/")) {
          return void 0;
        }
        return {
          errors: [
            {
              text: `Importing from "@glaze/core/backend/internal" is not allowed in Glaze apps. This entrypoint is reserved for the Glaze host app. Use the public APIs from "@glaze/core/backend" instead.`,
              location: { file: args.importer }
            }
          ]
        };
      });
    }
  };
}
function devHarnessStubPlugin() {
  const namespace = "glaze-dev-harness-stub";
  return {
    name: "glaze-dev-harness-stub",
    setup(build) {
      build.onResolve({ filter: /^\.\/dev\// }, () => ({ path: "dev-harness", namespace }));
      build.onLoad({ filter: /.*/, namespace }, () => ({ contents: "export {};", loader: "js" }));
    }
  };
}
async function buildBackend(options, appRoot = process.cwd()) {
  const { buildOutDir } = detectAppContext(appRoot);
  const appRequire = createRequire(resolve3(appRoot, "package.json"));
  const coreRequire = createRequire(import.meta.url);
  const esbuild = (() => {
    try {
      return appRequire("esbuild");
    } catch {
      try {
        return coreRequire("esbuild");
      } catch {
        throw new Error(
          `[glaze] Missing build dependency "esbuild". Install app dependencies in ${appRoot} (npm install).`
        );
      }
    }
  })();
  const entry = options?.entry ?? "main/index.ts";
  const entryPoint = resolve3(appRoot, entry);
  if (!existsSync6(entryPoint)) {
    throw new Error(`Backend entry point not found: ${entryPoint}`);
  }
  const outDir = resolve3(buildOutDir, "main");
  mkdirSync2(outDir, { recursive: true });
  const external = [...DEFAULT_EXTERNAL, ...options?.external ?? []];
  const includeDevHarness = existsSync6(resolve3(appRoot, "main/dev"));
  await esbuild.build({
    entryPoints: [entryPoint],
    bundle: true,
    platform: "node",
    target: "node20",
    format: "esm",
    outfile: resolve3(outDir, "index.js"),
    banner: { js: CJS_REQUIRE_BANNER },
    external,
    packages: "bundle",
    sourcemap: process.env.GLAZE_SOURCEMAP !== "false",
    define: {
      "process.env.GLAZE_DEV_HARNESS": JSON.stringify(includeDevHarness ? "1" : "0")
    },
    plugins: [
      restrictedImportsPlugin(),
      ...includeDevHarness ? [] : [devHarnessStubPlugin()],
      createSwiftSidecarsPlugin(appRoot),
      ...options?.plugins ?? []
    ]
  });
  console.log("[glaze] Backend built successfully");
}

// cli/build/index.ts
init_build_renderer();

// cli/build/dev-server.ts
import { spawn } from "child_process";
import { existsSync as existsSync8, realpathSync as realpathSync2, unlinkSync, writeFileSync as writeFileSync2 } from "fs";
import { resolve as resolve5 } from "path";
import { pathToFileURL as pathToFileURL2 } from "url";
var RENDERER_PORT = 4143;
var HOST = "localhost";
function swiftSidecarDevModules(appRoot) {
  return Object.fromEntries(
    discoverNativeSidecars(appRoot).map(({ name, packageDir }) => [
      realpathSync2(packageDir),
      pathToFileURL2(swiftSidecarModulePath(nativeSidecarDerivedDataPath(appRoot, name))).href
    ])
  );
}
async function startDevServers(appRoot) {
  const devServerHostFile = resolve5(appRoot, ".devserverhost");
  let mainProcess = null;
  let viteClose = null;
  function cleanup() {
    console.log("[glaze] Cleaning up dev servers...");
    if (existsSync8(devServerHostFile)) {
      try {
        unlinkSync(devServerHostFile);
      } catch {
      }
    }
    if (mainProcess && !mainProcess.killed) mainProcess.kill();
    viteClose?.();
  }
  process.on("SIGINT", () => {
    cleanup();
    process.exit(0);
  });
  process.on("SIGTERM", () => {
    cleanup();
    process.exit(0);
  });
  process.on("exit", () => {
    if (existsSync8(devServerHostFile)) {
      try {
        unlinkSync(devServerHostFile);
      } catch {
      }
    }
  });
  console.log("[glaze] Starting development environment...");
  const spawnEnv = { ...process.env };
  const networkRuntimeImport = "--import @glaze/core/backend/internal/network-runtime";
  const backendRuntimeImport = "--import @glaze/core/backend/runtime";
  spawnEnv.NODE_OPTIONS = `${spawnEnv.NODE_OPTIONS || ""} ${networkRuntimeImport} ${backendRuntimeImport}`.trim();
  spawnEnv.GLAZE_SWIFT_SIDECAR_DEV_MODULES = JSON.stringify(swiftSidecarDevModules(appRoot));
  mainProcess = spawn("tsx", ["watch", "main/index.ts"], {
    cwd: appRoot,
    stdio: "pipe",
    shell: true,
    env: spawnEnv
  });
  mainProcess.stdout?.on("data", (data) => process.stdout.write(`[Main] ${data}`));
  mainProcess.stderr?.on("data", (data) => process.stderr.write(`[Main] ${data}`));
  mainProcess.on("error", (error) => {
    console.error("[glaze] Failed to start main process:", error);
    cleanup();
    process.exit(1);
  });
  mainProcess.on("exit", (code) => {
    if (code !== 0) console.error(`[glaze] Main process exited with code ${code}`);
    cleanup();
    process.exit(code ?? 1);
  });
  setTimeout(async () => {
    try {
      const { createViteDevServer: createViteDevServer2 } = await Promise.resolve().then(() => (init_build_renderer(), build_renderer_exports));
      const { url, close } = await createViteDevServer2(appRoot, {
        server: { port: RENDERER_PORT, host: HOST }
      });
      viteClose = close;
      console.log(`[glaze] Renderer URL: ${url}`);
      writeFileSync2(devServerHostFile, url, "utf-8");
    } catch (error) {
      console.error("[glaze] Failed to start renderer:", error);
      cleanup();
      process.exit(1);
    }
  }, 1e3);
  return { cleanup };
}
async function startRendererDevServer(appRoot) {
  const devServerHostFile = resolve5(appRoot, ".devserverhost");
  let viteClose = null;
  function cleanup() {
    if (existsSync8(devServerHostFile)) {
      try {
        unlinkSync(devServerHostFile);
      } catch {
      }
    }
    viteClose?.();
  }
  process.on("SIGINT", () => {
    cleanup();
    process.exit(0);
  });
  process.on("SIGTERM", () => {
    cleanup();
    process.exit(0);
  });
  process.on("exit", () => {
    if (existsSync8(devServerHostFile)) {
      try {
        unlinkSync(devServerHostFile);
      } catch {
      }
    }
  });
  console.log("[glaze] Starting renderer dev server...");
  const { createViteDevServer: createViteDevServer2 } = await Promise.resolve().then(() => (init_build_renderer(), build_renderer_exports));
  const { url, close } = await createViteDevServer2(appRoot, {
    server: { port: RENDERER_PORT, host: HOST }
  });
  viteClose = close;
  console.log(`[glaze] Renderer URL: ${url}`);
  writeFileSync2(devServerHostFile, url, "utf-8");
  return { cleanup };
}

// cli/build/sync-runtime-manifest.ts
init_app_context();
import { existsSync as existsSync9, mkdirSync as mkdirSync3, readFileSync as readFileSync4, renameSync as renameSync2, writeFileSync as writeFileSync3 } from "fs";
import { dirname as dirname3, relative as relative2, resolve as resolve6 } from "path";
function asRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return void 0;
  }
  return value;
}
function readJson(filePath) {
  const content = readFileSync4(filePath, "utf-8");
  return JSON.parse(content);
}
function pickNonEmptyString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return void 0;
}
function sanitizeAppConfig(appConfig) {
  const config = asRecord(appConfig);
  if (!config) {
    return void 0;
  }
  const rest = { ...config };
  delete rest.displayName;
  delete rest.description;
  delete rest.windowSize;
  delete rest.toolbarStyle;
  return Object.keys(rest).length > 0 ? rest : void 0;
}
function mergeGlazeMetadata(sourceGlaze, existingRuntimeGlaze) {
  const source = asRecord(sourceGlaze);
  const existingRuntime = asRecord(existingRuntimeGlaze);
  if (!source) {
    return existingRuntime;
  }
  if (!existingRuntime) {
    return source;
  }
  const appId = pickNonEmptyString(source.appId, existingRuntime.appId);
  const variant = pickNonEmptyString(source.variant, existingRuntime.variant);
  return {
    ...source,
    ...appId ? { appId } : {},
    ...variant ? { variant } : {}
  };
}
function resolveRuntimeManifestPath(cwd) {
  const runtimeDir = resolveDeployedRuntimeDir(cwd);
  return runtimeDir ? resolve6(runtimeDir, "package.json") : null;
}
function buildRuntimeManifest(sourceManifest, existingRuntimeManifest) {
  const sourceAppConfig = asRecord(sourceManifest.appConfig);
  const runtimeAppConfig = asRecord(existingRuntimeManifest?.appConfig);
  const appConfig = sanitizeAppConfig(sourceAppConfig) ?? sanitizeAppConfig(runtimeAppConfig);
  const glaze = mergeGlazeMetadata(sourceManifest.glaze, existingRuntimeManifest?.glaze);
  const runtimeManifest = {
    id: pickNonEmptyString(sourceManifest.id, existingRuntimeManifest?.id),
    name: pickNonEmptyString(sourceManifest.name, existingRuntimeManifest?.name, "glaze-app"),
    productName: pickNonEmptyString(
      sourceManifest.productName,
      sourceAppConfig?.displayName,
      sourceManifest.displayName,
      existingRuntimeManifest?.productName,
      runtimeAppConfig?.displayName
    ),
    version: pickNonEmptyString(sourceManifest.version, existingRuntimeManifest?.version, "1.0.0"),
    description: pickNonEmptyString(
      sourceManifest.description,
      sourceAppConfig?.description,
      existingRuntimeManifest?.description,
      runtimeAppConfig?.description
    ),
    author: pickNonEmptyString(sourceManifest.author, existingRuntimeManifest?.author),
    storeAppId: pickNonEmptyString(sourceManifest.storeAppId, existingRuntimeManifest?.storeAppId),
    type: pickNonEmptyString(sourceManifest.type, existingRuntimeManifest?.type),
    ...appConfig ? { appConfig } : {},
    ...glaze ? { glaze } : {}
  };
  return Object.fromEntries(Object.entries(runtimeManifest).filter(([, value]) => value !== void 0));
}
function writeJsonAtomic(targetPath, value) {
  const serialized = `${JSON.stringify(value, null, 2)}
`;
  const existing = existsSync9(targetPath) ? readFileSync4(targetPath, "utf-8") : null;
  if (existing === serialized) {
    return false;
  }
  mkdirSync3(dirname3(targetPath), { recursive: true });
  const tempPath = `${targetPath}.tmp-${process.pid}`;
  writeFileSync3(tempPath, serialized, "utf-8");
  renameSync2(tempPath, targetPath);
  return true;
}
function syncRuntimeManifest(appRoot = process.cwd()) {
  const sourceManifestPath = resolve6(appRoot, "package.json");
  const runtimeManifestPath = resolveRuntimeManifestPath(appRoot);
  if (!runtimeManifestPath) {
    return null;
  }
  if (!existsSync9(sourceManifestPath)) {
    throw new Error(`Source manifest not found at ${sourceManifestPath}`);
  }
  const sourceManifest = readJson(sourceManifestPath);
  const existingRuntimeManifest = existsSync9(runtimeManifestPath) ? readJson(runtimeManifestPath) : void 0;
  const runtimeManifest = buildRuntimeManifest(sourceManifest, existingRuntimeManifest);
  const changed = writeJsonAtomic(runtimeManifestPath, runtimeManifest);
  if (changed) {
    console.log(`[glaze] Synced runtime manifest: ${relative2(appRoot, runtimeManifestPath)}`);
  }
  return changed;
}

// cli/build/copy-native-bindings.ts
init_config();
import { cp } from "fs/promises";
import { createRequire as createRequire3 } from "module";
import { join as join6, resolve as resolve7 } from "path";
function copyNativeBindings(packageName, nodeFileName) {
  const appRoot = process.cwd();
  return {
    name: `copy-${packageName}-bindings`,
    setup(build) {
      build.onEnd(async () => {
        try {
          const { buildOutDir } = detectAppContext(appRoot);
          const BUILD_OUTPUT = resolve7(buildOutDir, "main");
          const require2 = createRequire3(import.meta.url);
          const packageMainEntryPoint = require2.resolve(packageName);
          const packageRequire = createRequire3(packageMainEntryPoint);
          const addonMain = packageRequire.resolve(packageName);
          const addonRoot = addonMain.slice(0, addonMain.lastIndexOf(packageName) + packageName.length);
          const nativePath = join6(addonRoot, "build", "Release", nodeFileName);
          await cp(nativePath, join6(BUILD_OUTPUT, nodeFileName), { recursive: true, force: true });
          console.log(`[glaze] Copied native binding: ${nodeFileName}`);
        } catch (err) {
          console.error(`[glaze] Could not copy native addon for ${packageName}:`, err);
          throw err;
        }
      });
    }
  };
}

// cli/build/externalize-package.ts
init_config();
import { chmodSync, cpSync as cpSync2, existsSync as existsSync10, lstatSync, readFileSync as readFileSync5, readdirSync as readdirSync3, rmSync as rmSync4 } from "fs";
import { isAbsolute, join as join7, relative as relative3, resolve as resolve8, sep as sep2 } from "path";
function syncPermissions(src, dest) {
  const stat = lstatSync(src);
  if (stat.isSymbolicLink()) return;
  try {
    chmodSync(dest, stat.mode);
  } catch {
  }
  if (stat.isDirectory()) {
    for (const entry of readdirSync3(src)) {
      syncPermissions(join7(src, entry), join7(dest, entry));
    }
  }
}
function collectDeps(appRoot, packageName, visited = /* @__PURE__ */ new Set()) {
  if (visited.has(packageName)) return visited;
  visited.add(packageName);
  const pkgJsonPath = join7(appRoot, "node_modules", packageName, "package.json");
  if (!existsSync10(pkgJsonPath)) return visited;
  try {
    const pkgJson = JSON.parse(readFileSync5(pkgJsonPath, "utf-8"));
    const deps = Object.keys(pkgJson.dependencies || {});
    const optionalDeps = Object.keys(pkgJson.optionalDependencies || {});
    for (const dep of [...deps, ...optionalDeps]) {
      collectDeps(appRoot, dep, visited);
    }
  } catch {
  }
  return visited;
}
function externalizePackage(packageName, options = {}) {
  const appRoot = process.cwd();
  const exclude = options.exclude ?? [];
  const allDeps = collectDeps(appRoot, packageName);
  const externals = [...allDeps];
  const plugin = {
    name: `externalize-package-${packageName}`,
    setup(build) {
      build.onEnd(() => {
        const { buildOutDir } = detectAppContext(appRoot);
        const outputNodeModules = join7(resolve8(buildOutDir, "main"), "node_modules");
        for (const dep of allDeps) {
          const src = join7(appRoot, "node_modules", dep);
          if (existsSync10(src)) {
            const dest = join7(outputNodeModules, dep);
            cpSync2(src, dest, {
              recursive: true,
              force: true,
              filter: (source) => {
                const rel = relative3(src, source);
                if (rel === "") return true;
                const relPosix = rel.split(sep2).join("/");
                const excluded = exclude.some((entry) => relPosix === entry || relPosix.startsWith(`${entry}/`));
                if (excluded) {
                  console.log(`[glaze] Skipped ${dep}/${relPosix}`);
                }
                return !excluded;
              }
            });
            for (const entry of exclude) {
              const target = join7(dest, entry);
              const relTarget = relative3(dest, target);
              if (relTarget === "" || relTarget.startsWith("..") || isAbsolute(relTarget)) continue;
              rmSync4(target, { recursive: true, force: true });
            }
            syncPermissions(src, dest);
            console.log(`[glaze] Copied ${dep}`);
          }
        }
      });
    }
  };
  return { plugin, externals };
}

// cli/build/html-generator.ts
import { existsSync as existsSync11, readdirSync as readdirSync4, writeFileSync as writeFileSync4 } from "fs";
import { join as join8 } from "path";
var SKIP_DIRS = /* @__PURE__ */ new Set(["shared", "common"]);
function generateWindowHtml(appRoot, options) {
  const rendererDir = join8(appRoot, "renderer");
  if (!existsSync11(rendererDir)) {
    console.warn("[glaze] No renderer/ directory found, skipping HTML generation");
    return [];
  }
  const generated = [];
  for (const entry of readdirSync4(rendererDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (SKIP_DIRS.has(entry.name)) continue;
    const entryFile = join8(rendererDir, entry.name, "index.tsx");
    if (!existsSync11(entryFile)) continue;
    const htmlFileName = `${entry.name}-window.html`;
    const htmlFilePath = join8(appRoot, htmlFileName);
    if (existsSync11(htmlFilePath) && !options?.force) {
      continue;
    }
    const title = capitalize(entry.name);
    const html = generateHtml(title, entry.name);
    writeFileSync4(htmlFilePath, html, "utf-8");
    generated.push(htmlFileName);
    console.log(`[glaze] Generated ${htmlFileName}`);
  }
  return generated;
}
function capitalize(str) {
  if (str === "main") return "App";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function generateHtml(title, windowName) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <script>
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      }
    </script>
    <style>
      :root {
        --background: hsl(0 0% 100% / 0.9);
      }
      .dark {
        --background: hsl(0 0% 0% / 0.4);
      }
      body {
        background: var(--background);
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <!-- Preload is injected by the native layer via webPreferences.preload -->
    <script type="module" src="./renderer/${windowName}/index.tsx"></script>
  </body>
</html>
`;
}

// cli/build/start-backend.ts
init_config();
import { spawn as spawn2 } from "child_process";
import { existsSync as existsSync12 } from "fs";
import { join as join9 } from "path";
var LOG_PREFIX = "[glaze]";
var DISABLE_SIGUSR1_ARG = "--disable-sigusr1";
var MANAGED_BACKEND_ENV_KEY = "GLAZE_MANAGED_BACKEND_ENV";
var NETWORK_RUNTIME_IMPORT = "@glaze/core/backend/internal/network-runtime";
var BACKEND_RUNTIME_IMPORT = "@glaze/core/backend/runtime";
var HOST_SERVICE_ENV_KEYS = [
  "API_BASE_URL",
  "GLAZE_WEB_URL",
  "POSTHOG_API_KEY",
  "SENTRY_DSN",
  "SUPABASE_ANON_KEY",
  "SUPABASE_URL"
];
var INSPECTOR_VALUE_FLAGS = /* @__PURE__ */ new Set(["--debug-port", "--inspect-port", "--inspect-publish-uid"]);
var INSPECTOR_FLAGS = /* @__PURE__ */ new Set([
  "--allow-inspector",
  "--debug",
  "--debug-brk",
  "--experimental-inspector-network-resource",
  "--experimental-network-inspection",
  "--experimental-worker-inspection"
]);
function splitNodeOptions(nodeOptions) {
  const args = [];
  let current = "";
  let quote = null;
  let escaped = false;
  for (const char of nodeOptions) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }
    if (char === "\\" && quote !== "'") {
      escaped = true;
      continue;
    }
    if (quote) {
      if (char === quote) {
        quote = null;
      } else {
        current += char;
      }
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      continue;
    }
    if (/\s/.test(char)) {
      if (current) {
        args.push(current);
        current = "";
      }
      continue;
    }
    current += char;
  }
  if (escaped) {
    current += "\\";
  }
  if (current) {
    args.push(current);
  }
  return args;
}
function quoteNodeOption(option) {
  return /^[^\s"'\\]+$/.test(option) ? option : JSON.stringify(option);
}
function nodeOptionName(option) {
  return option.split("=", 1)[0] ?? option;
}
function isInspectorNodeOption(option) {
  const name = nodeOptionName(option);
  return name.startsWith("--inspect") || INSPECTOR_FLAGS.has(name) || INSPECTOR_VALUE_FLAGS.has(name);
}
function inspectorNodeOptionConsumesNext(option) {
  return !option.includes("=") && INSPECTOR_VALUE_FLAGS.has(nodeOptionName(option));
}
function scrubInspectorNodeOptions(nodeOptions) {
  if (!nodeOptions?.trim()) {
    return void 0;
  }
  const args = splitNodeOptions(nodeOptions);
  const keptArgs = [];
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (isInspectorNodeOption(arg)) {
      if (inspectorNodeOptionConsumesNext(arg) && args[index + 1]) {
        index += 1;
      }
      continue;
    }
    keptArgs.push(arg);
  }
  return keptArgs.length > 0 ? keptArgs.map(quoteNodeOption).join(" ") : void 0;
}
function createSdkHookDataImport() {
  const hookSource = `
    import { register } from "node:module";
    import { existsSync, readFileSync } from "node:fs";
    import { join } from "node:path";
    import { pathToFileURL } from "node:url";

    const sdkPath = process.env.GLAZE_SDK_PATH;
    if (sdkPath) {
      try {
        // Resolve @glaze/core package directory from either:
        //   1) SDK root path: <sdk>/@glaze/core
        //   2) Direct package path: <...>/glaze-core
        let sdkCoreDir;
        const sdkRootPkg = join(sdkPath, "@glaze", "core", "package.json");
        const directPkg = join(sdkPath, "package.json");

        if (existsSync(sdkRootPkg)) {
          sdkCoreDir = join(sdkPath, "@glaze", "core");
        } else if (existsSync(directPkg)) {
          const directMeta = JSON.parse(readFileSync(directPkg, "utf-8"));
          if (directMeta.name === "@glaze/core") {
            sdkCoreDir = sdkPath;
          }
        }

        if (sdkCoreDir) {
          const pkg = JSON.parse(readFileSync(join(sdkCoreDir, "package.json"), "utf-8"));
          const resolutionMap = {};

          for (const [subpath, entry] of Object.entries(pkg.exports || {})) {
            const importPath = typeof entry === "string" ? entry : entry?.import;
            if (importPath && !importPath.endsWith(".css")) {
              const specifier = subpath === "." ? "@glaze/core" : "@glaze/core" + subpath.slice(1);
              resolutionMap[specifier] = pathToFileURL(join(sdkCoreDir, importPath)).href;
            }
          }

          register(
            "data:text/javascript," +
              encodeURIComponent(
                "let m;" +
                  "export function initialize(d){m=d.resolutionMap}" +
                  "export async function resolve(s,c,n){return m?.[s]?{url:m[s],shortCircuit:true}:n(s,c)}",
              ),
            { parentURL: import.meta.url, data: { resolutionMap } },
          );

          console.log("${LOG_PREFIX} SDK resolve hook registered (" + Object.keys(resolutionMap).length + " modules)");
        }
      } catch (e) {
        console.warn("${LOG_PREFIX} SDK resolve hook setup failed:", e?.message ?? e);
      }
    }
  `;
  return `data:text/javascript,${encodeURIComponent(hookSource)}`;
}
function resolveEntryPoint(appRoot) {
  const tsEntry = join9(appRoot, "main", "index.ts");
  const { buildOutDir } = detectAppContext(appRoot);
  const jsEntry = join9(buildOutDir, "main", "index.js");
  const entryPoint = existsSync12(jsEntry) ? jsEntry : tsEntry;
  const isDevelopment = entryPoint === tsEntry;
  return { entryPoint, isDevelopment };
}
function resolveDevelopmentBackendArgs(appRoot, entryPoint) {
  const tsxPath = join9(appRoot, "node_modules", "tsx", "dist", "cli.mjs");
  const hasTsx = existsSync12(tsxPath);
  if (!hasTsx) {
    console.warn(`${LOG_PREFIX} Warning: tsx not found at ${tsxPath}, attempting direct node execution`);
  }
  return hasTsx ? [tsxPath, entryPoint] : [entryPoint];
}
function resolveProductionBackendArgs(entryPoint) {
  const sdkHookImport = createSdkHookDataImport();
  return [
    DISABLE_SIGUSR1_ARG,
    "--import",
    sdkHookImport,
    "--import",
    NETWORK_RUNTIME_IMPORT,
    "--import",
    BACKEND_RUNTIME_IMPORT,
    entryPoint
  ];
}
function buildBackendSpawnEnv(env, isDevelopment) {
  const spawnEnv = { ...env };
  const managedBackendEnv = spawnEnv[MANAGED_BACKEND_ENV_KEY];
  delete spawnEnv[MANAGED_BACKEND_ENV_KEY];
  if (managedBackendEnv === "app") {
    for (const key of HOST_SERVICE_ENV_KEYS) {
      delete spawnEnv[key];
    }
  }
  if (isDevelopment) {
    spawnEnv.NODE_OPTIONS = `${spawnEnv.NODE_OPTIONS || ""} --import ${NETWORK_RUNTIME_IMPORT} --import ${BACKEND_RUNTIME_IMPORT}`.trim();
  } else {
    const scrubbedNodeOptions = scrubInspectorNodeOptions(spawnEnv.NODE_OPTIONS);
    if (scrubbedNodeOptions) {
      spawnEnv.NODE_OPTIONS = scrubbedNodeOptions;
    } else {
      delete spawnEnv.NODE_OPTIONS;
    }
  }
  return spawnEnv;
}
function startBackend(appRoot) {
  const { entryPoint, isDevelopment } = resolveEntryPoint(appRoot);
  if (!existsSync12(entryPoint)) {
    console.error(`${LOG_PREFIX} Entry point not found: ${entryPoint}`);
    process.exit(1);
  }
  console.log(`${LOG_PREFIX} Starting backend`);
  console.log(`${LOG_PREFIX} Entry point: ${entryPoint}`);
  console.log(`${LOG_PREFIX} Mode: ${isDevelopment ? "development" : "production"}`);
  const backendArgs = isDevelopment ? resolveDevelopmentBackendArgs(appRoot, entryPoint) : resolveProductionBackendArgs(entryPoint);
  const spawnEnv = buildBackendSpawnEnv(process.env, isDevelopment);
  const backend = spawn2("node", backendArgs, {
    cwd: appRoot,
    env: spawnEnv,
    stdio: "inherit"
  });
  backend.on("error", (err) => {
    console.error(`${LOG_PREFIX} Failed to start backend:`, err);
    process.exit(1);
  });
  backend.on("exit", (code, signal) => {
    console.log(`${LOG_PREFIX} Backend exited with code ${code}${signal ? ` (signal ${signal})` : ""}`);
    if (signal && code === null) {
      process.exit(1e3);
    } else {
      process.exit(code ?? 0);
    }
  });
  for (const sig of ["SIGINT", "SIGTERM", "SIGQUIT", "SIGHUP"]) {
    process.on(sig, () => {
      console.log(`${LOG_PREFIX} Forwarding ${sig} to backend`);
      backend.kill(sig);
    });
  }
  process.on("SIGUSR2", () => {
    console.log(`${LOG_PREFIX} Restart requested by native host`);
    if (!backend.kill("SIGKILL")) {
      process.exit(1e3);
    }
  });
  process.stdin.setEncoding("utf8");
  process.stdin.on("end", () => backend.kill("SIGTERM"));
  process.stdin.on("close", () => backend.kill("SIGTERM"));
}

// cli/build/generate-support-files.ts
import { existsSync as existsSync13, mkdirSync as mkdirSync4, writeFileSync as writeFileSync5 } from "fs";
import { join as join10 } from "path";
function generateViteEnvDts(appRoot, options) {
  const dtsPath = join10(appRoot, "renderer", "vite-env.d.ts");
  if (existsSync13(dtsPath) && !options?.force) {
    return false;
  }
  mkdirSync4(join10(appRoot, "renderer"), { recursive: true });
  writeFileSync5(dtsPath, `/// <reference types="vite/client" />
`, "utf-8");
  console.log("[glaze] Generated renderer/vite-env.d.ts");
  return true;
}
export {
  buildBackend,
  buildRenderer,
  compileNativeSidecars,
  copyNativeBindings,
  createViteConfig,
  createViteDevServer,
  defineConfig,
  externalizePackage,
  generateViteEnvDts,
  generateWindowHtml,
  loadConfig,
  resolveGlazeCorePath,
  startBackend,
  startDevServers,
  startRendererDevServer,
  syncRuntimeManifest
};
