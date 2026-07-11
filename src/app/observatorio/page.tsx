export const dynamic = "force-dynamic";

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
  title: "Data · Chascomús",
  description: "Indicadores, proyectos, agenda, oferta académica e investigación científica de Chascomús.",
};

async function getResumen() {
  try {
    const [indicadores, proyectos, agenda, entrevistas, notas, instituciones, cientificas] = await Promise.all([
      prisma.indicador.findMany({ orderBy: { updatedAt: "desc" }, take: 4 }),
      prisma.proyectoLocal.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
      prisma.eventoAgenda.findMany({ orderBy: { fecha: "asc" }, take: 3 }),
      prisma.entrevista.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 2 }),
      prisma.notaObservatorio.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 2 }),
      prisma.institucionAcademica.findMany({ orderBy: { nombre: "asc" }, take: 3, include: { _count: { select: { carreras: true } } } }),
      prisma.institucionCientifica.findMany({ orderBy: { nombre: "asc" }, take: 3, include: { _count: { select: { servicios: true } } } }),
    ]);

    return {
      indicadores: indicadores.length ? indicadores : INDICADORES_DEMO,
      proyectos: proyectos.length
        ? proyectos.map((p) => ({ nombre: p.nombre, area: p.area ?? "", tipo: p.tipo === "publico" ? "Público" : p.tipo === "privado" ? "Privado" : "Mixto" }))
        : PROYECTOS_DEMO.map((p) => ({ ...p, tipo: "Público" })),
      agenda: agenda.length
        ? agenda.map((ev) => ({ titulo: ev.titulo, fecha: ev.fecha.toLocaleDateString("es-AR", { day: "numeric", month: "long" }), lugar: ev.lugar ?? "" }))
        : AGENDA_DEMO,
      entrevistas: entrevistas.length
        ? entrevistas.map((e) => ({ slug: e.slug, entrevistado: e.entrevistado, cargo: e.cargo ?? "", resumen: e.resumen, date: (e.publishedAt ?? e.createdAt).toLocaleDateString("es-AR") }))
        : ENTREVISTAS_DEMO,
      notas: notas.length
        ? notas.map((n) => ({ slug: n.slug, titulo: n.titulo, resumen: n.contenido.replace(/<[^>]+>/g, "").slice(0, 120), date: (n.publishedAt ?? n.createdAt).toLocaleDateString("es-AR") }))
        : NOTAS_OBSERVATORIO_DEMO,
      instituciones,
      cientificas,
    };
  } catch {
    return {
      indicadores: INDICADORES_DEMO,
      proyectos: PROYECTOS_DEMO.map((p) => ({ ...p, tipo: "Público" })),
      agenda: AGENDA_DEMO,
      entrevistas: ENTREVISTAS_DEMO,
      notas: NOTAS_OBSERVATORIO_DEMO,
      instituciones: [],
      cientificas: [],
    };
  }
}

