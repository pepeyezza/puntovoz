"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function marcarLeido(id: string) {
  await prisma.contactMessage.update({ where: { id }, data: { leido: true } });
  revalidatePath("/admin/contacto");
}
