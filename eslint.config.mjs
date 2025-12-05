import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: "readonly",
        JSX: "readonly",
        NodeJS: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "no-undef": "off", // TypeScript handles this
      "no-unused-vars": "off", // Use @typescript-eslint/no-unused-vars instead
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "public/**",
      "dist/**",
      "*.config.js",
      "*.config.mjs",
    ],
  },
];
