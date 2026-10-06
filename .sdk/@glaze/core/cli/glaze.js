#!/usr/bin/env node

// cli/main.ts
import { dirname as dirname4, join as join11, resolve as resolve3 } from "path";
import { existsSync as existsSync11 } from "fs";
import { fileURLToPath } from "url";

// cli/commands/build.ts
import { cpSync, existsSync as existsSync4, mkdirSync, readdirSync as readdirSync2, rmSync } from "fs";
import { dirname as dirname2, relative as relative2, resolve } from "path";

// ../glaze-publishing/src/shared/ai-capability-scan.ts
import { existsSync, readFileSync, readdirSync } from "fs";
import { join as join2, relative } from "path";

// cli/build/shims/typescript-resolver-shim.js
import { createRequire } from "node:module";
import { join } from "node:path";
import process2 from "node:process";
function resolveTypescript() {
  const candidates = [join(process2.cwd(), "package.json"), import.meta.url];
  for (const base of candidates) {
    try {
      return createRequire(base)("typescript");
    } catch {
    }
  }
  return null;
}
var typescript_resolver_shim_default = resolveTypescript();

// ../glaze-publishing/src/shared/ai-capability-manifest.ts
var GLAZE_AI_GRADES = ["fast", "smart", "powerful", "image-fast", "image-powerful"];
var GLAZE_AI_MODES = ["required", "optional"];
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function getDeclaredCapabilities(pkg) {
  return pkg.glaze?.capabilities ?? pkg.capabilities;
}
function validateAiCapability(cap) {
  if (!isRecord(cap)) {
    return { ok: false, error: "capability must be an object" };
  }
  const { grades, purpose, mode } = cap;
  if (!Array.isArray(grades) || grades.length === 0) {
    return { ok: false, error: "grades must be a non-empty array" };
  }
  if (!grades.every((grade) => GLAZE_AI_GRADES.includes(grade))) {
    return { ok: false, error: `grades must be a subset of ${GLAZE_AI_GRADES.join(", ")}` };
  }
  if (typeof purpose !== "string" || purpose.trim().length === 0) {
    return { ok: false, error: "purpose must be a non-empty string" };
  }
  if (typeof mode !== "string" || !GLAZE_AI_MODES.includes(mode)) {
    return { ok: false, error: `mode must be one of ${GLAZE_AI_MODES.join(", ")}` };
  }
  return { ok: true };
}

