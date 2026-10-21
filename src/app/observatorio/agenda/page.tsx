export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import { Strip, Panel, BarList, contar } from "@/components/observatorio/TableroUi";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Agenda - Data" };

const TILES = ["bg-joven text-principal", "bg-acento text-secundario", "bg-principal text-secundario"];
const DIA_MS = 24 * 60 * 60 * 1000;

type Evento = {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: Date;
  lugar: string;
  categoria: string;
  enlace: string;
  imagen: string;
};

async function getAgenda(): Promise<Evento[]> {
  try {
    const lista = await prisma.eventoAgenda.findMany({ orderBy: [{ orden: "asc" }, { createdAt: "desc" }] });
    return lista.map((ev: any) => ({
      id: ev.id as string,
      titulo: ev.titulo as string,
      descripcion: (ev.descripcion ?? "") as string,
      fecha: ev.fecha as Date,
      lugar: (ev.lugar ?? "") as string,
      categoria: (ev.categoria ?? "") as string,
      enlace: (ev.enlace ?? "") as string,
      imagen: (ev.imagen ?? "") as string,
    }));
  } catch {
    return [];
  }
}

function fechaLarga(f: Date) {
  return f.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export default async function Page() {
  const header = await getPageHeader("dataAgenda", {
    eyebrow: "Data",
    title: "Agenda cultural",
    description: "Próximas actividades, ferias y encuentros comunitarios del partido.",
  });
  const agenda = await getAgenda();

  // "Hoy" según la hora de Argentina (UTC-3), a las 00:00 UTC para comparar con las fechas guardadas.
  const ahoraAR = new Date(Date.now() - 3 * 60 * 60 * 1000);
  const hoy = Date.UTC(ahoraAR.getUTCFullYear(), ahoraAR.getUTCMonth(), ahoraAR.getUTCDate());

  const proximos = agenda.filter((e) => e.fecha.getTime() >= hoy).sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
  const proximo = proximos[0];
  const dias = proximo ? Math.round((proximo.fecha.getTime() - hoy) / DIA_MS) : 0;
  const esteMes = agenda.filter(
    (e) => e.fecha.getUTCFullYear() === ahoraAR.getUTCFullYear() && e.fecha.getUTCMonth() === ahoraAR.getUTCMonth()
  ).length;
  const categorias = new Set(agenda.map((e) => e.categoria).filter(Boolean)).size;
  const porCategoria = contar(agenda, (e) => e.categoria || "Sin categoría").slice(0, 6);

  return (
    <section className="mx-auto max-w-editorial px-5 py-12 lg:px-8">
      <p className="eyebrow text-acento">{header.eyebrow}</p>
      <div className="mt-3">
        <ObservatorioNav active="/observatorio/agenda" />
      </div>
      <div className="mt-6 flex items-center gap-3">
        <CalendarDays size={32} className="text-acento" />
        <h1 className="font-display text-4xl">Agenda cultural</h1>
      </div>
      {header.description && <p className="mt-3 text-principal/70">{header.description}</p>}

      {agenda.length === 0 ? (
        <p className="mt-10 text-principal/50">Todavía no hay eventos cargados.</p>
      ) : (
        <>
          <div className="mt-8">
            <Strip
              label="Resumen"
              tone="acento"
              items={[
                { label: "Eventos", value: String(agenda.length) },
                { label: "Próximos", value: String(proximos.length) },
                { label: "Este mes", value: String(esteMes) },
                { label: "Categorías", value: String(categorias) },
              ]}
            />
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            {/* Lista de eventos */}
            <ol className="space-y-4">
              {agenda.map((ev, i) => {
                const finalizado = ev.fecha.getTime() < hoy;
                return (
                  <li key={ev.id} className="flex gap-4 rounded-2xl bg-white p-4">
                    <div
                      className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl ${TILES[i % TILES.length]}`}
                    >
                      <span className="font-display text-2xl leading-none">{ev.fecha.getUTCDate()}</span>
                      <span className="mt-1 text-xs leading-none">
                        {ev.fecha.toLocaleDateString("es-AR", { month: "short", timeZone: "UTC" })}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display text-xl leading-snug">{ev.titulo}</p>
                        {ev.categoria && (
                          <span className="rounded-md bg-principal/5 px-2 py-0.5 text-xs text-principal/70">{ev.categoria}</span>
                        )}
                        {finalizado && (
                          <span className="rounded-md bg-principal/10 px-2 py-0.5 text-xs text-principal/50">Finalizado</span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-principal/50">
                        {fechaLarga(ev.fecha)}
                        {ev.lugar && (
                          <>
                            {" · "}
                            <MapPin size={12} className="mb-0.5 inline" /> {ev.lugar}
                          </>
                        )}
                      </p>
                      {ev.descripcion && (
                        <div
                          className="prose-voz mt-2 text-sm text-principal/70"
                          dangerouslySetInnerHTML={{ __html: ev.descripcion }}
                        />
                      )}
                      {ev.enlace && (
                        <a
                          href={ev.enlace}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-block break-all text-xs text-acento hover:underline"
                        >
                          {ev.enlace}
                        </a>
                      )}
                    </div>
                    {ev.imagen && (
                      <div className="relative hidden h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-principal/10 sm:block">
                        <Image src={ev.imagen} alt={ev.titulo} fill className="object-cover" />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>

            {/* Panel lateral */}
            <div className="space-y-5">
              <div className="rounded-2xl bg-principal p-5 text-secundario">
                <p className="text-xs text-joven">Próximo evento</p>
                {proximo ? (
                  <>
                    <p className="mt-2 font-display text-3xl">
                      {dias === 0 ? "Hoy" : dias === 1 ? "Mañana" : `En ${dias} días`}
                    </p>
                    <p className="mt-2 text-sm font-medium">{proximo.titulo}</p>
                    <p className="mt-1 text-xs text-secundario/60">
                      {fechaLarga(proximo.fecha)}
                      {proximo.lugar ? ` · ${proximo.lugar}` : ""}
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-secundario/70">No hay eventos próximos cargados.</p>
                )}
              </div>
              <Panel title="Eventos por categoría">
                <BarList data={porCategoria} />
              </Panel>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
