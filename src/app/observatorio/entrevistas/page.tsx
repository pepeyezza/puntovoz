export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Mic2 } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import { Strip } from "@/components/observatorio/TableroUi";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { ENTREVISTAS_DEMO } from "@/lib/demo-data";

export const metadata: Metadata = { title: "Entrevistas - Data" };

const ZONA = "America/Argentina/Buenos_Aires";

type Entrevista = {
  slug: string;
  entrevistado: string;
  cargo: string;
  resumen: string;
  fechaTxt: string;
  fecha: Date | null;
  imagen: string;
  audio: boolean;
};

function demo(): Entrevista[] {
  return (ENTREVISTAS_DEMO as any[]).map((e: any) => ({
    slug: e.slug as string,
    entrevistado: e.entrevistado as string,
    cargo: (e.cargo ?? "") as string,
    resumen: (e.resumen ?? "") as string,
    fechaTxt: (e.date ?? "") as string,
    fecha: null,
    imagen: "",
    audio: false,
  }));
}

async function getEntrevistas(): Promise<Entrevista[]> {
  try {
    const lista = await prisma.entrevista.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    });
    if (lista.length === 0) return demo();
    return lista.map((e: any) => {
      const fecha = (e.publishedAt ?? e.createdAt) as Date;
      return {
        slug: e.slug as string,
        entrevistado: e.entrevistado as string,
        cargo: (e.cargo ?? "") as string,
        resumen: (e.resumen ?? "") as string,
        fechaTxt: fecha.toLocaleDateString("es-AR", { timeZone: ZONA }),
        fecha,
        imagen: (e.coverImage ?? "") as string,
        audio: Boolean(e.audioUrl),
      };
    });
  } catch {
    return demo();
  }
}

export default async function Page() {
  const header = await getPageHeader("dataEntrevistas", {
    eyebrow: "Data",
    title: "Entrevistas",
    description: "Voces de quienes construyen el desarrollo local desde distintos sectores.",
  });
  const entrevistas = await getEntrevistas();

  const conFecha = entrevistas.filter((e) => e.fecha);
  const anioActual = new Date().getFullYear();
  const delAnio = conFecha.filter((e) => (e.fecha as Date).getFullYear() === anioActual).length;
  const conAudio = entrevistas.filter((e) => e.audio).length;
  const ultima = conFecha[0]?.fecha
    ? (conFecha[0].fecha as Date).toLocaleDateString("es-AR", { day: "numeric", month: "short", timeZone: ZONA })
    : "—";

  return (
    <section className="mx-auto max-w-editorial px-5 py-12 lg:px-8">
      <p className="eyebrow text-acento">{header.eyebrow}</p>
      <div className="mt-3">
        <ObservatorioNav active="/observatorio/entrevistas" />
      </div>
      <div className="mt-6 flex items-center gap-3">
        <Mic2 size={32} className="text-acento" />
        <h1 className="font-display text-4xl">{header.title}</h1>
      </div>
      {header.description && <p className="mt-3 text-principal/70">{header.description}</p>}

      <div className="mt-8">
        <Strip
          label="Resumen"
          tone="acento"
          items={[
            { label: "Entrevistas", value: String(entrevistas.length) },
            { label: "Con audio", value: String(conAudio) },
            { label: "Última publicación", value: ultima },
            { label: "En el año", value: String(delAnio) },
          ]}
        />
      </div>

      {entrevistas.length === 0 ? (
        <p className="mt-10 text-principal/50">Todavía no hay entrevistas publicadas.</p>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {entrevistas.map((e) => (
            <Link
              key={e.slug}
              href={`/observatorio/entrevistas/${e.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white transition-shadow hover:shadow-sm"
            >
              {e.imagen && (
                <div className="relative aspect-video w-full">
                  <Image src={e.imagen} alt={e.entrevistado} fill className="object-cover" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-acento/15 font-display text-lg text-acento">
                    {e.entrevistado.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-xl leading-snug group-hover:text-acento">{e.entrevistado}</p>
                    {e.cargo && <p className="mt-0.5 text-sm text-acento">{e.cargo}</p>}
                  </div>
                  {e.audio && (
                    <span className="flex shrink-0 items-center gap-1 rounded-md bg-joven/25 px-2 py-0.5 text-xs font-medium">
                      <Mic2 size={12} /> Audio
                    </span>
                  )}
                </div>
                <p className="mt-3 flex-1 line-clamp-4 text-sm text-principal/65">{e.resumen}</p>
                <p className="mt-3 text-xs text-principal/40">{e.fechaTxt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
