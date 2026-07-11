"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function updateColaboradorProfile(id: string, formData: FormData) {
  const name = String(formData.get("name") || "");
  const bio = String(formData.get("bio") || "");
  const photoUrl = String(formData.get("photoUrl") || "") || null;
  const especialidad = String(formData.get("especialidad") || "") || null;
  const instagram = String(formData.get("instagram") || "");
  const linkedin = String(formData.get("linkedin") || "");

  await prisma.user.update({
    where: { id },
    data: {
      name,
      bio,
      photoUrl,
      especialidad,
      socials: { instagram, linkedin },
    } as any,
  });

  revalidatePath("/admin/colaboradores");
  revalidatePath("/colaboradores");
  redirect(`/admin/colaboradores/${id}`);
}
