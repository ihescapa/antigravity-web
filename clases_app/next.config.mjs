/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: false,
    experimental: {
        serverComponentsExternalPackages: ['fs', 'path']
    },
    webpack: (config) => {
        config.resolve.alias.canvas = false;

        // Agregar soporte para leer el worker de react-pdf
        config.module.rules.push({
            test: /pdf\.worker\.(min\.)?js/,
            type: 'asset/resource',
            generator: {
                filename: 'static/worker/[hash][ext][query]'
            }
        });

        return config;
    }
};

export default nextConfig;
