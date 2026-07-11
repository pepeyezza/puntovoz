"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

type NavItem = { href: string; label: string; rolesPermitidos?: string[] };

const NAV: NavItem[] = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/editoriales", label: "Editoriales" },
  { href: "/admin/audios", label: "Audios" },
  { href: "/admin/videos", label: "Videos" },
  { href: "/admin/observatorio", label: "Data — Resumen" },
  { href: "/admin/observatorio/indicadores", label: "· Indicadores" },
  { href: "/admin/observatorio/proyectos", label: "· Proyectos" },
  { href: "/admin/observatorio/agenda", label: "· Agenda" },
  { href: "/admin/observatorio/oferta-academica", label: "· Oferta académica" },
  { href: "/admin/observatorio/investigacion", label: "· Investigación" },
  { href: "/admin/observatorio/entrevistas", label: "· Entrevistas" },
  { href: "/admin/observatorio/notas", label: "· Notas" },
  { href: "/admin/colaboradores", label: "Colaboradores" },
  { href: "/admin/sobre-nosotros", label: "Sección .VOZ" },
  { href: "/admin/categorias", label: "Categorías y etiquetas" },
  { href: "/admin/contacto", label: "Mensajes" },
  { href: "/admin/usuarios", label: "Usuarios", rolesPermitidos: ["ADMIN"] },
  { href: "/admin/configuracion", label: "Configuración", rolesPermitidos: ["ADMIN"] },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role ?? "";

  const items = NAV.filter((item) => !item.rolesPermitidos || item.rolesPermitidos.includes(role));

  return (
    <aside className="flex flex-col border-r border-principal/10 bg-secundario">
      <div className="border-b border-principal/10 px-6 py-5">
        <Link href="/" className="font-logo text-2xl font-bold">
          <span className="text-acento">.</span>VOZ{" "}
          <span className="font-body text-sm font-normal text-principal/40">admin</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {items.map((item) => {
            const isSubItem = item.label.startsWith("·");
            const isActive = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-xl px-3 py-2 text-sm transition-colors ${
                    isSubItem ? "pl-6 text-principal/60" : "font-medium"
                  } ${
                    isActive
                      ? "bg-principal text-secundario"
                      : "hover:bg-principal/5 text-principal/80"
                  }`}
                >
                  {isSubItem ? item.label.replace("· ", "") : item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
