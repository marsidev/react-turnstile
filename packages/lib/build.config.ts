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
				output.banner = "'use client';"
			})
		}
	}
})
