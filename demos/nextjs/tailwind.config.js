const colors = require('tailwindcss/colors')

delete colors['lightBlue']
delete colors['warmGray']
delete colors['trueGray']
delete colors['coolGray']
delete colors['blueGray']

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			maxWidth: {
				'8xl': '90rem'
			}
		},
		colors: {
			...colors,
			dark: '#1d1f20',
			cloudflare: {
				50: '#fff8ed',
				100: '#feefd6',
				200: '#fcdbac',
				300: '#f9c078',
				400: '#f69b41',
				500: '#f38020',
				600: '#e46412',
				700: '#bd4b11',
				800: '#963c16',
				900: '#793315',
				950: '#411809'
			},
			'cloudflare-light': {
				50: '#fff9ed',
				100: '#fef2d6',
				200: '#fce0ac',
				300: '#fac977',
				400: '#f8ad4c',
				500: '#f58d1a',
				600: '#e67110',
				700: '#bf560f',
				800: '#984414',
				900: '#7a3a14',
				950: '#421c08'
			}
		}
	},
	darkMode: 'class',
	plugins: [require('@tailwindcss/typography')]
}
