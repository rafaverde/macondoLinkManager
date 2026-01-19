const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Servidor de imagens do Google
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com", // Fallback para outros servidores Google
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
