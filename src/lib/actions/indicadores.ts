"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createIndicador(formData: FormData) {
  const nombre = String(formData.get("nombre") || "");
  const valor = parseFloat(String(formData.get("valor") || "0"));
  const unidad = String(formData.get("unidad") || "");
  const periodo = String(formData.get("periodo") || "");
  const categoria = String(formData.get("categoria") || "");
  const fuente = String(formData.get("fuente") || "");

  await prisma.indicador.create({
    data: { nombre, valor, unidad, periodo, categoria, fuente },
  });

  revalidatePath("/admin/observatorio/indicadores");
  revalidatePath("/observatorio/indicadores");
  redirect("/admin/observatorio/indicadores");
}

export async function updateIndicador(id: string, formData: FormData) {
  const nombre = String(formData.get("nombre") || "");
  const valor = parseFloat(String(formData.get("valor") || "0"));
  const unidad = String(formData.get("unidad") || "");
  const periodo = String(formData.get("periodo") || "");
  const categoria = String(formData.get("categoria") || "");
  const fuente = String(formData.get("fuente") || "");

  await prisma.indicador.update({
    where: { id },
    data: { nombre, valor, unidad, periodo, categoria, fuente },
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
