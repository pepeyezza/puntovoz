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

function leer(formData: FormData) {
  const txt = (k: string) => String(formData.get(k) || "").trim();
  const opc = (k: string) => txt(k) || null;

  // El editor enriquecido devuelve "<p></p>" cuando está vacío: lo tratamos como vacío.
  const detalleHtml = String(formData.get("detalle") || "");
  const detalle = detalleHtml.replace(/<[^>]*>/g, "").trim() ? detalleHtml : null;

  return {
    nombre: txt("nombre"),
    descripcion: String(formData.get("descripcion") || ""),
    area: txt("area"),
    tipo: txt("tipo") || "publico",
    enlace: opc("enlace"),
    imagen: opc("imagen"),
    logoUrl: opc("logoUrl"),
    estado: opc("estado"),
    responsable: opc("responsable"),
    periodo: opc("periodo"),
    ubicacion: opc("ubicacion"),
    destinatarios: opc("destinatarios"),
    detalle,
    cifras: opc("cifras"),
    galeria: formData.getAll("galeria").map((v) => String(v).trim()).filter(Boolean),
    documentoUrl: opc("documentoUrl"),
    documentoTitulo: opc("documentoTitulo"),
  };
}

function refrescar() {
  revalidatePath("/admin/observatorio/proyectos");
  revalidatePath("/observatorio/proyectos");
  revalidatePath("/observatorio");
}

export async function createProyecto(formData: FormData) {
  const datos = leer(formData);
  await prisma.proyectoLocal.create({
    data: { ...datos, slug: slugify(`${datos.nombre}-${Date.now()}`) },
  });
  refrescar();
  redirect("/admin/observatorio/proyectos");
}

export async function updateProyecto(id: string, formData: FormData) {
  const datos = leer(formData);
  await prisma.proyectoLocal.update({ where: { id }, data: datos });
  refrescar();
  redirect("/admin/observatorio/proyectos");
}

export async function deleteProyecto(id: string) {
  await prisma.proyectoLocal.delete({ where: { id } });
  refrescar();
}
