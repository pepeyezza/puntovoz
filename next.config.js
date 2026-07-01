/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  // Deshabilitar generación estática para todas las páginas
  // ya que el proyecto usa Prisma (base de datos) en casi todas las rutas
  output: undefined,
};

module.exports = nextConfig;
