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

// --- Entrevistas ---
export async function createEntrevista(formData: FormData) {
  const entrevistado = String(formData.get("entrevistado") || "");
  const status = String(formData.get("status") || "DRAFT") as "DRAFT" | "PUBLISHED" | "ARCHIVED";
  await prisma.entrevista.create({
    data: {
      entrevistado,
      cargo: String(formData.get("cargo") || ""),
      resumen: String(formData.get("resumen") || ""),
      contenido: String(formData.get("contenido") || ""),
      slug: slugify(entrevistado + "-" + Date.now()),
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });
  revalidatePath("/admin/observatorio/entrevistas");
  revalidatePath("/observatorio/entrevistas");
}

export async function updateEntrevista(id: string, formData: FormData) {
  await prisma.entrevista.update({
    where: { id },
    data: {
      entrevistado: String(formData.get("entrevistado") || ""),
      cargo: String(formData.get("cargo") || ""),
      resumen: String(formData.get("resumen") || ""),
      contenido: String(formData.get("contenido") || ""),
      status: String(formData.get("status") || "DRAFT") as "DRAFT" | "PUBLISHED" | "ARCHIVED",
      publishedAt: formData.get("status") === "PUBLISHED" ? new Date() : null,
    },
  });
  revalidatePath("/admin/observatorio/entrevistas");
  revalidatePath("/observatorio/entrevistas");
  redirect("/admin/observatorio/entrevistas");
}

export async function deleteEntrevista(id: string) {
  await prisma.entrevista.delete({ where: { id } });
  revalidatePath("/admin/observatorio/entrevistas");
  revalidatePath("/observatorio/entrevistas");
}

// --- Proyectos ---
export async function createProyecto(formData: FormData) {
  const nombre = String(formData.get("nombre") || "");
  await prisma.proyectoLocal.create({
    data: {
      nombre,
      descripcion: String(formData.get("descripcion") || ""),
      area: String(formData.get("area") || ""),
      tipo: String(formData.get("tipo") || "publico"),
      enlace: String(formData.get("enlace") || "") || null,
      slug: slugify(nombre + "-" + Date.now()),
    },
  });
  revalidatePath("/admin/observatorio/proyectos");
  revalidatePath("/observatorio/proyectos");
}

export async function updateProyecto(id: string, formData: FormData) {
  await prisma.proyectoLocal.update({
    where: { id },
    data: {
      nombre: String(formData.get("nombre") || ""),
      descripcion: String(formData.get("descripcion") || ""),
      area: String(formData.get("area") || ""),
      tipo: String(formData.get("tipo") || "publico"),
      enlace: String(formData.get("enlace") || "") || null,
    },
  });
  revalidatePath("/admin/observatorio/proyectos");
  revalidatePath("/observatorio/proyectos");
  redirect("/admin/observatorio/proyectos");
}

export async function deleteProyecto(id: string) {
  await prisma.proyectoLocal.delete({ where: { id } });
  revalidatePath("/admin/observatorio/proyectos");
  revalidatePath("/observatorio/proyectos");
}

// --- Agenda ---
export async function createEvento(formData: FormData) {
  await prisma.eventoAgenda.create({
    data: {
      titulo: String(formData.get("titulo") || ""),
      descripcion: String(formData.get("descripcion") || ""),
      fecha: new Date(String(formData.get("fecha") || new Date().toISOString())),
      lugar: String(formData.get("lugar") || ""),
      categoria: String(formData.get("categoria") || ""),
      enlace: String(formData.get("enlace") || "") || null,
    },
  });
  revalidatePath("/admin/observatorio/agenda");
  revalidatePath("/observatorio/agenda");
}

export async function updateEvento(id: string, formData: FormData) {
  await prisma.eventoAgenda.update({
    where: { id },
    data: {
      titulo: String(formData.get("titulo") || ""),
      descripcion: String(formData.get("descripcion") || ""),
      fecha: new Date(String(formData.get("fecha") || new Date().toISOString())),
      lugar: String(formData.get("lugar") || ""),
      categoria: String(formData.get("categoria") || ""),
      enlace: String(formData.get("enlace") || "") || null,
    },
  });
  revalidatePath("/admin/observatorio/agenda");
  revalidatePath("/observatorio/agenda");
  redirect("/admin/observatorio/agenda");
}

export async function deleteEvento(id: string) {
  await prisma.eventoAgenda.delete({ where: { id } });
  revalidatePath("/admin/observatorio/agenda");
  revalidatePath("/observatorio/agenda");
}

// --- Notas ---
export async function createNota(formData: FormData) {
  const titulo = String(formData.get("titulo") || "");
  const status = String(formData.get("status") || "DRAFT") as "DRAFT" | "PUBLISHED" | "ARCHIVED";
  await prisma.notaObservatorio.create({
    data: {
      titulo,
      contenido: String(formData.get("contenido") || ""),
      slug: slugify(titulo),
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });
  revalidatePath("/admin/observatorio/notas");
  revalidatePath("/observatorio/notas");
}

export async function updateNota(id: string, formData: FormData) {
  const status = String(formData.get("status") || "DRAFT") as "DRAFT" | "PUBLISHED" | "ARCHIVED";
  await prisma.notaObservatorio.update({
    where: { id },
    data: {
      titulo: String(formData.get("titulo") || ""),
      contenido: String(formData.get("contenido") || ""),
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });
  revalidatePath("/admin/observatorio/notas");
  revalidatePath("/observatorio/notas");
  redirect("/admin/observatorio/notas");
}

export async function deleteNota(id: string) {
  await prisma.notaObservatorio.delete({ where: { id } });
  revalidatePath("/admin/observatorio/notas");
  revalidatePath("/observatorio/notas");
}
