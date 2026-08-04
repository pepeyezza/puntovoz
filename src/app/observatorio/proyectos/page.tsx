export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Image from "next/image";
import { FolderKanban } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import DataSeccionWrapper from "@/components/observatorio/DataSeccionWrapper";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Iniciativas - Data" };

function tipoLabel(tipo: string) {
  const map: Record<string, string> = {
    publico: "Publico", privado: "Privado", mixto: "Mixto",
    comunitario: "Comunitario", internacional: "Internacional",
  };
  return map[tipo] ?? tipo;
}

const TIPO_COLOR: Record<string, string> = {
  Publico: "bg-joven/20 text-principal",
  Privado: "bg-acento/15 text-acento",
  Mixto: "bg-principal/10 text-principal/60",
  Comunitario: "bg-[#d8f3dc] text-[#2d6a4f]",
  Internacional: "bg-[#ede9fe] text-[#6d28d9]",
};

const TIPOS = ["Todos", "Publico", "Privado", "Mixto", "Comunitario", "Internacional"];

async function getIniciativas() {
  try {
    const p = await prisma.proyectoLocal.findMany({ orderBy: { createdAt: "desc" } });
    return p.map((p) => ({
      nombre: p.nombre, area: p.area ?? "", tipo: tipoLabel(p.tipo),
      descripcion: p.descripcion, enlace: p.enlace ?? "",
      imagen: (p as any).imagen ?? "",
    }));
  } catch { return []; }
}

export default async function Page({ searchParams }: { searchParams: { tipo?: string } }) {
  const header = await getPageHeader("dataProyectos", {
    eyebrow: "Data", title: "Iniciativas", description: "Proyectos e iniciativas publicas, privadas y comunitarias del partido.",
  });
  const tipoActivo = searchParams.tipo ?? "Todos";
  const todos = await getIniciativas();
  const iniciativas = tipoActivo === "Todos" ? todos : todos.filter((p) => p.tipo === tipoActivo);

  return (
    <DataSeccionWrapper seccion="/observatorio/proyectos">
      <section className="mx-auto max-w-editorial px-5 py-12 lg:px-8">
        <p className="eyebrow text-acento">{header.eyebrow}</p>
        <div className="mt-3"><ObservatorioNav active="/observatorio/proyectos" /></div>
        <div className="mt-6 flex items-center gap-3">
          <FolderKanban size={32} className="text-acento" />
          <h1 className="font-display text-4xl">Iniciativas</h1>
        </div>
        {header.description && <p className="mt-3 text-principal/70">{header.description}</p>}

        {/* Filtros de tipo */}
        <div className="mt-6 flex flex-wrap gap-2">
          {TIPOS.map((tipo) => (
            <a key={tipo}
              href={tipo === "Todos" ? "/observatorio/proyectos" : `/observatorio/proyectos?tipo=${encodeURIComponent(tipo)}`}
              className={`rounded-lg border px-4 py-1.5 text-xs font-medium transition-colors ${
                tipoActivo === tipo
                  ? "border-acento bg-acento text-secundario"
                  : "border-principal/15 hover:border-acento hover:text-acento"
              }`}>
              {tipo}
            </a>
          ))}
        </div>

        {iniciativas.length === 0 ? (
          <p className="mt-10 text-principal/50">Todavia no hay iniciativas cargadas.</p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {iniciativas.map((p) => (
              <div key={p.nombre} className="flex flex-col rounded-2xl bg-secundario/60 p-6">
                {/* Imagen si tiene */}
                {p.imagen && (
                  <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl border border-principal/10">
                    <Image src={p.imagen} alt={p.nombre} fill className="object-cover" />
                  </div>
                )}
                {/* Header de la card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-display text-xl leading-snug">{p.nombre}</p>
                    {p.area && <p className="mt-1 text-sm text-principal/50">{p.area}</p>}
                  </div>
                  <span className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${TIPO_COLOR[p.tipo] ?? "bg-principal/10 text-principal/60"}`}>
                    {p.tipo}
                  </span>
                </div>
                {/* Descripción */}
                {p.descripcion && (
                  <p className="mt-3 flex-1 text-sm text-principal/65 leading-relaxed">{p.descripcion}</p>
                )}
                {/* Link */}
                {p.enlace && (
                  <a href={p.enlace} target="_blank" rel="noreferrer"
                    className="mt-4 inline-block text-sm font-medium text-acento hover:underline">
                    Ver más →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </DataSeccionWrapper>
  );
}
