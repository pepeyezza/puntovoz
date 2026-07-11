"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateSiteConfig(formData: FormData) {
  const logoUrl = String(formData.get("logoUrl") || "");
  const colorPrincipal = String(formData.get("colorPrincipal") || "#1c2a38");
  const colorSecundario = String(formData.get("colorSecundario") || "#f5f2eb");
  const colorAcento = String(formData.get("colorAcento") || "#c87a62");
  const colorJoven = String(formData.get("colorJoven") || "#f4a900");
  const instagram = String(formData.get("instagram") || "");
  const spotify = String(formData.get("spotify") || "");

  const heroEyebrow = String(formData.get("heroEyebrow") || "");
  const heroTitle = String(formData.get("heroTitle") || "");
  const heroDescription = String(formData.get("heroDescription") || "");

  const homeDataTitle = String(formData.get("homeDataTitle") || "");
  const homeDataSubtitle = String(formData.get("homeDataSubtitle") || "");
  const homeNosotrosTitle = String(formData.get("homeNosotrosTitle") || "");
  const homeNosotrosText = String(formData.get("homeNosotrosText") || "");

  const pageKeys = ["editoriales", "audios", "videos", "observatorio", "colaboradores", "sobreNosotros", "contacto"];
  const pageHeaders: Record<string, { eyebrow: string; title: string; description: string }> = {};
  for (const key of pageKeys) {
    pageHeaders[key] = {
      eyebrow: String(formData.get(`page_${key}_eyebrow`) || ""),
      title: String(formData.get(`page_${key}_title`) || ""),
      description: String(formData.get(`page_${key}_description`) || ""),
    };
  }

  const data = {
    logoUrl,
    colors: { principal: colorPrincipal, secundario: colorSecundario, acento: colorAcento, joven: colorJoven },
    socials: { instagram, spotify },
    heroEyebrow,
    heroTitle,
    heroDescription,
    homeDataTitle,
    homeDataSubtitle,
    homeNosotrosTitle,
    homeNosotrosText,
    pageHeaders,
  };

  await prisma.siteConfig.upsert({
    where: { id: "singleton" },
    update: data,
    create: {
      id: "singleton",
      fonts: { display: "Fraunces", body: "Sora" },
      menus: {},
      ...data,
    },
  });

  revalidatePath("/admin/configuracion");
  revalidatePath("/");
  revalidatePath("/editoriales");
  revalidatePath("/audios");
  revalidatePath("/videos");
  revalidatePath("/observatorio");
  revalidatePath("/colaboradores");
  revalidatePath("/sobre-nosotros");
  revalidatePath("/contacto");
}
