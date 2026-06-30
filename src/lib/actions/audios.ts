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

export async function createAudio(formData: FormData) {
  const title = String(formData.get("title") || "");
  const description = String(formData.get("description") || "");
  const spotifyUrl = String(formData.get("spotifyUrl") || "");
  const categoriaNombre = String(formData.get("category") || "");
  const status = String(formData.get("status") || "PUBLISHED") as "DRAFT" | "PUBLISHED" | "ARCHIVED";

  await prisma.audio.create({
    data: {
      title,
      description,
      spotifyUrl,
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

  revalidatePath("/admin/audios");
  revalidatePath("/audios");
  redirect("/admin/audios");
}

export async function updateAudio(id: string, formData: FormData) {
  const title = String(formData.get("title") || "");
  const description = String(formData.get("description") || "");
  const spotifyUrl = String(formData.get("spotifyUrl") || "");
  const status = String(formData.get("status") || "PUBLISHED") as "DRAFT" | "PUBLISHED" | "ARCHIVED";

  await prisma.audio.update({
    where: { id },
    data: {
      title,
      description,
      spotifyUrl,
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });

  revalidatePath("/admin/audios");
  revalidatePath("/audios");
  redirect("/admin/audios");
}

export async function deleteAudio(id: string) {
  await prisma.audio.delete({ where: { id } });
  revalidatePath("/admin/audios");
  revalidatePath("/audios");
}
