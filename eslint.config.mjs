// eslint.config.js
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    // ----------------------------------------------------------------
    // นี่คือส่วนสำคัญที่สุด: บอกให้ ESLint ไม่ต้องตรวจโฟลเดอร์เหล่านี้
    // ----------------------------------------------------------------
    ignores: [
      ".next/",
      "node_modules/",
      "dist/",
      "app/generated/prisma/**/*", // <--- เพิ่มบรรทัดนี้
    ],
  },
  // การตั้งค่าอื่นๆ ของ ESLint (อาจแตกต่างกันไปในแต่ละโปรเจกต์)
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "next": nextPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: true,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      // ใส่ rules อื่นๆ ของคุณตรงนี้
    },
  },
];