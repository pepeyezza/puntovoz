export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import ContactoPageClient from "@/components/layout/ContactoPageClient";
import { getPageHeader } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escribinos tus propuestas, consultas o ideas para colaborar con .VOZ.",
};

export default async function ContactoPage() {
  const header = await getPageHeader("contacto", {
    eyebrow: "Contacto",
    title: "Hablemos",
    description: "Propuestas, consultas o ideas para colaborar — escribinos.",
  });

  return <ContactoPageClient header={header} />;
}
