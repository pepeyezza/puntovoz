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
  description: "Indicadores, iniciativas, agenda, oferta académica, investigación y herramientas de Chascomús.",
};

async function getResumen() {
  try {
    const [indicadores, proyectos, agenda, notas, instituciones, cientificas] = await Promise.all([
      prisma.indicador.findMany({ orderBy: { updatedAt: "desc" }, take: 6 }),
      prisma.proyectoLocal.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
      prisma.eventoAgenda.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
      prisma.notaObservatorio.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 2 }),
      prisma.institucionAcademica.findMany({ orderBy: { nombre: "asc" }, take: 3, include: { _count: { select: { carreras: true } } } }),
      prisma.institucionCientifica.findMany({ orderBy: { nombre: "asc" }, take: 3, include: { _count: { select: { servicios: true } } } }),
    ]);

    let herramientas: any[] = [];
    try {
      const h = await (prisma as any).herramientaTecnologica.findMany({ orderBy: { nombre: "asc" }, take: 6 });
      herramientas = h.length ? h : HERRAMIENTAS_DEMO.slice(0, 6);
    } catch { herramientas = HERRAMIENTAS_DEMO.slice(0, 6); }

    return {
      indicadores: indicadores.length ? indicadores : INDICADORES_DEMO,
      proyectos: proyectos.length
        ? proyectos.map((p) => ({ nombre: p.nombre, area: p.area ?? "", tipo: p.tipo, imagen: (p as any).imagen ?? "" }))
        : PROYECTOS_DEMO.slice(0, 4).map((p) => ({ ...p, tipo: "publico", imagen: "" })),
      agenda: agenda.length
        ? agenda.map((ev) => ({ titulo: ev.titulo, fecha: ev.fecha.toLocaleDateString("es-AR", { day: "numeric", month: "short" }), lugar: ev.lugar ?? "" }))
        : AGENDA_DEMO,
      notas: notas.length
        ? notas.map((n) => ({ slug: n.slug, titulo: n.titulo, resumen: n.contenido.replace(/<[^>]+>/g, "").slice(0, 100) }))
        : NOTAS_OBSERVATORIO_DEMO,
      instituciones,
      cientificas,
      herramientas,
    };
  } catch {
    let herramientas: any[] = HERRAMIENTAS_DEMO.slice(0, 6);
    return {
      indicadores: INDICADORES_DEMO,
      proyectos: PROYECTOS_DEMO.slice(0, 4).map((p) => ({ ...p, tipo: "publico", imagen: "" })),
      agenda: AGENDA_DEMO,
      notas: NOTAS_OBSERVATORIO_DEMO,
      instituciones: [], cientificas: [], herramientas,
    };
  }
}