// ../glaze-publishing/src/shared/ai-capability-scan.ts
function gradeOfLiteral(literal) {
  if (GLAZE_AI_GRADES.includes(literal)) return literal;
  const lower = literal.toLowerCase();
  if (!lower.startsWith("claude-")) return null;
  if (lower.includes("haiku")) return "fast";
  if (lower.includes("sonnet")) return "smart";
  if (lower.includes("opus")) return "powerful";
  return null;
}
var AI_IMPORT_SPECIFIER = "@glaze/core/ai";
var HOOKS_IMPORT_SPECIFIER = "@glaze/core/hooks";
function isPureTypeOnlyModuleRef(node) {
  if (typescript_resolver_shim_default.isImportDeclaration(node)) {
    const clause = node.importClause;
    if (!clause) return false;
    if (clause.isTypeOnly) return true;
    if (clause.name) return false;
    if (clause.namedBindings && typescript_resolver_shim_default.isNamespaceImport(clause.namedBindings)) return false;
    if (clause.namedBindings && typescript_resolver_shim_default.isNamedImports(clause.namedBindings)) {
      return clause.namedBindings.elements.every((element) => element.isTypeOnly);
    }
    return false;
  }
  if (node.isTypeOnly) return true;
  if (node.exportClause && typescript_resolver_shim_default.isNamedExports(node.exportClause)) {
    return node.exportClause.elements.every((element) => element.isTypeOnly);
  }
  return false;
}
function analyzeAiSource(sourceText, fileName = "file.ts") {
  const scriptKind = fileName.endsWith(".tsx") ? typescript_resolver_shim_default.ScriptKind.TSX : typescript_resolver_shim_default.ScriptKind.TS;
  const sourceFile = typescript_resolver_shim_default.createSourceFile(fileName, sourceText, typescript_resolver_shim_default.ScriptTarget.Latest, true, scriptKind);
  let usesAi = false;
  const literalGrades = /* @__PURE__ */ new Set();
  const glazeIdentifiers = /* @__PURE__ */ new Set();
  const aiNamespaces = /* @__PURE__ */ new Set();
  const hookIdentifiers = /* @__PURE__ */ new Set();
  const hookNamespaces = /* @__PURE__ */ new Set();
  const generateIdentifiers = /* @__PURE__ */ new Set();
  const streamTextIdentifiers = /* @__PURE__ */ new Set();
  const hookResultIdentifiers = /* @__PURE__ */ new Set();
  for (const statement of sourceFile.statements) {
    if (!typescript_resolver_shim_default.isImportDeclaration(statement) || !typescript_resolver_shim_default.isStringLiteral(statement.moduleSpecifier)) continue;
    const specifier = statement.moduleSpecifier.text;
    const clause = statement.importClause;
    if (specifier === AI_IMPORT_SPECIFIER && !clause?.isTypeOnly) {
      if (clause?.namedBindings && typescript_resolver_shim_default.isNamedImports(clause.namedBindings)) {
        const valueElements = clause.namedBindings.elements.filter((element) => !element.isTypeOnly);
        if (valueElements.length > 0) {
          usesAi = true;
          for (const element of valueElements) {
            if ((element.propertyName ?? element.name).text === "glaze") glazeIdentifiers.add(element.name.text);
          }
        }
      } else if (clause?.namedBindings && typescript_resolver_shim_default.isNamespaceImport(clause.namedBindings)) {
        usesAi = true;
        aiNamespaces.add(clause.namedBindings.name.text);
      } else {
        usesAi = true;
      }
    }
    if (specifier === HOOKS_IMPORT_SPECIFIER && clause?.namedBindings && !clause.isTypeOnly) {
      if (typescript_resolver_shim_default.isNamedImports(clause.namedBindings)) {
        for (const element of clause.namedBindings.elements) {
          if (element.isTypeOnly) continue;
          if ((element.propertyName ?? element.name).text === "useGlazeAI") {
            usesAi = true;
            hookIdentifiers.add(element.name.text);
          }
        }
      } else {
        hookNamespaces.add(clause.namedBindings.name.text);
      }
    }
  }
  const isHookCall = (node) => {
    if (!node || !typescript_resolver_shim_default.isCallExpression(node)) return false;
    if (typescript_resolver_shim_default.isIdentifier(node.expression)) return hookIdentifiers.has(node.expression.text);
    return typescript_resolver_shim_default.isPropertyAccessExpression(node.expression) && typescript_resolver_shim_default.isIdentifier(node.expression.expression) && hookNamespaces.has(node.expression.expression.text) && node.expression.name.text === "useGlazeAI";
  };
  const recordGrade = (value) => {
    if (!value || !typescript_resolver_shim_default.isStringLiteralLike(value)) return;
    const grade = gradeOfLiteral(value.text);
    if (grade) literalGrades.add(grade);
  };
  const recordGenerateGrade = (call) => {
    const options = call.arguments[0];
    if (!options || !typescript_resolver_shim_default.isObjectLiteralExpression(options)) return;
    const model = options.properties.find(
      (property) => typescript_resolver_shim_default.isPropertyAssignment(property) && (typescript_resolver_shim_default.isIdentifier(property.name) && property.name.text === "model" || typescript_resolver_shim_default.isStringLiteral(property.name) && property.name.text === "model")
    );
    recordGrade(model?.initializer);
  };
  const visit = (node) => {
    if ((typescript_resolver_shim_default.isImportDeclaration(node) || typescript_resolver_shim_default.isExportDeclaration(node)) && node.moduleSpecifier && typescript_resolver_shim_default.isStringLiteral(node.moduleSpecifier) && node.moduleSpecifier.text === AI_IMPORT_SPECIFIER && !isPureTypeOnlyModuleRef(node)) {
      usesAi = true;
    }
    if (typescript_resolver_shim_default.isExportDeclaration(node) && node.moduleSpecifier && typescript_resolver_shim_default.isStringLiteral(node.moduleSpecifier) && node.moduleSpecifier.text === HOOKS_IMPORT_SPECIFIER && node.exportClause && typescript_resolver_shim_default.isNamedExports(node.exportClause) && node.exportClause.elements.some((element) => (element.propertyName ?? element.name).text === "useGlazeAI")) {
      usesAi = true;
    }
    if (typescript_resolver_shim_default.isCallExpression(node) && node.expression.kind === typescript_resolver_shim_default.SyntaxKind.ImportKeyword && node.arguments.length > 0 && typescript_resolver_shim_default.isStringLiteral(node.arguments[0]) && node.arguments[0].text === AI_IMPORT_SPECIFIER) {
      usesAi = true;
    }
    if (typescript_resolver_shim_default.isVariableDeclaration(node) && node.initializer && isHookCall(node.initializer)) {
      usesAi = true;
      if (typescript_resolver_shim_default.isIdentifier(node.name)) hookResultIdentifiers.add(node.name.text);
      if (typescript_resolver_shim_default.isObjectBindingPattern(node.name)) {
        for (const element of node.name.elements) {
          const propertyName = element.propertyName ?? element.name;
          if (!typescript_resolver_shim_default.isIdentifier(propertyName)) continue;
          if (propertyName.text === "generate") {
            generateIdentifiers.add(element.name.getText(sourceFile));
          } else if (propertyName.text === "streamText") {
            streamTextIdentifiers.add(element.name.getText(sourceFile));
          }
        }
      }
    }
    if (typescript_resolver_shim_default.isPropertyAccessExpression(node) && node.name.text === "useGlazeAI") {
      if (typescript_resolver_shim_default.isIdentifier(node.expression) && hookNamespaces.has(node.expression.text)) usesAi = true;
    }
    if (typescript_resolver_shim_default.isCallExpression(node)) {
      if (typescript_resolver_shim_default.isIdentifier(node.expression) && glazeIdentifiers.has(node.expression.text)) {
        recordGrade(node.arguments[0]);
      } else if (typescript_resolver_shim_default.isPropertyAccessExpression(node.expression) && typescript_resolver_shim_default.isIdentifier(node.expression.expression) && aiNamespaces.has(node.expression.expression.text) && node.expression.name.text === "glaze") {
        recordGrade(node.arguments[0]);
      }
      if (typescript_resolver_shim_default.isPropertyAccessExpression(node.expression) && node.expression.name.text === "image") {
        const owner = node.expression.expression;
        if (typescript_resolver_shim_default.isIdentifier(owner) && glazeIdentifiers.has(owner.text) || typescript_resolver_shim_default.isPropertyAccessExpression(owner) && typescript_resolver_shim_default.isIdentifier(owner.expression) && aiNamespaces.has(owner.expression.text) && owner.name.text === "glaze") {
          const gradeArg = node.arguments[0];
          if (gradeArg && typescript_resolver_shim_default.isStringLiteralLike(gradeArg)) {
            recordGrade(gradeArg);
          } else {
            literalGrades.add("image-fast");
            literalGrades.add("image-powerful");
          }
        }
      }
      if (typescript_resolver_shim_default.isIdentifier(node.expression) && (generateIdentifiers.has(node.expression.text) || streamTextIdentifiers.has(node.expression.text))) {
        recordGenerateGrade(node);
      } else if (typescript_resolver_shim_default.isPropertyAccessExpression(node.expression) && (node.expression.name.text === "generate" || node.expression.name.text === "streamText")) {
        const owner = node.expression.expression;
        if (typescript_resolver_shim_default.isIdentifier(owner) && hookResultIdentifiers.has(owner.text) || isHookCall(owner)) {
          recordGenerateGrade(node);
        }
      }
    }
    typescript_resolver_shim_default.forEachChild(node, visit);
  };
  visit(sourceFile);
  return { usesAi, literalGrades };
}
function scanNeedsAiCapability(sourceFiles, pkgJson) {
  const usages = sourceFiles.map((file) => ({ file, usage: analyzeAiSource(file.content, file.path) }));
  const offendingFiles = usages.filter(({ usage }) => usage.usesAi).map(({ file }) => file.path);
  if (offendingFiles.length === 0) {
    return null;
  }
  const usedGrades = Array.from(new Set(usages.flatMap(({ usage }) => Array.from(usage.literalGrades)))).sort();
  const declaredCapabilities = isRecord(pkgJson) ? getDeclaredCapabilities(pkgJson) : void 0;
  const ai = declaredCapabilities?.ai;
  if (ai === void 0) {
    return { kind: "missing", reason: "missing glaze.capabilities.ai", offendingFiles, usedGrades };
  }
  const result = validateAiCapability(ai);
  if (!result.ok) {
    return { kind: "invalid", reason: `glaze.capabilities.ai is invalid: ${result.error}`, offendingFiles, usedGrades };
  }
  const declaredGrades = new Set(ai.grades);
  const gradeViolations = usages.filter(
    ({ usage }) => Array.from(usage.literalGrades).some((grade) => !declaredGrades.has(grade))
  );
  if (gradeViolations.length > 0) {
    const missingGrades = Array.from(
      new Set(
        gradeViolations.flatMap(({ usage }) => Array.from(usage.literalGrades)).filter((g) => !declaredGrades.has(g))
      )
    ).sort();
    return {
      kind: "undeclared-grades",
      reason: `literal AI usage requires undeclared grade(s): ${missingGrades.join(", ")}`,
      offendingFiles: gradeViolations.map(({ file }) => file.path),
      usedGrades
    };
  }
  return null;
}
function collectSourceFiles(dir, excludeTopLevelDirs) {
  if (!existsSync(dir)) return [];
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join2(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules") continue;
      if (excludeTopLevelDirs?.includes(entry.name)) continue;
      results.push(...collectSourceFiles(full));
    } else if (/\.(?:ts|tsx)$/.test(entry.name)) {
      results.push({ path: full, content: readFileSync(full, "utf-8") });
    }
  }
  return results;
}
function scanAppSources(appDir, options) {
  const sourceFiles = [
    ...collectSourceFiles(join2(appDir, "main"), options?.excludeTopLevelDirs),
    ...collectSourceFiles(join2(appDir, "renderer"), options?.excludeTopLevelDirs)
  ];
  const pkgPath = join2(appDir, "package.json");
  const pkgJson = existsSync(pkgPath) ? JSON.parse(readFileSync(pkgPath, "utf-8")) : {};
  const result = scanNeedsAiCapability(sourceFiles, pkgJson);
  if (!result) return null;
  return { ...result, offendingFiles: result.offendingFiles.map((file) => relative(appDir, file)) };
}

