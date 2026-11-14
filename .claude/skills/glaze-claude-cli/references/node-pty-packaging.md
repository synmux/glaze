# node-pty Packaging

Add `node-pty` to dependencies and externalize it in `glaze.config.ts`. Glaze backend builds use esbuild: use `setup(build)` with `build.onEnd(...)`; Rollup/Vite hooks such as `closeBundle` do not run. Put `external` and `plugins` under `build`.

On Node 24, `node-pty` usually installs from prebuilt binaries. Do not add native-build handling unless installation actually fails.

```ts
import { defineConfig, externalizePackage } from "@glaze/core/build";
import fs from "fs";
import path from "path";

const nodePty = externalizePackage("node-pty");

function getBuildOutDir() {
  if (process.env.GLAZE_BUILD_OUT_DIR) {
    return path.resolve(process.cwd(), process.env.GLAZE_BUILD_OUT_DIR);
  }

  const runtimeBuildDir = path.resolve(process.cwd(), "../runtime/build");
  if (fs.existsSync(path.dirname(runtimeBuildDir))) return runtimeBuildDir;
  return path.resolve(process.cwd(), "build");
}

function chmodSpawnHelpers(root: string) {
  if (!fs.existsSync(root)) return;

  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      chmodSpawnHelpers(entryPath);
      continue;
    }
    if (entry.name === "spawn-helper") {
      fs.chmodSync(entryPath, 0o755);
    }
  }
}

export default defineConfig({
  build: {
    external: [...nodePty.externals],
    plugins: [
      nodePty.plugin,
      {
        name: "fix-node-pty-spawn-helper-exec-bit",
        setup(build) {
          build.onEnd(() => {
            chmodSpawnHelpers(path.join(getBuildOutDir(), "main", "node_modules", "node-pty"));
          });
        },
      },
    ],
  },
});
```
