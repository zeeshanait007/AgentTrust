import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  // No Next.js specific configs – using only global ignores to avoid missing modules
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
