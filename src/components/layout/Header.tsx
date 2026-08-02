"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Menu } from "lucide-react";

const NAV = [
  { href: "/editoriales",   label: "Editoriales",  activeStyle: "bg-acento/25 text-secundario border border-acento/40" },
  { href: "/audios",        label: "Audios",        activeStyle: "bg-joven/20 text-joven border border-joven/35" },
  { href: "/videos",        label: "Videos",        activeStyle: "bg-secundario/10 text-secundario border border-secundario/25" },
  { href: "/observatorio",  label: "Data",          activeStyle: "bg-joven/20 text-joven border border-joven/35" },
  { href: "/colaboradores", label: "Colaboradores", activeStyle: "bg-secundario/10 text-secundario border border-secundario/25" },
  { href: "/sobre-nosotros",label: ".VOZ",          activeStyle: "bg-acento/25 text-secundario border border-acento/40" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 bg-principal backdrop-blur-md border-b border-secundario/10">
      <div className="mx-auto flex max-w-editorial items-center justify-between px-5 py-3 lg:px-8">
        <Link href="/" className="font-logo text-4xl font-bold tracking-tight lg:text-5xl" onClick={() => setMenuAbierto(false)}>
          <span className="text-acento">.</span><span className="text-secundario">VOZ</span>
        </Link>

        <nav className="hidden gap-1.5 lg:flex">
          {NAV.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive ? item.activeStyle : "text-secundario/45 border border-transparent hover:text-secundario/75 hover:bg-secundario/8"
                }`}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/contacto" className="hidden rounded-full border border-secundario/25 px-5 py-2 text-sm font-semibold text-secundario transition-colors hover:bg-secundario hover:text-principal lg:inline-block">
          Contacto
        </Link>

        <button className="flex items-center gap-1.5 rounded-full border border-secundario/25 px-3 py-2 text-sm font-medium text-secundario/80 lg:hidden" onClick={() => setMenuAbierto(!menuAbierto)}>
          {menuAbierto ? <><X size={18} /><span>Cerrar</span></> : <><Menu size={18} /><span>Menú</span></>}
        </button>
      </div>

      {menuAbierto && (
        <nav className="border-t border-secundario/10 bg-principal px-5 pb-6 pt-4 lg:hidden">
          <ul className="space-y-1.5">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setMenuAbierto(false)}
                  className={`block rounded-xl px-4 py-3 text-sm font-semibold ${pathname?.startsWith(item.href) ? item.activeStyle : "text-secundario/60 hover:text-secundario"}`}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link href="/contacto" onClick={() => setMenuAbierto(false)} className="block rounded-full border border-secundario/25 px-5 py-3 text-center text-sm font-semibold text-secundario">
                Contacto
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
