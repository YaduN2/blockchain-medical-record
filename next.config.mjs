/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'www.simsglobe.com',
            pathname: '*'
        },
    ],
},
};

export default nextConfig;
