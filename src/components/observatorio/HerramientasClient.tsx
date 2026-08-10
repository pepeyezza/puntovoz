"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Search, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIAS_HERRAMIENTAS } from "@/lib/herramientas";

type Herramienta = {
  id: string;
  nombre: string;
  descripcion: string | null;
  categoria: string;
  logoUrl: string | null;
  enlace: string;
  destacada: boolean;
};

type Props = { herramientas: Herramienta[]; paginado?: boolean };

const CAT_COLOR: Record<string, { bg: string; text: string }> = {
  "IA":                         { bg: "#ede9fe", text: "#6d28d9" },
  "Comunicacion e Interaccion": { bg: "#fce7f3", text: "#9d174d" },
  "Productividad y Ofimatica":  { bg: "#fff7e6", text: "#b45309" },
  "Gestion y Organizacion":     { bg: "#e8f5e9", text: "#2d6a4f" },
  "Otros":                      { bg: "#f1f5f9", text: "#475569" },
};

function getColor(cat: string) {
  return CAT_COLOR[cat] ?? { bg: "#f1f5f9", text: "#475569" };
}

const POR_PAGINA = 8;

export default function HerramientasClient({ herramientas, paginado = false }: Props) {
  const [query, setQuery] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [pagina, setPagina] = useState(0);

  const filtradas = useMemo(() => {
    setPagina(0);
    return herramientas.filter((h) => {
      const cat = categoriaActiva === "Todas" || h.categoria === categoriaActiva;
      const q = query.trim() === "" || h.nombre.toLowerCase().includes(query.toLowerCase()) || (h.descripcion ?? "").toLowerCase().includes(query.toLowerCase());
      return cat && q;
    });
  }, [herramientas, query, categoriaActiva]);

  const totalPags = Math.ceil(filtradas.length / POR_PAGINA);
  const slice = paginado ? filtradas.slice(pagina * POR_PAGINA, pagina * POR_PAGINA + POR_PAGINA) : filtradas;

  return (
    <>
      {/* Buscador */}
      <div className="mt-8 relative max-w-sm">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-principal/40" />
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar herramienta..."
          className="w-full rounded-lg border border-principal/20 bg-secundario/70 py-2.5 pl-10 pr-5 text-sm outline-none focus-visible:border-principal" />
      </div>

      {/* Filtros */}
      <div className="mt-4 flex flex-wrap gap-2">
        {["Todas", ...CATEGORIAS_HERRAMIENTAS].map((cat) => (
          <button key={cat} onClick={() => setCategoriaActiva(cat)}
            className={`rounded-lg border px-4 py-1.5 text-xs font-medium transition-colors ${
              categoriaActiva === cat ? "border-principal bg-principal text-secundario" : "border-principal/20 hover:border-principal/50"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtradas.length === 0 ? (
        <p className="mt-10 text-principal/50">No encontramos herramientas que coincidan.</p>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {slice.map((h) => {
              const { bg, text } = getColor(h.categoria);
              return (
                <a key={h.id} href={h.enlace} target="_blank" rel="noreferrer"
                  className="group flex flex-col rounded-2xl border border-principal/10 bg-secundario/60 p-5 transition-all hover:border-principal/25 hover:bg-secundario hover:shadow-sm">
                  {/* Logo */}
                  {h.logoUrl ? (
                    <div className="relative mb-3 h-12 w-12 overflow-hidden rounded-xl border border-principal/10 bg-white">
                      <Image src={h.logoUrl} alt={h.nombre} fill className="object-contain p-1.5" />
                    </div>
                  ) : (
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl font-display text-xl font-bold"
                      style={{ background: bg, color: text }}>
                      {h.nombre.charAt(0)}
                    </div>
                  )}
                  {/* Nombre */}
                  <div className="flex items-start justify-between gap-1">
                    <p className="font-display text-base font-medium leading-snug">{h.nombre}</p>
                    <ExternalLink size={12} className="mt-0.5 shrink-0 text-principal/25 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  {/* Descripción */}
                  {h.descripcion && (
                    <p className="mt-2 flex-1 text-xs text-principal/55 line-clamp-3">{h.descripcion}</p>
                  )}
                  {/* Badge categoría */}
                  <span className="mt-3 inline-block rounded-lg px-2.5 py-1 text-xs font-medium"
                    style={{ background: bg, color: text }}>
                    {h.categoria}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Paginación */}
          {paginado && totalPags > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-xs text-principal/40">
                {pagina * POR_PAGINA + 1}–{Math.min((pagina + 1) * POR_PAGINA, filtradas.length)} de {filtradas.length} herramientas
              </p>
              <div className="flex gap-2">
                <button onClick={() => setPagina((p) => Math.max(0, p - 1))} disabled={pagina === 0}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-principal/15 text-principal/50 disabled:opacity-30 hover:border-acento hover:text-acento transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => setPagina((p) => Math.min(totalPags - 1, p + 1))} disabled={pagina >= totalPags - 1}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-principal/15 text-principal/50 disabled:opacity-30 hover:border-acento hover:text-acento transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
