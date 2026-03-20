import { defineConfig } from "bumpp";

export default defineConfig({
  all: true,
  push: false,
  tag: true,
  commit: true,
  recursive: true,
  confirm: true,
  files: ["package.json", "skills/**/SKILL.md", "README.md", "_artifacts/*.{yaml,md}"]
});
