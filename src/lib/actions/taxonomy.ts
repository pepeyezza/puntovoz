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

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name") || "");
  if (!name) return;
  await prisma.category.create({ data: { name, slug: slugify(name) } });
  revalidatePath("/admin/categorias");
}

export async function updateCategory(id: string, formData: FormData) {
  const name = String(formData.get("name") || "");
  if (!name) return;
  await prisma.category.update({ where: { id }, data: { name, slug: slugify(name) } });
  revalidatePath("/admin/categorias");
  redirect("/admin/categorias");
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categorias");
}

export async function createTag(formData: FormData) {
  const name = String(formData.get("name") || "");
  if (!name) return;
  await prisma.tag.create({ data: { name, slug: slugify(name) } });
  revalidatePath("/admin/categorias");
}

export async function updateTag(id: string, formData: FormData) {
  const name = String(formData.get("name") || "");
  if (!name) return;
  await prisma.tag.update({ where: { id }, data: { name, slug: slugify(name) } });
  revalidatePath("/admin/categorias");
  redirect("/admin/categorias");
}

export async function deleteTag(id: string) {
  await prisma.tag.delete({ where: { id } });
  revalidatePath("/admin/categorias");
}
