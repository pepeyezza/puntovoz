export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/layout/Hero";
import ArticleCard from "@/components/editorial/ArticleCard";
import AudioCard from "@/components/audio/AudioCard";
import VideoCard from "@/components/video/VideoCard";
import ObservatorioPreview from "@/components/observatorio/ObservatorioPreview";
import Newsletter from "@/components/layout/Newsletter";
import { prisma } from "@/lib/prisma";
import { EDITORIALES_DEMO, AUDIOS_DEMO, VIDEOS_DEMO, INDICADORES_DEMO } from "@/lib/demo-data";
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
    const [posts, audios, videos, indicadores] = await Promise.all([
      prisma.post.findMany({
        where: { status: "PUBLISHED", type: { in: ["EDITORIAL", "COLABORADOR"] } },
        orderBy: [{ orden: "asc" }, { publishedAt: "desc" }],
        take: 3,
        include: { categories: true, author: true },
      }),
      prisma.audio.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ orden: "asc" }, { publishedAt: "desc" }],
        take: 3,
      }),
      prisma.video.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ orden: "asc" }, { publishedAt: "desc" }],
        take: 3,
      }),
      prisma.indicador.findMany({ orderBy: { updatedAt: "desc" }, take: 3 }),
    ]);

    return {
      editoriales: posts.length
        ? posts.map((p) => ({
            slug: p.slug, title: p.title, subtitle: p.subtitle ?? "",
            category: p.categories[0]?.name ?? "",
            date: (p.publishedAt ?? p.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }),
            coverImage: p.coverImage ?? undefined,
            featured: p.featured,
            author: p.author?.name ?? "Redacción .VOZ",
          }))
        : EDITORIALES_DEMO.slice(0, 3),
      audios: audios.length
        ? audios.map((a) => ({ title: a.title, description: a.description ?? "", spotifyUrl: a.spotifyUrl, date: (a.publishedAt ?? a.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }) }))
        : AUDIOS_DEMO.slice(0, 3),
      videos: videos.length
        ? videos.map((v) => ({ title: v.title, description: v.description ?? "", youtubeUrl: v.youtubeUrl, date: (v.publishedAt ?? v.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }) }))
        : (VIDEOS_DEMO ?? []).slice(0, 3),
      indicadores: indicadores.length ? indicadores : INDICADORES_DEMO.slice(0, 3),
    };
  } catch {
    return { editoriales: EDITORIALES_DEMO.slice(0, 3), audios: AUDIOS_DEMO.slice(0, 3), videos: [], indicadores: INDICADORES_DEMO.slice(0, 3) };
  }
}

export default async function HomePage() {
  const config = await getConfig();
  const { editoriales, audios, videos, indicadores } = await getHomeData();

  return (
    <>
      {/* Hero oscuro con banner */}
      <Hero eyebrow={config.eyebrow} title={config.title} description={config.description} bannerImages={config.bannerImages} />

      {/* Barra amarilla de categorías */}
      <div className="bg-joven">
        <div className="mx-auto flex max-w-editorial items-center gap-6 overflow-x-auto px-5 py-2.5 lg:px-8">
          <span className="shrink-0 text-xs font-bold uppercase tracking-widest text-principal/60">Temas</span>
          {CATEGORIAS_VOZ.map((cat) => (
            <Link key={cat} href={`/editoriales?categoria=${encodeURIComponent(cat)}`}
              className="shrink-0 text-sm font-medium text-principal/65 transition-colors hover:text-principal">
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Últimas editoriales */}
      <section className="mx-auto max-w-editorial px-5 py-14 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow text-acento">Recién publicado</p>
            <h2 className="mt-2 font-display text-3xl">Últimas editoriales</h2>
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <Link href="/colaboradores" className="text-sm font-medium text-principal/60 hover:text-acento">Colaboradores →</Link>
            <Link href="/editoriales" className="text-sm font-semibold hover:text-acento">Ver todas →</Link>
          </div>
        </div>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {editoriales.map((a, i) => (
            <ArticleCard key={a.slug} {...a} size={i === 0 ? "large" : "default"} />
          ))}
        </div>
      </section>

      {/* Últimos audios */}
      {audios.length > 0 && (
        <section className="bg-secundario/50 py-14">
          <div className="mx-auto max-w-editorial px-5 lg:px-8">
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
          </div>
        </section>
      )}

      {/* Últimos videos */}
      {videos.length > 0 && (
        <section className="py-14">
          <div className="mx-auto max-w-editorial px-5 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="eyebrow text-acento">Para ver</p>
                <h2 className="mt-2 font-display text-3xl">Últimos videos</h2>
              </div>
              <Link href="/videos" className="hidden text-sm font-semibold hover:text-acento sm:inline">Ver todos →</Link>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {videos.map((v) => <VideoCard key={v.youtubeUrl} title={v.title} description={v.description} youtubeUrl={v.youtubeUrl} date={v.date} />)}
            </div>
          </div>
        </section>
      )}

      {/* Data preview */}
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
