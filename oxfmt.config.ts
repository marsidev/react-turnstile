import { defineConfig } from "oxfmt";

export default defineConfig({
  semi: true,
  useTabs: false,
  singleQuote: false,
  jsxSingleQuote: false,
  trailingComma: "none",
  tabWidth: 2,
  arrowParens: "avoid",
  printWidth: 100,
  ignorePatterns: [".vscode", "dist", ".next", "*.yaml", "*.yml", "*.css", "*.md", "*.mdx"]
});
