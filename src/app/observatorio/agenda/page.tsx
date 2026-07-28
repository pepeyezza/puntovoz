export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import DataSeccionWrapper from "@/components/observatorio/DataSeccionWrapper";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Agenda - Data" };
const VERDE = "#2d6a4f";

async function getAgenda() {
  try {
    const agenda = await prisma.eventoAgenda.findMany({ orderBy: { fecha: "asc" } });
    return agenda.map((ev) => ({
      titulo: ev.titulo, descripcion: ev.descripcion ?? "",
      fecha: ev.fecha.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }),
      lugar: ev.lugar ?? "", categoria: ev.categoria ?? "",
      enlace: (ev as any).enlace ?? "", imagen: (ev as any).imagen ?? "",
    }));
  } catch { return []; }
}

export default async function Page() {
  const header = await getPageHeader("dataAgenda", { eyebrow: "Data", title: "Agenda cultural", description: "Proximas actividades, ferias y encuentros comunitarios del partido." });
  const agenda = await getAgenda();
  return (
    <DataSeccionWrapper seccion="/observatorio/agenda">
      <section className="mx-auto max-w-editorial px-5 py-12 lg:px-8">
        <p className="eyebrow" style={{ color: VERDE }}>{header.eyebrow}</p>
        <div className="mt-3"><ObservatorioNav active="/observatorio/agenda" /></div>
        <div className="mt-6 flex items-center gap-3">
          <CalendarDays size={32} style={{ color: VERDE }} />
          <h1 className="font-display text-4xl">{header.title}</h1>
        </div>
        {header.description && <p className="mt-3 text-principal/70">{header.description}</p>}
        {agenda.length === 0 ? (
          <p className="mt-10 text-principal/50">Todavia no hay eventos cargados.</p>
        ) : (
          <ol className="mt-10 space-y-6 border-l-2 pl-6" style={{ borderColor: VERDE }}>
            {agenda.map((ev) => (
              <li key={ev.titulo} className="relative flex gap-4">
                <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: VERDE }} />
                {ev.imagen && (
                  <div className="relative mt-1 h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-principal/10">
                    <Image src={ev.imagen} alt={ev.titulo} fill className="object-cover" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold" style={{ color: VERDE }}>{ev.fecha}</p>
                  <p className="mt-1 font-display text-xl">{ev.titulo}</p>
                  {ev.descripcion && <p className="mt-1 text-sm text-principal/70">{ev.descripcion}</p>}
                  <p className="mt-1 text-sm text-principal/50">{ev.lugar}{ev.categoria ? ` - ${ev.categoria}` : ""}</p>
                  {ev.enlace && <a href={ev.enlace} target="_blank" rel="noreferrer" className="mt-2 inline-block rounded-lg border px-4 py-1 text-xs font-medium" style={{ borderColor: VERDE, color: VERDE }}>Ver mas</a>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </DataSeccionWrapper>
  );
}
