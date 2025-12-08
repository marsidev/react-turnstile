module.exports = {
	extends: ['marsi/react-ts', 'prettier'],
	rules: {
		'import/no-unresolved': 'off',
		'no-control-regex': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'jsx-quotes': ['warn', 'prefer-double'],
		'react-hooks/exhaustive-deps': 'off'
	}
}
