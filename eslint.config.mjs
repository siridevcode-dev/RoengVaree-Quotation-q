import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

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
    rules: {
      // API boundaries and dynamic JSON data legitimately use `any`
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/exhaustive-deps": "off",
      // App serves dynamic uploaded images; next/image is not suitable here
      "@next/next/no-img-element": "off",
      // Syncing local state from props/context in effects is a valid React pattern
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
