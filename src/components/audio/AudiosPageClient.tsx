"use client";

import { useMemo, useState } from "react";
import AudioCard from "@/components/audio/AudioCard";

const CATEGORIAS = ["Todas", "Educación", "Tecnología", "Cultura", "Política", "Producción", "Comunidad"];

type AudioItem = {
  slug: string;
  title: string;
  description: string;
  spotifyUrl: string;
  category: string;
  date: string;
};

type Props = {
  header: { eyebrow: string; title: string; description?: string };
  audios: AudioItem[];
};

export default function AudiosPageClient({ header, audios: allAudios }: Props) {
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  const audios = useMemo(() => {
    return allAudios.filter((a) => {
      const coincideCategoria = categoria === "Todas" || a.category === categoria;
      const coincideQuery =
        query.trim() === "" ||
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.description.toLowerCase().includes(query.toLowerCase());
      return coincideCategoria && coincideQuery;
    });
  }, [query, categoria, allAudios]);

  return (
    <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
      <header className="max-w-2xl">
        <p className="eyebrow text-acento">{header.eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl">{header.title}</h1>
        <p className="mt-4 text-principal/70">{header.description}</p>
      </header>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative flex-1 sm:max-w-sm">
          <span className="sr-only">Buscar audios</span>
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

      {audios.length === 0 ? (
        <p className="mt-12 text-principal/60">No encontramos audios que coincidan con la búsqueda.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {audios.map((a) => (
            <AudioCard key={a.slug} title={a.title} description={a.description} spotifyUrl={a.spotifyUrl} date={a.date} />
          ))}
        </div>
      )}
    </section>
  );
}
