/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["res.cloudinary.com"],
    }, webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Custom error handling to ignore dynamic server usage errors
        if (!dev) {
            // Only modify webpack config for production build
            config.plugins.push(
                new webpack.IgnorePlugin({
                    resourceRegExp: /Dynamic server usage: Page couldn't be rendered statically because it used `cookies`/,
                })
            );
        }

        // Return the modified webpack configuration
        return config;
    },
};
module.exports = nextConfig;

