export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import { Strip, Panel, DonutChart, BarList, FiltroChips, Ficha, contar } from "@/components/observatorio/TableroUi";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Oferta académica - Data" };

const TIPO_LABEL: Record<string, string> = {
  universidad: "Universidad",
  instituto: "Instituto",
  formacion_laboral: "Centro de formación",
  otro: "Otro",
};

const TIPO_CLASE: Record<string, string> = {
  universidad: "bg-joven/25 text-principal",
  instituto: "bg-acento/15 text-acento",
  formacion_laboral: "bg-principal/10 text-principal/70",
  otro: "bg-principal/5 text-principal/60",
};

const MODALIDAD_LABEL: Record<string, string> = {
  presencial: "Presencial",
  virtual: "Virtual",
  mixta: "Mixta",
};

const TIPOS = ["Todas", "Universidad", "Instituto", "Centro de formación", "Otro"];

async function getInstituciones() {
  try {
    return (await prisma.institucionAcademica.findMany({
      orderBy: { nombre: "asc" },
      include: { carreras: { select: { modalidad: true, area: true } } },
    })) as any[];
  } catch {
    return [] as any[];
  }
}

export default async function Page({ searchParams }: { searchParams: { tipo?: string } }) {
  const header = await getPageHeader("dataOfertaAcademica", {
    eyebrow: "Data",
    title: "Oferta académica",
    description: "Instituciones educativas, institutos y centros de formación en Chascomús.",
  });
  const instituciones = await getInstituciones();
  const tipoActivo = searchParams.tipo ?? "Todas";
  const filtradas =
    tipoActivo === "Todas" ? instituciones : instituciones.filter((i: any) => TIPO_LABEL[i.tipo] === tipoActivo);

  const carreras: any[] = instituciones.flatMap((i: any) => i.carreras);
  const presenciales = carreras.filter((c: any) => c.modalidad === "presencial").length;
  const porArea = contar(carreras, (c: any) => c.area || "Sin área").slice(0, 6);
  const porModalidad = contar(carreras, (c: any) => MODALIDAD_LABEL[c.modalidad] ?? c.modalidad);

  return (
    <section className="mx-auto max-w-editorial px-5 py-12 lg:px-8">
      <p className="eyebrow text-acento">{header.eyebrow}</p>
      <div className="mt-3">
        <ObservatorioNav active="/observatorio/oferta-academica" />
      </div>
      <div className="mt-6 flex items-center gap-3">
        <GraduationCap size={32} className="text-principal/70" />
        <h1 className="font-display text-4xl">Oferta académica</h1>
      </div>
      {header.description && <p className="mt-3 text-principal/70">{header.description}</p>}

      {instituciones.length > 0 && (
        <>
          <div className="mt-8">
            <Strip
              label="Resumen"
              tone="joven"
              items={[
                { label: "Instituciones", value: String(instituciones.length) },
                { label: "Carreras", value: String(carreras.length) },
                { label: "Presenciales", value: String(presenciales) },
                { label: "Virtuales y mixtas", value: String(carreras.length - presenciales) },
              ]}
            />
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Panel title="Carreras por área">
              <BarList data={porArea} />
            </Panel>
            <Panel title="Modalidad">
              <DonutChart data={porModalidad} />
            </Panel>
          </div>
        </>
      )}

      <div className="mt-6">
        <FiltroChips opciones={TIPOS} activa={tipoActivo} base="/observatorio/oferta-academica" tone="principal" />
      </div>

      {filtradas.length === 0 ? (
        <p className="mt-10 text-principal/50">Todavía no hay instituciones cargadas.</p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {filtradas.map((inst: any) => (
            <Ficha
              key={inst.id}
              href={`/observatorio/oferta-academica/${inst.slug}`}
              imagen={inst.imagen || null}
              logo={inst.logoUrl || null}
              nombre={inst.nombre}
              etiqueta={TIPO_LABEL[inst.tipo] ?? inst.tipo}
              etiquetaClase={TIPO_CLASE[inst.tipo]}
              descripcionHtml={inst.descripcion || null}
              url={inst.web || null}
              clamp
              pie={
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-principal/5 px-2 py-0.5 text-xs text-principal/70">
                    {inst.carreras.length} carrera(s)
                  </span>
                  <span className="text-xs font-medium text-acento">Ver carreras →</span>
                </div>
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
