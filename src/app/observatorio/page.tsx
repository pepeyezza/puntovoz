export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { BarChart2, FolderKanban, CalendarDays, GraduationCap, Microscope, Wrench, FileText } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { INDICADORES_DEMO, PROYECTOS_DEMO, AGENDA_DEMO, NOTAS_OBSERVATORIO_DEMO } from "@/lib/demo-data";
import { HERRAMIENTAS_DEMO } from "@/lib/herramientas";

export const metadata: Metadata = {
  title: "Data · Chascomús",
  description: "Indicadores, proyectos, agenda, oferta académica, investigación y herramientas de Chascomús.",
};

async function getResumen() {
  try {
    const [indicadores, proyectos, agenda, notas, instituciones, cientificas] = await Promise.all([
      prisma.indicador.findMany({ orderBy: { updatedAt: "desc" }, take: 4 }),
      prisma.proyectoLocal.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
      prisma.eventoAgenda.findMany({ orderBy: { fecha: "asc" }, take: 3 }),
      prisma.notaObservatorio.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 2 }),
      prisma.institucionAcademica.findMany({ orderBy: { nombre: "asc" }, take: 3, include: { _count: { select: { carreras: true } } } }),
      prisma.institucionCientifica.findMany({ orderBy: { nombre: "asc" }, take: 3, include: { _count: { select: { servicios: true } } } }),
    ]);

    let herramientas: any[] = [];
    try {
      const h = await (prisma as any).herramientaTecnologica.findMany({ orderBy: { nombre: "asc" }, take: 4 });
      herramientas = h.length ? h : HERRAMIENTAS_DEMO.slice(0, 4);
    } catch { herramientas = HERRAMIENTAS_DEMO.slice(0, 4); }

    return {
      indicadores: indicadores.length ? indicadores : INDICADORES_DEMO,
      proyectos: proyectos.length
        ? proyectos.map((p) => ({ nombre: p.nombre, area: p.area ?? "", tipo: p.tipo === "publico" ? "Público" : p.tipo === "privado" ? "Privado" : "Mixto" }))
        : PROYECTOS_DEMO.slice(0, 3).map((p) => ({ ...p, tipo: "Público" })),
      agenda: agenda.length
        ? agenda.map((ev) => ({ titulo: ev.titulo, fecha: ev.fecha.toLocaleDateString("es-AR", { day: "numeric", month: "long" }), lugar: ev.lugar ?? "" }))
        : AGENDA_DEMO,
      notas: notas.length
        ? notas.map((n) => ({ slug: n.slug, titulo: n.titulo, resumen: n.contenido.replace(/<[^>]+>/g, "").slice(0, 100) }))
        : NOTAS_OBSERVATORIO_DEMO,
      instituciones,
      cientificas,
      herramientas,
    };
  } catch {
    return {
      indicadores: INDICADORES_DEMO,
      proyectos: PROYECTOS_DEMO.slice(0, 3).map((p) => ({ ...p, tipo: "Público" })),
      agenda: AGENDA_DEMO,
      notas: NOTAS_OBSERVATORIO_DEMO,
      instituciones: [], cientificas: [],
      herramientas: HERRAMIENTAS_DEMO.slice(0, 4),
    };
  }
}