// cli/build/app-context.ts
import { existsSync as existsSync2 } from "fs";
import { basename, dirname, join as join3 } from "path";
var SOURCES_DIR_NAME = "sources";
var RUNTIME_DIR_NAME = "runtime";
var LEGACY_SOURCES_DIR_NAME = ".glaze-sources";
var LEGACY_RUNTIME_DIR_NAME = ".glaze";
var BUILD_OUTPUT_DIR_NAME = "build";
function isSourcesDirName(name) {
  return name === SOURCES_DIR_NAME || name === LEGACY_SOURCES_DIR_NAME;
}
function resolveDeployedRuntimeDir(cwd) {
  const name = basename(cwd);
  const parentDir = dirname(cwd);
  if (name === SOURCES_DIR_NAME && basename(parentDir) === LEGACY_RUNTIME_DIR_NAME) {
    return parentDir;
  }
  const legacySibling = join3(cwd, "..", LEGACY_RUNTIME_DIR_NAME);
  if (existsSync2(legacySibling)) {
    return legacySibling;
  }
  if (!isSourcesDirName(name)) {
    return null;
  }
  const currentSibling = join3(cwd, "..", RUNTIME_DIR_NAME);
  if (existsSync2(currentSibling)) {
    return currentSibling;
  }
  return name === SOURCES_DIR_NAME ? join3(cwd, "..", RUNTIME_DIR_NAME) : join3(cwd, "..", LEGACY_RUNTIME_DIR_NAME);
}
function isDeployedApp(cwd = process.cwd()) {
  return resolveDeployedRuntimeDir(cwd) !== null;
}

// cli/commands/command.ts
import { join as join4 } from "path";
import { existsSync as existsSync3 } from "fs";
function defineCommand(cmd) {
  return cmd;
}
async function loadBuildModule(coreRoot2) {
  const compiledPath = join4(coreRoot2, "build.js");
  if (existsSync3(compiledPath)) {
    return import(compiledPath);
  }
  const srcPath = join4(coreRoot2, "cli", "build", "index.ts");
  if (existsSync3(srcPath)) {
    return import(srcPath);
  }
  console.error("[glaze] Cannot find build module. Looked for:");
  console.error(`  - ${compiledPath}`);
  console.error(`  - ${srcPath}`);
  process.exit(1);
}

