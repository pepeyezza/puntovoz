export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import DataSeccionWrapper from "@/components/observatorio/DataSeccionWrapper";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Agenda · Data" };

async function getAgenda() {
  try {
    const agenda = await prisma.eventoAgenda.findMany({ orderBy: { fecha: "asc" } });
    return agenda.map((ev) => ({
      titulo: ev.titulo, descripcion: ev.descripcion ?? "",
      fecha: ev.fecha.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }),
      lugar: ev.lugar ?? "", categoria: ev.categoria ?? "", enlace: (ev as any).enlace ?? "",
    }));
  } catch { return []; }
}

export default async function AgendaPage() {
  const agenda = await getAgenda();
  return (
    <DataSeccionWrapper seccion="/observatorio/agenda">
      <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
        <header className="max-w-2xl">
          <p className="eyebrow" style={{ color: "#2d6a4f" }}>Data</p>
          <h1 className="mt-2 font-display text-4xl">Agenda cultural</h1>
          <p className="mt-4 text-principal/70">Proximas actividades, ferias y encuentros comunitarios del partido.</p>
        </header>
        <div className="mt-10"><ObservatorioNav active="/observatorio/agenda" /></div>
        {agenda.length === 0 ? (
          <p className="mt-10 text-principal/50">Todavia no hay eventos cargados.</p>
        ) : (
          <ol className="mt-10 space-y-6 border-l-2 pl-6" style={{ borderColor: "#2d6a4f" }}>
            {agenda.map((ev) => (
              <li key={ev.titulo} className="relative">
                <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#2d6a4f" }} />
                <p className="text-sm font-semibold" style={{ color: "#2d6a4f" }}>{ev.fecha}</p>
                <p className="mt-1 font-display text-xl">{ev.titulo}</p>
                {ev.descripcion && <p className="mt-1 text-sm text-principal/70">{ev.descripcion}</p>}
                <p className="mt-1 text-sm text-principal/50">{ev.lugar}{ev.categoria ? ` - ${ev.categoria}` : ""}</p>
                {ev.enlace && (
                  <a href={ev.enlace} target="_blank" rel="noreferrer" className="mt-2 inline-block rounded-full border px-4 py-1 text-xs font-medium" style={{ borderColor: "#2d6a4f", color: "#2d6a4f" }}>
                    Ver mas
                  </a>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>
    </DataSeccionWrapper>
  );
}
