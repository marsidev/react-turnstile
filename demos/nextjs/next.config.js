/** @type {import('next').NextConfig} */
const nextConfig = {
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
