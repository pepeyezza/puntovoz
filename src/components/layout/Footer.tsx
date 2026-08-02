import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getSocials() {
  try {
    const config = await prisma.siteConfig.findUnique({ where: { id: "singleton" } });
    return (config?.socials as any) ?? {};
  } catch { return {}; }
}

export default async function Footer() {
  const socials = await getSocials();
  return (
    <footer className="border-t border-principal/10 bg-principal text-secundario">
      <div className="mx-auto max-w-editorial px-5 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div className="lg:col-span-2">
            <div className="font-logo text-5xl font-bold">
              <span className="text-acento">.</span>VOZ
            </div>
            <p className="mt-3 max-w-xs text-sm text-secundario/50">
              Comunicación, divulgación y opinión para el desarrollo de nuestra comunidad.
            </p>
            <div className="mt-4 flex gap-4">
              {socials.instagram && (
                <a href={socials.instagram} target="_blank" rel="noreferrer" className="text-sm text-secundario/40 hover:text-acento transition-colors">Instagram</a>
              )}
              {socials.spotify && (
                <a href={socials.spotify} target="_blank" rel="noreferrer" className="text-sm text-secundario/40 hover:text-joven transition-colors">Spotify</a>
              )}
            </div>
          </div>

          {/* Secciones */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-secundario/30">Contenido</p>
            <ul className="mt-4 space-y-2.5">
              {[["Editoriales","/editoriales"],["Audios","/audios"],["Videos","/videos"],["Colaboradores","/colaboradores"]].map(([l,h]) => (
                <li key={h}><Link href={h} className="text-sm text-secundario/50 hover:text-secundario transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Data y más */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-secundario/30">Data</p>
            <ul className="mt-4 space-y-2.5">
              {[["Observatorio","/observatorio"],["Indicadores","/observatorio/indicadores"],["Herramientas","/observatorio/herramientas"],["Contacto","/contacto"]].map(([l,h]) => (
                <li key={h}><Link href={h} className="text-sm text-secundario/50 hover:text-secundario transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-secundario/10 pt-8">
          <p className="text-xs text-secundario/25">© {new Date().getFullYear()} .VOZ · Chascomús</p>
          <Link href="/sobre-nosotros" className="text-xs text-secundario/25 hover:text-secundario/60 transition-colors">Sobre .VOZ</Link>
        </div>
      </div>
    </footer>
  );
}
