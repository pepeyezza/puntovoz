export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { BarChart2, FolderKanban, CalendarDays, GraduationCap, Microscope, Wrench, Mic2, FileText } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { INDICADORES_DEMO, ENTREVISTAS_DEMO, PROYECTOS_DEMO, AGENDA_DEMO, NOTAS_OBSERVATORIO_DEMO } from "@/lib/demo-data";
import { HERRAMIENTAS_DEMO } from "@/lib/herramientas";

export const metadata: Metadata = {
  title: "Data · Chascomús",
  description: "Indicadores, proyectos, agenda, oferta académica, investigación y herramientas de Chascomús.",
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

    // Herramientas en su propio try-catch para no romper el resto
    let herramientas: any[] = [];
    try {
      const h = await (prisma as any).herramientaTecnologica.findMany({ orderBy: { nombre: "asc" }, take: 6 });
      herramientas = h.length ? h : HERRAMIENTAS_DEMO.slice(0, 6);
    } catch {
      herramientas = HERRAMIENTAS_DEMO.slice(0, 6);
    }

    return {
      indicadores: indicadores.length ? indicadores : INDICADORES_DEMO,
      proyectos: proyectos.length
        ? proyectos.map((p) => ({ nombre: p.nombre, area: p.area ?? "", tipo: p.tipo === "publico" ? "Público" : p.tipo === "privado" ? "Privado" : "Mixto" }))
        : PROYECTOS_DEMO.map((p) => ({ ...p, tipo: "Público" })),
      agenda: agenda.length
        ? agenda.map((ev) => ({ titulo: ev.titulo, fecha: ev.fecha.toLocaleDateString("es-AR", { day: "numeric", month: "long" }), lugar: ev.lugar ?? "" }))
        : AGENDA_DEMO,
      entrevistas: entrevistas.length
        ? entrevistas.map((e) => ({ slug: e.slug, entrevistado: e.entrevistado, cargo: e.cargo ?? "", resumen: e.resumen }))
        : ENTREVISTAS_DEMO,
      notas: notas.length
        ? notas.map((n) => ({ slug: n.slug, titulo: n.titulo, resumen: n.contenido.replace(/<[^>]+>/g, "").slice(0, 120) }))
        : NOTAS_OBSERVATORIO_DEMO,
      instituciones,
      cientificas,
      herramientas,
    };
  } catch {
    let herramientas: any[] = HERRAMIENTAS_DEMO.slice(0, 6);
    try {
      const h = await (prisma as any).herramientaTecnologica.findMany({ take: 6 });
      if (h.length) herramientas = h;
    } catch {}
    return {
      indicadores: INDICADORES_DEMO,
      proyectos: PROYECTOS_DEMO.map((p) => ({ ...p, tipo: "Público" })),
      agenda: AGENDA_DEMO,
      entrevistas: ENTREVISTAS_DEMO,
      notas: NOTAS_OBSERVATORIO_DEMO,
      instituciones: [],
      cientificas: [],
      herramientas,
    };
  }
}

// Botón "Ver todo" pegado al título — no en el extremo opuesto
function SeccionHeader({ titulo, href, icono }: { titulo: string; href: string; icono: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {icono}
      <h2 className="font-display text-2xl">{titulo}</h2>
      <Link href={href} className="rounded-lg border border-current px-3 py-1 text-sm font-semibold opacity-60 transition-opacity hover:opacity-100">
        Ver todo →
      </Link>
    </div>
  );
}

