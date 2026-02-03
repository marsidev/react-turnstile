const path = require('node:path')

/** @type {import('next').NextConfig} */
const nextConfig = {
	turbopack: {
		root: path.join(__dirname, '../..'),
	},
	async redirects () {
		return [
			{
				source: '/',
				destination: '/basic',
				permanent: true
			}
		]
	}
}

module.exports = nextConfig