// cli/commands/build.ts
var BUILD_OUT_DIR_OVERRIDE_ENV = "GLAZE_BUILD_OUT_DIR";
function resolveDeployedBuildPaths(appRoot2) {
  const runtimeDir = resolveDeployedRuntimeDir(appRoot2);
  return {
    liveBuildOutDir: runtimeDir ? resolve(runtimeDir, BUILD_OUTPUT_DIR_NAME) : resolve(appRoot2, `../${BUILD_OUTPUT_DIR_NAME}`),
    stagedBuildOutDir: resolve(appRoot2, ".build")
  };
}
function collectRelativeFiles(directory, root = directory) {
  if (!existsSync4(directory)) {
    return [];
  }
  const relativeFiles = [];
  for (const entry of readdirSync2(directory, { withFileTypes: true })) {
    const entryPath = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      relativeFiles.push(...collectRelativeFiles(entryPath, root));
      continue;
    }
    relativeFiles.push(relative2(root, entryPath).replace(/\\/g, "/"));
  }
  return relativeFiles.sort();
}
function isWatchedBuildFile(relativePath) {
  return relativePath.endsWith(".js") || relativePath.endsWith(".html") || relativePath.endsWith(".css") || relativePath.endsWith(".json");
}
function isBackendTriggerFile(relativePath) {
  return relativePath.startsWith("main/") && relativePath.endsWith(".js") && !relativePath.endsWith(".js.map");
}
function getPublishOrder(relativeFiles) {
  const otherFiles = relativeFiles.filter(
    (relativePath) => !relativePath.startsWith("main/") && !isWatchedBuildFile(relativePath)
  );
  const watchedFrontendFiles = relativeFiles.filter(
    (relativePath) => !relativePath.startsWith("main/") && isWatchedBuildFile(relativePath) && !relativePath.endsWith(".html")
  );
  const htmlFiles = relativeFiles.filter(
    (relativePath) => !relativePath.startsWith("main/") && relativePath.endsWith(".html")
  );
  const backendSupportFiles = relativeFiles.filter(
    (relativePath) => relativePath.startsWith("main/") && !isBackendTriggerFile(relativePath)
  );
  const backendTriggerFiles = relativeFiles.filter(isBackendTriggerFile);
  return [...otherFiles, ...watchedFrontendFiles, ...htmlFiles, ...backendSupportFiles, ...backendTriggerFiles];
}
function getDeleteOrder(relativeFiles) {
  return [...relativeFiles].sort((left, right) => {
    const depthDifference = right.split("/").length - left.split("/").length;
    if (depthDifference !== 0) {
      return depthDifference;
    }
    return right.localeCompare(left);
  });
}
function removeEmptyDirectories(directory, isRoot = true) {
  if (!existsSync4(directory)) {
    return;
  }
  for (const entry of readdirSync2(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }
    removeEmptyDirectories(resolve(directory, entry.name), false);
  }
  if (!isRoot && readdirSync2(directory).length === 0) {
    rmSync(directory, { recursive: true, force: true });
  }
}
function deleteStaleBuildFiles(liveBuildOutDir, stagedRelativeFiles) {
  const stagedFileSet = new Set(stagedRelativeFiles);
  const staleRelativeFiles = collectRelativeFiles(liveBuildOutDir).filter(
    (relativePath) => !stagedFileSet.has(relativePath)
  );
  if (staleRelativeFiles.length === 0) {
    return;
  }
  for (const relativePath of getDeleteOrder(staleRelativeFiles)) {
    rmSync(resolve(liveBuildOutDir, relativePath), { force: true });
  }
  removeEmptyDirectories(liveBuildOutDir);
}
function publishStagedBuild(appRoot2, stagedBuildOutDir, liveBuildOutDir) {
  console.log(
    `[glaze] Publishing staged build: ${relative2(appRoot2, stagedBuildOutDir)} -> ${relative2(appRoot2, liveBuildOutDir)}`
  );
  const stagedRelativeFiles = collectRelativeFiles(stagedBuildOutDir);
  mkdirSync(liveBuildOutDir, { recursive: true });
  deleteStaleBuildFiles(liveBuildOutDir, stagedRelativeFiles);
  for (const relativePath of getPublishOrder(stagedRelativeFiles)) {
    const stagedPath = resolve(stagedBuildOutDir, relativePath);
    const livePath = resolve(liveBuildOutDir, relativePath);
    mkdirSync(dirname2(livePath), { recursive: true });
    cpSync(stagedPath, livePath, { force: true });
  }
  rmSync(stagedBuildOutDir, { recursive: true, force: true });
}
function checkAiCapabilityDeclared(appRoot2) {
  let result;
  try {
    result = scanAppSources(appRoot2, { excludeTopLevelDirs: ["dev"] });
  } catch (error) {
    console.warn(`[glaze] AI capability check skipped: ${error instanceof Error ? error.message : String(error)}`);
    return;
  }
  if (!result) return;
  console.error(`[glaze] Build failed: ${result.reason}`);
  console.error(`  AI usage (@glaze/core/ai import or useGlazeAI hook) found in: ${result.offendingFiles.join(", ")}`);
  switch (result.kind) {
    case "missing": {
      const grades = result.usedGrades.length > 0 ? result.usedGrades : ["fast"];
      const gradesJson = grades.map((grade) => `"${grade}"`).join(", ");
      console.error(`  Apps must declare AI usage in package.json \u2014 without it, Glaze denies`);
      console.error(`  every AI request without showing a consent dialog. Add (adjusting`);
      console.error(`  grades/purpose/mode to what the app actually does):`);
      console.error(`    "glaze": {`);
      console.error(`      "capabilities": {`);
      console.error(
        `        "ai": { "grades": [${gradesJson}], "purpose": "<what the AI does, shown to the user>", "mode": "optional" }`
      );
      console.error(`      }`);
      console.error(`    }`);
      break;
    }
    case "invalid":
      console.error(`  Fix the existing "glaze"."capabilities"."ai" declaration in package.json.`);
      break;
    case "undeclared-grades":
      console.error(`  Add the missing grade(s) to the "grades" array of glaze.capabilities.ai in package.json.`);
      break;
  }
  process.exit(1);
}
var build_default = defineCommand({
  name: "build",
  description: "Build backend + renderer + sync manifest",
  async execute({ appRoot: appRoot2, coreRoot: coreRoot2 }) {
    checkAiCapabilityDeclared(appRoot2);
    const mod = await loadBuildModule(coreRoot2);
    const config = await mod.loadConfig(appRoot2);
    mod.generateViteEnvDts(appRoot2);
    if (isDeployedApp(appRoot2)) {
      const { liveBuildOutDir, stagedBuildOutDir } = resolveDeployedBuildPaths(appRoot2);
      const previousBuildOutDirOverride = process.env[BUILD_OUT_DIR_OVERRIDE_ENV];
      rmSync(stagedBuildOutDir, { recursive: true, force: true });
      process.env[BUILD_OUT_DIR_OVERRIDE_ENV] = stagedBuildOutDir;
      try {
        await mod.compileNativeSidecars(appRoot2);
        await mod.buildBackend(config.build, appRoot2);
        await mod.buildRenderer(appRoot2, config.vite);
      } catch (error) {
        rmSync(stagedBuildOutDir, { recursive: true, force: true });
        throw error;
      } finally {
        if (previousBuildOutDirOverride) {
          process.env[BUILD_OUT_DIR_OVERRIDE_ENV] = previousBuildOutDirOverride;
        } else {
          delete process.env[BUILD_OUT_DIR_OVERRIDE_ENV];
        }
      }
      publishStagedBuild(appRoot2, stagedBuildOutDir, liveBuildOutDir);
      mod.syncRuntimeManifest(appRoot2);
    } else {
      await mod.compileNativeSidecars(appRoot2);
      await mod.buildBackend(config.build, appRoot2);
      await mod.buildRenderer(appRoot2, config.vite);
      mod.syncRuntimeManifest(appRoot2);
    }
    console.log("[glaze] Build complete");
  }
});

// cli/commands/dev.ts
var dev_default = defineCommand({
  name: "dev",
  description: "Start backend + renderer dev servers",
  async execute({ appRoot: appRoot2, coreRoot: coreRoot2 }) {
    const mod = await loadBuildModule(coreRoot2);
    mod.generateViteEnvDts(appRoot2);
    await mod.compileNativeSidecars(appRoot2, { configuration: "debug" });
    await mod.startDevServers(appRoot2);
  }
});

// cli/commands/dev-renderer.ts
var dev_renderer_default = defineCommand({
  name: "dev:renderer",
  description: "Start renderer dev server only",
  async execute({ appRoot: appRoot2, coreRoot: coreRoot2 }) {
    const mod = await loadBuildModule(coreRoot2);
    mod.generateViteEnvDts(appRoot2);
    await mod.startRendererDevServer(appRoot2);
  }
});

// cli/commands/start.ts
var start_default = defineCommand({
  name: "start",
  description: "Launch production backend",
  async execute({ appRoot: appRoot2, coreRoot: coreRoot2 }) {
    const mod = await loadBuildModule(coreRoot2);
    mod.startBackend(appRoot2);
  }
});

// cli/commands/lint.ts
import { join as join5 } from "path";
import { existsSync as existsSync5 } from "fs";
import { execFile } from "child_process";
import { promisify } from "util";
var execFileAsync = promisify(execFile);
var externalAgentResourceIgnorePatterns = [".claude/**", ".agents/**", ".cursor/**"];
function buildLintArgs(appRoot2, coreRoot2) {
  const args = ["."];
  for (const ignorePattern of externalAgentResourceIgnorePatterns) {
    args.push("--ignore-pattern", ignorePattern);
  }
  const localConfig = join5(appRoot2, "eslint.config.js");
  if (!existsSync5(localConfig)) {
    args.push("--config", join5(coreRoot2, "cli", "lint", "eslint.config.js"));
  }
  return args;
}
var lint_default = defineCommand({
  name: "lint",
  description: "Run ESLint with framework config",
  async execute({ appRoot: appRoot2, coreRoot: coreRoot2 }) {
    const appEslintBin = join5(appRoot2, "node_modules", ".bin", "eslint");
    const coreEslintBin = join5(coreRoot2, "node_modules", ".bin", "eslint");
    const eslintCmd = existsSync5(appEslintBin) ? appEslintBin : existsSync5(coreEslintBin) ? coreEslintBin : "eslint";
    const args = buildLintArgs(appRoot2, coreRoot2);
    try {
      const { stdout } = await execFileAsync(eslintCmd, args, { cwd: appRoot2, env: process.env });
      if (stdout) process.stdout.write(stdout);
    } catch (err) {
      if (err.stdout) process.stdout.write(err.stdout);
      if (err.stderr) process.stderr.write(err.stderr);
      process.exitCode = typeof err.code === "number" ? err.code : 1;
    }
  }
});

