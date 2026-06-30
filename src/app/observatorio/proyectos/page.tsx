import type { Metadata } from "next";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Proyectos · Data",
  description: "Proyectos de desarrollo local en Chascomús.",
};

const TIPOS = ["Todos", "Público", "Privado", "Mixto"];

const TIPO_COLOR: Record<string, string> = {
  Público: "bg-joven/20 text-principal",
  Privado: "bg-acento/15 text-acento",
  Mixto: "bg-principal/10 text-principal/60",
};

function tipoLabel(tipo: string) {
  if (tipo === "publico") return "Público";
  if (tipo === "privado") return "Privado";
  if (tipo === "mixto") return "Mixto";
  return tipo;
}

async function getProyectos() {
  try {
    const proyectos = await prisma.proyectoLocal.findMany({ orderBy: { createdAt: "desc" } });
    return proyectos.map((p) => ({
      nombre: p.nombre,
      area: p.area ?? "",
      descripcion: p.descripcion,
      tipo: tipoLabel(p.tipo),
      enlace: p.enlace ?? "",
    }));
  } catch {
    return [];
  }
}

export default async function ProyectosPage({
  searchParams,
}: {
  searchParams: { tipo?: string };
}) {
  const tipoActivo = searchParams.tipo ?? "Todos";
  const todosLosProyectos = await getProyectos();
  const proyectos =
    tipoActivo === "Todos" ? todosLosProyectos : todosLosProyectos.filter((p) => p.tipo === tipoActivo);

  return (
    <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
      <header className="max-w-2xl">
        <p className="eyebrow text-acento">Data</p>
        <h1 className="mt-2 font-display text-4xl">Proyectos de desarrollo local</h1>
        <p className="mt-4 text-principal/70">
          Iniciativas públicas, privadas y mixtas del partido.
        </p>
      </header>

      <div className="mt-10">
        <ObservatorioNav active="/observatorio/proyectos" />
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {TIPOS.map((tipo) => (
          <a
            key={tipo}
            href={tipo === "Todos" ? "/observatorio/proyectos" : `/observatorio/proyectos?tipo=${encodeURIComponent(tipo)}`}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              tipoActivo === tipo
                ? "border-acento bg-acento text-secundario"
                : "border-principal/15 hover:border-acento hover:text-acento"
            }`}
          >
            {tipo}
          </a>
        ))}
      </div>

      {proyectos.length === 0 ? (
        <p className="mt-10 text-principal/50">Todavía no hay proyectos cargados.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {proyectos.map((p) => (
            <li key={p.nombre} className="rounded-2xl border border-principal/10 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-display text-xl">{p.nombre}</p>
                  {p.area && <p className="mt-1 text-sm text-principal/50">{p.area}</p>}
                  {p.descripcion && <p className="mt-3 text-sm text-principal/70">{p.descripcion}</p>}
                  {p.enlace && (
                    <a href={p.enlace} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium text-acento hover:underline">
                      Ver más →
                    </a>
                  )}
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${TIPO_COLOR[p.tipo] ?? "bg-principal/10 text-principal/60"}`}>
                  {p.tipo}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
