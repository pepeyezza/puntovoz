export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Wrench } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import HerramientasClient from "@/components/observatorio/HerramientasClient";
import { Strip, Panel, DonutChart, Avatar, contar } from "@/components/observatorio/TableroUi";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { HERRAMIENTAS_DEMO } from "@/lib/herramientas";

export const metadata: Metadata = { title: "Tablero de herramientas - Data" };

async function getHerramientas(): Promise<any[]> {
  try {
    const h = await (prisma as any).herramientaTecnologica.findMany({
      orderBy: [{ orden: "asc" }, { categoria: "asc" }, { nombre: "asc" }],
    });
    return h.length ? h : (HERRAMIENTAS_DEMO as any[]);
  } catch {
    return HERRAMIENTAS_DEMO as any[];
  }
}

export default async function Page() {
  const header = await getPageHeader("dataHerramientas", {
    eyebrow: "Data",
    title: "Tablero de herramientas",
    description: "Apps, plataformas e inteligencia artificial para la gestión, comunicación y productividad.",
  });
  const herramientas = await getHerramientas();

  const categorias = new Set(herramientas.map((h: any) => h.categoria)).size;
  const destacadas = herramientas.filter((h: any) => h.destacada);
  const enIA = herramientas.filter((h: any) => h.categoria === "IA").length;
  const porCategoria = contar(herramientas, (h: any) => h.categoria || "Otros");

  return (
    <section className="mx-auto max-w-editorial px-5 py-12 lg:px-8">
      <p className="eyebrow text-acento">{header.eyebrow}</p>
      <div className="mt-3">
        <ObservatorioNav active="/observatorio/herramientas" />
      </div>
      <div className="mt-6 flex items-center gap-3">
        <Wrench size={32} className="text-principal/70" />
        <h1 className="font-display text-4xl">{header.title}</h1>
      </div>
      {header.description && <p className="mt-3 text-principal/70">{header.description}</p>}

      <div className="mt-8">
        <Strip
          label="Resumen"
          tone="joven"
          items={[
            { label: "Herramientas", value: String(herramientas.length) },
            { label: "Categorías", value: String(categorias) },
            { label: "Destacadas", value: String(destacadas.length) },
            { label: "Inteligencia artificial", value: String(enIA) },
          ]}
        />
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Panel title="Por categoría">
          <DonutChart data={porCategoria} />
        </Panel>
        <Panel title="Destacadas">
          {destacadas.length === 0 ? (
            <p className="text-sm text-principal/50">Todavía no hay herramientas destacadas.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {destacadas.slice(0, 6).map((h: any, i: number) => (
                <li key={h.id ?? `${h.nombre}-${i}`} className="flex items-center gap-3">
                  <Avatar src={h.logoUrl} name={h.nombre} />
                  <span className="line-clamp-1 text-sm font-medium">{h.nombre}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <HerramientasClient herramientas={herramientas} paginado={true} />
    </section>
  );
}
