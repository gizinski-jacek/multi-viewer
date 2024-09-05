/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*ytimg.com',
				port: '',
			},
			{
				protocol: 'https',
				hostname: '*static-cdn.jtvnw.net',
				port: '',
			},
		],
	},
};

export default nextConfig;
