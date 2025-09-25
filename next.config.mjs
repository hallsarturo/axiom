/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'localhost',
                port: '4010',
                pathname: '/uploads/**',
            },
            {
                protocol: 'https',
                hostname: '.axiomlab.space',
                port: '4010',
                pathname: '/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.buymeacoffee.com',
            },
            {
                protocol: 'https',
                hostname: 'tailwindcss.com',
            },
        ],
    },
};

export default nextConfig;
