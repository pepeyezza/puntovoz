import type { Metadata } from "next";
import Link from "next/link";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import {
  INDICADORES_DEMO,
  ENTREVISTAS_DEMO,
  PROYECTOS_DEMO,
  AGENDA_DEMO,
  NOTAS_OBSERVATORIO_DEMO,
} from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Observatorio de Chascomús",
  description:
    "Indicadores, entrevistas, proyectos, agenda cultural y notas sobre el desarrollo local de Chascomús.",
};

async function getResumen() {
  try {
    const [indicadores, entrevistas, proyectos, agenda, notas] = await Promise.all([
      prisma.indicador.findMany({ orderBy: { updatedAt: "desc" }, take: 4 }),
      prisma.entrevista.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 2 }),
      prisma.proyectoLocal.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
      prisma.eventoAgenda.findMany({ orderBy: { fecha: "asc" }, take: 3 }),
      prisma.notaObservatorio.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 2 }),
    ]);

    return {
      indicadores: indicadores.length ? indicadores : INDICADORES_DEMO,
      entrevistas: entrevistas.length
        ? entrevistas.map((e) => ({ slug: e.slug, entrevistado: e.entrevistado, cargo: e.cargo ?? "", resumen: e.resumen, date: (e.publishedAt ?? e.createdAt).toLocaleDateString("es-AR") }))
        : ENTREVISTAS_DEMO,
      proyectos: proyectos.length
        ? proyectos.map((p) => ({ nombre: p.nombre, area: p.area ?? "", estado: p.estado === "en_curso" ? "En curso" : p.estado === "finalizado" ? "Finalizado" : "Planificado" }))
        : PROYECTOS_DEMO,
      agenda: agenda.length
        ? agenda.map((ev) => ({ titulo: ev.titulo, fecha: ev.fecha.toLocaleDateString("es-AR"), lugar: ev.lugar ?? "" }))
        : AGENDA_DEMO,
      notas: notas.length
        ? notas.map((n) => ({ slug: n.slug, titulo: n.titulo, resumen: n.contenido.replace(/<[^>]+>/g, "").slice(0, 140), date: (n.publishedAt ?? n.createdAt).toLocaleDateString("es-AR") }))
        : NOTAS_OBSERVATORIO_DEMO,
    };
  } catch {
    return {
      indicadores: INDICADORES_DEMO,
      entrevistas: ENTREVISTAS_DEMO,
      proyectos: PROYECTOS_DEMO,
      agenda: AGENDA_DEMO,
      notas: NOTAS_OBSERVATORIO_DEMO,
    };
  }
}

export default async function ObservatorioPage() {
  const header = await getPageHeader("observatorio", {
    eyebrow: "Data",
    title: "Observatorio de Chascomús",
    description: "Un espacio de seguimiento del desarrollo local: indicadores, voces de la comunidad, proyectos en marcha y agenda cultural, todo en un solo lugar.",
  });
  const { indicadores, entrevistas, proyectos, agenda, notas } = await getResumen();

  return (
    <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
      <header className="max-w-2xl">
        <p className="eyebrow text-acento">{header.eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl">{header.title}</h1>
        <p className="mt-4 text-principal/70">{header.description}</p>
      </header>

      <div className="mt-10">
        <ObservatorioNav active="/observatorio" />
      </div>

      {/* Indicadores destacados */}
      <div className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl">Indicadores destacados</h2>
          <Link href="/observatorio/indicadores" className="text-sm font-semibold hover:text-acento">
            Ver todos →
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {indicadores.map((ind) => (
            <div key={ind.nombre + ind.periodo} className="rounded-2xl border border-principal/10 p-5">
              <p className="text-xs text-principal/50">{ind.categoria}</p>
              <p className="mt-2 text-sm text-principal/70">{ind.nombre}</p>
              <p className="mt-2 font-display text-3xl text-acento">
                {ind.valor}
                <span className="ml-1 text-base text-principal/50">{ind.unidad}</span>
              </p>
              <p className="mt-1 text-xs text-principal/40">{ind.periodo}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Entrevistas */}
      <div className="mt-14">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl">Últimas entrevistas</h2>
          <Link href="/observatorio/entrevistas" className="text-sm font-semibold hover:text-acento">
            Ver todas →
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {entrevistas.map((e) => (
            <Link
              key={e.slug}
              href={`/observatorio/entrevistas/${e.slug}`}
              className="block rounded-2xl border border-principal/10 p-6 transition-colors hover:border-acento"
            >
              <p className="font-display text-xl">{e.entrevistado}</p>
              <p className="mt-1 text-sm text-acento">{e.cargo}</p>
              <p className="mt-3 text-sm text-principal/60">{e.resumen}</p>
              <p className="mt-3 text-xs text-principal/40">{e.date}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Proyectos + agenda en dos columnas */}
      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl">Proyectos</h2>
            <Link href="/observatorio/proyectos" className="text-sm font-semibold hover:text-acento">
              Ver todos →
            </Link>
          </div>
          <ul className="mt-6 space-y-3">
            {proyectos.map((p) => (
              <li key={p.nombre} className="flex items-center justify-between rounded-xl border border-principal/10 px-5 py-3">
                <div>
                  <p className="text-sm font-medium">{p.nombre}</p>
                  <p className="text-xs text-principal/50">{p.area}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    p.estado === "En curso"
                      ? "bg-joven/20 text-principal"
                      : p.estado === "Finalizado"
                      ? "bg-principal/10 text-principal/60"
                      : "bg-acento/15 text-acento"
                  }`}
                >
                  {p.estado}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl">Agenda cultural</h2>
            <Link href="/observatorio/agenda" className="text-sm font-semibold hover:text-acento">
              Ver toda →
            </Link>
          </div>
          <ul className="mt-6 space-y-3">
            {agenda.map((ev) => (
              <li key={ev.titulo} className="rounded-xl border border-principal/10 px-5 py-3">
                <p className="text-sm font-medium">{ev.titulo}</p>
                <p className="mt-1 text-xs text-principal/50">
                  {ev.fecha} · {ev.lugar}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Notas */}
      <div className="mt-14">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl">Notas del Observatorio</h2>
          <Link href="/observatorio/notas" className="text-sm font-semibold hover:text-acento">
            Ver todas →
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {notas.map((n) => (
            <Link
              key={n.slug}
              href={`/observatorio/notas/${n.slug}`}
              className="block rounded-2xl border border-principal/10 p-6 transition-colors hover:border-acento"
            >
              <p className="font-display text-xl">{n.titulo}</p>
              <p className="mt-2 text-sm text-principal/60">{n.resumen}</p>
              <p className="mt-3 text-xs text-principal/40">{n.date}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
