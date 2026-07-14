"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";

type Institucion = {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string | null;
  logoUrl: string | null;
  serviciosCount: number;
};

type Props = { instituciones: Institucion[] };

export default function InvestigacionClient({ instituciones }: Props) {
  const [query, setQuery] = useState("");

  const filtradas = useMemo(() => {
    if (query.trim() === "") return instituciones;
    return instituciones.filter((inst) =>
      inst.nombre.toLowerCase().includes(query.toLowerCase()) ||
      (inst.descripcion ?? "").toLowerCase().includes(query.toLowerCase())
    );
  }, [instituciones, query]);

  return (
    <>
      <div className="mt-8 flex items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-principal/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar institución o servicio..."
            className="w-full rounded-full border border-principal/20 bg-secundario/70 py-2.5 pl-10 pr-5 text-sm outline-none placeholder:text-principal/40 focus-visible:border-principal"
          />
        </div>
      </div>

      {filtradas.length === 0 ? (
        <p className="mt-10 text-principal/50">No encontramos instituciones que coincidan.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtradas.map((inst) => (
            <Link key={inst.id} href={`/observatorio/investigacion/${inst.slug}`} className="block rounded-2xl bg-secundario/80 p-6 transition-colors hover:bg-secundario">
              <div className="flex items-center gap-4">
                {inst.logoUrl ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-principal/10">
                    <Image src={inst.logoUrl} alt={inst.nombre} fill className="object-contain p-1" />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-principal/10 font-display text-xl text-principal/40">{inst.nombre.charAt(0)}</div>
                )}
                <p className="font-display text-lg leading-snug">{inst.nombre}</p>
              </div>
              {inst.descripcion && <p className="mt-3 text-sm text-principal/60 line-clamp-2">{inst.descripcion}</p>}
              <p className="mt-3 text-xs text-principal/40">{inst.serviciosCount} servicio(s)</p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
