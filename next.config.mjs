/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Provide fallbacks for Node.js built-in modules
    if (!isServer) {
      // We can also add modules to externals if fallbacks don't work
      config.externals.push('encoding', 'fs');
      
      config.resolve.fallback = {
        // fs: false, // Or 'empty' if using Webpack 4 - might be handled by externals now
        // encoding: false, // Or 'empty' if using Webpack 4 - might be handled by externals now
        // Refer to the installed browser polyfill packages directly
        path: 'path-browserify',
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
      };
    }

    return config;
  },
}

export default nextConfig
