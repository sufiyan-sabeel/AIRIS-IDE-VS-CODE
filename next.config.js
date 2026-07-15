/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const repoName = 'AIRIS-IDE-VS-CODE';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  // GitHub Pages serves from /repo-name/ subpath
  basePath: isGithubPages ? `/${repoName}` : undefined,
  assetPrefix: isGithubPages ? `/${repoName}/` : undefined,
  transpilePackages: ['monaco-editor', '@xterm/xterm', '@xterm/addon-fit'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false, path: false, os: false, crypto: false };
    }
    return config;
  },
};

module.exports = nextConfig;
