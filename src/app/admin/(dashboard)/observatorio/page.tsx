export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getCounts() {
  try {
    const [indicadores, entrevistas, proyectos, agenda, notas] = await Promise.all([
      prisma.indicador.count(),
      prisma.entrevista.count(),
      prisma.proyectoLocal.count(),
      prisma.eventoAgenda.count(),
      prisma.notaObservatorio.count(),
    ]);
    return { indicadores, entrevistas, proyectos, agenda, notas };
  } catch {
    return { indicadores: 0, entrevistas: 0, proyectos: 0, agenda: 0, notas: 0 };
  }
}

export default async function AdminObservatorioPage() {
  const counts = await getCounts();

  const modulos = [
    { label: "Indicadores", count: counts.indicadores, href: "/admin/observatorio/indicadores" },
    { label: "Entrevistas", count: counts.entrevistas, href: "/admin/observatorio/entrevistas" },
    { label: "Proyectos", count: counts.proyectos, href: "/admin/observatorio/proyectos" },
    { label: "Agenda cultural", count: counts.agenda, href: "/admin/observatorio/agenda" },
    { label: "Notas", count: counts.notas, href: "/admin/observatorio/notas" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl">Observatorio de Chascomús</h1>
      <p className="mt-1 text-principal/60">Gestión de los contenidos del Observatorio.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {modulos.map((m) => (
          <Link key={m.href} href={m.href} className="rounded-2xl border border-principal/10 p-6 transition-colors hover:border-acento">
            <p className="font-display text-3xl text-acento">{m.count}</p>
            <p className="mt-2 text-sm font-medium">{m.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
