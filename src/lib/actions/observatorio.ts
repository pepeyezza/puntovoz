"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function createProyecto(formData: FormData) {
  const nombre = String(formData.get("nombre") || "");
  await prisma.proyectoLocal.create({
    data: {
      nombre,
      descripcion: String(formData.get("descripcion") || ""),
      area: String(formData.get("area") || ""),
      tipo: String(formData.get("tipo") || "publico"),
      enlace: String(formData.get("enlace") || "") || null,
      imagen: String(formData.get("imagen") || "") || null,
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
      imagen: String(formData.get("imagen") || "") || null,
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

export async function createEvento(formData: FormData) {
  await prisma.eventoAgenda.create({
    data: {
      titulo: String(formData.get("titulo") || ""),
      descripcion: String(formData.get("descripcion") || "") || null,
      fecha: new Date(String(formData.get("fecha") || new Date().toISOString())),
      lugar: String(formData.get("lugar") || "") || null,
      categoria: String(formData.get("categoria") || "") || null,
      enlace: String(formData.get("enlace") || "") || null,
      imagen: String(formData.get("imagen") || "") || null,
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
      descripcion: String(formData.get("descripcion") || "") || null,
      fecha: new Date(String(formData.get("fecha") || new Date().toISOString())),
      lugar: String(formData.get("lugar") || "") || null,
      categoria: String(formData.get("categoria") || "") || null,
      enlace: String(formData.get("enlace") || "") || null,
      imagen: String(formData.get("imagen") || "") || null,
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

export async function createIndicador(formData: FormData) {
  await prisma.indicador.create({
    data: {
      nombre: String(formData.get("nombre") || ""),
      valor: parseFloat(String(formData.get("valor") || "0")),
      unidad: String(formData.get("unidad") || ""),
      periodo: String(formData.get("periodo") || ""),
      categoria: String(formData.get("categoria") || "") || null,
      fuente: String(formData.get("fuente") || "") || null,
    },
  });
  revalidatePath("/admin/observatorio/indicadores");
  revalidatePath("/observatorio/indicadores");
}

export async function updateIndicador(id: string, formData: FormData) {
  await prisma.indicador.update({
    where: { id },
    data: {
      nombre: String(formData.get("nombre") || ""),
      valor: parseFloat(String(formData.get("valor") || "0")),
      unidad: String(formData.get("unidad") || ""),
      periodo: String(formData.get("periodo") || ""),
      categoria: String(formData.get("categoria") || "") || null,
      fuente: String(formData.get("fuente") || "") || null,
    },
  });
  revalidatePath("/admin/observatorio/indicadores");
  revalidatePath("/observatorio/indicadores");
  redirect("/admin/observatorio/indicadores");
}

export async function deleteIndicador(id: string) {
  await prisma.indicador.delete({ where: { id } });
  revalidatePath("/admin/observatorio/indicadores");
  revalidatePath("/observatorio/indicadores");
}

export async function createEntrevista(formData: FormData) {
  const entrevistado = String(formData.get("entrevistado") || "");
  await prisma.entrevista.create({
    data: {
      entrevistado,
      slug: slugify(entrevistado + "-" + Date.now()),
      cargo: String(formData.get("cargo") || "") || null,
      resumen: String(formData.get("resumen") || ""),
      contenido: String(formData.get("contenido") || ""),
      status: "PUBLISHED",
      publishedAt: new Date(),
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
      cargo: String(formData.get("cargo") || "") || null,
      resumen: String(formData.get("resumen") || ""),
      contenido: String(formData.get("contenido") || ""),
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

export async function createNota(formData: FormData) {
  const titulo = String(formData.get("titulo") || "");
  await prisma.notaObservatorio.create({
    data: {
      titulo,
      slug: slugify(titulo + "-" + Date.now()),
      contenido: String(formData.get("contenido") || ""),
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });
  revalidatePath("/admin/observatorio/notas");
  revalidatePath("/observatorio/notas");
}

export async function updateNota(id: string, formData: FormData) {
  await prisma.notaObservatorio.update({
    where: { id },
    data: {
      titulo: String(formData.get("titulo") || ""),
      contenido: String(formData.get("contenido") || ""),
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
