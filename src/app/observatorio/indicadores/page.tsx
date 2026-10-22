export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { BarChart2 } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import IndicadoresClient from "@/components/observatorio/IndicadoresClient";
import { Strip, Panel, BarList, contar } from "@/components/observatorio/TableroUi";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { INDICADORES_DEMO } from "@/lib/demo-data";

export const metadata: Metadata = { title: "Indicadores - Data" };

const ZONA = "America/Argentina/Buenos_Aires";

type Ind = {
  id: string;
  nombre: string;
  valor: number;
  unidad: string;
  periodo: string;
  categoria: string | null;
  fuente: string | null;
  actualizado: Date;
};

async function getIndicadores(): Promise<Ind[]> {
  try {
    const lista = await prisma.indicador.findMany({ orderBy: [{ categoria: "asc" }, { nombre: "asc" }] });
    if (lista.length > 0) {
      return lista.map((i: any) => ({
        id: i.id as string,
        nombre: i.nombre as string,
        valor: Number(i.valor),
        unidad: (i.unidad ?? "") as string,
        periodo: (i.periodo ?? "") as string,
        categoria: (i.categoria ?? null) as string | null,
        fuente: (i.fuente ?? null) as string | null,
        actualizado: i.updatedAt as Date,
      }));
    }
  } catch {
    // sigue con los datos de ejemplo
  }
  return (INDICADORES_DEMO as any[]).map((i: any, idx: number) => ({
    id: String(idx),
    nombre: i.nombre as string,
    valor: Number(i.valor),
    unidad: (i.unidad ?? "") as string,
    periodo: (i.periodo ?? "") as string,
    categoria: (i.categoria ?? null) as string | null,
    fuente: null,
    actualizado: new Date(),
  }));
}

function formatear(valor: number) {
  return valor.toLocaleString("es-AR");
}

export default async function Page() {
  const header = await getPageHeader("dataIndicadores", {
    eyebrow: "Data",
    title: "Indicadores",
    description: "Principales métricas de desarrollo del partido de Chascomús.",
  });
  const indicadores = await getIndicadores();

  const categorias = new Set(indicadores.map((i) => i.categoria).filter(Boolean)).size;
  const fuentes = new Set(indicadores.map((i) => i.fuente).filter(Boolean)).size;
  const recientes = [...indicadores].sort((a, b) => b.actualizado.getTime() - a.actualizado.getTime()).slice(0, 4);
  const ultima = recientes[0]
    ? recientes[0].actualizado.toLocaleDateString("es-AR", { day: "numeric", month: "short", timeZone: ZONA })
    : "—";
  const porTema = contar(indicadores, (i) => i.categoria || "Sin categoría").slice(0, 6);

  const paraCliente = indicadores.map((i) => ({
    id: i.id,
    nombre: i.nombre,
    valor: i.valor,
    unidad: i.unidad,
    periodo: i.periodo,
    categoria: i.categoria,
    fuente: i.fuente,
  }));

  return (
    <section className="mx-auto max-w-editorial px-5 py-12 lg:px-8">
      <p className="eyebrow text-acento">{header.eyebrow}</p>
      <div className="mt-3">
        <ObservatorioNav active="/observatorio/indicadores" />
      </div>
      <div className="mt-6 flex items-center gap-3">
        <BarChart2 size={32} className="text-principal/70" />
        <h1 className="font-display text-4xl">{header.title}</h1>
      </div>
      {header.description && <p className="mt-3 text-principal/70">{header.description}</p>}

      <div className="mt-8">
        <Strip
          label="Resumen"
          tone="joven"
          items={[
            { label: "Indicadores", value: String(indicadores.length) },
            { label: "Temas", value: String(categorias) },
            { label: "Fuentes", value: String(fuentes) },
            { label: "Última actualización", value: ultima },
          ]}
        />
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Panel title="Indicadores por tema">
          <BarList data={porTema} />
        </Panel>
        <Panel title="Actualizados recientemente">
          <ul className="space-y-3">
            {recientes.map((i) => (
              <li key={i.id} className="flex items-baseline justify-between gap-4">
                <div className="min-w-0">
                  <p className="line-clamp-1 text-sm font-medium">{i.nombre}</p>
                  <p className="text-xs text-principal/50">{i.periodo}</p>
                </div>
                <p className="shrink-0 font-display text-xl">
                  {formatear(i.valor)}
                  <span className="ml-1 text-xs text-principal/50">{i.unidad}</span>
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <IndicadoresClient indicadores={paraCliente} />
    </section>
  );
}
