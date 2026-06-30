/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Se permite cualquier dominio https, ya que las imágenes de portada se
    // pegan como URL (búsquedas, bancos de imágenes, etc.). Cuando se agregue
    // subida de imágenes desde el equipo, esto puede volver a restringirse.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

module.exports = nextConfig;
