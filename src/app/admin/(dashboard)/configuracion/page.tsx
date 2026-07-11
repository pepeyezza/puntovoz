export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { updateSiteConfig } from "@/lib/actions/config";
import ImageUploadField from "@/components/admin/ImageUploadField";

const PAGINAS_SITIO = [
  { key: "editoriales", label: "Editoriales", placeholders: { eyebrow: "Editoriales", title: "Articulos propios de .VOZ", description: "Analisis y notas de produccion propia." } },
  { key: "audios", label: "Audios", placeholders: { eyebrow: "Audios", title: "Catalogo de podcasts", description: "Episodios y playlists de .VOZ." } },
  { key: "videos", label: "Videos", placeholders: { eyebrow: "Videos", title: "Videos de .VOZ", description: "Contenido audiovisual del canal de YouTube." } },
  { key: "colaboradores", label: "Colaboradores", placeholders: { eyebrow: "Colaboradores", title: "Voces invitadas", description: "Personas de distintos sectores." } },
  { key: "sobreNosotros", label: "Seccion .VOZ", placeholders: { eyebrow: "Sobre .VOZ", title: ".VOZ", description: "Una mirada critica y cercana." } },
  { key: "contacto", label: "Contacto", placeholders: { eyebrow: "Contacto", title: "Hablemos", description: "Propuestas, consultas o ideas." } },
];

