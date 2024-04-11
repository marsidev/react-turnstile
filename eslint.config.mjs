import antfu from '@antfu/eslint-config'

export const config = {
	react: true,
	jsonc: false,
	yaml: false,
	stylistic: {
		indent: 'tab',
		quotes: 'single',
		semi: false
	},
	rules: {
		curly: ['error', 'multi-line'],
		'no-console': 'off',
		'dot-notation': 'off',
		'antfu/if-newline': 'off',
		'style/comma-dangle': ['warn', 'never'],
		'style/arrow-parens': ['warn', 'as-needed'],
		'style/operator-linebreak': 'off',
		'style/brace-style': 'off',
		'style/indent': 'off',
		'style/indent-binary-ops': 'off',
		'style/quote-props': 'off',
		'style/jsx-one-expression-per-line': 'off',
		'style/member-delimiter-style': [
			'error',
			{
				multiline: {
					delimiter: 'none',
					requireLast: true
				},
				multilineDetection: 'brackets',
				singleline: {
					delimiter: 'semi',
					requireLast: false
				}
			}
		],
		'jsdoc/require-returns-description': 'off',
		'jsdoc/check-param-names': 'off',
		'jsdoc/require-returns-check': 'off',
		'react-refresh/only-export-components': 'off',
		'react/prop-types': 'off'
	}
}

export default antfu(config)
