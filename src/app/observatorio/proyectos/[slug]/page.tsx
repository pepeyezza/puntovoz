export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FileText } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import { Strip, Avatar } from "@/components/observatorio/TableroUi";
import { prisma } from "@/lib/prisma";

type Props = { params: { slug: string } };

const TIPO_LABEL: Record<string, string> = {
  publico: "Público",
  privado: "Privado",
  mixto: "Mixto",
  comunitario: "Comunitario",
  internacional: "Internacional",
};

const TIPO_CLASE: Record<string, string> = {
  publico: "bg-joven/25 text-principal",
  privado: "bg-acento/15 text-acento",
  mixto: "bg-principal/10 text-principal/70",
  comunitario: "bg-[#d8f3dc] text-[#2d6a4f]",
  internacional: "bg-[#ede9fe] text-[#6d28d9]",
};

const ESTADO_LABEL: Record<string, string> = {
  en_curso: "En curso",
  planificada: "Planificada",
  finalizada: "Finalizada",
};

const ESTADO_CLASE: Record<string, string> = {
  en_curso: "bg-principal text-secundario",
  planificada: "bg-joven/25 text-principal",
  finalizada: "bg-principal/10 text-principal/70",
};

function soloTexto(html?: string | null) {
  return String(html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseCifras(texto?: string | null) {
  if (!texto) return [];
  return texto
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 4)
    .map((linea) => {
      const [valor, ...resto] = linea.split("|");
      return { value: valor.trim(), label: resto.join("|").trim() };
    })
    .filter((c) => c.value);
}

async function getIniciativa(slug: string): Promise<any | null> {
  try {
    return await prisma.proyectoLocal.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}

async function getOtras(slug: string): Promise<any[]> {
  try {
    return await prisma.proyectoLocal.findMany({
      where: { slug: { not: slug } },
      orderBy: [{ orden: "asc" }, { createdAt: "desc" }],
      take: 4,
    });
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getIniciativa(params.slug);
  if (!p) return {};
  return { title: `${p.nombre} · Iniciativas`, description: soloTexto(p.descripcion).slice(0, 160) || undefined };
}

export default async function Page({ params }: Props) {
  const p = await getIniciativa(params.slug);
  if (!p) notFound();
  const otras = await getOtras(params.slug);

  const cifras = parseCifras(p.cifras);
  const galeria: string[] = Array.isArray(p.galeria) ? p.galeria.filter(Boolean) : [];
  const tieneDetalle = soloTexto(p.detalle).length > 0;
  const tieneDescripcion = soloTexto(p.descripcion).length > 0;

  const filas: { k: string; v: string }[] = [
    { k: "Responsable", v: p.responsable },
    { k: "Período", v: p.periodo },
    { k: "Ubicación", v: p.ubicacion },
    { k: "A quién llega", v: p.destinatarios },
    { k: "Área", v: p.area },
  ].filter((f) => f.v);

  const hayDatos = filas.length > 0 || Boolean(p.enlace);

  return (
    <section className="mx-auto max-w-editorial px-5 py-12 lg:px-8">
      <Link href="/observatorio/proyectos" className="text-sm font-medium text-principal/60 hover:text-acento">
        ← Iniciativas
      </Link>
      <div className="mt-6">
        <ObservatorioNav active="/observatorio/proyectos" />
      </div>

      {p.imagen && (
        <div className="relative mt-6 aspect-[16/6] w-full overflow-hidden rounded-2xl bg-principal/5">
          <Image src={p.imagen} alt={p.nombre} fill className="object-cover" priority />
        </div>
      )}

      <div className="mt-6 flex items-center gap-4">
        <Avatar src={p.logoUrl} name={p.nombre} size="md" />
        <div className="min-w-0">
          <h1 className="font-display text-3xl leading-tight lg:text-4xl">{p.nombre}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className={`rounded-md px-2.5 py-0.5 text-xs font-medium ${TIPO_CLASE[p.tipo] ?? "bg-principal/10 text-principal/70"}`}>
              {TIPO_LABEL[p.tipo] ?? p.tipo}
            </span>
            {p.estado && (
              <span className={`rounded-md px-2.5 py-0.5 text-xs font-medium ${ESTADO_CLASE[p.estado] ?? "bg-principal/10 text-principal/70"}`}>
                {ESTADO_LABEL[p.estado] ?? p.estado}
              </span>
            )}
            {p.area && <span className="rounded-md bg-white px-2.5 py-0.5 text-xs text-principal/70">{p.area}</span>}
          </div>
        </div>
      </div>

      {cifras.length > 0 && (
        <div className="mt-6">
          <Strip label="En números" tone="acento" items={cifras} />
        </div>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          {(tieneDescripcion || tieneDetalle) && (
            <div className="rounded-2xl bg-white p-6">
              <h2 className="text-sm font-medium">Sobre la iniciativa</h2>
              {tieneDescripcion && (
                <div
                  className="prose-voz mt-3 text-principal/80"
                  dangerouslySetInnerHTML={{ __html: p.descripcion }}
                />
              )}
              {tieneDetalle && (
                <div
                  className={`prose-voz text-principal/80 ${tieneDescripcion ? "mt-5 border-t border-principal/10 pt-5" : "mt-3"}`}
                  dangerouslySetInnerHTML={{ __html: p.detalle }}
                />
              )}
            </div>
          )}

          {galeria.length > 0 && (
            <div className="rounded-2xl bg-white p-6">
              <h2 className="text-sm font-medium">Galería</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {galeria.map((url, i) => (
                  <a
                    key={`${url}-${i}`}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="relative block aspect-[4/3] overflow-hidden rounded-xl border border-principal/10"
                  >
                    <Image src={url} alt={`${p.nombre} - foto ${i + 1}`} fill className="object-cover transition-transform hover:scale-105" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          {hayDatos && (
            <div className="rounded-2xl bg-white p-6">
              <h2 className="text-sm font-medium">Datos</h2>
              <dl className="mt-3 space-y-3">
                {filas.map((f) => (
                  <div key={f.k}>
                    <dt className="text-xs text-principal/50">{f.k}</dt>
                    <dd className="text-sm">{f.v}</dd>
                  </div>
                ))}
                {p.enlace && (
                  <div>
                    <dt className="text-xs text-principal/50">Sitio web</dt>
                    <dd>
                      <a href={p.enlace} target="_blank" rel="noreferrer" className="break-all text-sm text-acento hover:underline">
                        {p.enlace}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {p.documentoUrl && (
            <a
              href={p.documentoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-white p-4 transition-shadow hover:shadow-sm"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-acento text-secundario">
                <FileText size={18} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium">{p.documentoTitulo || "Documento"}</span>
                <span className="block text-xs text-principal/50">Descargar PDF</span>
              </span>
            </a>
          )}
        </div>
      </div>

      {otras.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-2xl">Otras iniciativas</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {otras.map((o: any) => (
              <Link
                key={o.id}
                href={`/observatorio/proyectos/${o.slug}`}
                className="flex items-center gap-3 rounded-2xl bg-white p-4 transition-shadow hover:shadow-sm"
              >
                <Avatar src={o.logoUrl} name={o.nombre} />
                <div className="min-w-0">
                  <p className="line-clamp-1 text-sm font-medium">{o.nombre}</p>
                  {o.area && <p className="text-xs text-principal/50">{o.area}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
