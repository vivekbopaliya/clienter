/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "********",
        NEXT_PUBLIC_CLOUDINARY_PRESET_NAME: "********"
    }, images: {
        domains: ["res.cloudinary.com"],
    },
};
module.exports = nextConfig;

module.exports = nextConfig
