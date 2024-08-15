import { defineConfig } from 'tsup'

export default defineConfig({
	bundle: true,
	clean: true,
	dts: true,
	minify: true,
	treeshake: true,
	splitting: false,
	entry: ['src/index.ts'],
	format: 'esm',
	banner: {
		js: "'use client';"
	},
	outDir: 'dist'
})
