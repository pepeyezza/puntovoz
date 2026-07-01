export const dynamic = "force-dynamic";
import Link from "next/link";
import Hero from "@/components/layout/Hero";
import ArticleCard from "@/components/editorial/ArticleCard";
import AudioCard from "@/components/audio/AudioCard";
import ObservatorioPreview from "@/components/observatorio/ObservatorioPreview";
import Newsletter from "@/components/layout/Newsletter";
import { prisma } from "@/lib/prisma";
import { EDITORIALES_DEMO, AUDIOS_DEMO, INDICADORES_DEMO } from "@/lib/demo-data";

const CATEGORIAS = ["Educación", "Tecnología", "Cultura", "Política", "Producción", "Comunidad"];

async function getHeroConfig() {
  try {
    const config = await prisma.siteConfig.findUnique({ where: { id: "singleton" } });
    return {
      eyebrow: config?.heroEyebrow || undefined,
      title: config?.heroTitle || undefined,
      description: config?.heroDescription || undefined,
    };
  } catch {
    return {};
  }
}

async function getHomeData() {
  try {
    const [posts, audios, indicadores] = await Promise.all([
      prisma.post.findMany({
        where: { type: "EDITORIAL", status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 3,
        include: { categories: true },
      }),
      prisma.audio.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
      prisma.indicador.findMany({ orderBy: { updatedAt: "desc" }, take: 3 }),
    ]);

    return {
      editoriales: posts.length
        ? posts.map((p) => ({
            slug: p.slug,
            title: p.title,
            subtitle: p.subtitle ?? "",
            category: p.categories[0]?.name ?? "",
            date: (p.publishedAt ?? p.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }),
            coverImage: p.coverImage ?? undefined,
          }))
        : EDITORIALES_DEMO.slice(0, 3),
      audios: audios.length
        ? audios.map((a) => ({
            title: a.title,
            description: a.description ?? "",
            spotifyUrl: a.spotifyUrl,
            date: (a.publishedAt ?? a.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }),
          }))
        : AUDIOS_DEMO.slice(0, 3),
      indicadores: indicadores.length ? indicadores : INDICADORES_DEMO.slice(0, 3),
    };
  } catch {
    return {
      editoriales: EDITORIALES_DEMO.slice(0, 3),
      audios: AUDIOS_DEMO.slice(0, 3),
      indicadores: INDICADORES_DEMO.slice(0, 3),
    };
  }
}

export default async function HomePage() {
  const hero = await getHeroConfig();
  const { editoriales, audios, indicadores } = await getHomeData();

  return (
    <>
      <Hero {...hero} />

      {/* Últimos editoriales */}
      <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow text-acento">Recién publicado</p>
            <h2 className="mt-2 font-display text-3xl">Últimos editoriales</h2>
          </div>
          <Link href="/editoriales" className="hidden text-sm font-semibold hover:text-acento sm:inline">
            Ver todos →
          </Link>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          {editoriales.map((a, i) => (
            <ArticleCard key={a.slug} {...a} size={i === 0 ? "large" : "default"} />
          ))}
        </div>
      </section>

      {/* Categorías temáticas */}
      <section className="border-y border-principal/10 bg-principal/[0.03] py-12">
        <div className="mx-auto max-w-editorial px-5 lg:px-8">
          <p className="eyebrow text-acento">Explorá por tema</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {CATEGORIAS.map((cat) => (
              <Link
                key={cat}
                href={`/categoria/${cat.toLowerCase()}`}
                className="rounded-full border border-principal/15 px-5 py-2 text-sm font-medium transition-colors hover:border-acento hover:text-acento"
              >
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
          <Link href="/audios" className="hidden text-sm font-semibold hover:text-acento sm:inline">
            Ver todos →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {audios.map((a) => (
            <AudioCard key={a.spotifyUrl} title={a.title} description={a.description} spotifyUrl={a.spotifyUrl} date={a.date} />
          ))}
        </div>
      </section>

      <ObservatorioPreview indicadores={indicadores} />

      {/* Sobre .VOZ */}
      <section className="mx-auto max-w-editorial px-5 py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <span className="linea-acento block" />
            <p className="eyebrow mt-4 text-acento">Quiénes somos</p>
          </div>
          <div>
            <h2 className="font-display text-3xl leading-snug lg:text-4xl">
              Una mirada crítica y cercana sobre lo que construye nuestra región.
            </h2>
            <p className="mt-5 max-w-2xl text-principal/70">
              .VOZ es un espacio de comunicación, divulgación y opinión que
              pone en agenda el desarrollo local, la educación, la cultura y
              la innovación — con la convicción de que entender el territorio
              es el primer paso para transformarlo.
            </p>
            <Link
              href="/sobre-nosotros"
              className="mt-6 inline-block text-sm font-semibold text-principal underline-offset-4 hover:underline"
            >
              Conocer el proyecto →
            </Link>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
