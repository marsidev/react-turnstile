import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["esm"],
  dts: true,
  clean: true,
  minify: true,
  treeshake: true,
  banner: {
    js: "'use client';"
  },
  outExtensions: () => ({
    js: ".js",
    dts: ".d.ts"
  })
});
