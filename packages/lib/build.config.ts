import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
	entries: ['src/index'],
	declaration: true,
	clean: true,
	rollup: {
		emitCJS: true
	},
	hooks: {
		'rollup:options': (_ctx, options) => {
			if (!Array.isArray(options.output)) {
				options.output = options.output ? [options.output] : []
			}

			options.output.forEach(output => {
				/* eslint-disable style/quotes */
				output.banner = "'use client';"
			})
		}
	}
})
