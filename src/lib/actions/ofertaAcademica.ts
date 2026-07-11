"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function createInstitucion(formData: FormData) {
  const nombre = String(formData.get("nombre") || "");
  await prisma.institucionAcademica.create({
    data: {
      nombre, slug: slugify(nombre + "-" + Date.now()),
      tipo: String(formData.get("tipo") || "instituto"),
      descripcion: String(formData.get("descripcion") || "") || null,
      direccion: String(formData.get("direccion") || "") || null,
      telefono: String(formData.get("telefono") || "") || null,
      email: String(formData.get("email") || "") || null,
      web: String(formData.get("web") || "") || null,
      logoUrl: String(formData.get("logoUrl") || "") || null,
    },
  });
  revalidatePath("/admin/observatorio/oferta-academica");
  revalidatePath("/observatorio/oferta-academica");
  redirect("/admin/observatorio/oferta-academica");
}

export async function updateInstitucion(id: string, formData: FormData) {
  await prisma.institucionAcademica.update({
    where: { id },
    data: {
      nombre: String(formData.get("nombre") || ""),
      tipo: String(formData.get("tipo") || "instituto"),
      descripcion: String(formData.get("descripcion") || "") || null,
      direccion: String(formData.get("direccion") || "") || null,
      telefono: String(formData.get("telefono") || "") || null,
      email: String(formData.get("email") || "") || null,
      web: String(formData.get("web") || "") || null,
      logoUrl: String(formData.get("logoUrl") || "") || null,
    },
  });
  revalidatePath("/admin/observatorio/oferta-academica");
  revalidatePath("/observatorio/oferta-academica");
  redirect("/admin/observatorio/oferta-academica");
}

export async function deleteInstitucion(id: string) {
  await prisma.institucionAcademica.delete({ where: { id } });
  revalidatePath("/admin/observatorio/oferta-academica");
  revalidatePath("/observatorio/oferta-academica");
}

export async function createCarrera(formData: FormData) {
  const institucionId = String(formData.get("institucionId") || "");
  await prisma.carreraOferta.create({
    data: {
      nombre: String(formData.get("nombre") || ""),
      duracion: String(formData.get("duracion") || "") || null,
      modalidad: String(formData.get("modalidad") || "presencial"),
      titulo: String(formData.get("titulo") || "") || null,
      area: String(formData.get("area") || "") || null,
      descripcion: String(formData.get("descripcion") || "") || null,
      inscripcion: String(formData.get("inscripcion") || "") || null,
      planEstudioUrl: String(formData.get("planEstudioUrl") || "") || null,
      institucionId,
    },
  });
  revalidatePath("/admin/observatorio/oferta-academica");
  redirect(`/admin/observatorio/oferta-academica/${institucionId}`);
}

export async function updateCarrera(id: string, formData: FormData) {
  const carrera = await prisma.carreraOferta.findUnique({ where: { id } });
  await prisma.carreraOferta.update({
    where: { id },
    data: {
      nombre: String(formData.get("nombre") || ""),
      duracion: String(formData.get("duracion") || "") || null,
      modalidad: String(formData.get("modalidad") || "presencial"),
      titulo: String(formData.get("titulo") || "") || null,
      area: String(formData.get("area") || "") || null,
      descripcion: String(formData.get("descripcion") || "") || null,
      inscripcion: String(formData.get("inscripcion") || "") || null,
      planEstudioUrl: String(formData.get("planEstudioUrl") || "") || null,
    },
  });
  revalidatePath("/admin/observatorio/oferta-academica");
  redirect(`/admin/observatorio/oferta-academica/${carrera?.institucionId}`);
}

export async function deleteCarrera(id: string) {
  await prisma.carreraOferta.delete({ where: { id } });
  revalidatePath("/admin/observatorio/oferta-academica");
}
