"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type BannerImage = { url: string; caption?: string };

type Props = { images: BannerImage[] };

export default function BannerCarousel({ images }: Props) {
  const [actual, setActual] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setActual((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="relative h-48 w-full overflow-hidden bg-principal sm:h-64 lg:h-80">
      {images.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === actual ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={img.url}
            alt={img.caption || `Chascomús ${i + 1}`}
            fill
            className="object-cover"
            priority={i === 0}
          />
          {/* Degradado inferior suave */}
          <div className="absolute inset-0 bg-gradient-to-t from-principal/40 to-transparent" />
        </div>
      ))}

      {/* Caption */}
      {images[actual]?.caption && (
        <p className="absolute bottom-3 left-5 text-xs font-medium text-secundario/80 drop-shadow">
          {images[actual].caption}
        </p>
      )}

      {/* Indicadores */}
      {images.length > 1 && (
        <div className="absolute bottom-3 right-5 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActual(i)}
              aria-label={`Foto ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === actual ? "w-5 bg-joven" : "w-1.5 bg-secundario/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
