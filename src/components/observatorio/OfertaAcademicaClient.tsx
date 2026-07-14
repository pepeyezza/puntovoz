"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";

type Institucion = {
  id: string;
  slug: string;
  nombre: string;
  tipo: string;
  descripcion: string | null;
  logoUrl: string | null;
  carrerasCount: number;
};

const TIPO_LABEL: Record<string, string> = {
  universidad: "Universidad",
  instituto: "Instituto",
  formacion_laboral: "Centro de formación",
  otro: "Otro",
};

const TIPOS = ["Todas", "Universidad", "Instituto", "Centro de formación", "Otro"];

type Props = { instituciones: Institucion[] };

export default function OfertaAcademicaClient({ instituciones }: Props) {
  const [query, setQuery] = useState("");
  const [tipoActivo, setTipoActivo] = useState("Todas");

  const filtradas = useMemo(() => {
    return instituciones.filter((inst) => {
      const coincideTipo = tipoActivo === "Todas" || TIPO_LABEL[inst.tipo] === tipoActivo;
      const coincideQuery =
        query.trim() === "" ||
        inst.nombre.toLowerCase().includes(query.toLowerCase()) ||
        (inst.descripcion ?? "").toLowerCase().includes(query.toLowerCase());
      return coincideTipo && coincideQuery;
    });
  }, [instituciones, query, tipoActivo]);

  return (
    <>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-principal/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar institución o carrera..."
            className="w-full rounded-full border border-principal/20 bg-secundario/70 py-2.5 pl-10 pr-5 text-sm outline-none placeholder:text-principal/40 focus-visible:border-principal"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {TIPOS.map((tipo) => (
          <button
            key={tipo}
            onClick={() => setTipoActivo(tipo)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              tipoActivo === tipo
                ? "border-principal bg-principal text-secundario"
                : "border-principal/20 hover:border-principal hover:bg-principal/10"
            }`}
          >
            {tipo}
          </button>
        ))}
      </div>

      {filtradas.length === 0 ? (
        <p className="mt-10 text-principal/50">No encontramos instituciones que coincidan.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtradas.map((inst) => (
            <Link key={inst.id} href={`/observatorio/oferta-academica/${inst.slug}`} className="block rounded-2xl bg-secundario/70 p-6 transition-colors hover:bg-secundario">
              <div className="flex items-center gap-4">
                {inst.logoUrl ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-principal/10">
                    <Image src={inst.logoUrl} alt={inst.nombre} fill className="object-contain p-1" />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-joven/20 font-display text-xl text-principal/60">{inst.nombre.charAt(0)}</div>
                )}
                <div>
                  <p className="font-display text-lg leading-snug">{inst.nombre}</p>
                  <p className="text-xs text-principal/50">{TIPO_LABEL[inst.tipo] ?? inst.tipo}</p>
                </div>
              </div>
              {inst.descripcion && <p className="mt-3 text-sm text-principal/60 line-clamp-2">{inst.descripcion}</p>}
              <p className="mt-3 text-xs text-principal/40">{inst.carrerasCount} carrera(s)</p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
