export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Microscope } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import { Strip, Panel, DonutChart, BarList, Ficha, contar } from "@/components/observatorio/TableroUi";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Ciencia y Tecnología - Data" };

async function getInstituciones() {
  try {
    return (await prisma.institucionCientifica.findMany({
      orderBy: { nombre: "asc" },
      include: { servicios: { select: { area: true } } },
    })) as any[];
  } catch {
    return [] as any[];
  }
}

export default async function Page() {
  const header = await getPageHeader("dataInvestigacion", {
    eyebrow: "Data",
    title: "Ciencia y Tecnología",
    description: "Instituciones de investigación científica y tecnológica en Chascomús.",
  });
  const instituciones = await getInstituciones();

  const servicios: any[] = instituciones.flatMap((i: any) => i.servicios);
  const porArea = contar(servicios, (s: any) => s.area || "Sin área").slice(0, 6);
  const areasDistintas = new Set(servicios.map((s: any) => s.area).filter(Boolean)).size;
  const porInstitucion = instituciones
    .map((i: any) => ({ label: i.nombre as string, value: i.servicios.length as number }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <section className="mx-auto max-w-editorial px-5 py-12 lg:px-8">
      <p className="eyebrow text-acento">{header.eyebrow}</p>
      <div className="mt-3">
        <ObservatorioNav active="/observatorio/investigacion" />
      </div>
      <div className="mt-6 flex items-center gap-3">
        <Microscope size={32} className="text-principal/70" />
        <h1 className="font-display text-4xl">Ciencia y Tecnología</h1>
      </div>
      {header.description && <p className="mt-3 text-principal/70">{header.description}</p>}

      {instituciones.length > 0 && (
        <>
          <div className="mt-8">
            <Strip
              label="Resumen"
              tone="acento"
              items={[
                { label: "Instituciones", value: String(instituciones.length) },
                { label: "Servicios", value: String(servicios.length) },
                { label: "Áreas", value: String(areasDistintas) },
              ]}
            />
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Panel title="Servicios por área">
              <BarList data={porArea} />
            </Panel>
            <Panel title="Servicios por institución">
              <DonutChart data={porInstitucion} />
            </Panel>
          </div>
        </>
      )}

      {instituciones.length === 0 ? (
        <p className="mt-10 text-principal/50">Todavía no hay instituciones cargadas.</p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {instituciones.map((inst: any) => (
            <Ficha
              key={inst.id}
              href={`/observatorio/investigacion/${inst.slug}`}
              imagen={inst.imagen || null}
              logo={inst.logoUrl || null}
              nombre={inst.nombre}
              etiqueta="Institución científica"
              descripcionHtml={inst.descripcion || null}
              url={inst.web || null}
              clamp
              pie={
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-principal/5 px-2 py-0.5 text-xs text-principal/70">
                    {inst.servicios.length} servicio(s)
                  </span>
                  <span className="text-xs font-medium text-acento">Ver servicios →</span>
                </div>
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