// cli/commands/format.ts
import { join as join6 } from "path";
import { existsSync as existsSync6 } from "fs";
import { execFile as execFile2 } from "child_process";
import { promisify as promisify2 } from "util";
var execFileAsync2 = promisify2(execFile2);
var format_default = defineCommand({
  name: "format",
  description: "Run formatter on renderer/ and main/",
  async execute({ appRoot: appRoot2, coreRoot: coreRoot2 }) {
    const appFmtBin = join6(appRoot2, "node_modules", ".bin", "oxfmt");
    const coreFmtBin = join6(coreRoot2, "node_modules", ".bin", "oxfmt");
    const fmtCmd = existsSync6(appFmtBin) ? appFmtBin : existsSync6(coreFmtBin) ? coreFmtBin : "oxfmt";
    const appConfig = join6(appRoot2, ".oxfmtrc.json");
    const coreConfig = join6(coreRoot2, "cli", ".oxfmtrc.json");
    const configPath = existsSync6(appConfig) ? appConfig : existsSync6(coreConfig) ? coreConfig : null;
    const args = ["--write", "renderer/", "main/"];
    if (configPath) {
      args.push("--config", configPath);
    }
    try {
      const { stdout } = await execFileAsync2(fmtCmd, args, {
        cwd: appRoot2,
        env: process.env
      });
      if (stdout) process.stdout.write(stdout);
    } catch (err) {
      if (err.stdout) process.stdout.write(err.stdout);
      if (err.stderr) process.stderr.write(err.stderr);
      process.exitCode = typeof err.code === "number" ? err.code : 1;
    }
  }
});

// cli/commands/type-check.ts
import { join as join7 } from "path";
import { existsSync as existsSync7 } from "fs";
import { execFile as execFile3 } from "child_process";
import { promisify as promisify3 } from "util";
var execFileAsync3 = promisify3(execFile3);
var type_check_default = defineCommand({
  name: "type-check",
  description: "Run TypeScript type checking with --noEmit",
  async execute({ appRoot: appRoot2, coreRoot: coreRoot2 }) {
    const mod = await loadBuildModule(coreRoot2);
    await mod.compileNativeSidecars(appRoot2, { emitBinaries: false });
    const appTscBin = join7(appRoot2, "node_modules", ".bin", "tsc");
    const coreTscBin = join7(coreRoot2, "node_modules", ".bin", "tsc");
    const tscCmd = existsSync7(appTscBin) ? appTscBin : existsSync7(coreTscBin) ? coreTscBin : "tsc";
    try {
      const { stdout } = await execFileAsync3(tscCmd, ["--noEmit"], { cwd: appRoot2, env: process.env });
      if (stdout) process.stdout.write(stdout);
    } catch (err) {
      if (err.stdout) process.stdout.write(err.stdout);
      if (err.stderr) process.stderr.write(err.stderr);
      process.exitCode = typeof err.code === "number" ? err.code : 1;
    }
  }
});

// cli/commands/launch.ts
import { randomUUID } from "crypto";
import { rmSync as rmSync3 } from "fs";

