export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import { prisma } from "@/lib/prisma";

type Props = { params: { slug: string }; searchParams: { area?: string } };

const MODALIDAD_LABEL: Record<string,string> = { presencial:"Presencial", virtual:"Virtual", mixta:"Mixta" };

async function getInst(slug: string) { try { return await prisma.institucionAcademica.findUnique({ where:{slug}, include:{carreras:{orderBy:{nombre:"asc"}}} }); } catch { return null; } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const inst = await getInst(params.slug);
  if (!inst) return {};
  return { title: `${inst.nombre} · Oferta Académica`, description: inst.descripcion ?? undefined };
}

export default async function Page({ params, searchParams }: Props) {
  const inst = await getInst(params.slug);
  if (!inst) notFound();

  const areaActiva = searchParams.area ?? "Todas";
  const areas = ["Todas", ...Array.from(new Set(inst.carreras.map((c) => c.area).filter(Boolean) as string[]))];
  const carreras = areaActiva === "Todas" ? inst.carreras : inst.carreras.filter((c) => c.area === areaActiva);

  return (
    <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
      <Link href="/observatorio/oferta-academica" className="text-sm font-medium text-principal/60 hover:text-acento">← Oferta académica</Link>
      <div className="mt-8"><ObservatorioNav active="/observatorio/oferta-academica" /></div>
      <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-start">
        {inst.logoUrl && (
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-principal/10"><Image src={inst.logoUrl} alt={inst.nombre} fill className="object-contain p-2" /></div>
        )}
        <div>
          <h1 className="font-display text-4xl">{inst.nombre}</h1>
          {inst.descripcion && <p className="mt-3 max-w-2xl text-principal/70">{inst.descripcion}</p>}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-principal/60">
            {inst.direccion && <span>📍 {inst.direccion}</span>}
            {inst.telefono && <span>📞 {inst.telefono}</span>}
            {inst.email && <a href={`mailto:${inst.email}`} className="hover:text-acento">✉️ {inst.email}</a>}
            {inst.web && <a href={inst.web} target="_blank" rel="noreferrer" className="hover:text-acento">🌐 Sitio web</a>}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-2xl">Carreras y programas</h2>
        {areas.length > 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {areas.map((area) => (
              <a key={area} href={area === "Todas" ? `/observatorio/oferta-academica/${inst.slug}` : `/observatorio/oferta-academica/${inst.slug}?area=${encodeURIComponent(area)}`} className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${areaActiva === area ? "border-acento bg-acento text-secundario" : "border-principal/15 hover:border-acento hover:text-acento"}`}>
                {area}
              </a>
            ))}
          </div>
        )}
      </div>

      {carreras.length === 0 ? (
        <p className="mt-8 text-principal/50">No hay carreras en esta área.</p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {carreras.map((c) => (
            <div key={c.id} className="rounded-2xl border border-principal/10 p-6">
              <p className="font-display text-xl leading-snug">{c.nombre}</p>
              {c.titulo && <p className="mt-1 text-sm text-acento">{c.titulo}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                {c.modalidad && <span className="rounded-full bg-principal/5 px-3 py-1 text-xs font-medium">{MODALIDAD_LABEL[c.modalidad] ?? c.modalidad}</span>}
                {c.duracion && <span className="rounded-full bg-principal/5 px-3 py-1 text-xs font-medium">{c.duracion}</span>}
                {c.area && <span className="rounded-full bg-acento/10 px-3 py-1 text-xs font-medium text-acento">{c.area}</span>}
              </div>
              {c.descripcion && <p className="mt-3 text-sm text-principal/60">{c.descripcion}</p>}
              {c.inscripcion && <p className="mt-2 text-xs text-principal/50">Inscripción: {c.inscripcion}</p>}
              {c.planEstudioUrl && (
                <a href={c.planEstudioUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-principal/15 px-4 py-1.5 text-xs font-medium hover:border-acento hover:text-acento">
                  📄 Ver plan de estudios
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
