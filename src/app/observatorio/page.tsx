export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { BarChart2, FolderKanban, CalendarDays, GraduationCap, Microscope, Wrench, FileText } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { INDICADORES_DEMO, PROYECTOS_DEMO, AGENDA_DEMO, NOTAS_OBSERVATORIO_DEMO } from "@/lib/demo-data";
import { HERRAMIENTAS_DEMO } from "@/lib/herramientas";

export const metadata: Metadata = {
  title: "Data · Chascomús",
};

async function getResumen() {
  try {
    const [indicadores, proyectos, agenda, notas, instituciones, cientificas] = await Promise.all([
      prisma.indicador.findMany({ orderBy: { updatedAt: "desc" }, take: 6 }),
      prisma.proyectoLocal.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
      prisma.eventoAgenda.findMany({ orderBy: [{ orden: "asc" }, { createdAt: "desc" }], take: 3 }),
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
      proyectos: proyectos.length ? proyectos : PROYECTOS_DEMO.slice(0, 4).map((p) => ({ ...p, tipo: "publico", imagen: "", logoUrl: "" })),
      agenda: agenda.length ? agenda.map((ev) => ({ titulo: ev.titulo, fecha: ev.fecha.toLocaleDateString("es-AR", { day: "numeric", month: "short" }), lugar: ev.lugar ?? "", imagen: (ev as any).imagen ?? "" })) : AGENDA_DEMO.map((a) => ({ ...a, imagen: "" })),
      notas: notas.length ? notas.map((n) => ({ slug: n.slug, titulo: n.titulo, resumen: n.contenido.replace(/<[^>]+>/g, "").slice(0, 100) })) : NOTAS_OBSERVATORIO_DEMO,
      instituciones,
      cientificas,
      herramientas,
    };
  } catch {
    return {
      indicadores: INDICADORES_DEMO,
      proyectos: PROYECTOS_DEMO.slice(0, 4).map((p) => ({ ...p, tipo: "publico", imagen: "", logoUrl: "" })),
      agenda: AGENDA_DEMO.map((a) => ({ ...a, imagen: "" })),
      notas: NOTAS_OBSERVATORIO_DEMO,
      instituciones: [], cientificas: [],
      herramientas: HERRAMIENTAS_DEMO.slice(0, 6),
    };
  }
}

export default async function ObservatorioPage() {
  const header = await getPageHeader("observatorio", { eyebrow: "Data", title: "Observatorio de Chascomús", description: "Un espacio de seguimiento del desarrollo local." });
  const { indicadores, proyectos, agenda, notas, instituciones, cientificas, herramientas } = await getResumen();

  return (
    <section className="mx-auto max-w-editorial px-5 py-12 lg:px-8">
      <p className="eyebrow text-acento">{header.eyebrow}</p>
      <div className="mt-3"><ObservatorioNav active="/observatorio" /></div>
      <h1 className="mt-6 font-display text-4xl">{header.title}</h1>
      <p className="mt-2 text-principal/60">{header.description}</p>

      {/* BENTO — columna izquierda grande + derecha */}
      <div className="mt-10 grid gap-5 lg:grid-cols-[1.35fr_1fr]">

        {/* INDICADORES — card grande azul medio */}
        <div className="flex flex-col rounded-3xl p-8 text-secundario lg:row-span-2" style={{ backgroundColor: "#2d4a60" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-joven/20">
              <BarChart2 size={18} className="text-joven" />
            </div>
            <h2 className="font-display text-xl">Indicadores</h2>
            <Link href="/observatorio/indicadores" className="ml-auto rounded-lg border border-joven/50 bg-joven/10 px-3 py-1 text-xs font-semibold text-joven hover:bg-joven/20">
              Ver todo →
            </Link>
          </div>
          <div className="mt-6 grid flex-1 grid-cols-2 gap-4">
            {indicadores.map((ind) => (
              <div key={ind.nombre + ind.periodo} className="rounded-2xl border border-secundario/12 bg-secundario/5 p-5">
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

        {/* INICIATIVAS */}
        <div className="flex flex-col rounded-3xl bg-acento p-6 text-secundario">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secundario/15">
              <FolderKanban size={16} className="text-secundario" />
            </div>
            <h2 className="font-display text-lg">Iniciativas</h2>
            <Link href="/observatorio/proyectos" className="ml-auto rounded-lg border border-secundario/30 px-3 py-1 text-xs font-semibold text-secundario hover:bg-secundario/10">
              Ver todo →
            </Link>
          </div>
          <ul className="mt-4 flex-1 space-y-2">
            {proyectos.map((p: any) => (
              <li key={p.nombre} className="flex items-center gap-2.5 rounded-xl bg-secundario/10 px-4 py-2.5">
                {p.logoUrl ? (
                  <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-lg bg-white">
                    <Image src={p.logoUrl} alt={p.nombre} fill className="object-contain p-0.5" />
                  </div>
                ) : (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secundario/20 text-xs font-bold text-secundario">
                    {p.nombre.charAt(0)}
                  </span>
                )}
                <p className="text-sm font-medium text-secundario line-clamp-1">{p.nombre}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* AGENDA + HERRAMIENTAS en fila */}
        <div className="grid grid-cols-2 gap-5">

          {/* Agenda */}
          <div className="flex flex-col rounded-3xl p-5" style={{ backgroundColor: "#2d6a4f", color: "white" }}>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">
                <CalendarDays size={14} className="text-white" />
              </div>
              <h2 className="font-display text-base">Agenda</h2>
              <Link href="/observatorio/agenda" className="ml-auto text-xs font-semibold text-white/70 hover:text-white">Ver →</Link>
            </div>
            <ul className="mt-3 flex-1 space-y-2">
              {agenda.map((ev: any) => (
                <li key={ev.titulo} className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
                  {ev.imagen ? (
                    <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded bg-white/20">
                      <Image src={ev.imagen} alt={ev.titulo} fill className="object-cover" />
                    </div>
                  ) : (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-white/15 text-xs">📅</span>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white line-clamp-1">{ev.titulo}</p>
                    <p className="text-xs text-white/50">{ev.fecha}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Herramientas */}
          <div className="flex flex-col rounded-3xl p-5" style={{ backgroundColor: "#6d28d9", color: "white" }}>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">
                <Wrench size={14} className="text-white" />
              </div>
              <h2 className="font-display text-base">Herramientas</h2>
              <Link href="/observatorio/herramientas" className="ml-auto text-xs font-semibold text-white/70 hover:text-white">Ver →</Link>
            </div>
            <div className="mt-3 flex-1 grid grid-cols-2 gap-1.5">
              {herramientas.slice(0, 6).map((h: any) => (
                <a key={h.id} href={h.enlace} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2 py-1.5 hover:bg-white/20 transition-colors">
                  {h.logoUrl ? (
                    <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded bg-white">
                      <Image src={h.logoUrl} alt={h.nombre} fill className="object-contain p-0.5" />
                    </div>
                  ) : (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white/20 text-xs font-bold text-white">
                      {h.nombre.charAt(0)}
                    </span>
                  )}
                  <span className="text-xs font-medium text-white line-clamp-1">{h.nombre}</span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* FILA 2 — Oferta + Investigación + Notas */}
      <div className="mt-5 grid gap-5 sm:grid-cols-3">

        {/* Oferta académica */}
        <div className="flex flex-col rounded-3xl p-6" style={{ backgroundColor: "#b45309", color: "white" }}>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
              <GraduationCap size={16} className="text-white" />
            </div>
            <h2 className="font-display text-lg">Oferta académica</h2>
            <Link href="/observatorio/oferta-academica" className="ml-auto text-xs font-semibold text-white/70 hover:text-white">Ver →</Link>
          </div>
          {instituciones.length === 0 ? (
            <p className="mt-4 text-xs text-white/50">Sin instituciones cargadas.</p>
          ) : (
            <ul className="mt-4 flex-1 space-y-2">
              {instituciones.map((inst) => (
                <li key={inst.id}>
                  <Link href={`/observatorio/oferta-academica/${inst.slug}`} className="flex items-center gap-2.5 rounded-xl bg-white/10 px-3 py-2.5 hover:bg-white/20 transition-colors">
                    {inst.logoUrl ? (
                      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-white">
                        <Image src={inst.logoUrl} alt={inst.nombre} fill className="object-contain p-1" />
                      </div>
                    ) : (
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20 text-sm font-bold text-white">
                        {inst.nombre.charAt(0)}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white line-clamp-1">{inst.nombre}</p>
                      <p className="text-xs text-white/50">{inst._count.carreras} carrera(s)</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Investigación */}
        <div className="flex flex-col rounded-3xl bg-principal/90 p-6 text-secundario">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secundario/10">
              <Microscope size={16} className="text-secundario/70" />
            </div>
            <h2 className="font-display text-lg">Investigación</h2>
            <Link href="/observatorio/investigacion" className="ml-auto text-xs font-semibold text-secundario/60 hover:text-secundario">Ver →</Link>
          </div>
          {cientificas.length === 0 ? (
            <p className="mt-4 text-xs text-secundario/40">Sin instituciones cargadas.</p>
          ) : (
            <ul className="mt-4 flex-1 space-y-2">
              {cientificas.map((inst) => (
                <li key={inst.id}>
                  <Link href={`/observatorio/investigacion/${inst.slug}`} className="flex items-center gap-2.5 rounded-xl bg-secundario/8 px-3 py-2.5 hover:bg-secundario/15 transition-colors">
                    {inst.logoUrl ? (
                      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-white">
                        <Image src={inst.logoUrl} alt={inst.nombre} fill className="object-contain p-1" />
                      </div>
                    ) : (
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secundario/15 text-sm font-bold text-secundario/50">
                        {inst.nombre.charAt(0)}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-secundario line-clamp-1">{inst.nombre}</p>
                      <p className="text-xs text-secundario/40">{inst._count.servicios} servicio(s)</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Notas */}
        <div className="flex flex-col rounded-3xl border-2 border-principal/15 p-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-principal/8">
              <FileText size={16} className="text-principal/60" />
            </div>
            <h2 className="font-display text-lg">Notas</h2>
            <Link href="/observatorio/notas" className="ml-auto text-xs font-semibold text-principal/50 hover:text-acento">Ver →</Link>
          </div>
          <div className="mt-4 flex-1 space-y-3">
            {notas.map((n) => (
              <Link key={n.slug} href={`/observatorio/notas/${n.slug}`} className="block rounded-xl border border-principal/10 bg-secundario/50 p-4 hover:border-acento transition-colors">
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
