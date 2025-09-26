/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        domains: ['api.axiomlab.space'], // Add your API domain here
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.axiomlab.space',
                pathname: '/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.buymeacoffee.com', // Added pattern for Buy Me A Coffee
                pathname: '/buttons/**',
            },
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'tailwindcss.com',
            },
        ],
    },
    // Add security headers
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Credentials',
                        value: 'true',
                    },
                ],
            },
        ];
    },
};
// const nextConfig = {
//     images: {
//         remotePatterns: [
//             {
//                 protocol: 'https',
//                 hostname: 'localhost',
//                 port: '4010',
//                 pathname: '/uploads/**',
//             },
//             {
//                 protocol: 'https',
//                 hostname: 'api.axiomlab.space',
//                 port: '',
//                 pathname: '/uploads/**',
//             },
//             {
//                 protocol: 'https',
//                 hostname: 'axiomlab.space',
//                 pathname: '/**',
//             },
//             {
//                 protocol: 'https',
//                 hostname: 'picsum.photos',
//                 pathname: '/**',
//             },
//             {
//                 protocol: 'https',
//                 hostname: 'cdn.buymeacoffee.com',
//             },
//             {
//                 protocol: 'https',
//                 hostname: 'tailwindcss.com',
//             },
//         ],
//     },
// };

export default nextConfig;
