import { readFileSync } from "node:fs";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const libPkg = JSON.parse(
  readFileSync(new URL("../packages/lib/package.json", import.meta.url), "utf8")
) as { version: string };

export default defineConfig({
  define: {
    __LIB_VERSION__: JSON.stringify(libPkg.version)
  },
  resolve: {
    tsconfigPaths: true
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    tanstackStart(),
    viteReact()
  ]
});