export default async function ObservatorioPage() {
  const header = await getPageHeader("observatorio", {
    eyebrow: "Data",
    title: "Observatorio de Chascomús",
    description: "Un espacio de seguimiento del desarrollo local.",
  });
  const { indicadores, proyectos, agenda, entrevistas, notas, instituciones, cientificas } = await getResumen();

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

      {/* INDICADORES — fondo oscuro tipo home */}
      <div className="mt-10 rounded-3xl bg-principal p-8 text-secundario">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl">Indicadores</h2>
          <Link href="/observatorio/indicadores" className="text-sm font-semibold text-joven hover:opacity-80">Ver todos →</Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {indicadores.map((ind) => (
            <div key={ind.nombre + ind.periodo} className="rounded-2xl border border-secundario/15 p-5">
              <p className="text-xs text-secundario/50">{ind.categoria}</p>
              <p className="mt-2 text-sm text-secundario/70">{ind.nombre}</p>
              <p className="mt-2 font-display text-3xl text-joven">
                {ind.valor}<span className="ml-1 text-base text-secundario/50">{ind.unidad}</span>
              </p>
              <p className="mt-1 text-xs text-secundario/40">{ind.periodo}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PROYECTOS — fondo acento suave */}
      <div className="mt-6 rounded-3xl bg-acento/10 p-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl">Proyectos</h2>
          <Link href="/observatorio/proyectos" className="text-sm font-semibold text-acento hover:opacity-80">Ver todos →</Link>
        </div>
        <ul className="mt-6 space-y-3">
          {proyectos.map((p) => (
            <li key={p.nombre} className="flex items-center justify-between rounded-xl bg-secundario/60 px-5 py-3">
              <div>
                <p className="text-sm font-medium">{p.nombre}</p>
                <p className="text-xs text-principal/50">{p.area}</p>
              </div>
              <span className="rounded-full bg-acento/20 px-3 py-1 text-xs font-semibold text-acento">{p.tipo}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* AGENDA — fondo verde */}
      <div className="mt-6 rounded-3xl p-8" style={{ backgroundColor: "#e8f5e9" }}>
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl" style={{ color: "#2d6a4f" }}>Agenda cultural</h2>
          <Link href="/observatorio/agenda" className="text-sm font-semibold hover:opacity-80" style={{ color: "#2d6a4f" }}>Ver toda →</Link>
        </div>
        <ul className="mt-6 space-y-3">
          {agenda.map((ev) => (
            <li key={ev.titulo} className="rounded-xl bg-white/70 px-5 py-3">
              <p className="text-sm font-medium">{ev.titulo}</p>
              <p className="mt-1 text-xs text-principal/50">{ev.fecha} · {ev.lugar}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* OFERTA ACADÉMICA — fondo joven suave */}
      <div className="mt-6 rounded-3xl bg-joven/10 p-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl">Oferta académica</h2>
          <Link href="/observatorio/oferta-academica" className="text-sm font-semibold text-joven hover:opacity-80">Ver todo →</Link>
        </div>
        {instituciones.length === 0 ? (
          <p className="mt-4 text-sm text-principal/50">Todavía no hay instituciones cargadas.</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {instituciones.map((inst) => (
              <li key={inst.id}>
                <Link href={`/observatorio/oferta-academica/${inst.slug}`} className="flex items-center justify-between rounded-xl bg-secundario/60 px-5 py-3 transition-colors hover:bg-secundario">
                  <p className="text-sm font-medium">{inst.nombre}</p>
                  <span className="text-xs text-principal/50">{inst._count.carreras} carrera(s)</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* INVESTIGACIÓN CIENTÍFICA — fondo azul oscuro suave */}
      <div className="mt-6 rounded-3xl bg-principal/5 p-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl">Investigación científica</h2>
          <Link href="/observatorio/investigacion" className="text-sm font-semibold hover:text-acento">Ver todo →</Link>
        </div>
        {cientificas.length === 0 ? (
          <p className="mt-4 text-sm text-principal/50">Todavía no hay instituciones cargadas.</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {cientificas.map((inst) => (
              <li key={inst.id}>
                <Link href={`/observatorio/investigacion/${inst.slug}`} className="flex items-center justify-between rounded-xl bg-secundario/80 px-5 py-3 transition-colors hover:bg-secundario">
                  <p className="text-sm font-medium">{inst.nombre}</p>
                  <span className="text-xs text-principal/50">{inst._count.servicios} servicio(s)</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ENTREVISTAS — al final, fondo neutro */}
      <div className="mt-6 rounded-3xl border border-principal/10 p-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl">Entrevistas</h2>
          <Link href="/observatorio/entrevistas" className="text-sm font-semibold hover:text-acento">Ver todas →</Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {entrevistas.map((e) => (
            <Link key={e.slug} href={`/observatorio/entrevistas/${e.slug}`} className="block rounded-2xl border border-principal/10 bg-secundario/50 p-5 transition-colors hover:border-acento">
              <p className="font-display text-lg">{e.entrevistado}</p>
              <p className="mt-1 text-sm text-acento">{e.cargo}</p>
              <p className="mt-2 text-xs text-principal/50 line-clamp-2">{e.resumen}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* NOTAS — al final */}
      <div className="mt-6 rounded-3xl border border-principal/10 p-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl">Notas del Observatorio</h2>
          <Link href="/observatorio/notas" className="text-sm font-semibold hover:text-acento">Ver todas →</Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {notas.map((n) => (
            <Link key={n.slug} href={`/observatorio/notas/${n.slug}`} className="block rounded-2xl border border-principal/10 bg-secundario/50 p-5 transition-colors hover:border-acento">
              <p className="font-display text-lg">{n.titulo}</p>
              <p className="mt-2 text-sm text-principal/60">{n.resumen}</p>
              <p className="mt-2 text-xs text-principal/40">{n.date}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
