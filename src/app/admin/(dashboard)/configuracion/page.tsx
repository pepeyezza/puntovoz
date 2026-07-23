export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { updateSiteConfig } from "@/lib/actions/config";
import ImageUploadField from "@/components/admin/ImageUploadField";

const PAGINAS_SITIO = [
  { key: "editoriales", label: "Editoriales", placeholders: { eyebrow: "Editoriales", title: "Artículos propios de .VOZ", description: "" } },
  { key: "audios", label: "Audios", placeholders: { eyebrow: "Audios", title: "Catálogo de podcasts", description: "" } },
  { key: "videos", label: "Videos", placeholders: { eyebrow: "Videos", title: "Videos de .VOZ", description: "" } },
  { key: "colaboradores", label: "Colaboradores", placeholders: { eyebrow: "Colaboradores", title: "Voces invitadas", description: "" } },
  { key: "sobreNosotros", label: "Sección .VOZ", placeholders: { eyebrow: "Sobre .VOZ", title: ".VOZ", description: "" } },
  { key: "contacto", label: "Contacto", placeholders: { eyebrow: "Contacto", title: "Hablemos", description: "" } },
];

const PAGINAS_DATA = [
  { key: "observatorio", label: "Resumen Data" },
  { key: "dataIndicadores", label: "Indicadores" },
  { key: "dataProyectos", label: "Proyectos" },
  { key: "dataAgenda", label: "Agenda cultural" },
  { key: "dataOfertaAcademica", label: "Oferta académica" },
  { key: "dataInvestigacion", label: "Investigación científica" },
  { key: "dataEntrevistas", label: "Entrevistas" },
  { key: "dataNotas", label: "Notas" },
];

async function getConfig() {
  try { return await prisma.siteConfig.findUnique({ where: { id: "singleton" } }); }
  catch { return null; }
}

