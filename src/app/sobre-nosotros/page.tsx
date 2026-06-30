import type { Metadata } from "next";
import { COLABORADORES_DEMO } from "@/lib/demo-data";
import { getPageHeader, esHtmlEnriquecido } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Sobre Nosotros",
  description: "Historia, misión, visión, valores y equipo de .VOZ.",
};

const HISTORIA_DEFAULT = `<p>.VOZ nació de la necesidad de contar lo que pasa en nuestra región con una mirada propia: ni la del comunicado oficial, ni la del rumor de café. Una voz que se anima a explicar, a contextualizar y, cuando hace falta, a cuestionar.</p><p>Empezamos con editoriales y hoy sumamos audios, videos, voces colaboradoras y un espacio de Data que pone en números el desarrollo local. El objetivo no cambió: ayudar a entender el territorio para poder transformarlo.</p>`;

const MISION_DEFAULT = "Comunicar, divulgar y dar lugar a la opinión sobre los temas que definen el presente y el futuro de nuestra comunidad — desde la educación hasta la producción, desde la cultura hasta la gestión pública.";

const VISION_DEFAULT = "Ser una referencia de comunicación regional reconocida por su credibilidad, su pensamiento crítico y su capacidad de poner en agenda lo que realmente importa para el desarrollo local.";

const VALORES_DEFAULT = [
  { titulo: "Credibilidad", descripcion: "Chequeamos antes de publicar y citamos nuestras fuentes." },
  { titulo: "Pensamiento crítico", descripcion: "No repetimos el discurso oficial ni el del sentido común." },
  { titulo: "Cercanía", descripcion: "Escribimos para la comunidad, no para una audiencia abstracta." },
  { titulo: "Visión de futuro", descripcion: "Nos importa hacia dónde va la región, no solo lo que pasó hoy." },
];

const EQUIPO_DEFAULT = [
  { nombre: "Redacción .VOZ", rol: "Editorial y coordinación general" },
  ...COLABORADORES_DEMO.map((c) => ({ nombre: c.name, rol: "Colaborador/a" })),
];

async function getAboutContent() {
  try {
    const config = await prisma.siteConfig.findUnique({ where: { id: "singleton" } });
    return {
      historia: config?.aboutHistoria || HISTORIA_DEFAULT,
      mision: config?.aboutMision || MISION_DEFAULT,
      vision: config?.aboutVision || VISION_DEFAULT,
      valores: (config?.aboutValores as any[])?.length ? (config!.aboutValores as any[]) : VALORES_DEFAULT,
      equipo: (config?.aboutEquipo as any[])?.length ? (config!.aboutEquipo as any[]) : EQUIPO_DEFAULT,
    };
  } catch {
    return { historia: HISTORIA_DEFAULT, mision: MISION_DEFAULT, vision: VISION_DEFAULT, valores: VALORES_DEFAULT, equipo: EQUIPO_DEFAULT };
  }
}

export default async function SobreNosotrosPage() {
  const header = await getPageHeader("sobreNosotros", {
    eyebrow: "Sobre .VOZ",
    title: ".VOZ",
    description: "Una mirada crítica y cercana sobre lo que construye nuestra región.",
  });
  const { historia, mision, vision, valores, equipo } = await getAboutContent();

  return (
    <section>
      <div className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
        <p className="eyebrow text-acento">{header.eyebrow}</p>
        <h1 className="mt-2 max-w-2xl font-display text-4xl leading-tight lg:text-5xl">
          {header.title}
        </h1>
        {header.description && <p className="mt-4 max-w-xl text-principal/70">{header.description}</p>}
      </div>

      {/* Historia */}
      <div className="border-t border-principal/10 bg-principal/[0.03]">
        <div className="mx-auto grid max-w-editorial gap-10 px-5 py-16 lg:grid-cols-[0.6fr_1.4fr] lg:px-8">
          <p className="eyebrow text-acento">Nuestra historia</p>
          {esHtmlEnriquecido(historia) ? (
            <div className="prose-voz text-lg text-principal/80" dangerouslySetInnerHTML={{ __html: historia }} />
          ) : (
            <div className="space-y-4 text-lg leading-relaxed text-principal/80">
              {historia.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Misión / Visión */}
      <div className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <span className="linea-acento block" />
            <h2 className="mt-4 font-display text-2xl">Misión</h2>
            <p className="mt-3 text-principal/70">{mision}</p>
          </div>
          <div>
            <span className="linea-acento block" />
            <h2 className="mt-4 font-display text-2xl">Visión</h2>
            <p className="mt-3 text-principal/70">{vision}</p>
          </div>
        </div>
      </div>

      {/* Valores */}
      <div className="border-y border-principal/10 bg-principal py-16 text-secundario">
        <div className="mx-auto max-w-editorial px-5 lg:px-8">
          <p className="eyebrow text-joven">Valores</p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {valores.map((v: any) => (
              <div key={v.titulo}>
                <p className="font-display text-xl">{v.titulo}</p>
                <p className="mt-2 text-sm text-secundario/70">{v.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Equipo */}
      <div className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
        <p className="eyebrow text-acento">Equipo</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {equipo.map((m: any) => (
            <div key={m.nombre} className="rounded-2xl border border-principal/10 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-principal/10 font-display text-principal/60">
                {m.nombre.charAt(0)}
              </div>
              <p className="mt-4 font-medium">{m.nombre}</p>
              <p className="mt-1 text-sm text-principal/50">{m.rol}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
