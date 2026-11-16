/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Demo listing imagery. Replace with the real CDN host before launch.
      { protocol: "https", hostname: "images.unsplash.com" },
      // Wikimedia Commons — the demo photos are CC-licensed works served from
      // these two hosts (thumb.* for resized derivatives, upload.* for originals).
      { protocol: "https", hostname: "thumb.wikimedia.org" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
};

export default nextConfig;
