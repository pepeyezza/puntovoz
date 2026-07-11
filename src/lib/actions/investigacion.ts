"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function createInstitucionCientifica(formData: FormData) {
  const nombre = String(formData.get("nombre") || "");
  await prisma.institucionCientifica.create({
    data: {
      nombre, slug: slugify(nombre + "-" + Date.now()),
      descripcion: String(formData.get("descripcion") || "") || null,
      logoUrl: String(formData.get("logoUrl") || "") || null,
      direccion: String(formData.get("direccion") || "") || null,
      telefono: String(formData.get("telefono") || "") || null,
      email: String(formData.get("email") || "") || null,
      web: String(formData.get("web") || "") || null,
    },
  });
  revalidatePath("/admin/observatorio/investigacion");
  revalidatePath("/observatorio/investigacion");
  redirect("/admin/observatorio/investigacion");
}

export async function updateInstitucionCientifica(id: string, formData: FormData) {
  await prisma.institucionCientifica.update({
    where: { id },
    data: {
      nombre: String(formData.get("nombre") || ""),
      descripcion: String(formData.get("descripcion") || "") || null,
      logoUrl: String(formData.get("logoUrl") || "") || null,
      direccion: String(formData.get("direccion") || "") || null,
      telefono: String(formData.get("telefono") || "") || null,
      email: String(formData.get("email") || "") || null,
      web: String(formData.get("web") || "") || null,
    },
  });
  revalidatePath("/admin/observatorio/investigacion");
  revalidatePath("/observatorio/investigacion");
  redirect("/admin/observatorio/investigacion");
}

export async function deleteInstitucionCientifica(id: string) {
  await prisma.institucionCientifica.delete({ where: { id } });
  revalidatePath("/admin/observatorio/investigacion");
  revalidatePath("/observatorio/investigacion");
}

export async function createServicio(formData: FormData) {
  const institucionId = String(formData.get("institucionId") || "");
  await prisma.servicioCientifico.create({
    data: {
      nombre: String(formData.get("nombre") || ""),
      descripcion: String(formData.get("descripcion") || "") || null,
      area: String(formData.get("area") || "") || null,
      contacto: String(formData.get("contacto") || "") || null,
      institucionId,
    },
  });
  revalidatePath("/admin/observatorio/investigacion");
  redirect(`/admin/observatorio/investigacion/${institucionId}`);
}

export async function updateServicio(id: string, formData: FormData) {
  const servicio = await prisma.servicioCientifico.findUnique({ where: { id } });
  await prisma.servicioCientifico.update({
    where: { id },
    data: {
      nombre: String(formData.get("nombre") || ""),
      descripcion: String(formData.get("descripcion") || "") || null,
      area: String(formData.get("area") || "") || null,
      contacto: String(formData.get("contacto") || "") || null,
    },
  });
  revalidatePath("/admin/observatorio/investigacion");
  redirect(`/admin/observatorio/investigacion/${servicio?.institucionId}`);
}

export async function deleteServicio(id: string) {
  await prisma.servicioCientifico.delete({ where: { id } });
  revalidatePath("/admin/observatorio/investigacion");
}
