/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/*/**",
      },
      {
        protocol: "https",
        hostname: "s4.anilist.co",
        port: "",
        pathname: "/*/**",
      },
      {
        protocol: "https",
        hostname: "media.kitsu.app",
        port: "",
        pathname: "/*/**",
      },
    ],
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
