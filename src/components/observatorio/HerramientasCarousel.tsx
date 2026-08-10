"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

type Herramienta = {
  id: string;
  nombre: string;
  descripcion?: string | null;
  categoria: string;
  logoUrl?: string | null;
  enlace: string;
};

const CAT_COLOR: Record<string, string> = {
  "IA": "bg-[#ede9fe] text-[#6d28d9]",
  "Comunicacion e Interaccion": "bg-acento/15 text-acento",
  "Productividad y Ofimatica": "bg-joven/20 text-principal",
  "Gestion y Organizacion": "bg-[#d8f3dc] text-[#2d6a4f]",
  "Otros": "bg-principal/10 text-principal/60",
};

export default function HerramientasCarousel({ herramientas }: { herramientas: Herramienta[] }) {
  const [inicio, setInicio] = useState(0);
  const visible = 4;
  const total = herramientas.length;

  function prev() { setInicio((i) => Math.max(0, i - visible)); }
  function next() { setInicio((i) => Math.min(total - visible, i + visible)); }

  const slice = herramientas.slice(inicio, inicio + visible);

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {slice.map((h) => (
          <a key={h.id} href={h.enlace} target="_blank" rel="noreferrer"
            className="group flex flex-col rounded-2xl border border-principal/10 bg-secundario p-4 transition-all hover:border-principal/25 hover:shadow-sm">
            {/* Logo o inicial */}
            <div className="flex items-center gap-3">
              {h.logoUrl ? (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-principal/10 bg-white">
                  <Image src={h.logoUrl} alt={h.nombre} fill className="object-contain p-1" />
                </div>
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-principal/8 font-display text-lg font-medium text-principal/40">
                  {h.nombre.charAt(0)}
                </div>
              )}
              <ExternalLink size={14} className="ml-auto text-principal/20 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="mt-3 text-sm font-semibold leading-snug">{h.nombre}</p>
            {h.descripcion && <p className="mt-1 text-xs text-principal/50 line-clamp-2 flex-1">{h.descripcion}</p>}
            <span className={`mt-3 inline-block rounded-lg px-2 py-0.5 text-xs font-medium ${CAT_COLOR[h.categoria] ?? "bg-principal/8 text-principal/50"}`}>
              {h.categoria}
            </span>
          </a>
        ))}
      </div>
      {total > visible && (
        <div className="mt-5 flex items-center justify-between">
          <p className="text-xs text-principal/40">{inicio + 1}–{Math.min(inicio + visible, total)} de {total} herramientas</p>
          <div className="flex gap-2">
            <button onClick={prev} disabled={inicio === 0}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-principal/15 text-principal/50 disabled:opacity-30 hover:border-acento hover:text-acento transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button onClick={next} disabled={inicio + visible >= total}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-principal/15 text-principal/50 disabled:opacity-30 hover:border-acento hover:text-acento transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
