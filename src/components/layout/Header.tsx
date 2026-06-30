"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-principal/10 bg-secundario/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-editorial items-center justify-between px-5 py-3 lg:px-8 lg:py-4">
        <Link href="/" className="font-logo text-4xl font-bold tracking-tight lg:text-5xl">
          <span className="text-acento">.</span>VOZ
        </Link>

        <nav className="hidden gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-principal/80 transition-colors hover:text-acento"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contacto"
          className="hidden rounded-full bg-principal px-5 py-2 text-sm font-semibold text-secundario transition-transform hover:-translate-y-0.5 lg:inline-block"
        >
          Contacto
        </Link>

        {/* Menú mobile simplificado — placeholder de interacción */}
        <button
          className="lg:hidden"
          aria-label="Abrir menú"
        >
          <span className="block h-0.5 w-6 bg-principal" />
          <span className="mt-1.5 block h-0.5 w-6 bg-principal" />
          <span className="mt-1.5 block h-0.5 w-4 bg-principal" />
        </button>
      </div>
    </header>
  );
}