const PAGINAS_DATA = [
  { key: "observatorio", label: "Resumen de Data", placeholders: { eyebrow: "Data", title: "Observatorio de Chascomus", description: "Un espacio de seguimiento del desarrollo local." } },
  { key: "dataIndicadores", label: "Indicadores", placeholders: { eyebrow: "Data", title: "Indicadores", description: "Principales metricas de desarrollo del partido." } },
  { key: "dataProyectos", label: "Proyectos", placeholders: { eyebrow: "Data", title: "Proyectos de desarrollo local", description: "Iniciativas publicas, privadas y mixtas del partido." } },
  { key: "dataAgenda", label: "Agenda cultural", placeholders: { eyebrow: "Data", title: "Agenda cultural", description: "Proximas actividades y encuentros comunitarios." } },
  { key: "dataOfertaAcademica", label: "Oferta academica", placeholders: { eyebrow: "Data", title: "Oferta academica", description: "Instituciones educativas en Chascomus." } },
  { key: "dataInvestigacion", label: "Investigacion cientifica", placeholders: { eyebrow: "Data", title: "Investigacion cientifica", description: "Instituciones de investigacion en Chascomus." } },
  { key: "dataEntrevistas", label: "Entrevistas", placeholders: { eyebrow: "Data", title: "Entrevistas", description: "Voces de quienes construyen el desarrollo local." } },
  { key: "dataNotas", label: "Notas del Observatorio", placeholders: { eyebrow: "Data", title: "Notas sobre desarrollo local", description: "Analisis propios que cruzan datos y contexto." } },
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

  return (
    <div>
      <h1 className="font-display text-3xl">Configuracion</h1>
      <p className="mt-1 text-principal/60">Logo, colores, redes sociales y textos editables del sitio.</p>

      <form action={updateSiteConfig} className="mt-8 max-w-xl space-y-10">

        {/* Portada Home */}
        <div>
          <p className="text-sm font-semibold">Portada (Home)</p>
          <div className="mt-3 space-y-3">
            <input name="heroEyebrow" type="text" defaultValue={(config as any)?.heroEyebrow ?? ""} placeholder="Voz propia, mirada local" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <textarea name="heroTitle" rows={2} defaultValue={(config as any)?.heroTitle ?? ""} placeholder="Contamos lo que pasa en nuestro territorio." className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <textarea name="heroDescription" rows={3} defaultValue={(config as any)?.heroDescription ?? ""} placeholder="Descripcion breve del sitio..." className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
          </div>
        </div>

        {/* Seccion Data en el Home */}
        <div>
          <p className="text-sm font-semibold">Seccion Data (Home)</p>
          <div className="mt-3 space-y-3">
            <input name="homeDataTitle" type="text" defaultValue={(config as any)?.homeDataTitle ?? ""} placeholder="El partido, en numeros" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <input name="homeDataSubtitle" type="text" defaultValue={(config as any)?.homeDataSubtitle ?? ""} placeholder="Ver Data completo" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
          </div>
        </div>

        {/* Seccion Quienes somos en el Home */}
        <div>
          <p className="text-sm font-semibold">Seccion Quienes somos (Home)</p>
          <div className="mt-3 space-y-3">
            <input name="homeNosotrosTitle" type="text" defaultValue={(config as any)?.homeNosotrosTitle ?? ""} placeholder="Una mirada critica y cercana..." className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <textarea name="homeNosotrosText" rows={3} defaultValue={(config as any)?.homeNosotrosText ?? ""} placeholder=".VOZ es un espacio de comunicacion..." className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
          </div>
        </div>

        {/* Titulos de paginas del sitio */}
        <div>
          <p className="text-sm font-semibold">Titulos de paginas</p>
          <p className="mt-1 text-xs text-principal/50">Encabezado visible en cada seccion del sitio.</p>
          <div className="mt-3 space-y-4">
            {PAGINAS_SITIO.map((p) => (
              <div key={p.key} className="rounded-xl border border-principal/10 p-4">
                <p className="text-sm font-medium text-acento">{p.label}</p>
                <div className="mt-3 space-y-2">
                  <input name={`page_${p.key}_eyebrow`} type="text" defaultValue={pageHeaders[p.key]?.eyebrow ?? ""} placeholder={p.placeholders.eyebrow} className="w-full rounded-lg border border-principal/15 bg-secundario px-3 py-2 text-sm outline-none focus-visible:border-acento" />
                  <input name={`page_${p.key}_title`} type="text" defaultValue={pageHeaders[p.key]?.title ?? ""} placeholder={p.placeholders.title} className="w-full rounded-lg border border-principal/15 bg-secundario px-3 py-2 text-sm outline-none focus-visible:border-acento" />
                  <textarea name={`page_${p.key}_description`} rows={2} defaultValue={pageHeaders[p.key]?.description ?? ""} placeholder={p.placeholders.description} className="w-full rounded-lg border border-principal/15 bg-secundario px-3 py-2 text-sm outline-none focus-visible:border-acento" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Titulos de subsecciones de Data */}
        <div>
          <p className="text-sm font-semibold">Titulos de subsecciones de Data</p>
          <p className="mt-1 text-xs text-principal/50">Encabezado visible en cada subseccion dentro de Data.</p>
          <div className="mt-3 space-y-4">
            {PAGINAS_DATA.map((p) => (
              <div key={p.key} className="rounded-xl border border-principal/10 p-4">
                <p className="text-sm font-medium" style={{ color: "#2d6a4f" }}>{p.label}</p>
                <div className="mt-3 space-y-2">
                  <input name={`page_${p.key}_eyebrow`} type="text" defaultValue={pageHeaders[p.key]?.eyebrow ?? ""} placeholder={p.placeholders.eyebrow} className="w-full rounded-lg border border-principal/15 bg-secundario px-3 py-2 text-sm outline-none focus-visible:border-acento" />
                  <input name={`page_${p.key}_title`} type="text" defaultValue={pageHeaders[p.key]?.title ?? ""} placeholder={p.placeholders.title} className="w-full rounded-lg border border-principal/15 bg-secundario px-3 py-2 text-sm outline-none focus-visible:border-acento" />
                  <textarea name={`page_${p.key}_description`} rows={2} defaultValue={pageHeaders[p.key]?.description ?? ""} placeholder={p.placeholders.description} className="w-full rounded-lg border border-principal/15 bg-secundario px-3 py-2 text-sm outline-none focus-visible:border-acento" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logo */}
        <ImageUploadField name="logoUrl" defaultValue={(config as any)?.logoUrl ?? ""} label="Logo" />

        {/* Paleta de colores */}
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

        {/* Redes sociales */}
        <div>
          <p className="text-sm font-semibold">Redes sociales</p>
          <p className="mt-1 text-xs text-principal/50">Pega la URL completa incluyendo https://</p>
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
          Guardar configuracion
        </button>
      </form>
    </div>
  );
}
