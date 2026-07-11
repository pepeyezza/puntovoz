export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import { prisma } from "@/lib/prisma";

type Props = { params: { slug: string } };

async function getInst(slug: string) { try { return await prisma.institucionCientifica.findUnique({ where:{slug}, include:{servicios:{orderBy:{nombre:"asc"}}} }); } catch { return null; } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const inst = await getInst(params.slug);
  if (!inst) return {};
  return { title: `${inst.nombre} · Investigación`, description: inst.descripcion ?? undefined };
}

export default async function Page({ params }: Props) {
  const inst = await getInst(params.slug);
  if (!inst) notFound();

  return (
    <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
      <Link href="/observatorio/investigacion" className="text-sm font-medium text-principal/60 hover:text-acento">← Investigación científica</Link>
      <div className="mt-8"><ObservatorioNav active="/observatorio/investigacion" /></div>

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
        <h2 className="font-display text-2xl">Servicios de investigación</h2>
        {inst.servicios.length === 0 ? (
          <p className="mt-6 text-principal/50">Todavía no hay servicios cargados.</p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {inst.servicios.map((s) => (
              <div key={s.id} className="rounded-2xl border border-principal/10 p-6">
                <p className="font-display text-xl">{s.nombre}</p>
                {s.area && <p className="mt-1 text-sm text-acento">{s.area}</p>}
                {s.descripcion && <p className="mt-3 text-sm text-principal/70">{s.descripcion}</p>}
                {s.contacto && (
                  <p className="mt-3 text-xs text-principal/50">Contacto: {s.contacto}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
