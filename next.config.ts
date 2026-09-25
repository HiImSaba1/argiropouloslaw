import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: { cpus: 1 },
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/αρχικη", destination: "/", permanent: true },
      { source: "/contact", destination: "/epikoinonia", permanent: true },
      { source: "/επικοινωνία-2", destination: "/epikoinonia", permanent: true },
      { source: "/biography", destination: "/viografiko", permanent: true },
      { source: "/our-office", destination: "/about-us", permanent: true },
      { source: "/privacy-policy", destination: "/politiki-aporritou", permanent: true },
      { source: "/services", destination: "/ypiresies", permanent: true },
      { source: "/2025/01/09/about-us", destination: "/about-us", permanent: true },
      { source: "/2025/01/09/services", destination: "/ypiresies", permanent: true },
      { source: "/2025/01/09/contact", destination: "/epikoinonia", permanent: true },
      { source: "/2025/01/09/privacy-policy", destination: "/politiki-aporritou", permanent: true },
      { source: "/2025/03/18/αρχικη", destination: "/", permanent: true },
      { source: "/2025/03/18/επικοινωνία-2", destination: "/epikoinonia", permanent: true },
    ];
  },
};

export default nextConfig;
