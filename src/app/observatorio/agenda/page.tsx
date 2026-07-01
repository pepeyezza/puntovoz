export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AGENDA_DEMO } from "@/lib/demo-data";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";

export const metadata: Metadata = {
  title: "Agenda cultural · Observatorio",
  description: "Próximos eventos culturales, productivos y comunitarios en Chascomús.",
};

async function getAgenda() {
  try {
    const agenda = await prisma.eventoAgenda.findMany({ orderBy: { fecha: "asc" } });
    if (agenda.length === 0) return AGENDA_DEMO;
    return agenda.map((ev) => ({
      titulo: ev.titulo,
      fecha: ev.fecha.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }),
      lugar: ev.lugar ?? "",
      categoria: ev.categoria ?? "",
    }));
  } catch {
    return AGENDA_DEMO;
  }
}

export default async function AgendaPage() {
  const agenda = await getAgenda();

  return (
    <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
      <header className="max-w-2xl">
        <p className="eyebrow text-acento">Data</p>
        <h1 className="mt-2 font-display text-4xl">Agenda cultural</h1>
        <p className="mt-4 text-principal/70">
          Próximas actividades, ferias y encuentros comunitarios del partido.
        </p>
      </header>

      <div className="mt-10">
        <ObservatorioNav active="/observatorio/agenda" />
      </div>

      <ol className="mt-10 space-y-4 border-l border-principal/15 pl-6">
        {agenda.map((ev) => (
          <li key={ev.titulo} className="relative">
            <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-joven" />
            <p className="text-sm font-semibold text-acento">{ev.fecha}</p>
            <p className="mt-1 font-display text-xl">{ev.titulo}</p>
            <p className="mt-1 text-sm text-principal/60">
              {ev.lugar}{ev.categoria ? (' · ' + ev.categoria) : ''}
            </p>
            {(ev as any).enlace && (
              <a href={(ev as any).enlace} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs font-medium text-acento hover:underline">
                Ver más →
              </a>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
