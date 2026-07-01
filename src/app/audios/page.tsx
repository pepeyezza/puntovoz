export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import AudiosPageClient from "@/components/audio/AudiosPageClient";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { AUDIOS_DEMO } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Audios",
  description: "Catálogo de podcasts de .VOZ: episodios y playlists de Spotify.",
};

async function getAudios() {
  try {
    const audios = await prisma.audio.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      include: { categories: true },
    });
    if (audios.length === 0) return AUDIOS_DEMO;
    return audios.map((a) => ({
      slug: a.slug,
      title: a.title,
      description: a.description ?? "",
      spotifyUrl: a.spotifyUrl,
      category: a.categories[0]?.name ?? "",
      date: (a.publishedAt ?? a.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }),
    }));
  } catch {
    return AUDIOS_DEMO;
  }
}

export default async function AudiosPage() {
  const header = await getPageHeader("audios", {
    eyebrow: "Audios",
    title: "Catálogo de podcasts",
    description: "Episodios y playlists de .VOZ, directamente desde Spotify.",
  });
  const audios = await getAudios();

  return <AudiosPageClient header={header} audios={audios} />;
}
