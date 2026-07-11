export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { Mic2 } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { ENTREVISTAS_DEMO } from "@/lib/demo-data";

export const metadata: Metadata = { title: "Entrevistas - Data" };

async function getEntrevistas() {
  try {
    const e = await prisma.entrevista.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" } });
    if (e.length === 0) return ENTREVISTAS_DEMO;
    return e.map((e) => ({ slug: e.slug, entrevistado: e.entrevistado, cargo: e.cargo ?? "", resumen: e.resumen, date: (e.publishedAt ?? e.createdAt).toLocaleDateString("es-AR") }));
  } catch { return ENTREVISTAS_DEMO; }
}

export default async function Page() {
  const header = await getPageHeader("dataEntrevistas", {
    eyebrow: "Data",
    title: "Entrevistas",
    description: "Voces de quienes construyen el desarrollo local desde distintos sectores.",
  });
  const entrevistas = await getEntrevistas();

  return (
    <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
      <header className="max-w-2xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-principal/5">
          <Mic2 size={28} className="text-principal/60" />
        </div>
        <p className="eyebrow mt-4 text-acento">{header.eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl">{header.title}</h1>
        {header.description && <p className="mt-4 text-principal/70">{header.description}</p>}
      </header>
      <div className="mt-10"><ObservatorioNav active="/observatorio/entrevistas" /></div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {entrevistas.map((e) => (
          <Link key={e.slug} href={`/observatorio/entrevistas/${e.slug}`} className="block rounded-2xl border border-principal/10 p-6 transition-colors hover:border-acento">
            <p className="font-display text-xl">{e.entrevistado}</p>
            <p className="mt-1 text-sm text-acento">{e.cargo}</p>
            <p className="mt-3 text-sm text-principal/60">{e.resumen}</p>
            <p className="mt-3 text-xs text-principal/40">{e.date}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
