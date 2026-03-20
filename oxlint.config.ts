import { defineConfig } from 'oxlint'

export default defineConfig({
	plugins: ['import', 'typescript', 'react', 'jsx-a11y', 'unicorn', 'promise'],
	env: {
		browser: true,
		node: true,
		es2024: true
	},
	options: {
		typeAware: true
	},
	globals: {
		document: 'readonly',
		navigator: 'readonly',
		window: 'readonly'
	},
	settings: {
		jsx: true
	},
	rules: {
		'import/no-unresolved': 'off',
		'no-control-regex': 'off',
		'no-unused-expressions': 'off',
		'typescript/no-non-null-assertion': 'off',
		'jsx-quotes': ['warn', 'prefer-double'],
		'react-hooks/exhaustive-deps': 'off'
	},
	ignorePatterns: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/coverage/**', '**/*.d.ts']
})
