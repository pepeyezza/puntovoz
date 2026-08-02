"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type BannerImage = { url: string; caption?: string };

type Props = {
  eyebrow?: string;
  title?: string;
  description?: string;
  bannerImages?: BannerImage[];
};

const WAVE_HEIGHTS = [30, 55, 40, 70, 45, 90, 60, 35, 75, 50, 65, 40, 85, 55, 30, 60, 45, 70, 50, 38];

export default function Hero({
  eyebrow = "Voz propia, mirada local",
  title = "Pensar, divulgar, informar.",
  description = "Editoriales, audios y datos sobre desarrollo local, educación, tecnología y cultura.",
  bannerImages = [],
}: Props) {
  const [actual, setActual] = useState(0);

  useEffect(() => {
    if (bannerImages.length <= 1) return;
    const t = setInterval(() => setActual((p) => (p + 1) % bannerImages.length), 5000);
    return () => clearInterval(t);
  }, [bannerImages.length]);

  return (
    <div className="relative overflow-hidden bg-principal">
      {/* Textura sutil */}
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(244,169,0,0.035) 0, rgba(244,169,0,0.035) 1px, transparent 1px, transparent 22px)" }} />

      {/* Línea de acento lateral derecha */}
      <div className="absolute right-0 top-0 bottom-0 w-[3px]" style={{ background: "linear-gradient(to bottom, #f4a900, #c87a62)" }} />

      {/* Imágenes de banner (si hay) como fondo con overlay */}
      {bannerImages.length > 0 && bannerImages.map((img, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === actual ? "opacity-30" : "opacity-0"}`}>
          <Image src={img.url} alt={img.caption || ""} fill className="object-cover" priority={i === 0} />
        </div>
      ))}

      {/* Contenido */}
      <div className="relative mx-auto grid max-w-editorial gap-6 px-5 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:px-8 lg:py-14">
        <div>
          {/* Eyebrow badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-acento/30 bg-acento/20 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-acento" />
            <span className="text-xs font-semibold uppercase tracking-widest text-acento">{eyebrow}</span>
          </div>

          <h1 className="font-display text-5xl font-medium leading-none tracking-tight text-secundario lg:text-6xl">
            {title.split(",").map((part, i, arr) => (
              <span key={i}>{part.trim()}{i < arr.length - 1 ? "," : ""}{i < arr.length - 1 && <br />}</span>
            ))}
          </h1>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-secundario/50">{description}</p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <Link href="/editoriales" className="rounded-full bg-acento px-6 py-3 text-sm font-semibold text-secundario transition-opacity hover:opacity-90">
              Últimas notas
            </Link>
            <Link href="/observatorio" className="rounded-full bg-joven px-6 py-3 text-sm font-semibold text-principal transition-opacity hover:opacity-90">
              Data
            </Link>
            <Link href="/colaboradores" className="rounded-full border border-secundario/25 px-6 py-3 text-sm font-semibold text-secundario transition-colors hover:bg-secundario/10">
              Colaboradores
            </Link>
          </div>
        </div>

        {/* Barras */}
        <div className="flex items-end justify-center gap-1.5 lg:h-56 lg:justify-end lg:pr-6">
          <div className="flex h-36 items-end gap-1.5 lg:h-full">
            {WAVE_HEIGHTS.map((h, i) => (
              <span key={i} className="w-2 rounded-full lg:w-3"
                style={{ height: `${h}%`, backgroundColor: i % 5 === 0 ? "#f4a900" : i % 3 === 0 ? "#c87a62" : "rgba(245,242,235,0.12)" }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Pie del banner */}
      {bannerImages.length > 0 && (
        <div className="relative mx-auto flex max-w-editorial items-center justify-between px-5 pb-4 lg:px-8">
          <span className="text-xs text-secundario/25">
            {bannerImages[actual]?.caption && `📍 ${bannerImages[actual].caption}`}
          </span>
          {bannerImages.length > 1 && (
            <div className="flex gap-1.5">
              {bannerImages.map((_, i) => (
                <button key={i} onClick={() => setActual(i)}
                  className={`h-1.5 rounded-full transition-all ${i === actual ? "w-5 bg-joven" : "w-1.5 bg-secundario/25"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