// cli/commands/bundle-host-request.ts
import { execFile as execFile4 } from "child_process";
import { existsSync as existsSync8, mkdirSync as mkdirSync2, readFileSync as readFileSync2, rmSync as rmSync2 } from "fs";
import { homedir } from "os";
import { basename as basename2, dirname as dirname3, isAbsolute, join as join8, resolve as resolve2 } from "path";
import { promisify as promisify4 } from "util";
var execFileAsync4 = promisify4(execFile4);
var HOST_SCHEMES_BY_SUPPORT_DIR = {
  "app.glaze.macos.main": "glaze",
  "app.glaze.macos.main.internal": "glaze-internal",
  "app.glaze.macos.main.development": "glaze-development"
};
var PROJECTS_ROOT_MARKER = ".glaze-projects-root";
var HOST_SCHEMES_BY_FLAVOR = {
  "": "glaze",
  production: "glaze",
  internal: "glaze-internal",
  development: "glaze-development"
};
var SUPPORT_BUNDLE_IDS_BY_FLAVOR = {
  "": "app.glaze.macos.main",
  production: "app.glaze.macos.main",
  internal: "app.glaze.macos.main.internal",
  development: "app.glaze.macos.main.development"
};
function readOwningFlavor(projectsRoot) {
  try {
    const marker = JSON.parse(readFileSync2(join8(projectsRoot, PROJECTS_ROOT_MARKER), "utf-8"));
    if (typeof marker.flavor === "string" && marker.flavor.trim().length > 0) {
      return marker.flavor.trim().toLowerCase();
    }
  } catch {
  }
  switch (basename2(projectsRoot)) {
    case "Glaze":
      return "production";
    case "Glaze (Internal)":
      return "internal";
    case "Glaze (Development)":
      return "development";
    default:
      return null;
  }
}
var URL_SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*$/i;
var DEFAULT_WAIT_TIMEOUT_MS = 10 * 60 * 1e3;
var HOST_REQUEST_ACCEPTANCE_TIMEOUT_MS = 3e4;
var RESULT_POLL_INTERVAL_MS = 250;
var RESULT_DIRECTORY_NAME = ".glaze-external-agent-results";
var HOST_DESCRIPTOR_FILE = ".glaze-external-agent-host.json";
function readPersistedAppId(packageJsonPath) {
  if (!existsSync8(packageJsonPath)) return null;
  try {
    const manifest = JSON.parse(readFileSync2(packageJsonPath, "utf-8"));
    const appId = manifest?.glaze?.appId;
    if (typeof appId !== "string" || appId.trim().length === 0) return null;
    const trimmed = appId.trim();
    const projectId = typeof manifest?.id === "string" ? manifest.id.trim() : "";
    if (projectId.length === 0 || !trimmed.endsWith(`-${projectId}`)) return null;
    return trimmed;
  } catch {
    return null;
  }
}
function resolveManagedGlazeProject(appRoot2, explicitHostScheme) {
  const normalizedRoot = resolve2(appRoot2);
  const rootName = basename2(normalizedRoot);
  const isLegacyLayout = rootName === ".glaze-sources";
  if (!isLegacyLayout && rootName !== "sources") {
    throw new Error("Run this command from a managed .glaze-sources project folder.");
  }
  const appDataDir = dirname3(normalizedRoot);
  if (isLegacyLayout) {
    const appsDir = dirname3(appDataDir);
    if (basename2(appsDir) !== "apps") {
      throw new Error("This project is not inside a managed Glaze apps directory.");
    }
  }
  const persistedAppId = isLegacyLayout ? null : readPersistedAppId(join8(appDataDir, "runtime", "package.json")) ?? readPersistedAppId(join8(normalizedRoot, "package.json"));
  const appId = persistedAppId ?? basename2(appDataDir);
  let supportDirName = null;
  let flavor = null;
  if (isLegacyLayout) {
    supportDirName = basename2(dirname3(dirname3(appDataDir)));
  } else {
    flavor = readOwningFlavor(dirname3(appDataDir));
    supportDirName = flavor === null ? null : SUPPORT_BUNDLE_IDS_BY_FLAVOR[flavor] ?? null;
  }
  const hostScheme = explicitHostScheme || (flavor !== null ? HOST_SCHEMES_BY_FLAVOR[flavor] : void 0) || (supportDirName !== null ? HOST_SCHEMES_BY_SUPPORT_DIR[supportDirName] : void 0) || "glaze-development";
  if (!URL_SCHEME_PATTERN.test(hostScheme)) {
    throw new Error(`Invalid Glaze host URL scheme: ${hostScheme}`);
  }
  const applicationSupportDir = isLegacyLayout ? dirname3(dirname3(appDataDir)) : supportDirName === null ? null : join8(homedir(), "Library", "Application Support", supportDirName);
  return { appId, hostScheme, appDataDir, applicationSupportDir };
}
function parseBundleHostOptions(args, commandName2) {
  let json = false;
  let timeoutMs = DEFAULT_WAIT_TIMEOUT_MS;
  let wait = false;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--json") json = true;
    else if (arg === "--wait") wait = true;
    else if (arg === "--timeout-ms") {
      timeoutMs = Number(args[index + 1]);
      index += 1;
    } else if (arg.startsWith("--timeout-ms=")) {
      timeoutMs = Number(arg.slice("--timeout-ms=".length));
    } else {
      throw new Error(`Unknown ${commandName2} option: ${arg}`);
    }
  }
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1e3) {
    throw new Error("--timeout-ms must be an integer of at least 1000.");
  }
  if (json && !wait) {
    throw new Error("--json requires --wait so the command can return the completed result.");
  }
  return { json, timeoutMs, wait };
}
function buildBundleHostUrl(project, host, request) {
  const url = new URL(`${project.hostScheme}://${host}`);
  url.searchParams.set("appId", project.appId);
  if (request) {
    url.searchParams.set("requestId", request.requestId);
    url.searchParams.set("resultFile", request.resultFile);
  }
  return url.toString().replace(/\+/g, "%20");
}
function prepareBundleHostResultFile(project, requestName, requestId) {
  const resultDir = join8(project.appDataDir, RESULT_DIRECTORY_NAME);
  mkdirSync2(resultDir, { recursive: true, mode: 448 });
  const resultFile = join8(resultDir, `${requestName}-${requestId}.json`);
  rmSync2(resultFile, { force: true });
  rmSync2(`${resultFile}.accepted`, { force: true });
  return resultFile;
}
function resolveManagedGlazeHostApp(project) {
  if (project.applicationSupportDir === null) return null;
  const descriptorFile = join8(project.applicationSupportDir, HOST_DESCRIPTOR_FILE);
  if (!existsSync8(descriptorFile)) return null;
  try {
    const descriptor = JSON.parse(readFileSync2(descriptorFile, "utf-8"));
    if (typeof descriptor.bundlePath !== "string" || !isAbsolute(descriptor.bundlePath)) return null;
    if (!descriptor.bundlePath.endsWith(".app")) return null;
    if (!existsSync8(join8(descriptor.bundlePath, "Contents", "Info.plist"))) return null;
    return descriptor.bundlePath;
  } catch {
    return null;
  }
}
function sleep(milliseconds) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
}
async function waitForBundleHostResult(resultFile, expected, timeoutMs, actionDescription) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (existsSync8(resultFile)) {
      const result = JSON.parse(readFileSync2(resultFile, "utf-8"));
      if (result.appId !== expected.appId || result.requestId !== expected.requestId) {
        throw new Error(`Glaze returned a result for a different ${actionDescription} request.`);
      }
      rmSync2(resultFile, { force: true });
      return result;
    }
    await sleep(RESULT_POLL_INTERVAL_MS);
  }
  throw new Error(`Timed out after ${timeoutMs}ms waiting for Glaze to finish ${actionDescription}.`);
}
async function waitForBundleHostAcknowledgement(resultFile, timeoutMs) {
  const acknowledgementFile = `${resultFile}.accepted`;
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (existsSync8(acknowledgementFile) || existsSync8(resultFile)) return;
    await sleep(RESULT_POLL_INTERVAL_MS);
  }
  throw new Error(`Glaze did not accept the request within ${timeoutMs}ms. Restart or update Glaze, then retry.`);
}
async function openBundleHostUrl(project, url, options = {}) {
  const hostApp = resolveManagedGlazeHostApp(project);
  const backgroundArgs = options.background ? ["-g"] : [];
  await execFileAsync4("open", hostApp ? [...backgroundArgs, "-a", hostApp, url] : [...backgroundArgs, url]);
}

// cli/commands/launch.ts
function buildLaunchUrl(project, request) {
  const url = new URL(buildBundleHostUrl(project, "open-app", request));
  url.searchParams.set("external", "1");
  return url.toString().replace(/\+/g, "%20");
}
var launch_default = defineCommand({
  name: "launch",
  description: "Ask Glaze to launch the current managed app",
  async execute({ appRoot: appRoot2, args }) {
    if (process.platform !== "darwin") {
      throw new Error("Glaze app launching is available on macOS only.");
    }
    const options = parseBundleHostOptions(args, "launch");
    const project = resolveManagedGlazeProject(appRoot2, process.env.GLAZE_HOST_URL_SCHEME);
    if (!options.wait) {
      await openBundleHostUrl(project, buildLaunchUrl(project), { background: true });
      console.log(`[glaze] Launch requested for ${project.appId}.`);
      return;
    }
    const requestId = randomUUID();
    const resultFile = prepareBundleHostResultFile(project, "launch", requestId);
    const acknowledgementFile = `${resultFile}.accepted`;
    console.error(`[glaze] Asking Glaze to launch ${project.appId}...`);
    try {
      await openBundleHostUrl(project, buildLaunchUrl(project, { requestId, resultFile }), { background: true });
      await waitForBundleHostAcknowledgement(
        resultFile,
        Math.min(HOST_REQUEST_ACCEPTANCE_TIMEOUT_MS, options.timeoutMs)
      );
      const result = await waitForBundleHostResult(
        resultFile,
        { appId: project.appId, requestId },
        options.timeoutMs,
        "launching"
      );
      if (options.json) console.log(JSON.stringify(result, null, 2));
      else if (result.ok) console.log(`[glaze] Launched ${project.appId}.`);
      else console.error(`[glaze] Launch failed: ${result.error ?? "Unknown error"}`);
      if (!result.ok) process.exitCode = 1;
    } finally {
      rmSync3(acknowledgementFile, { force: true });
    }
  }
});

