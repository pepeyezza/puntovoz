"use client";

import { useMemo, useState } from "react";
import VideoCard from "@/components/video/VideoCard";

const CATEGORIAS = ["Todas", "Educación", "Tecnología", "Cultura", "Política", "Producción", "Comunidad", "Emprendedurismo"];

type VideoItem = {
  slug: string;
  title: string;
  description: string;
  youtubeUrl: string;
  category: string;
  date: string;
};

type Props = {
  header: { eyebrow: string; title: string; description?: string };
  videos: VideoItem[];
};

export default function VideosPageClient({ header, videos: allVideos }: Props) {
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  const videos = useMemo(() => {
    return allVideos.filter((v) => {
      const coincideCategoria = categoria === "Todas" || v.category === categoria;
      const coincideQuery =
        query.trim() === "" ||
        v.title.toLowerCase().includes(query.toLowerCase()) ||
        v.description.toLowerCase().includes(query.toLowerCase());
      return coincideCategoria && coincideQuery;
    });
  }, [query, categoria, allVideos]);

  return (
    <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
      <header className="max-w-2xl">
        <p className="eyebrow text-acento">{header.eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl">{header.title}</h1>
        <p className="mt-4 text-principal/70">{header.description}</p>
      </header>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative flex-1 sm:max-w-sm">
          <span className="sr-only">Buscar videos</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título o tema…"
            className="w-full rounded-full border border-principal/15 bg-secundario px-5 py-2.5 text-sm outline-none focus-visible:border-acento"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                categoria === cat
                  ? "border-acento bg-acento text-secundario"
                  : "border-principal/15 hover:border-acento hover:text-acento"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {videos.length === 0 ? (
        <p className="mt-12 text-principal/60">No encontramos videos que coincidan con la búsqueda.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <VideoCard key={v.slug} title={v.title} description={v.description} youtubeUrl={v.youtubeUrl} date={v.date} />
          ))}
        </div>
      )}
    </section>
  );
}
