/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true
	},
	async redirects() {
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