export default async function ObservatorioPage() {
  const header = await getPageHeader("observatorio", {
    eyebrow: "Data",
    title: "Observatorio de Chascomús",
    description: "Un espacio de seguimiento del desarrollo local.",
  });
  const { indicadores, proyectos, agenda, notas, instituciones, cientificas, herramientas } = await getResumen();

  return (
    <section className="mx-auto max-w-editorial px-5 py-12 lg:px-8">
      <p className="eyebrow text-acento">{header.eyebrow}</p>
      <div className="mt-3"><ObservatorioNav active="/observatorio" /></div>
      <h1 className="mt-6 font-display text-4xl">{header.title}</h1>
      <p className="mt-2 text-principal/60">{header.description}</p>

      {/* Grilla 2 columnas */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2">

        {/* INDICADORES */}
        <div className="flex flex-col rounded-3xl bg-principal p-7 text-secundario">
          <div className="flex items-center gap-2.5">
            <BarChart2 size={20} className="text-joven" />
            <h2 className="font-display text-xl">Indicadores</h2>
            <Link href="/observatorio/indicadores" className="ml-auto rounded-lg border border-joven/40 px-3 py-1 text-xs font-semibold text-joven hover:opacity-80">
              Ver todo →
            </Link>
          </div>
          <div className="mt-5 grid flex-1 grid-cols-2 gap-3">
            {indicadores.slice(0, 4).map((ind) => (
              <div key={ind.nombre + ind.periodo} className="rounded-xl border border-secundario/10 p-4">
                <p className="text-xs text-secundario/40 line-clamp-1">{ind.categoria}</p>
                <p className="mt-1 text-xs text-secundario/60 line-clamp-2">{ind.nombre}</p>
                <p className="mt-2 font-display text-2xl text-joven">
                  {ind.valor}<span className="ml-1 text-sm text-secundario/40">{ind.unidad}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* PROYECTOS */}
        <div className="flex flex-col rounded-3xl bg-acento/10 p-7">
          <div className="flex items-center gap-2.5">
            <FolderKanban size={20} className="text-acento" />
            <h2 className="font-display text-xl">Proyectos</h2>
            <Link href="/observatorio/proyectos" className="ml-auto rounded-lg border border-acento/40 px-3 py-1 text-xs font-semibold text-acento hover:opacity-80">
              Ver todo →
            </Link>
          </div>
          <ul className="mt-5 flex-1 space-y-2.5">
            {proyectos.map((p) => (
              <li key={p.nombre} className="flex items-center justify-between rounded-xl bg-secundario/60 px-4 py-2.5">
                <div>
                  <p className="text-sm font-medium line-clamp-1">{p.nombre}</p>
                  {p.area && <p className="text-xs text-principal/40">{p.area}</p>}
                </div>
                <span className="ml-2 shrink-0 rounded-lg bg-acento/20 px-2 py-0.5 text-xs font-semibold text-acento">{p.tipo}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* AGENDA */}
        <div className="flex flex-col rounded-3xl p-7" style={{ backgroundColor: "#e8f5e9" }}>
          <div className="flex items-center gap-2.5">
            <CalendarDays size={20} style={{ color: "#2d6a4f" }} />
            <h2 className="font-display text-xl" style={{ color: "#2d6a4f" }}>Agenda cultural</h2>
            <Link href="/observatorio/agenda" className="ml-auto rounded-lg border px-3 py-1 text-xs font-semibold hover:opacity-80" style={{ borderColor: "#2d6a4f", color: "#2d6a4f" }}>
              Ver todo →
            </Link>
          </div>
          <ul className="mt-5 flex-1 space-y-2.5">
            {agenda.map((ev) => (
              <li key={ev.titulo} className="rounded-xl bg-white/70 px-4 py-2.5">
                <p className="text-sm font-medium line-clamp-1">{ev.titulo}</p>
                <p className="text-xs text-principal/50">{ev.fecha}{ev.lugar ? ` · ${ev.lugar}` : ""}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* OFERTA ACADÉMICA */}
        <div className="flex flex-col rounded-3xl bg-joven/10 p-7">
          <div className="flex items-center gap-2.5">
            <GraduationCap size={20} className="text-principal/60" />
            <h2 className="font-display text-xl">Oferta académica</h2>
            <Link href="/observatorio/oferta-academica" className="ml-auto rounded-lg border border-principal/20 px-3 py-1 text-xs font-semibold text-principal/60 hover:opacity-80">
              Ver todo →
            </Link>
          </div>
          {instituciones.length === 0 ? (
            <p className="mt-4 text-sm text-principal/40">Todavía no hay instituciones cargadas.</p>
          ) : (
            <ul className="mt-5 flex-1 space-y-2.5">
              {instituciones.map((inst) => (
                <li key={inst.id}>
                  <Link href={`/observatorio/oferta-academica/${inst.slug}`} className="flex items-center justify-between rounded-xl bg-secundario/60 px-4 py-2.5 hover:bg-secundario transition-colors">
                    <p className="text-sm font-medium line-clamp-1">{inst.nombre}</p>
                    <span className="ml-2 shrink-0 text-xs text-principal/40">{inst._count.carreras} carr.</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* INVESTIGACIÓN */}
        <div className="flex flex-col rounded-3xl bg-principal/5 p-7">
          <div className="flex items-center gap-2.5">
            <Microscope size={20} className="text-principal/60" />
            <h2 className="font-display text-xl">Investigación</h2>
            <Link href="/observatorio/investigacion" className="ml-auto rounded-lg border border-principal/20 px-3 py-1 text-xs font-semibold text-principal/60 hover:opacity-80">
              Ver todo →
            </Link>
          </div>
          {cientificas.length === 0 ? (
            <p className="mt-4 text-sm text-principal/40">Todavía no hay instituciones cargadas.</p>
          ) : (
            <ul className="mt-5 flex-1 space-y-2.5">
              {cientificas.map((inst) => (
                <li key={inst.id}>
                  <Link href={`/observatorio/investigacion/${inst.slug}`} className="flex items-center justify-between rounded-xl bg-secundario/80 px-4 py-2.5 hover:bg-secundario transition-colors">
                    <p className="text-sm font-medium line-clamp-1">{inst.nombre}</p>
                    <span className="ml-2 shrink-0 text-xs text-principal/40">{inst._count.servicios} serv.</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* HERRAMIENTAS */}
        <div className="flex flex-col rounded-3xl p-7" style={{ backgroundColor: "#ede9fe" }}>
          <div className="flex items-center gap-2.5">
            <Wrench size={20} style={{ color: "#6d28d9" }} />
            <h2 className="font-display text-xl" style={{ color: "#6d28d9" }}>Herramientas</h2>
            <Link href="/observatorio/herramientas" className="ml-auto rounded-lg border px-3 py-1 text-xs font-semibold hover:opacity-80" style={{ borderColor: "#6d28d9", color: "#6d28d9" }}>
              Ver todo →
            </Link>
          </div>
          <div className="mt-5 flex-1 grid grid-cols-2 gap-2.5">
            {herramientas.map((h: any) => (
              <a key={h.id} href={h.enlace} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 rounded-xl bg-white/60 px-3 py-2.5 transition-colors hover:bg-white">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-principal/10 font-display text-xs font-bold text-principal/40">
                  {h.nombre.charAt(0)}
                </div>
                <p className="text-xs font-medium line-clamp-1">{h.nombre}</p>
              </a>
            ))}
          </div>
        </div>

        {/* NOTAS — ocupa todo el ancho */}
        <div className="flex flex-col rounded-3xl border border-principal/10 p-7 sm:col-span-2">
          <div className="flex items-center gap-2.5">
            <FileText size={20} className="text-principal/50" />
            <h2 className="font-display text-xl">Notas del Observatorio</h2>
            <Link href="/observatorio/notas" className="ml-auto rounded-lg border border-principal/15 px-3 py-1 text-xs font-semibold text-principal/50 hover:opacity-80">
              Ver todo →
            </Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {notas.map((n) => (
              <Link key={n.slug} href={`/observatorio/notas/${n.slug}`} className="block rounded-2xl border border-principal/8 bg-secundario/50 p-5 transition-colors hover:border-acento">
                <p className="font-display text-lg">{n.titulo}</p>
                <p className="mt-2 text-sm text-principal/50 line-clamp-2">{n.resumen}</p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
