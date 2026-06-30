"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createVideo(formData: FormData) {
  const title = String(formData.get("title") || "");
  const description = String(formData.get("description") || "");
  const youtubeUrl = String(formData.get("youtubeUrl") || "");
  const categoriaNombre = String(formData.get("category") || "");
  const status = String(formData.get("status") || "PUBLISHED") as "DRAFT" | "PUBLISHED" | "ARCHIVED";

  await prisma.video.create({
    data: {
      title,
      description,
      youtubeUrl,
      slug: slugify(title),
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
      categories: categoriaNombre
        ? {
            connectOrCreate: {
              where: { slug: slugify(categoriaNombre) },
              create: { name: categoriaNombre, slug: slugify(categoriaNombre) },
            },
          }
        : undefined,
    },
  });

  revalidatePath("/admin/videos");
  revalidatePath("/videos");
  redirect("/admin/videos");
}

export async function updateVideo(id: string, formData: FormData) {
  const title = String(formData.get("title") || "");
  const description = String(formData.get("description") || "");
  const youtubeUrl = String(formData.get("youtubeUrl") || "");
  const status = String(formData.get("status") || "PUBLISHED") as "DRAFT" | "PUBLISHED" | "ARCHIVED";

  await prisma.video.update({
    where: { id },
    data: {
      title,
      description,
      youtubeUrl,
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });

  revalidatePath("/admin/videos");
  revalidatePath("/videos");
  redirect("/admin/videos");
}

export async function deleteVideo(id: string) {
  await prisma.video.delete({ where: { id } });
  revalidatePath("/admin/videos");
  revalidatePath("/videos");
}
