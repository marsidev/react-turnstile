import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

const r = (p: string) => resolve(__dirname, p)

export default defineConfig({
	test: {
		globals: false,
		reporters: 'verbose',
		environment: 'node'
	},
	root: r('./test')
})
