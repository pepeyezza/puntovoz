"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { CATEGORIAS_INDICADORES } from "@/lib/categoriasIndicadores";

type Indicador = {
  id: string;
  nombre: string;
  valor: number;
  unidad: string;
  periodo: string;
  categoria: string | null;
  fuente: string | null;
};

type Props = { indicadores: Indicador[] };

const COLORES = ["#1c2a38", "#c87a62", "#f4a900", "#cfc8b8", "#7a8794", "#e3b9a9"];

function colorDe(categoria: string | null) {
  const i = categoria ? (CATEGORIAS_INDICADORES as readonly string[]).indexOf(categoria) : -1;
  return COLORES[i >= 0 ? i % COLORES.length : 3];
}

export default function IndicadoresClient({ indicadores }: Props) {
  const [query, setQuery] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    return indicadores.filter((ind) => {
      const coincideCategoria = categoriaActiva === "Todas" || ind.categoria === categoriaActiva;
      const coincideQuery =
        q === "" ||
        ind.nombre.toLowerCase().includes(q) ||
        (ind.categoria ?? "").toLowerCase().includes(q) ||
        (ind.fuente ?? "").toLowerCase().includes(q);
      return coincideCategoria && coincideQuery;
    });
  }, [indicadores, query, categoriaActiva]);

  const porCategoria = useMemo(() => {
    const grupos: Record<string, Indicador[]> = {};
    filtrados.forEach((ind) => {
      const cat = ind.categoria ?? "Sin categoría";
      if (!grupos[cat]) grupos[cat] = [];
      grupos[cat].push(ind);
    });
    return grupos;
  }, [filtrados]);

  return (
    <>
      {/* Buscador */}
      <div className="mt-8 relative max-w-sm">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-principal/40" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar indicador..."
          className="w-full rounded-lg border border-principal/20 bg-white py-2.5 pl-10 pr-5 text-sm outline-none placeholder:text-principal/40 focus-visible:border-principal"
        />
      </div>

      {/* Filtros por categoría */}
      <div className="mt-4 flex flex-wrap gap-2">
        {["Todas", ...CATEGORIAS_INDICADORES].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaActiva(cat)}
            className={`rounded-lg border px-4 py-1.5 text-xs font-medium transition-colors ${
              categoriaActiva === cat
                ? "border-principal bg-principal text-secundario"
                : "border-principal/20 hover:border-principal/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resultados */}
      {filtrados.length === 0 ? (
        <p className="mt-10 text-principal/50">No encontramos indicadores que coincidan.</p>
      ) : categoriaActiva !== "Todas" ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtrados.map((ind) => (
            <IndicadorCard key={ind.id} ind={ind} />
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {Object.entries(porCategoria).map(([cat, items]) => (
            <div key={cat}>
              <h3 className="font-display text-lg text-principal/70">{cat}</h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((ind) => (
                  <IndicadorCard key={ind.id} ind={ind} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function IndicadorCard({ ind }: { ind: Indicador }) {
  return (
    <div
      className="rounded-2xl border-t-4 border-transparent bg-white p-5"
      style={{ borderTopColor: colorDe(ind.categoria) }}
    >
      <p className="text-xs text-principal/50">{ind.categoria ?? "Sin categoría"}</p>
      <p className="mt-2 text-sm text-principal/70">{ind.nombre}</p>
      <p className="mt-2 font-display text-3xl">
        {ind.valor.toLocaleString("es-AR")}
        <span className="ml-1 text-base text-principal/50">{ind.unidad}</span>
      </p>
      <p className="mt-1 text-xs text-principal/40">{ind.periodo}</p>
      {ind.fuente && <p className="mt-2 text-xs text-principal/40">Fuente: {ind.fuente}</p>}
    </div>
  );
}
