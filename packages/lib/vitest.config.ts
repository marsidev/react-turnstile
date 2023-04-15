import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['./test/**/*.{test,spec}.{ts,mts,cts,tsx}'],
		reporters: 'verbose',
		setupFiles: [resolve(__dirname, 'test/vitest.setup.ts')]
	}
})
