"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("No autenticado");
  return session.user as { id: string; role: string };
}

export async function createPost(formData: FormData) {
  const user = await requireUser();

  const title = String(formData.get("title") || "");
  const subtitle = String(formData.get("subtitle") || "");
  const content = String(formData.get("content") || "");
  const categoriaNombre = String(formData.get("category") || "");
  const tagsRaw = String(formData.get("tags") || "");
  const status = String(formData.get("status") || "DRAFT") as "DRAFT" | "PUBLISHED" | "ARCHIVED";
  const featured = formData.get("featured") === "on";
  const coverImage = String(formData.get("coverImage") || "") || null;
  const type = String(formData.get("type") || "EDITORIAL") as "EDITORIAL" | "COLABORADOR";

  const slug = slugify(title);
  const tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);
  const authorIdOverride = String(formData.get("authorId") || "");

  await prisma.post.create({
    data: {
      title,
      subtitle,
      content,
      slug,
      status,
      featured,
      type,
      coverImage,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
      authorId: authorIdOverride || user.id,
      categories: categoriaNombre
        ? {
            connectOrCreate: {
              where: { slug: slugify(categoriaNombre) },
              create: { name: categoriaNombre, slug: slugify(categoriaNombre) },
            },
          }
        : undefined,
      tags: {
        connectOrCreate: tags.map((tag) => ({
          where: { slug: slugify(tag) },
          create: { name: tag, slug: slugify(tag) },
        })),
      },
    },
  });

  revalidatePath("/admin/editoriales");
  revalidatePath("/editoriales");
  revalidatePath("/admin/colaboradores");
  revalidatePath("/colaboradores");
  if (type === "COLABORADOR" && authorIdOverride) {
    redirect(`/admin/colaboradores/${authorIdOverride}`);
  }
  redirect("/admin/editoriales");
}

export async function updatePost(id: string, formData: FormData) {
  await requireUser();

  const existing = await prisma.post.findUnique({ where: { id }, select: { type: true, authorId: true } });

  const title = String(formData.get("title") || "");
  const subtitle = String(formData.get("subtitle") || "");
  const content = String(formData.get("content") || "");
  const status = String(formData.get("status") || "DRAFT") as "DRAFT" | "PUBLISHED" | "ARCHIVED";
  const featured = formData.get("featured") === "on";
  const coverImage = String(formData.get("coverImage") || "") || null;

  await prisma.post.update({
    where: { id },
    data: {
      title,
      subtitle,
      content,
      status,
      featured,
      coverImage,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });

  revalidatePath("/admin/editoriales");
  revalidatePath("/editoriales");
  revalidatePath("/admin/colaboradores");
  revalidatePath("/colaboradores");

  if (existing?.type === "COLABORADOR") {
    redirect(`/admin/colaboradores/${existing.authorId}`);
  }
  redirect("/admin/editoriales");
}

export async function deletePost(id: string) {
  await requireUser();
  await prisma.post.delete({ where: { id } });
  revalidatePath("/admin/editoriales");
  revalidatePath("/editoriales");
  revalidatePath("/admin/colaboradores");
  revalidatePath("/colaboradores");
}
