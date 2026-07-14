import Link from "next/link";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

async function getSocials() {
  try {
    const config = await prisma.siteConfig.findUnique({ where: { id: "singleton" } });
    return (config?.socials as any) ?? {};
  } catch {
    return {};
  }
}

export default async function Footer() {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") ?? "";
  if (pathname?.startsWith("/admin")) return null;

  const socials = await getSocials();

  const redes = [
    socials.instagram && { href: socials.instagram, label: "Instagram" },
    socials.spotify && { href: socials.spotify, label: "Spotify" },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <footer className="border-t border-secundario/10 bg-principal text-secundario">
      <div className="mx-auto grid max-w-editorial gap-10 px-5 py-14 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-logo text-3xl font-bold lg:text-4xl">
            <span className="text-acento">.</span>VOZ
          </p>
          <p className="mt-3 max-w-xs text-sm text-secundario/70">
            Comunicación, divulgación y opinión para el desarrollo de nuestra comunidad.
          </p>
        </div>

        <div>
          <p className="eyebrow text-secundario/50">Secciones</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/editoriales" className="hover:text-joven">Editoriales</Link></li>
            <li><Link href="/audios" className="hover:text-joven">Audios</Link></li>
            <li><Link href="/videos" className="hover:text-joven">Videos</Link></li>
            <li><Link href="/observatorio" className="hover:text-joven">Data</Link></li>
            <li><Link href="/colaboradores" className="hover:text-joven">Colaboradores</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-secundario/50">Redes</p>
          <ul className="mt-3 space-y-2 text-sm">
            {redes.length === 0 ? (
              <li className="text-secundario/40">Sin redes configuradas</li>
            ) : (
              redes.map((r) => (
                <li key={r.href}>
                  <a href={r.href} className="hover:text-joven" target="_blank" rel="noreferrer">
                    {r.label}
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-secundario/50">Legal</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/contacto" className="hover:text-joven">Contacto</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-secundario/10 px-5 py-5 text-center text-xs text-secundario/50 lg:px-8">
        &copy; {new Date().getFullYear()} .VOZ &mdash; Todos los derechos reservados.
      </div>
    </footer>
  );
}
