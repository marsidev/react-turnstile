module.exports = {
	extends: ['plugin:react-hooks/recommended', 'marsi/react-ts', 'prettier'],
	rules: {
		'no-control-regex': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'jsx-quotes': ['warn', 'prefer-double']
	}
}