export default async function ObservatorioPage() {
  const header = await getPageHeader("observatorio", {
    eyebrow: "Data", title: "Observatorio de Chascomús",
    description: "Un espacio de seguimiento del desarrollo local.",
  });
  const { indicadores, proyectos, agenda, notas, instituciones, cientificas, herramientas } = await getResumen();

  return (
    <section className="mx-auto max-w-editorial px-5 py-12 lg:px-8">
      <p className="eyebrow text-acento">{header.eyebrow}</p>
      <div className="mt-3"><ObservatorioNav active="/observatorio" /></div>
      <h1 className="mt-6 font-display text-4xl">{header.title}</h1>
      <p className="mt-2 text-principal/60">{header.description}</p>

      {/* BENTO GRID — columna izquierda grande + derecha chica */}
      <div className="mt-10 grid gap-5 lg:grid-cols-[1.35fr_1fr]">

        {/* COLUMNA IZQUIERDA — Indicadores (card grande) */}
        <div className="flex flex-col rounded-3xl bg-principal p-8 text-secundario lg:row-span-2">
          <div className="flex items-center gap-3">
            <BarChart2 size={20} className="text-joven" />
            <h2 className="font-display text-xl">Indicadores</h2>
            <Link href="/observatorio/indicadores" className="ml-auto rounded-lg border border-joven/40 px-3 py-1 text-xs font-semibold text-joven hover:opacity-80">
              Ver todo →
            </Link>
          </div>
          <div className="mt-6 grid flex-1 grid-cols-2 gap-4">
            {indicadores.map((ind) => (
              <div key={ind.nombre + ind.periodo} className="rounded-2xl border border-secundario/10 p-5">
                <p className="text-xs text-secundario/40 line-clamp-1">{ind.categoria}</p>
                <p className="mt-2 text-sm text-secundario/65 line-clamp-2">{ind.nombre}</p>
                <p className="mt-3 font-display text-3xl text-joven">
                  {ind.valor.toLocaleString("es-AR")}<span className="ml-1 text-sm text-secundario/40">{ind.unidad}</span>
                </p>
                <p className="mt-1 text-xs text-secundario/30">{ind.periodo}</p>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA — arriba: Iniciativas */}
        <div className="flex flex-col rounded-3xl bg-acento/10 p-6">
          <div className="flex items-center gap-2.5">
            <FolderKanban size={18} className="text-acento" />
            <h2 className="font-display text-lg">Iniciativas</h2>
            <Link href="/observatorio/proyectos" className="ml-auto rounded-lg border border-acento/30 px-3 py-1 text-xs font-semibold text-acento hover:opacity-80">
              Ver todo →
            </Link>
          </div>
          <ul className="mt-4 flex-1 space-y-2">
            {proyectos.map((p) => (
              <li key={p.nombre} className="flex items-center gap-2.5 rounded-xl bg-secundario/60 px-4 py-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-acento/15 text-xs font-bold text-acento">
                  {p.nombre.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium line-clamp-1">{p.nombre}</p>
                  {p.area && <p className="text-xs text-principal/40">{p.area}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMNA DERECHA — abajo: Agenda + Herramientas en grilla */}
        <div className="grid grid-cols-2 gap-5">

          {/* Agenda */}
          <div className="flex flex-col rounded-3xl p-5" style={{ backgroundColor: "#e8f5e9" }}>
            <div className="flex items-center gap-2">
              <CalendarDays size={16} style={{ color: "#2d6a4f" }} />
              <h2 className="font-display text-base" style={{ color: "#2d6a4f" }}>Agenda</h2>
              <Link href="/observatorio/agenda" className="ml-auto text-xs font-semibold hover:opacity-80" style={{ color: "#2d6a4f" }}>Ver →</Link>
            </div>
            <ul className="mt-3 flex-1 space-y-2">
              {agenda.map((ev) => (
                <li key={ev.titulo} className="rounded-xl bg-white/70 px-3 py-2">
                  <p className="text-xs font-medium line-clamp-1">{ev.titulo}</p>
                  <p className="text-xs text-principal/40">{ev.fecha}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Herramientas */}
          <div className="flex flex-col rounded-3xl p-5" style={{ backgroundColor: "#ede9fe" }}>
            <div className="flex items-center gap-2">
              <Wrench size={16} style={{ color: "#6d28d9" }} />
              <h2 className="font-display text-base" style={{ color: "#6d28d9" }}>Herramientas</h2>
              <Link href="/observatorio/herramientas" className="ml-auto text-xs font-semibold hover:opacity-80" style={{ color: "#6d28d9" }}>Ver →</Link>
            </div>
            <div className="mt-3 flex-1 grid grid-cols-2 gap-2">
              {herramientas.slice(0, 6).map((h: any) => (
                <a key={h.id} href={h.enlace} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-white/60 px-2.5 py-2 hover:bg-white transition-colors">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-principal/10 text-xs font-bold text-principal/40">
                    {h.nombre.charAt(0)}
                  </span>
                  <span className="text-xs font-medium line-clamp-1">{h.nombre}</span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* FILA 2 — Oferta + Investigación + Notas */}
      <div className="mt-5 grid gap-5 sm:grid-cols-3">

        {/* Oferta académica */}
        <div className="flex flex-col rounded-3xl bg-joven/10 p-6">
          <div className="flex items-center gap-2.5">
            <GraduationCap size={18} className="text-principal/60" />
            <h2 className="font-display text-lg">Oferta académica</h2>
            <Link href="/observatorio/oferta-academica" className="ml-auto text-xs font-semibold text-principal/50 hover:opacity-80">Ver →</Link>
          </div>
          {instituciones.length === 0 ? (
            <p className="mt-4 text-xs text-principal/40">Sin instituciones cargadas.</p>
          ) : (
            <ul className="mt-4 flex-1 space-y-2">
              {instituciones.map((inst) => (
                <li key={inst.id}>
                  <Link href={`/observatorio/oferta-academica/${inst.slug}`} className="flex items-center gap-2.5 rounded-xl bg-secundario/60 px-3 py-2.5 hover:bg-secundario transition-colors">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-joven/30 text-xs font-bold text-principal/50">
                      {inst.nombre.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{inst.nombre}</p>
                      <p className="text-xs text-principal/40">{inst._count.carreras} carrera(s)</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Investigación */}
        <div className="flex flex-col rounded-3xl bg-principal/5 p-6">
          <div className="flex items-center gap-2.5">
            <Microscope size={18} className="text-principal/60" />
            <h2 className="font-display text-lg">Investigación</h2>
            <Link href="/observatorio/investigacion" className="ml-auto text-xs font-semibold text-principal/50 hover:opacity-80">Ver →</Link>
          </div>
          {cientificas.length === 0 ? (
            <p className="mt-4 text-xs text-principal/40">Sin instituciones cargadas.</p>
          ) : (
            <ul className="mt-4 flex-1 space-y-2">
              {cientificas.map((inst) => (
                <li key={inst.id}>
                  <Link href={`/observatorio/investigacion/${inst.slug}`} className="flex items-center gap-2.5 rounded-xl bg-secundario/80 px-3 py-2.5 hover:bg-secundario transition-colors">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-principal/10 text-xs font-bold text-principal/40">
                      {inst.nombre.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{inst.nombre}</p>
                      <p className="text-xs text-principal/40">{inst._count.servicios} servicio(s)</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Notas */}
        <div className="flex flex-col rounded-3xl border border-principal/10 p-6">
          <div className="flex items-center gap-2.5">
            <FileText size={18} className="text-principal/50" />
            <h2 className="font-display text-lg">Notas</h2>
            <Link href="/observatorio/notas" className="ml-auto text-xs font-semibold text-principal/50 hover:opacity-80">Ver →</Link>
          </div>
          <div className="mt-4 flex-1 space-y-3">
            {notas.map((n) => (
              <Link key={n.slug} href={`/observatorio/notas/${n.slug}`} className="block rounded-xl border border-principal/8 bg-secundario/50 p-4 hover:border-acento transition-colors">
                <p className="text-sm font-medium line-clamp-2">{n.titulo}</p>
                <p className="mt-1 text-xs text-principal/45 line-clamp-2">{n.resumen}</p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
