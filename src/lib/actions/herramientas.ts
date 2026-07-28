"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function createHerramienta(formData: FormData) {
  const nombre = String(formData.get("nombre") || "");
  await (prisma as any).herramientaTecnologica.create({
    data: {
      nombre,
      slug: slugify(nombre + "-" + Date.now()),
      descripcion: String(formData.get("descripcion") || "") || null,
      categoria: String(formData.get("categoria") || "Otros"),
      logoUrl: String(formData.get("logoUrl") || "") || null,
      enlace: String(formData.get("enlace") || ""),
      destacada: formData.get("destacada") === "on",
    },
  });
  revalidatePath("/admin/observatorio/herramientas");
  revalidatePath("/observatorio/herramientas");
  redirect("/admin/observatorio/herramientas");
}

export async function updateHerramienta(id: string, formData: FormData) {
  await (prisma as any).herramientaTecnologica.update({
    where: { id },
    data: {
      nombre: String(formData.get("nombre") || ""),
      descripcion: String(formData.get("descripcion") || "") || null,
      categoria: String(formData.get("categoria") || "Otros"),
      logoUrl: String(formData.get("logoUrl") || "") || null,
      enlace: String(formData.get("enlace") || ""),
      destacada: formData.get("destacada") === "on",
    },
  });
  revalidatePath("/admin/observatorio/herramientas");
  revalidatePath("/observatorio/herramientas");
  redirect("/admin/observatorio/herramientas");
}

export async function deleteHerramienta(id: string) {
  await (prisma as any).herramientaTecnologica.delete({ where: { id } });
  revalidatePath("/admin/observatorio/herramientas");
  revalidatePath("/observatorio/herramientas");
}
