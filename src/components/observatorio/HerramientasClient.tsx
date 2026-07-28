"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Search, ExternalLink } from "lucide-react";
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

type Props = { herramientas: Herramienta[] };

export default function HerramientasClient({ herramientas }: Props) {
  const [query, setQuery] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");

  const filtradas = useMemo(() => {
    return herramientas.filter((h) => {
      const coincideCategoria = categoriaActiva === "Todas" || h.categoria === categoriaActiva;
      const coincideQuery =
        query.trim() === "" ||
        h.nombre.toLowerCase().includes(query.toLowerCase()) ||
        (h.descripcion ?? "").toLowerCase().includes(query.toLowerCase());
      return coincideCategoria && coincideQuery;
    });
  }, [herramientas, query, categoriaActiva]);

  const porCategoria = useMemo(() => {
    if (categoriaActiva !== "Todas") return { [categoriaActiva]: filtradas };
    const grupos: Record<string, Herramienta[]> = {};
    filtradas.forEach((h) => {
      if (!grupos[h.categoria]) grupos[h.categoria] = [];
      grupos[h.categoria].push(h);
    });
    return grupos;
  }, [filtradas, categoriaActiva]);

  return (
    <>
      {/* Buscador */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-principal/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar herramienta..."
            className="w-full rounded-lg border border-principal/20 bg-secundario/70 py-2.5 pl-10 pr-5 text-sm outline-none placeholder:text-principal/40 focus-visible:border-principal"
          />
        </div>
      </div>

      {/* Filtros por categoría */}
      <div className="mt-4 flex flex-wrap gap-2">
        {["Todas", ...CATEGORIAS_HERRAMIENTAS].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaActiva(cat)}
            className={`rounded-lg border px-4 py-1.5 text-xs font-medium transition-colors ${
              categoriaActiva === cat
                ? "border-principal bg-principal text-secundario"
                : "border-principal/20 hover:border-principal hover:bg-principal/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resultados */}
      {filtradas.length === 0 ? (
        <p className="mt-10 text-principal/50">No encontramos herramientas que coincidan.</p>
      ) : (
        <div className="mt-8 space-y-10">
          {Object.entries(porCategoria).map(([cat, items]) => (
            <div key={cat}>
              <h3 className="font-display text-lg text-principal/60">{cat}</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((h) => (
                  <a
                    key={h.id}
                    href={h.enlace}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col rounded-2xl border border-principal/10 bg-secundario/60 p-5 transition-all hover:border-principal/30 hover:bg-secundario"
                  >
                    <div className="flex items-center gap-3">
                      {h.logoUrl ? (
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-principal/10">
                          <Image src={h.logoUrl} alt={h.nombre} fill className="object-contain p-1.5" />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-principal/10 font-display text-lg font-bold text-principal/40">
                          {h.nombre.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="font-display text-base font-medium leading-snug">{h.nombre}</p>
                          <ExternalLink size={12} className="shrink-0 text-principal/30 opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                        {h.destacada && <span className="text-xs text-joven">★ Destacada</span>}
                      </div>
                    </div>
                    {h.descripcion && (
                      <p className="mt-3 text-sm text-principal/60 line-clamp-3">{h.descripcion}</p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="rounded-lg bg-principal/5 px-2.5 py-1 text-xs text-principal/50">{h.categoria}</span>
                      <span className="text-xs font-medium text-acento opacity-0 transition-opacity group-hover:opacity-100">Ir al sitio →</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
