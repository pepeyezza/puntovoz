"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

type NavItem = { href: string; label: string; rolesPermitidos?: string[] };

const NAV: NavItem[] = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/editoriales", label: "Editoriales" },
  { href: "/admin/audios", label: "Audios" },
  { href: "/admin/videos", label: "Videos" },
  { href: "/admin/observatorio", label: "Data" },
  { href: "/admin/colaboradores", label: "Colaboradores" },
  { href: "/admin/sobre-nosotros", label: "Sección .VOZ" },
  { href: "/admin/categorias", label: "Categorías y etiquetas" },
  { href: "/admin/contacto", label: "Mensajes" },
  { href: "/admin/usuarios", label: "Usuarios", rolesPermitidos: ["ADMIN"] },
  { href: "/admin/configuracion", label: "Configuración", rolesPermitidos: ["ADMIN"] },
];

export default function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-principal/10 bg-secundario">
      <div className="px-6 py-6">
        <p className="font-logo text-xl font-bold">
          <span className="text-acento">.</span>VOZ <span className="font-body text-sm font-normal text-principal/40">admin</span>
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.filter((item) => !item.rolesPermitidos || item.rolesPermitidos.includes(role)).map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-principal text-secundario" : "text-principal/70 hover:bg-principal/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-principal/10 p-4">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium text-principal/60 hover:bg-principal/5"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
