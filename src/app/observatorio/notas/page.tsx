export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FileText } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import { Strip } from "@/components/observatorio/TableroUi";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { NOTAS_OBSERVATORIO_DEMO } from "@/lib/demo-data";

export const metadata: Metadata = { title: "Notas - Data" };

const ZONA = "America/Argentina/Buenos_Aires";

type Nota = {
  slug: string;
  titulo: string;
  resumen: string;
  fechaTxt: string;
  fecha: Date | null;
  imagen: string;
};

function demo(): Nota[] {
  return (NOTAS_OBSERVATORIO_DEMO as any[]).map((n: any) => ({
    slug: n.slug as string,
    titulo: n.titulo as string,
    resumen: (n.resumen ?? "") as string,
    fechaTxt: (n.date ?? "") as string,
    fecha: null,
    imagen: "",
  }));
}

async function getNotas(): Promise<Nota[]> {
  try {
    const notas = await prisma.notaObservatorio.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    });
    if (notas.length === 0) return demo();
    return notas.map((n: any) => {
      const fecha = (n.publishedAt ?? n.createdAt) as Date;
      const texto = String(n.contenido ?? "")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return {
        slug: n.slug as string,
        titulo: n.titulo as string,
        resumen: texto.length > 160 ? `${texto.slice(0, 160)}...` : texto,
        fechaTxt: fecha.toLocaleDateString("es-AR", { timeZone: ZONA }),
        fecha,
        imagen: (n.coverImage ?? "") as string,
      };
    });
  } catch {
    return demo();
  }
}

export default async function Page() {
  const header = await getPageHeader("dataNotas", {
    eyebrow: "Data",
    title: "Notas sobre desarrollo local",
    description: "Análisis propios que cruzan datos, proyectos y contexto del partido.",
  });
  const notas = await getNotas();
  const [destacada, ...resto] = notas;

  const conFecha = notas.filter((n) => n.fecha);
  const anioActual = new Date().getFullYear();
  const delAnio = conFecha.filter((n) => (n.fecha as Date).getFullYear() === anioActual).length;
  const ultima = conFecha[0]?.fecha
    ? (conFecha[0].fecha as Date).toLocaleDateString("es-AR", { day: "numeric", month: "short", timeZone: ZONA })
    : "—";

  return (
    <section className="mx-auto max-w-editorial px-5 py-12 lg:px-8">
      <p className="eyebrow text-acento">{header.eyebrow}</p>
      <div className="mt-3">
        <ObservatorioNav active="/observatorio/notas" />
      </div>
      <div className="mt-6 flex items-center gap-3">
        <FileText size={32} className="text-principal/70" />
        <h1 className="font-display text-4xl">{header.title}</h1>
      </div>
      {header.description && <p className="mt-3 text-principal/70">{header.description}</p>}

      <div className="mt-8">
        <Strip
          label="Resumen"
          tone="joven"
          items={[
            { label: "Notas publicadas", value: String(notas.length) },
            { label: "Última publicación", value: ultima },
            { label: "En el año", value: String(delAnio) },
          ]}
        />
      </div>

      {destacada && (
        <Link
          href={`/observatorio/notas/${destacada.slug}`}
          className="group mt-5 grid overflow-hidden rounded-2xl bg-principal text-secundario md:grid-cols-[1.2fr_1fr]"
        >
          <div className="flex flex-col justify-center p-6 md:p-8">
            <p className="text-xs text-joven">Última nota</p>
            <p className="mt-2 font-display text-3xl leading-snug group-hover:text-joven">{destacada.titulo}</p>
            <p className="mt-3 text-sm text-secundario/70">{destacada.resumen}</p>
            <p className="mt-4 text-xs text-secundario/50">{destacada.fechaTxt}</p>
          </div>
          {destacada.imagen && (
            <div className="relative min-h-[200px]">
              <Image src={destacada.imagen} alt={destacada.titulo} fill className="object-cover" />
            </div>
          )}
        </Link>
      )}

      {resto.length > 0 && (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {resto.map((n) => (
            <Link
              key={n.slug}
              href={`/observatorio/notas/${n.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white transition-shadow hover:shadow-sm"
            >
              {n.imagen && (
                <div className="relative aspect-video w-full">
                  <Image src={n.imagen} alt={n.titulo} fill className="object-cover" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <p className="font-display text-xl leading-snug group-hover:text-acento">{n.titulo}</p>
                <p className="mt-2 flex-1 text-sm text-principal/60">{n.resumen}</p>
                <p className="mt-3 text-xs text-principal/40">{n.fechaTxt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
