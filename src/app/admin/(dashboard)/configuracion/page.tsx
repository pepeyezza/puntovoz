import { prisma } from "@/lib/prisma";
import { updateSiteConfig } from "@/lib/actions/config";
import ImageUploadField from "@/components/admin/ImageUploadField";

async function getConfig() {
  try {
    return await prisma.siteConfig.findUnique({ where: { id: "singleton" } });
  } catch {
    return null;
  }
}

export default async function AdminConfiguracionPage() {
  const config = await getConfig();
  const colors = (config?.colors as any) ?? {};
  const socials = (config?.socials as any) ?? {};
  const pageHeaders = (config?.pageHeaders as any) ?? {};

  const PAGINAS = [
    { key: "editoriales", label: "Editoriales", placeholders: { eyebrow: "Editoriales", title: "Artículos propios de .VOZ", description: "Análisis y notas de producción propia…" } },
    { key: "audios", label: "Audios", placeholders: { eyebrow: "Audios", title: "Catálogo de podcasts", description: "Episodios y playlists de .VOZ…" } },
    { key: "observatorio", label: "Observatorio", placeholders: { eyebrow: "Observatorio", title: "Observatorio de Chascomús", description: "Un espacio de seguimiento del desarrollo local…" } },
    { key: "colaboradores", label: "Colaboradores", placeholders: { eyebrow: "Colaboradores", title: "Voces invitadas", description: "Personas de distintos sectores de la comunidad…" } },
    { key: "sobreNosotros", label: "Sección \".VOZ\" (ex Nosotros)", placeholders: { eyebrow: "Sobre .VOZ", title: ".VOZ", description: "Una mirada crítica y cercana…" } },
    { key: "contacto", label: "Contacto", placeholders: { eyebrow: "Contacto", title: "Hablemos", description: "Propuestas, consultas o ideas para colaborar…" } },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl">Configuración</h1>
      <p className="mt-1 text-principal/60">Logo, colores de marca y redes sociales del sitio.</p>

      <form action={updateSiteConfig} className="mt-8 max-w-xl space-y-8">
        <div>
          <p className="text-sm font-medium">Portada (Home)</p>
          <p className="mt-1 text-xs text-principal/50">
            Texto principal que se muestra arriba de todo en la página de inicio.
          </p>
          <div className="mt-3 space-y-3">
            <div>
              <label className="text-xs text-principal/60">Subtítulo (etiqueta pequeña arriba del título)</label>
              <input
                name="heroEyebrow"
                type="text"
                defaultValue={config?.heroEyebrow ?? ""}
                placeholder="Voz propia, mirada local"
                className="mt-1 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento"
              />
            </div>
            <div>
              <label className="text-xs text-principal/60">Título principal</label>
              <textarea
                name="heroTitle"
                rows={2}
                defaultValue={config?.heroTitle ?? ""}
                placeholder="Contamos lo que pasa en nuestro territorio."
                className="mt-1 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento"
              />
            </div>
            <div>
              <label className="text-xs text-principal/60">Descripción</label>
              <textarea
                name="heroDescription"
                rows={3}
                defaultValue={config?.heroDescription ?? ""}
                placeholder="Editoriales, audios y datos sobre desarrollo local…"
                className="mt-1 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento"
              />
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">Títulos de cada página</p>
          <p className="mt-1 text-xs text-principal/50">
            Encabezado (subtítulo, título y descripción) que aparece arriba en cada sección del sitio.
          </p>
          <div className="mt-3 space-y-6">
            {PAGINAS.map((p) => (
              <div key={p.key} className="rounded-xl border border-principal/10 p-4">
                <p className="text-sm font-medium text-acento">{p.label}</p>
                <div className="mt-3 space-y-2">
                  <input
                    name={`page_${p.key}_eyebrow`}
                    type="text"
                    defaultValue={pageHeaders[p.key]?.eyebrow ?? ""}
                    placeholder={p.placeholders.eyebrow}
                    className="w-full rounded-lg border border-principal/15 bg-secundario px-3 py-2 text-sm outline-none focus-visible:border-acento"
                  />
                  <input
                    name={`page_${p.key}_title`}
                    type="text"
                    defaultValue={pageHeaders[p.key]?.title ?? ""}
                    placeholder={p.placeholders.title}
                    className="w-full rounded-lg border border-principal/15 bg-secundario px-3 py-2 text-sm outline-none focus-visible:border-acento"
                  />
                  <textarea
                    name={`page_${p.key}_description`}
                    rows={2}
                    defaultValue={pageHeaders[p.key]?.description ?? ""}
                    placeholder={p.placeholders.description}
                    className="w-full rounded-lg border border-principal/15 bg-secundario px-3 py-2 text-sm outline-none focus-visible:border-acento"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <ImageUploadField name="logoUrl" defaultValue={config?.logoUrl ?? ""} label="Logo" />

        <div>
          <p className="text-sm font-medium">Paleta de colores</p>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { name: "colorPrincipal", label: "Principal", def: colors.principal ?? "#1c2a38" },
              { name: "colorSecundario", label: "Secundario", def: colors.secundario ?? "#f5f2eb" },
              { name: "colorAcento", label: "Acento", def: colors.acento ?? "#c87a62" },
              { name: "colorJoven", label: "Joven", def: colors.joven ?? "#f4a900" },
            ].map((c) => (
              <div key={c.name}>
                <label className="text-xs text-principal/60">{c.label}</label>
                <input
                  name={c.name}
                  type="color"
                  defaultValue={c.def}
                  className="mt-1 h-10 w-full rounded-lg border border-principal/15"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">Redes sociales</p>
          <div className="mt-3 space-y-3">
            <input
              name="instagram"
              type="url"
              defaultValue={socials.instagram ?? ""}
              placeholder="https://instagram.com/voz"
              className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento"
            />
            <input
              name="spotify"
              type="url"
              defaultValue={socials.spotify ?? ""}
              placeholder="https://open.spotify.com/show/…"
              className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento"
            />
            <input
              name="twitter"
              type="url"
              defaultValue={socials.twitter ?? ""}
              placeholder="https://twitter.com/voz"
              className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento"
            />
          </div>
        </div>

        <button type="submit" className="rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario hover:-translate-y-0.5">
          Guardar configuración
        </button>
      </form>
    </div>
  );
}