// cli/commands/repackage.ts
import { randomUUID as randomUUID2 } from "crypto";
import { rmSync as rmSync4 } from "fs";
function buildRepackageUrl(project, request) {
  return buildBundleHostUrl(project, "repackage-app", request);
}
async function waitForRepackageResult(resultFile, expected, timeoutMs) {
  return waitForBundleHostResult(resultFile, expected, timeoutMs, "repackaging");
}
var waitForRepackageAcknowledgement = waitForBundleHostAcknowledgement;
var repackage_default = defineCommand({
  name: "repackage",
  description: "Ask Glaze to recreate the managed app bundle",
  async execute({ appRoot: appRoot2, args }) {
    if (process.platform !== "darwin") {
      throw new Error("Glaze app repackaging is available on macOS only.");
    }
    const options = parseBundleHostOptions(args, "repackage");
    const project = resolveManagedGlazeProject(appRoot2, process.env.GLAZE_HOST_URL_SCHEME);
    if (!options.wait) {
      await openBundleHostUrl(project, buildRepackageUrl(project));
      console.log(`[glaze] Repackage requested for ${project.appId}. Glaze will report when it finishes.`);
      return;
    }
    const requestId = randomUUID2();
    const resultFile = prepareBundleHostResultFile(project, "repackage", requestId);
    const acknowledgementFile = `${resultFile}.accepted`;
    console.error(`[glaze] Asking Glaze to repackage ${project.appId}...`);
    try {
      await openBundleHostUrl(project, buildRepackageUrl(project, { requestId, resultFile }));
      await waitForRepackageAcknowledgement(
        resultFile,
        Math.min(HOST_REQUEST_ACCEPTANCE_TIMEOUT_MS, options.timeoutMs)
      );
      console.error("[glaze] Glaze accepted the request. Repackaging the app...");
      const progressTimer = setInterval(() => {
        console.error("[glaze] Repackaging is still in progress...");
      }, 15e3);
      progressTimer.unref();
      let result;
      try {
        result = await waitForRepackageResult(resultFile, { appId: project.appId, requestId }, options.timeoutMs);
      } finally {
        clearInterval(progressTimer);
      }
      if (options.json) console.log(JSON.stringify(result, null, 2));
      else if (result.ok)
        console.log(`[glaze] Repackaged ${project.appId} at ${result.bundlePath ?? "the managed bundle"}.`);
      else console.error(`[glaze] Repackage failed: ${result.error ?? "Unknown error"}`);
      if (!result.ok) process.exitCode = 1;
    } finally {
      rmSync4(acknowledgementFile, { force: true });
    }
  }
});

// cli/commands/update-bundle.ts
import { randomUUID as randomUUID3 } from "crypto";
import { rmSync as rmSync5 } from "fs";
function buildUpdateBundleUrl(project, request) {
  return buildBundleHostUrl(project, "update-bundle", request);
}
var update_bundle_default = defineCommand({
  name: "update-bundle",
  description: "Ask Glaze to refresh managed bundle metadata",
  async execute({ appRoot: appRoot2, args }) {
    if (process.platform !== "darwin") {
      throw new Error("Glaze bundle updates are available on macOS only.");
    }
    const options = parseBundleHostOptions(args, "update-bundle");
    const project = resolveManagedGlazeProject(appRoot2, process.env.GLAZE_HOST_URL_SCHEME);
    if (!options.wait) {
      await openBundleHostUrl(project, buildUpdateBundleUrl(project));
      console.log(`[glaze] Bundle update requested for ${project.appId}. Glaze will report when it finishes.`);
      return;
    }
    const requestId = randomUUID3();
    const resultFile = prepareBundleHostResultFile(project, "update-bundle", requestId);
    const acknowledgementFile = `${resultFile}.accepted`;
    console.error(`[glaze] Asking Glaze to update bundle metadata for ${project.appId}...`);
    try {
      await openBundleHostUrl(project, buildUpdateBundleUrl(project, { requestId, resultFile }));
      await waitForBundleHostAcknowledgement(
        resultFile,
        Math.min(HOST_REQUEST_ACCEPTANCE_TIMEOUT_MS, options.timeoutMs)
      );
      console.error("[glaze] Glaze accepted the request. Updating bundle metadata...");
      const progressTimer = setInterval(() => {
        console.error("[glaze] Bundle metadata update is still in progress...");
      }, 15e3);
      progressTimer.unref();
      let result;
      try {
        result = await waitForBundleHostResult(
          resultFile,
          { appId: project.appId, requestId },
          options.timeoutMs,
          "updating bundle metadata"
        );
      } finally {
        clearInterval(progressTimer);
      }
      if (options.json) console.log(JSON.stringify(result, null, 2));
      else if (result.ok) console.log(`[glaze] Updated bundle metadata for ${project.appId}.`);
      else console.error(`[glaze] Bundle update failed: ${result.error ?? "Unknown error"}`);
      if (!result.ok) process.exitCode = 1;
    } finally {
      rmSync5(acknowledgementFile, { force: true });
    }
  }
});

