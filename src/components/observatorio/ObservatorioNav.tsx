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

export default function ObservatorioNav({ active }: { active: string }) {
  return (
    <nav className="flex flex-wrap gap-2 border-b border-principal/10 pb-6">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            active === tab.href
              ? "bg-principal text-secundario"
              : "text-principal/70 hover:bg-principal/5"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
