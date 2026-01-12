/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // PWA config would go here with next-pwa if we added it, 
    // keeping it simple for now.
    images: {
        domains: ['lh3.googleusercontent.com'], // For Google Profile user images
    },
};

module.exports = nextConfig;