// cli/commands/verify.ts
import { execFile as execFile5 } from "child_process";
import { existsSync as existsSync9, promises as fs } from "fs";
import { join as join9 } from "path";
import { promisify as promisify5 } from "util";
var execFileAsync5 = promisify5(execFile5);
var DEPENDENCY_SECTIONS = ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"];
var MAX_OUTPUT_BYTES = 50 * 1024 * 1024;
function parseVerifyOptions(args) {
  let installMode = "auto";
  let json = false;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--json") {
      json = true;
      continue;
    }
    if (arg === "--install") {
      const value = args[index + 1];
      if (value !== "auto" && value !== "always" && value !== "never") {
        throw new Error("--install must be auto, always, or never.");
      }
      installMode = value;
      index += 1;
      continue;
    }
    if (arg.startsWith("--install=")) {
      const value = arg.slice("--install=".length);
      if (value !== "auto" && value !== "always" && value !== "never") {
        throw new Error("--install must be auto, always, or never.");
      }
      installMode = value;
      continue;
    }
    throw new Error(`Unknown verify option: ${arg}`);
  }
  return { installMode, json };
}
function normalizedSection(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "{}";
  return JSON.stringify(
    Object.fromEntries(
      Object.entries(value).filter((entry) => typeof entry[1] === "string").sort(([left], [right]) => left.localeCompare(right))
    )
  );
}
function dependencySpecsMatchPackageLock(packageJson, packageLock) {
  const lockRoot = packageLock.packages?.[""];
  if (!lockRoot) return false;
  return DEPENDENCY_SECTIONS.every(
    (section) => normalizedSection(packageJson[section]) === normalizedSection(lockRoot[section])
  );
}
async function shouldInstallDependencies(appRoot2) {
  const packageJsonPath = join9(appRoot2, "package.json");
  if (!existsSync9(packageJsonPath)) return false;
  const nodeModulesPath = join9(appRoot2, "node_modules");
  if (!existsSync9(nodeModulesPath)) return true;
  const packageLockPath = join9(appRoot2, "package-lock.json");
  const nodeModulesModifiedAt = (await fs.stat(nodeModulesPath)).mtimeMs;
  if (!existsSync9(packageLockPath)) return (await fs.stat(packageJsonPath)).mtimeMs > nodeModulesModifiedAt;
  try {
    const [packageJsonText, packageLockText, packageLockStats] = await Promise.all([
      fs.readFile(packageJsonPath, "utf8"),
      fs.readFile(packageLockPath, "utf8"),
      fs.stat(packageLockPath)
    ]);
    return !dependencySpecsMatchPackageLock(
      JSON.parse(packageJsonText),
      JSON.parse(packageLockText)
    ) || packageLockStats.mtimeMs > nodeModulesModifiedAt;
  } catch {
    return true;
  }
}
async function runStep(name, executable, args, appRoot2, env = process.env) {
  const startedAt = Date.now();
  const command = [executable, ...args].join(" ");
  try {
    const { stdout, stderr } = await execFileAsync5(executable, args, {
      cwd: appRoot2,
      env,
      encoding: "utf8",
      maxBuffer: MAX_OUTPUT_BYTES
    });
    return { name, command, ok: true, exitCode: 0, stdout, stderr, durationMs: Date.now() - startedAt };
  } catch (error) {
    const failure = error;
    return {
      name,
      command,
      ok: false,
      exitCode: typeof failure.code === "number" ? failure.code : 1,
      stdout: failure.stdout ?? "",
      stderr: failure.stderr ?? failure.message,
      durationMs: Date.now() - startedAt
    };
  }
}
async function runVerification(appRoot2, options, cliEntry = process.argv[1]) {
  const steps = [];
  const installedDependencies = options.installMode === "always" || options.installMode === "auto" && await shouldInstallDependencies(appRoot2);
  if (installedDependencies) {
    const install = await runStep("install", "npm", ["install", "--include=dev"], appRoot2);
    steps.push(install);
    if (!install.ok) return { ok: false, installMode: options.installMode, installedDependencies, steps };
  }
  const [lint, typeCheck] = await Promise.all([
    runStep("lint", process.execPath, [cliEntry, "lint"], appRoot2),
    runStep("type-check", process.execPath, [cliEntry, "type-check"], appRoot2)
  ]);
  steps.push(lint, typeCheck);
  if (!lint.ok || !typeCheck.ok) {
    return { ok: false, installMode: options.installMode, installedDependencies, steps };
  }
  const build = await runStep("build", process.execPath, [cliEntry, "build"], appRoot2, {
    ...process.env,
    NODE_ENV: "production"
  });
  steps.push(build);
  return { ok: build.ok, installMode: options.installMode, installedDependencies, steps };
}
function printHumanResult(result) {
  for (const step of result.steps) {
    console.log(`[glaze] ${step.ok ? "PASS" : "FAIL"} ${step.name} (${step.durationMs}ms)`);
    if (step.stdout) process.stdout.write(step.stdout);
    if (step.stderr) process.stderr.write(step.stderr);
  }
  console.log(result.ok ? "[glaze] Verification complete" : "[glaze] Verification failed");
}
var verify_default = defineCommand({
  name: "verify",
  description: "Install if needed, lint, type-check, and build",
  async execute({ appRoot: appRoot2, args }) {
    const options = parseVerifyOptions(args);
    const result = await runVerification(appRoot2, options);
    if (options.json) console.log(JSON.stringify(result, null, 2));
    else printHumanResult(result);
    if (!result.ok) process.exitCode = 1;
  }
});

// cli/commands/index.ts
var allCommands = [
  build_default,
  dev_default,
  dev_renderer_default,
  start_default,
  lint_default,
  format_default,
  type_check_default,
  verify_default,
  launch_default,
  update_bundle_default,
  repackage_default
];
var commands = new Map(allCommands.map((cmd) => [cmd.name, cmd]));

// cli/sdk-hook.ts
import { register } from "node:module";
import { existsSync as existsSync10, readFileSync as readFileSync3 } from "node:fs";
import { join as join10 } from "node:path";
import { pathToFileURL } from "node:url";
function registerSdkResolveHook() {
  const sdkPath = process.env.GLAZE_SDK_PATH;
  if (!sdkPath) return;
  try {
    let sdkCoreDir;
    const sdkRootPkg = join10(sdkPath, "@glaze", "core", "package.json");
    const directPkg = join10(sdkPath, "package.json");
    if (existsSync10(sdkRootPkg)) {
      sdkCoreDir = join10(sdkPath, "@glaze", "core");
    } else if (existsSync10(directPkg)) {
      const directMeta = JSON.parse(readFileSync3(directPkg, "utf-8"));
      if (directMeta.name !== "@glaze/core") return;
      sdkCoreDir = sdkPath;
    } else {
      return;
    }
    const pkg = JSON.parse(readFileSync3(join10(sdkCoreDir, "package.json"), "utf-8"));
    const resolutionMap = {};
    for (const [subpath, entry] of Object.entries(pkg.exports || {})) {
      const importPath = typeof entry === "string" ? entry : entry?.import;
      if (importPath && !importPath.endsWith(".css")) {
        const specifier = subpath === "." ? "@glaze/core" : "@glaze/core" + subpath.slice(1);
        resolutionMap[specifier] = pathToFileURL(join10(sdkCoreDir, importPath)).href;
      }
    }
    register(
      "data:text/javascript," + encodeURIComponent(
        "let m;export function initialize(d){m=d.resolutionMap}export async function resolve(s,c,n){return m?.[s]?{url:m[s],shortCircuit:true}:n(s,c)}"
      ),
      { parentURL: import.meta.url, data: { resolutionMap } }
    );
  } catch (e) {
    console.warn("[glaze] SDK resolve hook setup failed:", e?.message ?? e);
  }
}

// cli/main.ts
var __dirname = dirname4(fileURLToPath(import.meta.url));
var coreRoot = resolve3(__dirname, "..");
if (!process.env.GLAZE_SDK_PATH) {
  const sdkPath = resolve3(__dirname, "../../..");
  if (existsSync11(join11(sdkPath, "@glaze", "core", "package.json"))) {
    process.env.GLAZE_SDK_PATH = sdkPath;
  } else {
    process.env.GLAZE_SDK_PATH = coreRoot;
  }
}
registerSdkResolveHook();
var commandName = process.argv[2];
var appRoot = process.cwd();
if (!commandName || commandName === "help") {
  printHelp();
} else {
  const cmd = commands.get(commandName);
  if (!cmd) {
    printHelp(commandName);
  } else {
    cmd.execute({ appRoot, coreRoot, args: process.argv.slice(3) }).catch((err) => {
      console.error("[glaze] Fatal error:", err);
      process.exit(1);
    });
  }
}
function printHelp(unknown) {
  const log = unknown ? console.error : console.log;
  if (unknown) {
    log(`[glaze] Unknown command: ${unknown}
`);
  }
  log("Usage: glaze <command>\n");
  log("Commands:");
  for (const cmd of commands.values()) {
    log(`  ${cmd.name.padEnd(16)} ${cmd.description}`);
  }
  log(`  ${"help".padEnd(16)} Show this help message`);
  process.exit(unknown ? 1 : 0);
}
