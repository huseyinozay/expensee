/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@fabrikant-masraff/masraff-react","@fabrikant-masraff/masraff-core"],
    excludeFile: (str) => str === 'layout.css',
}

module.exports = nextConfig
