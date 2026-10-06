// @ts-check

import { createRequire } from "node:module";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const appRequire = createRequire(resolve(process.cwd(), "package.json"));
const coreRequire = createRequire(import.meta.url);

function resolveToolingPath(specifier) {
  try {
    return appRequire.resolve(specifier);
  } catch {
    try {
      return coreRequire.resolve(specifier);
    } catch {
      throw new Error(
        `[glaze] Missing lint dependency "${specifier}". Install app dependencies in ${process.cwd()} (npm install).`,
      );
    }
  }
}

async function importToolingModule(specifier) {
  const resolvedPath = resolveToolingPath(specifier);
  return import(pathToFileURL(resolvedPath).href);
}

function resolveModuleDefault(mod) {
  return mod.default ?? mod;
}

const js = resolveModuleDefault(await importToolingModule("@eslint/js"));
const typescript = resolveModuleDefault(await importToolingModule("@typescript-eslint/eslint-plugin"));
const typescriptParser = resolveModuleDefault(await importToolingModule("@typescript-eslint/parser"));
const importPlugin = resolveModuleDefault(await importToolingModule("eslint-plugin-import"));
const globals = resolveModuleDefault(await importToolingModule("globals"));

export default [
  // Base JavaScript recommendations
  js.configs.recommended,

  // Add specific ignores for glaze apps
  {
    ignores: [
      "build/**",
      "**/dist/**",
      "node_modules/**",
      "*.config.js",
      "*.config.ts",
      // Framework code - should not be linted or modified by AI agents
      "**/sdk/**",
      // External-agent instructions and skills are project resources, not app source.
      ".claude/**",
      ".agents/**",
      ".cursor/**",
    ],
  },

  // Relax rules for AI-friendly development - JavaScript files
  {
    files: ["**/*.js", "**/*.jsx"],
    plugins: {
      import: importPlugin,
    },
    rules: {
      // Allow unused variables with underscore prefix (common in AI code)
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_+",
          varsIgnorePattern: "^_+",
          ignoreRestSiblings: true,
          caughtErrors: "none",
        },
      ],

      // Allow default exports (common in React and template files)
      "import/no-default-export": "off",

      // Allow unassigned imports (CSS imports, etc.)
      "import/no-unassigned-import": "off",

      // Make import order warnings instead of errors (very relaxed for AI)
      "import/order": "off",
      "import/newline-after-import": "off",
      "import/first": "warn",
    },
  },

  // Relax rules for AI-friendly development - TypeScript files
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      import: importPlugin,
    },
    rules: {
      // Allow any types since AI often needs flexibility
      "@typescript-eslint/no-explicit-any": "off",

      // Make accessibility modifiers optional
      "@typescript-eslint/explicit-member-accessibility": "off",

      // Allow unused variables with underscore prefix (common in AI code)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_+",
          varsIgnorePattern: "^_+",
          ignoreRestSiblings: true,
          caughtErrors: "none",
          // Allow unused variables in destructuring (common in AI code)
          destructuredArrayIgnorePattern: "^_+",
        },
      ],

      // Allow default exports (common in React and template files)
      "import/no-default-export": "off",

      // Allow unassigned imports (CSS imports, etc.)
      "import/no-unassigned-import": "off",

      // Make import order warnings instead of errors (very relaxed for AI)
      "import/order": "off",
      "import/newline-after-import": "off",
      "import/first": "warn",

      // Basic rules
      "no-unused-vars": "off", // Use TypeScript version instead
      "prefer-const": "warn",
      "no-unreachable": "off", // Allow unreachable code (common in AI-generated code)
    },
  },

  // Node.js environment for main process files
  {
    files: ["main/**/*.ts", "main/**/*.js", "glaze.ts", "glaze.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        // TypeScript NodeJS namespace (for type definitions like NodeJS.Timeout, NodeJS.ErrnoException)
        NodeJS: "readonly",
      },
    },
  },

  // Browser environment for renderer files
  {
    files: ["renderer/**/*.ts", "renderer/**/*.tsx", "renderer/**/*.js", "renderer/**/*.jsx"],
    languageOptions: {
      globals: {
        ...globals.browser,
        __REACT_DEVTOOLS_GLOBAL_HOOK__: "readonly",
        IS_REACT_ACT_ENVIRONMENT: "readonly",
        MSApp: "readonly",
        // Vite global constants
        __APP_DISPLAY_NAME__: "readonly",
        NodeJS: "readonly",
      },
    },
  },

  // Prevent imports of framework-internal APIs.
  // These symbols are auto-bootstrapped by the runtime and must not be used
  // in app code. They exist in the barrel for backward compatibility with
  // legacy apps only. The @glaze/core/backend/internal entrypoint is reserved
  // for the Glaze host app (main-app).
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@glaze/core/backend/internal",
              message:
                "Do not import from @glaze/core/backend/internal. This entrypoint is reserved for the Glaze host app.",
            },
            {
              name: "@glaze/core/backend/internal/network",
              message:
                "Do not import from @glaze/core/backend/internal/network. Runtime networking is configured by Glaze.",
            },
            {
              name: "@glaze/core/backend/internal/network-runtime",
              message:
                "Do not import from @glaze/core/backend/internal/network-runtime. Runtime networking is configured by Glaze.",
            },
            {
              name: "@glaze/core/backend",
              importNames: [
                "GlazeIPCServer",
                "GlazeLifecycle",
                "childProcessTracker",
                "backendNativeBridge",
                "registerNativeApiHandlers",
                "wireProtocolHandlers",
              ],
              message: "This is a framework internal handled by auto-bootstrap. Do not use it in app code.",
            },
          ],
        },
      ],
    },
  },

  // SECURITY: Prevent direct ipcRenderer imports in renderer code (except preload.ts)
  // Renderer code must use window.glazeAPI instead
  // NOTE: This block also re-declares the framework-internal restrictions because
  // ESLint flat config replaces (not merges) earlier no-restricted-imports values.
  {
    files: ["renderer/**/*.ts", "renderer/**/*.tsx"],
    ignores: ["renderer/preload.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@glaze/core/preload",
              message:
                "Do not import from @glaze/core/preload in renderer code. Use window.glazeAPI instead. Only renderer/preload.ts should import from @glaze/core/preload.",
            },
            {
              name: "@glaze/core/backend/internal",
              message:
                "Do not import from @glaze/core/backend/internal. This entrypoint is reserved for the Glaze host app.",
            },
            {
              name: "@glaze/core/backend/internal/network",
              message:
                "Do not import from @glaze/core/backend/internal/network. Runtime networking is configured by Glaze.",
            },
            {
              name: "@glaze/core/backend/internal/network-runtime",
              message:
                "Do not import from @glaze/core/backend/internal/network-runtime. Runtime networking is configured by Glaze.",
            },
            {
              name: "@glaze/core/backend",
              importNames: [
                "GlazeIPCServer",
                "GlazeLifecycle",
                "childProcessTracker",
                "backendNativeBridge",
                "registerNativeApiHandlers",
                "wireProtocolHandlers",
              ],
              message: "This is a framework internal handled by auto-bootstrap. Do not use it in app code.",
            },
          ],
          patterns: [
            {
              group: ["@glaze/core/preload"],
              message: "Do not import from @glaze/core/preload in renderer code. Use window.glazeAPI instead.",
            },
          ],
        },
      ],
    },
  },
];
