export const dynamic = "force-dynamic";

import Link from "next/link";
import Hero from "@/components/layout/Hero";
import BannerCarousel from "@/components/layout/BannerCarousel";
import ArticleCard from "@/components/editorial/ArticleCard";
import AudioCard from "@/components/audio/AudioCard";
import ObservatorioPreview from "@/components/observatorio/ObservatorioPreview";
import Newsletter from "@/components/layout/Newsletter";
import { prisma } from "@/lib/prisma";
import { EDITORIALES_DEMO, AUDIOS_DEMO, INDICADORES_DEMO } from "@/lib/demo-data";
import { CATEGORIAS_VOZ } from "@/lib/categorias";

async function getConfig() {
  try {
    const config = await prisma.siteConfig.findUnique({ where: { id: "singleton" } });
    return {
      eyebrow: (config as any)?.heroEyebrow || undefined,
      title: (config as any)?.heroTitle || undefined,
      description: (config as any)?.heroDescription || undefined,
      dataTitle: (config as any)?.homeDataTitle || "El partido, en números",
      dataSubtitle: (config as any)?.homeDataSubtitle || "Ver Data completo →",
      nosotrosTitle: (config as any)?.homeNosotrosTitle || "Una mirada crítica y cercana sobre lo que construye nuestra región.",
      nosotrosText: (config as any)?.homeNosotrosText || ".VOZ es un espacio de comunicación, divulgación y opinión que pone en agenda el desarrollo local.",
      bannerImages: ((config as any)?.bannerImages as { url: string; caption: string }[]) ?? [],
    };
  } catch {
    return { dataTitle: "El partido, en números", dataSubtitle: "Ver Data completo →", nosotrosTitle: "Una mirada crítica y cercana.", nosotrosText: ".VOZ es un espacio de comunicación.", bannerImages: [] };
  }
}

async function getHomeData() {
  try {
    const [posts, audios, indicadores] = await Promise.all([
      prisma.post.findMany({ where: { type: "EDITORIAL", status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 3, include: { categories: true } }),
      prisma.audio.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 3 }),
      prisma.indicador.findMany({ orderBy: { updatedAt: "desc" }, take: 3 }),
    ]);
    return {
      editoriales: posts.length ? posts.map((p) => ({ slug: p.slug, title: p.title, subtitle: p.subtitle ?? "", category: p.categories[0]?.name ?? "", date: (p.publishedAt ?? p.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }), coverImage: p.coverImage ?? undefined })) : EDITORIALES_DEMO.slice(0, 3),
      audios: audios.length ? audios.map((a) => ({ title: a.title, description: a.description ?? "", spotifyUrl: a.spotifyUrl, date: (a.publishedAt ?? a.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }) })) : AUDIOS_DEMO.slice(0, 3),
      indicadores: indicadores.length ? indicadores : INDICADORES_DEMO.slice(0, 3),
    };
  } catch {
    return { editoriales: EDITORIALES_DEMO.slice(0, 3), audios: AUDIOS_DEMO.slice(0, 3), indicadores: INDICADORES_DEMO.slice(0, 3) };
  }
}

export default async function HomePage() {
  const config = await getConfig();
  const { editoriales, audios, indicadores } = await getHomeData();

  return (
    <>
      {/* Banner de fotos — entre el nav y el hero */}
      {config.bannerImages.length > 0 && (
        <BannerCarousel images={config.bannerImages} />
      )}

      <Hero eyebrow={config.eyebrow} title={config.title} description={config.description} />

      {/* Últimos editoriales */}
      <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow text-acento">Recién publicado</p>
            <h2 className="mt-2 font-display text-3xl">Últimos editoriales</h2>
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <Link href="/observatorio" className="text-sm font-medium text-principal/60 hover:text-acento">Data →</Link>
            <Link href="/colaboradores" className="text-sm font-medium text-principal/60 hover:text-acento">Colaboradores →</Link>
            <Link href="/editoriales" className="text-sm font-semibold hover:text-acento">Ver todos →</Link>
          </div>
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          {editoriales.map((a, i) => <ArticleCard key={a.slug} {...a} size={i === 0 ? "large" : "default"} />)}
        </div>
      </section>

      {/* Explorá por tema */}
      <section className="border-y border-principal/10 bg-principal/[0.03] py-12">
        <div className="mx-auto max-w-editorial px-5 lg:px-8">
          <p className="eyebrow text-acento">Explorá por tema</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {CATEGORIAS_VOZ.map((cat) => (
              <Link key={cat} href={`/editoriales?categoria=${encodeURIComponent(cat)}`} className="rounded-full border border-principal/15 px-5 py-2 text-sm font-medium transition-colors hover:border-acento hover:text-acento">
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Últimos audios */}
      <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow text-acento">Para escuchar</p>
            <h2 className="mt-2 font-display text-3xl">Últimos audios</h2>
          </div>
          <Link href="/audios" className="hidden text-sm font-semibold hover:text-acento sm:inline">Ver todos →</Link>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {audios.map((a) => <AudioCard key={a.spotifyUrl} title={a.title} description={a.description} spotifyUrl={a.spotifyUrl} date={a.date} />)}
        </div>
      </section>

      <ObservatorioPreview indicadores={indicadores} titulo={config.dataTitle} linkLabel={config.dataSubtitle} />

      {/* Quiénes somos */}
      <section className="mx-auto max-w-editorial px-5 py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <span className="linea-acento block" />
            <p className="eyebrow mt-4 text-acento">Quiénes somos</p>
          </div>
          <div>
            <h2 className="font-display text-3xl leading-snug lg:text-4xl">{config.nosotrosTitle}</h2>
            <p className="mt-5 max-w-2xl text-principal/70">{config.nosotrosText}</p>
            <Link href="/sobre-nosotros" className="mt-6 inline-block text-sm font-semibold text-principal underline-offset-4 hover:underline">Conocer el proyecto →</Link>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
