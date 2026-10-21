export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FolderKanban, CalendarDays, GraduationCap, Microscope, Wrench, FileText } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import { Strip, Panel, DonutChart, BarList, SectionTile, contar } from "@/components/observatorio/TableroUi";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Data · Chascomús",
  description: "Indicadores, iniciativas, agenda, oferta académica, ciencia y tecnología y herramientas de Chascomús.",
};

const TIPO_LABEL: Record<string, string> = {
  publico: "Público",
  privado: "Privado",
  mixto: "Mixto",
  comunitario: "Comunitario",
  internacional: "Internacional",
};

const MODALIDAD_LABEL: Record<string, string> = {
  presencial: "Presencial",
  virtual: "Virtual",
  mixta: "Mixta",
};

async function getData() {
  try {
    const [indicadores, proyectos, eventos, notas, academicas, cientificas, carreras] = await Promise.all([
      prisma.indicador.findMany({ orderBy: { updatedAt: "desc" } }),
      prisma.proyectoLocal.findMany({ orderBy: [{ orden: "asc" }, { createdAt: "desc" }] }),
      prisma.eventoAgenda.findMany({ orderBy: [{ orden: "asc" }, { createdAt: "desc" }] }),
      prisma.notaObservatorio.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
      prisma.institucionAcademica.findMany({
        orderBy: { nombre: "asc" },
        include: { _count: { select: { carreras: true } } },
      }),
      prisma.institucionCientifica.findMany({
        orderBy: { nombre: "asc" },
        include: { _count: { select: { servicios: true } } },
      }),
      prisma.carreraOferta.findMany({ select: { modalidad: true } }),
    ]);

    let herramientas: any[] = [];
    try {
      herramientas = await (prisma as any).herramientaTecnologica.findMany({
        orderBy: [{ orden: "asc" }, { nombre: "asc" }],
      });
    } catch {
      herramientas = [];
    }

    return { indicadores, proyectos, eventos, notas, academicas, cientificas, carreras, herramientas };
  } catch {
    return {
      indicadores: [] as any[],
      proyectos: [] as any[],
      eventos: [] as any[],
      notas: [] as any[],
      academicas: [] as any[],
      cientificas: [] as any[],
      carreras: [] as any[],
      herramientas: [] as any[],
    };
  }
}

function Avatar({ src, name }: { src?: string | null; name: string }) {
  if (src) {
    return (
      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-principal/10 bg-white">
        <Image src={src} alt={name} fill className="object-contain p-1" />
      </div>
    );
  }
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-principal/10 text-sm font-medium text-principal/50">
      {name.charAt(0)}
    </span>
  );
}

function Vacio({ texto }: { texto: string }) {
  return <p className="text-xs text-principal/50">{texto}</p>;
}

