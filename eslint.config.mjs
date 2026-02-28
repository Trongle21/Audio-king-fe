import typescriptEslint from "@typescript-eslint/eslint-plugin"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import importPlugin from "eslint-plugin-import"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import { defineConfig, globalIgnores } from "eslint/config"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    plugins: {
      react,
      "react-refresh": reactRefresh,
      "react-hooks": reactHooks,
      "@typescript-eslint": typescriptEslint,
      import: importPlugin,
    },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { 
          allowConstantExport: true,
        },
      ],
      "@next/next/no-img-element": "warn", // Cảnh báo nhưng không chặn, có thể dùng eslint-disable cho trường hợp đặc biệt
      semi: 0,
      "react/react-in-jsx-scope": 0,
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": 0,
      "@typescript-eslint/explicit-module-boundary-types": 0,
      "@typescript-eslint/ban-ts-comment": 0,
      "@typescript-eslint/no-var-requires": 0,
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-this-alias": 0,
      "@typescript-eslint/no-empty-function": 0,
      "no-await-in-loop": 2,
      "no-empty": [2, { allowEmptyCatch: true }],
      "prefer-const": 1,
      "import/no-anonymous-default-export": 0,
      "react/jsx-no-useless-fragment": 0,
      eqeqeq: 2,
      "no-empty-function": 0,
      "no-self-compare": 2,
      "no-undef": 0,
      "react/display-name": 0,
      "react/jsx-key": 1,
      "require-await": 0,
      "react-hooks/rules-of-hooks": 1,
      "react-hooks/exhaustive-deps": 1,
      "no-unreachable": 1,
      "react-refresh/only-export-components": "off",
      "import/extensions": [
        1,
        "ignorePackages",
        {
          "": "never",
          js: "never",
          jsx: "never",
          ts: "never",
          tsx: "never",
        },
      ],
      "import/newline-after-import": 1,
      "import/no-namespace": "off", // Cảnh báo nhưng không chặn, import * as React là pattern phổ biến
      "import/order": [
        1,
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["sibling", "parent"],
            "index",
            "object",
            "type",
            "unknown",
          ],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
            {
              pattern: "@(?!/).*", // scoped-package
              group: "external",
              position: "after",
            },
            {
              pattern: "@/*",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@/*",
              group: "type",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["react", "next"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  // Override cho Next.js app directory files - cho phép export metadata cùng với components
  {
    files: ["app/**/*.tsx", "app/**/*.ts"],
    rules: {
      "react-refresh/only-export-components": "off", // Tắt rule này cho Next.js pages/layouts
    },
  },
])

export default eslintConfig
