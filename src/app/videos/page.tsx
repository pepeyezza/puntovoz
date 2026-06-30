import type { Metadata } from "next";
import VideosPageClient from "@/components/video/VideosPageClient";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { VIDEOS_DEMO } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Videos",
  description: "Videos de .VOZ desde el canal de YouTube.",
};

async function getVideos() {
  try {
    const videos = await prisma.video.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      include: { categories: true },
    });
    if (videos.length === 0) return VIDEOS_DEMO;
    return videos.map((v) => ({
      slug: v.slug,
      title: v.title,
      description: v.description ?? "",
      youtubeUrl: v.youtubeUrl,
      category: v.categories[0]?.name ?? "",
      date: (v.publishedAt ?? v.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }),
    }));
  } catch {
    return VIDEOS_DEMO;
  }
}

export default async function VideosPage() {
  const header = await getPageHeader("videos", {
    eyebrow: "Videos",
    title: "Videos de .VOZ",
    description: "Contenido audiovisual del canal de YouTube de .VOZ.",
  });
  const videos = await getVideos();

  return <VideosPageClient header={header} videos={videos} />;
}