export default async function ObservatorioPage() {
  const header = await getPageHeader("observatorio", {
    eyebrow: "Data",
    title: "Observatorio de Chascomús",
    description: "Un espacio de seguimiento del desarrollo local.",
  });
  const { indicadores, proyectos, eventos, notas, academicas, cientificas, carreras, herramientas } = await getData();

  const kpis = indicadores.slice(0, 5).map((ind: any) => ({
    label: ind.nombre as string,
    value: Number(ind.valor).toLocaleString("es-AR"),
    unit: ind.unidad as string,
    caption: ind.periodo as string,
  }));

  const porTema = contar(indicadores, (i: any) => i.categoria || "Sin categoría").slice(0, 6);
  const porTipo = contar(proyectos, (p: any) => TIPO_LABEL[p.tipo] ?? p.tipo);
  const porModalidad = contar(carreras, (c: any) => MODALIDAD_LABEL[c.modalidad] ?? c.modalidad);

  return (
    <section className="mx-auto max-w-editorial px-5 py-12 lg:px-8">
      <p className="eyebrow text-acento">{header.eyebrow}</p>
      <div className="mt-3">
        <ObservatorioNav active="/observatorio" />
      </div>
      <h1 className="mt-6 font-display text-4xl">{header.title}</h1>
      <p className="mt-2 text-principal/60">{header.description}</p>

      {/* Franja de resumen */}
      {kpis.length > 0 && (
        <div className="mt-8">
          <Strip label="Resumen general" tone="joven" items={kpis} />
        </div>
      )}

      {/* Gráficos */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Panel n={1} title="Indicadores por tema">
          <BarList data={porTema} />
        </Panel>
        <Panel n={2} title="Iniciativas por tipo">
          <DonutChart data={porTipo} />
        </Panel>
        <Panel n={3} title="Carreras por modalidad">
          <DonutChart data={porModalidad} />
        </Panel>
      </div>

      {/* Secciones */}
      <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <SectionTile
          title="Iniciativas"
          href="/observatorio/proyectos"
          tone="acento"
          icon={<FolderKanban size={18} />}
          meta={`${proyectos.length} cargadas`}
        >
          {proyectos.length === 0 ? (
            <Vacio texto="Todavía no hay iniciativas cargadas." />
          ) : (
            <ul className="space-y-3">
              {proyectos.slice(0, 3).map((p: any) => (
                <li key={p.id} className="flex items-center gap-3">
                  <Avatar src={p.logoUrl} name={p.nombre} />
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-sm font-medium">{p.nombre}</p>
                    <p className="text-xs text-principal/50">{p.area || TIPO_LABEL[p.tipo] || p.tipo}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionTile>

        <SectionTile
          title="Agenda"
          href="/observatorio/agenda"
          tone="joven"
          icon={<CalendarDays size={18} />}
          meta={`${eventos.length} eventos`}
        >
          {eventos.length === 0 ? (
            <Vacio texto="Todavía no hay eventos cargados." />
          ) : (
            <ul className="space-y-3">
              {eventos.slice(0, 3).map((ev: any) => (
                <li key={ev.id} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-joven/25 text-principal">
                    <span className="text-sm font-medium leading-none">{new Date(ev.fecha).getDate()}</span>
                    <span className="text-[10px] leading-none">
                      {new Date(ev.fecha).toLocaleDateString("es-AR", { month: "short" })}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-sm font-medium">{ev.titulo}</p>
                    {ev.lugar && <p className="line-clamp-1 text-xs text-principal/50">{ev.lugar}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionTile>

        <SectionTile
          title="Oferta académica"
          href="/observatorio/oferta-academica"
          tone="principal"
          icon={<GraduationCap size={18} />}
          meta={`${academicas.length} instituciones · ${carreras.length} carreras`}
        >
          {academicas.length === 0 ? (
            <Vacio texto="Todavía no hay instituciones cargadas." />
          ) : (
            <ul className="space-y-3">
              {academicas.slice(0, 3).map((inst: any) => (
                <li key={inst.id} className="flex items-center gap-3">
                  <Avatar src={inst.logoUrl} name={inst.nombre} />
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-sm font-medium">{inst.nombre}</p>
                    <p className="text-xs text-principal/50">{inst._count.carreras} carrera(s)</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionTile>

        <SectionTile
          title="Ciencia y Tecnología"
          href="/observatorio/investigacion"
          tone="principal"
          icon={<Microscope size={18} />}
          meta={`${cientificas.length} instituciones`}
        >
          {cientificas.length === 0 ? (
            <Vacio texto="Todavía no hay instituciones cargadas." />
          ) : (
            <ul className="space-y-3">
              {cientificas.slice(0, 3).map((inst: any) => (
                <li key={inst.id} className="flex items-center gap-3">
                  <Avatar src={inst.logoUrl} name={inst.nombre} />
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-sm font-medium">{inst.nombre}</p>
                    <p className="text-xs text-principal/50">{inst._count.servicios} servicio(s)</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionTile>

        <SectionTile
          title="Herramientas"
          href="/observatorio/herramientas"
          tone="joven"
          icon={<Wrench size={18} />}
          meta={`${herramientas.length} disponibles`}
        >
          {herramientas.length === 0 ? (
            <Vacio texto="Todavía no hay herramientas cargadas." />
          ) : (
            <ul className="grid grid-cols-2 gap-x-3 gap-y-2.5">
              {herramientas.slice(0, 6).map((h: any) => (
                <li key={h.id} className="flex items-center gap-2">
                  <Avatar src={h.logoUrl} name={h.nombre} />
                  <span className="line-clamp-1 text-xs font-medium">{h.nombre}</span>
                </li>
              ))}
            </ul>
          )}
        </SectionTile>

        <SectionTile
          title="Notas"
          href="/observatorio/notas"
          tone="acento"
          icon={<FileText size={18} />}
          meta={notas.length > 0 ? "Últimas publicadas" : undefined}
        >
          {notas.length === 0 ? (
            <Vacio texto="Todavía no hay notas publicadas." />
          ) : (
            <ul className="space-y-3">
              {notas.map((n: any) => (
                <li key={n.id}>
                  <Link href={`/observatorio/notas/${n.slug}`} className="line-clamp-2 text-sm font-medium hover:text-acento">
                    {n.titulo}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionTile>
      </div>

      {/* Cierre */}
      <Link
        href="/observatorio/indicadores"
        className="mt-5 flex items-center justify-between rounded-2xl bg-principal px-6 py-4 text-secundario transition-opacity hover:opacity-90"
      >
        <span className="font-display text-lg">Explorá todos los indicadores</span>
        <span className="text-sm font-medium text-joven">Ver indicadores →</span>
      </Link>
    </section>
  );
}
