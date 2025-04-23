/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["az", "en"], 
    defaultLocale: "az", 
    localeDetection: false,
   
  },
};

export default nextConfig;
