export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import DataSeccionWrapper from "@/components/observatorio/DataSeccionWrapper";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Proyectos · Data" };

const TIPOS = ["Todos", "Público", "Privado", "Mixto"];

function tipoLabel(tipo: string) {
  if (tipo === "publico") return "Público";
  if (tipo === "privado") return "Privado";
  return "Mixto";
}

async function getProyectos() {
  try {
    const p = await prisma.proyectoLocal.findMany({ orderBy: { createdAt: "desc" } });
    return p.map((p) => ({ nombre: p.nombre, area: p.area ?? "", tipo: tipoLabel(p.tipo), descripcion: p.descripcion, enlace: p.enlace ?? "" }));
  } catch { return []; }
}

export default async function ProyectosPage({ searchParams }: { searchParams: { tipo?: string } }) {
  const tipoActivo = searchParams.tipo ?? "Todos";
  const todos = await getProyectos();
  const proyectos = tipoActivo === "Todos" ? todos : todos.filter((p) => p.tipo === tipoActivo);

  return (
    <DataSeccionWrapper seccion="/observatorio/proyectos">
      <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
        <header className="max-w-2xl">
          <p className="eyebrow text-acento">Data</p>
          <h1 className="mt-2 font-display text-4xl">Proyectos de desarrollo local</h1>
        </header>
        <div className="mt-10"><ObservatorioNav active="/observatorio/proyectos" /></div>
        <div className="mt-8 flex flex-wrap gap-2">
          {TIPOS.map((tipo) => (
            <a key={tipo} href={tipo === "Todos" ? "/observatorio/proyectos" : `/observatorio/proyectos?tipo=${encodeURIComponent(tipo)}`}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${tipoActivo === tipo ? "border-acento bg-acento text-secundario" : "border-principal/15 hover:border-acento hover:text-acento"}`}>
              {tipo}
            </a>
          ))}
        </div>
        {proyectos.length === 0 ? (
          <p className="mt-10 text-principal/50">Todavía no hay proyectos cargados.</p>
        ) : (
          <ul className="mt-8 space-y-4">
            {proyectos.map((p) => (
              <li key={p.nombre} className="rounded-2xl bg-secundario/60 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-display text-xl">{p.nombre}</p>
                    {p.area && <p className="mt-1 text-sm text-principal/50">{p.area}</p>}
                    {p.descripcion && <p className="mt-3 text-sm text-principal/70">{p.descripcion}</p>}
                    {p.enlace && <a href={p.enlace} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium text-acento hover:underline">Ver más →</a>}
                  </div>
                  <span className="shrink-0 rounded-full bg-acento/20 px-3 py-1 text-xs font-semibold text-acento">{p.tipo}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </DataSeccionWrapper>
  );
}
