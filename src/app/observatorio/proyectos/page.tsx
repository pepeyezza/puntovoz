export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { FolderKanban } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import { Strip, Panel, DonutChart, BarList, FiltroChips, Ficha, contar } from "@/components/observatorio/TableroUi";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Iniciativas - Data" };

const TIPO_LABEL: Record<string, string> = {
  publico: "Público",
  privado: "Privado",
  mixto: "Mixto",
  comunitario: "Comunitario",
  internacional: "Internacional",
};

const TIPO_CLASE: Record<string, string> = {
  Público: "bg-joven/25 text-principal",
  Privado: "bg-acento/15 text-acento",
  Mixto: "bg-principal/10 text-principal/70",
  Comunitario: "bg-[#d8f3dc] text-[#2d6a4f]",
  Internacional: "bg-[#ede9fe] text-[#6d28d9]",
};

const TIPOS = ["Todos", "Público", "Privado", "Mixto", "Comunitario", "Internacional"];

async function getIniciativas() {
  try {
    const lista = await prisma.proyectoLocal.findMany({ orderBy: [{ orden: "asc" }, { createdAt: "desc" }] });
    return lista.map((p: any) => ({
      id: p.id as string,
      nombre: p.nombre as string,
      area: (p.area ?? "") as string,
      tipo: (TIPO_LABEL[p.tipo] ?? p.tipo) as string,
      descripcion: (p.descripcion ?? "") as string,
      enlace: (p.enlace ?? "") as string,
      imagen: (p.imagen ?? "") as string,
      logoUrl: (p.logoUrl ?? "") as string,
    }));
  } catch {
    return [];
  }
}

export default async function Page({ searchParams }: { searchParams: { tipo?: string } }) {
  const header = await getPageHeader("dataProyectos", {
    eyebrow: "Data",
    title: "Iniciativas",
    description: "Proyectos e iniciativas públicas, privadas y comunitarias del partido.",
  });
  const tipoActivo = searchParams.tipo ?? "Todos";
  const todas = await getIniciativas();
  const iniciativas = tipoActivo === "Todos" ? todas : todas.filter((p) => p.tipo === tipoActivo);

  const cuenta = (t: string) => todas.filter((p) => p.tipo === t).length;
  const otras = todas.length - cuenta("Público") - cuenta("Privado") - cuenta("Mixto");
  const porTipo = contar(todas, (p) => p.tipo);
  const porArea = contar(todas, (p) => p.area || "Sin área").slice(0, 6);

  return (
    <section className="mx-auto max-w-editorial px-5 py-12 lg:px-8">
      <p className="eyebrow text-acento">{header.eyebrow}</p>
      <div className="mt-3">
        <ObservatorioNav active="/observatorio/proyectos" />
      </div>
      <div className="mt-6 flex items-center gap-3">
        <FolderKanban size={32} className="text-acento" />
        <h1 className="font-display text-4xl">Iniciativas</h1>
      </div>
      {header.description && <p className="mt-3 text-principal/70">{header.description}</p>}

      {todas.length > 0 && (
        <>
          <div className="mt-8">
            <Strip
              label="Resumen"
              tone="acento"
              items={[
                { label: "Total", value: String(todas.length) },
                { label: "Públicas", value: String(cuenta("Público")) },
                { label: "Privadas", value: String(cuenta("Privado")) },
                { label: "Mixtas", value: String(cuenta("Mixto")) },
                { label: "Otras", value: String(otras) },
              ]}
            />
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Panel title="Por tipo">
              <DonutChart data={porTipo} />
            </Panel>
            <Panel title="Por área">
              <BarList data={porArea} />
            </Panel>
          </div>
        </>
      )}

      <div className="mt-6">
        <FiltroChips opciones={TIPOS} activa={tipoActivo} base="/observatorio/proyectos" tone="acento" />
      </div>

      {iniciativas.length === 0 ? (
        <p className="mt-10 text-principal/50">Todavía no hay iniciativas cargadas.</p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {iniciativas.map((p) => (
            <Ficha
              key={p.id}
              imagen={p.imagen || null}
              logo={p.logoUrl || null}
              nombre={p.nombre}
              subtitulo={p.area || null}
              etiqueta={p.tipo}
              etiquetaClase={TIPO_CLASE[p.tipo]}
              descripcionHtml={p.descripcion || null}
              url={p.enlace || null}
            />
          ))}
        </div>
      )}
    </section>
  );
}
