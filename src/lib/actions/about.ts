"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateAboutContent(formData: FormData) {
  const historia = String(formData.get("historia") || "");
  const mision = String(formData.get("mision") || "");
  const vision = String(formData.get("vision") || "");

  const valores = [1, 2, 3, 4].map((i) => ({
    titulo: String(formData.get(`valor_${i}_titulo`) || ""),
    descripcion: String(formData.get(`valor_${i}_descripcion`) || ""),
  })).filter((v) => v.titulo);

  const equipo = [1, 2, 3, 4, 5, 6].map((i) => ({
    nombre: String(formData.get(`miembro_${i}_nombre`) || ""),
    rol: String(formData.get(`miembro_${i}_rol`) || ""),
  })).filter((m) => m.nombre);

  await prisma.siteConfig.upsert({
    where: { id: "singleton" },
    update: { aboutHistoria: historia, aboutMision: mision, aboutVision: vision, aboutValores: valores, aboutEquipo: equipo },
    create: {
      id: "singleton",
      colors: {},
      fonts: {},
      socials: {},
      menus: {},
      aboutHistoria: historia,
      aboutMision: mision,
      aboutVision: vision,
      aboutValores: valores,
      aboutEquipo: equipo,
    },
  });

  revalidatePath("/admin/sobre-nosotros");
  revalidatePath("/sobre-nosotros");
}
