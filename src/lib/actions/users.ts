"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") {
    throw new Error("Solo un administrador puede realizar esta acción.");
  }
}

export async function createUser(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "EDITOR") as "ADMIN" | "EDITOR" | "COLLABORATOR";

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, password: hashed, role },
  });

  revalidatePath("/admin/usuarios");
}

export async function updateUserRole(id: string, formData: FormData) {
  await requireAdmin();
  const role = String(formData.get("role") || "EDITOR") as "ADMIN" | "EDITOR" | "COLLABORATOR";
  await prisma.user.update({ where: { id }, data: { role } });
  revalidatePath("/admin/usuarios");
}

export async function deleteUser(id: string) {
  await requireAdmin();
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/usuarios");
}