export default async function AdminConfiguracionPage() {
  const config = await getConfig();
  const colors = (config?.colors as any) ?? {};
  const socials = (config?.socials as any) ?? {};
  const pageHeaders = (config?.pageHeaders as any) ?? {};
  const bannerImages = ((config as any)?.bannerImages as { url: string; caption: string }[]) ?? [];

  return (
    <div>
      <h1 className="font-display text-3xl">Configuración</h1>
      <p className="mt-1 text-principal/60">Logo, colores, redes, banner y textos editables del sitio.</p>

      <form action={updateSiteConfig} className="mt-8 max-w-xl space-y-10">

        {/* BANNER DE FOTOS */}
        <div>
          <p className="text-sm font-semibold">Banner de fotos (Home)</p>
          <p className="mt-1 text-xs text-principal/50">Hasta 3 fotos que rotan automáticamente debajo del menú. Podés agregar un pie de foto opcional para cada una.</p>
          <div className="mt-4 space-y-6">
            {[1, 2, 3].map((i) => {
              const img = bannerImages[i - 1];
              return (
                <div key={i} className="rounded-xl border border-principal/10 p-4">
                  <p className="mb-3 text-xs font-medium text-principal/60">Foto {i}</p>
                  <ImageUploadField name={`banner_${i}_url`} defaultValue={img?.url ?? ""} label="Imagen" />
                  <div className="mt-3">
                    <label className="text-xs font-medium text-principal/60">Pie de foto (opcional)</label>
                    <input
                      name={`banner_${i}_caption`}
                      type="text"
                      defaultValue={img?.caption ?? ""}
                      placeholder="Ej: Laguna de Chascomús · atardecer"
                      className="mt-1 w-full rounded-lg border border-principal/15 bg-secundario px-3 py-2 text-sm outline-none focus-visible:border-acento"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PORTADA HOME */}
        <div>
          <p className="text-sm font-semibold">Portada (Home)</p>
          <div className="mt-3 space-y-3">
            <input name="heroEyebrow" type="text" defaultValue={(config as any)?.heroEyebrow ?? ""} placeholder="Voz propia, mirada local" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <textarea name="heroTitle" rows={2} defaultValue={(config as any)?.heroTitle ?? ""} placeholder="Pensar, divulgar, informar." className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <textarea name="heroDescription" rows={3} defaultValue={(config as any)?.heroDescription ?? ""} placeholder="Descripción breve..." className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
          </div>
        </div>

        {/* SECCIÓN DATA EN EL HOME */}
        <div>
          <p className="text-sm font-semibold">Sección Data (Home)</p>
          <div className="mt-3 space-y-3">
            <input name="homeDataTitle" type="text" defaultValue={(config as any)?.homeDataTitle ?? ""} placeholder="El partido, en números" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <input name="homeDataSubtitle" type="text" defaultValue={(config as any)?.homeDataSubtitle ?? ""} placeholder="Ver Data completo →" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
          </div>
        </div>

        {/* SECCIÓN QUIÉNES SOMOS */}
        <div>
          <p className="text-sm font-semibold">Sección Quiénes somos (Home)</p>
          <div className="mt-3 space-y-3">
            <input name="homeNosotrosTitle" type="text" defaultValue={(config as any)?.homeNosotrosTitle ?? ""} placeholder="Una mirada crítica y cercana..." className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <textarea name="homeNosotrosText" rows={3} defaultValue={(config as any)?.homeNosotrosText ?? ""} placeholder=".VOZ es un espacio de comunicación..." className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
          </div>
        </div>

        {/* TÍTULOS DE PÁGINAS */}
        <div>
          <p className="text-sm font-semibold">Títulos de páginas</p>
          <div className="mt-3 space-y-4">
            {PAGINAS_SITIO.map((p) => (
              <div key={p.key} className="rounded-xl border border-principal/10 p-4">
                <p className="text-sm font-medium text-acento">{p.label}</p>
                <div className="mt-3 space-y-2">
                  <input name={`page_${p.key}_eyebrow`} type="text" defaultValue={pageHeaders[p.key]?.eyebrow ?? ""} placeholder={p.placeholders.eyebrow} className="w-full rounded-lg border border-principal/15 bg-secundario px-3 py-2 text-sm outline-none focus-visible:border-acento" />
                  <input name={`page_${p.key}_title`} type="text" defaultValue={pageHeaders[p.key]?.title ?? ""} placeholder={p.placeholders.title} className="w-full rounded-lg border border-principal/15 bg-secundario px-3 py-2 text-sm outline-none focus-visible:border-acento" />
                  <textarea name={`page_${p.key}_description`} rows={2} defaultValue={pageHeaders[p.key]?.description ?? ""} placeholder="Descripción..." className="w-full rounded-lg border border-principal/15 bg-secundario px-3 py-2 text-sm outline-none focus-visible:border-acento" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TÍTULOS DE DATA */}
        <div>
          <p className="text-sm font-semibold">Títulos de subsecciones de Data</p>
          <div className="mt-3 space-y-4">
            {PAGINAS_DATA.map((p) => (
              <div key={p.key} className="rounded-xl border border-principal/10 p-4">
                <p className="text-sm font-medium" style={{ color: "#2d6a4f" }}>{p.label}</p>
                <div className="mt-3 space-y-2">
                  <input name={`page_${p.key}_eyebrow`} type="text" defaultValue={pageHeaders[p.key]?.eyebrow ?? ""} placeholder="Eyebrow" className="w-full rounded-lg border border-principal/15 bg-secundario px-3 py-2 text-sm outline-none focus-visible:border-acento" />
                  <input name={`page_${p.key}_title`} type="text" defaultValue={pageHeaders[p.key]?.title ?? ""} placeholder="Título" className="w-full rounded-lg border border-principal/15 bg-secundario px-3 py-2 text-sm outline-none focus-visible:border-acento" />
                  <textarea name={`page_${p.key}_description`} rows={2} defaultValue={pageHeaders[p.key]?.description ?? ""} placeholder="Descripción..." className="w-full rounded-lg border border-principal/15 bg-secundario px-3 py-2 text-sm outline-none focus-visible:border-acento" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LOGO */}
        <ImageUploadField name="logoUrl" defaultValue={(config as any)?.logoUrl ?? ""} label="Logo" />

        {/* PALETA */}
        <div>
          <p className="text-sm font-semibold">Paleta de colores</p>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { name: "colorPrincipal", label: "Principal", def: colors.principal ?? "#1c2a38" },
              { name: "colorSecundario", label: "Secundario", def: colors.secundario ?? "#f5f2eb" },
              { name: "colorAcento", label: "Acento", def: colors.acento ?? "#c87a62" },
              { name: "colorJoven", label: "Joven", def: colors.joven ?? "#f4a900" },
            ].map((c) => (
              <div key={c.name}>
                <label className="text-xs text-principal/60">{c.label}</label>
                <input name={c.name} type="color" defaultValue={c.def} className="mt-1 h-10 w-full rounded-lg border border-principal/15" />
              </div>
            ))}
          </div>
        </div>

        {/* REDES */}
        <div>
          <p className="text-sm font-semibold">Redes sociales</p>
          <div className="mt-3 space-y-3">
            <div>
              <label className="text-xs text-principal/60">Instagram</label>
              <input name="instagram" type="url" defaultValue={socials.instagram ?? ""} placeholder="https://instagram.com/puntovoz" className="mt-1 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            </div>
            <div>
              <label className="text-xs text-principal/60">Spotify</label>
              <input name="spotify" type="url" defaultValue={socials.spotify ?? ""} placeholder="https://open.spotify.com/show/..." className="mt-1 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            </div>
          </div>
        </div>

        <button type="submit" className="rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario hover:-translate-y-0.5">
          Guardar configuración
        </button>
      </form>
    </div>
  );
}
