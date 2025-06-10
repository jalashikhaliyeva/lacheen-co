/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["az", "en"], 
    defaultLocale: "az", 
    localeDetection: false,
   
  },
  images: {
  domains: ["firebasestorage.googleapis.com"],
}

};

export default nextConfig;