export default async function ObservatorioPage() {
  const header = await getPageHeader("observatorio", {
    eyebrow: "Data",
    title: "Observatorio de Chascomús",
    description: "Un espacio de seguimiento del desarrollo local.",
  });
  const { indicadores, proyectos, agenda, entrevistas, notas, instituciones, cientificas, herramientas } = await getResumen();

  return (
    <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
      <header className="max-w-2xl">
        <p className="eyebrow text-acento">{header.eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl">{header.title}</h1>
        <p className="mt-4 text-principal/70">{header.description}</p>
      </header>

      <div className="mt-6">
        <ObservatorioNav active="/observatorio" />
      </div>

      {/* INDICADORES */}
      <div className="mt-10 rounded-3xl bg-principal p-8 text-secundario">
        <SeccionHeader titulo="Indicadores" href="/observatorio/indicadores" icono={<BarChart2 size={24} className="text-joven" />} />
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

      {/* PROYECTOS */}
      <div className="mt-6 rounded-3xl bg-acento/10 p-8">
        <SeccionHeader titulo="Proyectos" href="/observatorio/proyectos" icono={<FolderKanban size={24} className="text-acento" />} />
        <ul className="mt-6 space-y-3">
          {proyectos.map((p) => (
            <li key={p.nombre} className="flex items-center justify-between rounded-xl bg-secundario/60 px-5 py-3">
              <div>
                <p className="text-sm font-medium">{p.nombre}</p>
                <p className="text-xs text-principal/50">{p.area}</p>
              </div>
              <span className="rounded-lg bg-acento/20 px-3 py-1 text-xs font-semibold text-acento">{p.tipo}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* AGENDA */}
      <div className="mt-6 rounded-3xl p-8" style={{ backgroundColor: "#e8f5e9" }}>
        <div className="flex flex-wrap items-center gap-3">
          <CalendarDays size={24} style={{ color: "#2d6a4f" }} />
          <h2 className="font-display text-2xl" style={{ color: "#2d6a4f" }}>Agenda cultural</h2>
          <Link href="/observatorio/agenda" className="rounded-lg border px-3 py-1 text-sm font-semibold opacity-60 transition-opacity hover:opacity-100" style={{ borderColor: "#2d6a4f", color: "#2d6a4f" }}>
            Ver todo →
          </Link>
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

      {/* OFERTA ACADÉMICA */}
      <div className="mt-6 rounded-3xl bg-joven/10 p-8">
        <SeccionHeader titulo="Oferta académica" href="/observatorio/oferta-academica" icono={<GraduationCap size={24} className="text-principal/70" />} />
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

      {/* INVESTIGACIÓN */}
      <div className="mt-6 rounded-3xl bg-principal/5 p-8">
        <SeccionHeader titulo="Investigación científica" href="/observatorio/investigacion" icono={<Microscope size={24} className="text-principal/70" />} />
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

      {/* HERRAMIENTAS */}
      <div className="mt-6 rounded-3xl bg-principal/5 p-8">
        <SeccionHeader titulo="Tablero de herramientas" href="/observatorio/herramientas" icono={<Wrench size={24} className="text-principal/70" />} />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {herramientas.map((h: any) => (
            <a key={h.id} href={h.enlace} target="_blank" rel="noreferrer"
              className="flex items-center gap-3 rounded-xl bg-secundario/80 px-4 py-3 transition-colors hover:bg-secundario">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-principal/10 font-display text-sm font-bold text-principal/40">
                {h.nombre.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{h.nombre}</p>
                <p className="truncate text-xs text-principal/50">{h.categoria}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ENTREVISTAS */}
      <div className="mt-6 rounded-3xl border border-principal/10 p-8">
        <SeccionHeader titulo="Entrevistas" href="/observatorio/entrevistas" icono={<Mic2 size={24} className="text-principal/60" />} />
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

      {/* NOTAS */}
      <div className="mt-6 rounded-3xl border border-principal/10 p-8">
        <SeccionHeader titulo="Notas del Observatorio" href="/observatorio/notas" icono={<FileText size={24} className="text-principal/60" />} />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {notas.map((n) => (
            <Link key={n.slug} href={`/observatorio/notas/${n.slug}`} className="block rounded-2xl border border-principal/10 bg-secundario/50 p-5 transition-colors hover:border-acento">
              <p className="font-display text-lg">{n.titulo}</p>
              <p className="mt-2 text-sm text-principal/60">{n.resumen}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
