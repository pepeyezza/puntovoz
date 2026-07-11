"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Menu } from "lucide-react";

const NAV = [
  { href: "/editoriales", label: "Editoriales" },
  { href: "/audios", label: "Audios" },
  { href: "/videos", label: "Videos" },
  { href: "/observatorio", label: "Data" },
  { href: "/colaboradores", label: "Colaboradores" },
  { href: "/sobre-nosotros", label: ".VOZ" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-principal/10 bg-secundario/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-editorial items-center justify-between px-5 py-3 lg:px-8 lg:py-4">
        <Link href="/" className="font-logo text-4xl font-bold tracking-tight lg:text-5xl" onClick={() => setMenuAbierto(false)}>
          <span className="text-acento">.</span>VOZ
        </Link>

        {/* Navegación desktop */}
        <nav className="hidden gap-7 lg:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-principal/80 transition-colors hover:text-acento">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/contacto" className="hidden rounded-full bg-principal px-5 py-2 text-sm font-semibold text-secundario transition-transform hover:-translate-y-0.5 lg:inline-block">
          Contacto
        </Link>

        {/* Botón mobile con texto "Menú" */}
        <button
          className="flex items-center gap-1.5 rounded-full border border-principal/15 px-3 py-2 text-sm font-medium text-principal/80 lg:hidden"
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          {menuAbierto ? (
            <>
              <X size={18} />
              <span>Cerrar</span>
            </>
          ) : (
            <>
              <Menu size={18} />
              <span>Menú</span>
            </>
          )}
        </button>
      </div>

      {/* Menú mobile desplegable */}
      {menuAbierto && (
        <nav className="border-t border-principal/10 bg-secundario px-5 pb-6 pt-4 lg:hidden">
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setMenuAbierto(false)} className="block rounded-xl px-4 py-3 text-base font-medium text-principal/80 transition-colors hover:bg-principal/5 hover:text-acento">
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link href="/contacto" onClick={() => setMenuAbierto(false)} className="block rounded-full bg-principal px-5 py-3 text-center text-sm font-semibold text-secundario">
                Contacto
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
