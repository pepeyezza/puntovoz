import React from "react";
import Link from "next/link";

const TABS = [
  { href: "/observatorio", label: "Resumen" },
  { href: "/observatorio/indicadores", label: "Indicadores" },
  { href: "/observatorio/proyectos", label: "Proyectos" },
  { href: "/observatorio/agenda", label: "Agenda" },
  { href: "/observatorio/oferta-academica", label: "Oferta académica" },
  { href: "/observatorio/investigacion", label: "Investigación" },
  { href: "/observatorio/entrevistas", label: "Entrevistas" },
  { href: "/observatorio/notas", label: "Notas" },
];

// Colores de fondo por sección — deben coincidir con los del resumen
export const SECCION_COLORS: Record<string, { bg: string; text: string; navActive: string; style?: React.CSSProperties }> = {
  "/observatorio": { bg: "bg-secundario", text: "text-principal", navActive: "bg-principal text-secundario" },
  "/observatorio/indicadores": { bg: "bg-principal", text: "text-secundario", navActive: "bg-joven text-principal" },
  "/observatorio/proyectos": { bg: "bg-acento/10", text: "text-principal", navActive: "bg-acento text-secundario" },
  "/observatorio/agenda": { bg: "", text: "text-principal", navActive: "bg-[#2d6a4f] text-white", style: { backgroundColor: "#e8f5e9" } },
  "/observatorio/oferta-academica": { bg: "bg-joven/10", text: "text-principal", navActive: "bg-joven text-principal" },
  "/observatorio/investigacion": { bg: "bg-principal/5", text: "text-principal", navActive: "bg-principal text-secundario" },
  "/observatorio/entrevistas": { bg: "bg-secundario", text: "text-principal", navActive: "bg-principal text-secundario" },
  "/observatorio/notas": { bg: "bg-secundario", text: "text-principal", navActive: "bg-principal text-secundario" },
};

export default function ObservatorioNav({ active }: { active: string }) {
  const color = SECCION_COLORS[active] ?? SECCION_COLORS["/observatorio"];

  return (
    <nav className="flex flex-wrap gap-2 border-b border-principal/10 pb-6">
      {TABS.map((tab) => {
        const isActive = active === tab.href ||
          (tab.href !== "/observatorio" && active.startsWith(tab.href));
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? color.navActive
                : color.bg === "bg-principal"
                ? "text-secundario/60 hover:bg-secundario/10 hover:text-secundario"
                : "text-principal/70 hover:bg-principal/5"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
