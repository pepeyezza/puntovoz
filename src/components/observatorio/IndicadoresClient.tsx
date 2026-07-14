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

export default function IndicadoresClient({ indicadores }: Props) {
  const [query, setQuery] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");

  const filtrados = useMemo(() => {
    return indicadores.filter((ind) => {
      const coincideCategoria = categoriaActiva === "Todas" || ind.categoria === categoriaActiva;
      const coincideQuery =
        query.trim() === "" ||
        ind.nombre.toLowerCase().includes(query.toLowerCase()) ||
        (ind.categoria ?? "").toLowerCase().includes(query.toLowerCase()) ||
        (ind.fuente ?? "").toLowerCase().includes(query.toLowerCase());
      return coincideCategoria && coincideQuery;
    });
  }, [indicadores, query, categoriaActiva]);

  // Agrupar por categoría para mostrarlos organizados
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
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-secundario/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar indicador..."
            className="w-full rounded-full border border-secundario/20 bg-secundario/10 py-2.5 pl-10 pr-5 text-sm text-secundario outline-none placeholder:text-secundario/40 focus-visible:border-joven"
          />
        </div>
      </div>

      {/* Filtros por categoría */}
      <div className="mt-4 flex flex-wrap gap-2">
        {["Todas", ...CATEGORIAS_INDICADORES].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaActiva(cat)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              categoriaActiva === cat
                ? "border-joven bg-joven text-principal"
                : "border-secundario/20 text-secundario/60 hover:border-joven hover:text-joven"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resultados */}
      {filtrados.length === 0 ? (
        <p className="mt-10 text-secundario/50">No encontramos indicadores que coincidan.</p>
      ) : categoriaActiva !== "Todas" ? (
        // Vista plana cuando hay filtro activo
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtrados.map((ind) => (
            <IndicadorCard key={ind.id} ind={ind} />
          ))}
        </div>
      ) : (
        // Vista agrupada por categoría
        <div className="mt-8 space-y-10">
          {Object.entries(porCategoria).map(([cat, items]) => (
            <div key={cat}>
              <h3 className="font-display text-lg text-secundario/70">{cat}</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
    <div className="rounded-2xl border border-secundario/15 p-5">
      <p className="text-xs text-secundario/50">{ind.categoria}</p>
      <p className="mt-2 text-sm text-secundario/70">{ind.nombre}</p>
      <p className="mt-2 font-display text-3xl text-joven">
        {ind.valor}
        <span className="ml-1 text-base text-secundario/50">{ind.unidad}</span>
      </p>
      <p className="mt-1 text-xs text-secundario/40">{ind.periodo}</p>
      {ind.fuente && <p className="mt-2 text-xs text-secundario/30">Fuente: {ind.fuente}</p>}
    </div>
  );
}
