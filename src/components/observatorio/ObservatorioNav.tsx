import React from "react";
import Link from "next/link";
import { LayoutDashboard, BarChart2, FolderKanban, CalendarDays, GraduationCap, Microscope, Wrench, Mic2, FileText } from "lucide-react";

const TABS = [
  { href: "/observatorio", label: "Resumen", icon: LayoutDashboard },
  { href: "/observatorio/indicadores", label: "Indicadores", icon: BarChart2 },
  { href: "/observatorio/proyectos", label: "Proyectos", icon: FolderKanban },
  { href: "/observatorio/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/observatorio/oferta-academica", label: "Oferta académica", icon: GraduationCap },
  { href: "/observatorio/investigacion", label: "Investigación", icon: Microscope },
  { href: "/observatorio/herramientas", label: "Herramientas", icon: Wrench },
  { href: "/observatorio/entrevistas", label: "Entrevistas", icon: Mic2 },
  { href: "/observatorio/notas", label: "Notas", icon: FileText },
];

export const SECCION_COLORS: Record<string, { bg: string; text: string; navActive: string; style?: React.CSSProperties }> = {
  "/observatorio":               { bg: "bg-secundario",    text: "text-principal",   navActive: "bg-principal text-secundario" },
  "/observatorio/indicadores":   { bg: "bg-principal",     text: "text-secundario",  navActive: "bg-joven text-principal" },
  "/observatorio/proyectos":     { bg: "bg-acento/10",     text: "text-principal",   navActive: "bg-acento text-secundario" },
  "/observatorio/agenda":        { bg: "",                 text: "text-principal",   navActive: "bg-[#2d6a4f] text-white", style: { backgroundColor: "#e8f5e9" } },
  "/observatorio/oferta-academica": { bg: "bg-joven/10",  text: "text-principal",   navActive: "bg-joven text-principal" },
  "/observatorio/investigacion": { bg: "bg-principal/5",   text: "text-principal",   navActive: "bg-principal text-secundario" },
  "/observatorio/herramientas":  { bg: "",                 text: "text-principal",   navActive: "bg-[#6d28d9] text-white", style: { backgroundColor: "#ede9fe" } },
  "/observatorio/entrevistas":   { bg: "bg-acento/10",     text: "text-principal",   navActive: "bg-acento text-secundario" },
  "/observatorio/notas":         { bg: "bg-joven/10",      text: "text-principal",   navActive: "bg-joven text-principal" },
};

export default function ObservatorioNav({ active }: { active: string }) {
  const color = SECCION_COLORS[active] ?? SECCION_COLORS["/observatorio"];

  return (
    <nav className="flex flex-wrap gap-2 border-b border-principal/10 pb-4">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.href ||
          (tab.href !== "/observatorio" && active.startsWith(tab.href));
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? color.navActive
                : color.bg === "bg-principal"
                ? "text-secundario/60 hover:bg-secundario/10 hover:text-secundario"
                : "text-principal/70 hover:bg-principal/5"
            }`}
          >
            <Icon size={14} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
