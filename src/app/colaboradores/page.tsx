import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { COLABORADORES_DEMO } from "@/lib/demo-data";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Colaboradores",
  description: "Autores invitados que aportan su mirada a .VOZ desde distintos sectores de la comunidad.",
};

async function getColaboradores() {
  try {
    const colaboradores = await prisma.user.findMany({
      where: { role: "COLLABORATOR" },
      include: { _count: { select: { posts: true } } },
      orderBy: { name: "asc" },
    });
    if (colaboradores.length === 0) {
      return COLABORADORES_DEMO.map((c) => ({ id: c.slug, name: c.name, bio: c.bio, photoUrl: "", photoInitials: c.photoInitials }));
    }
    return colaboradores.map((c) => ({
      id: c.id,
      name: c.name,
      bio: c.bio ?? "",
      photoUrl: c.photoUrl ?? "",
      photoInitials: c.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase(),
    }));
  } catch {
    return COLABORADORES_DEMO.map((c) => ({ id: c.slug, name: c.name, bio: c.bio, photoUrl: "", photoInitials: c.photoInitials }));
  }
}

export default async function ColaboradoresPage() {
  const header = await getPageHeader("colaboradores", {
    eyebrow: "Colaboradores",
    title: "Voces invitadas",
    description: "Personas de distintos sectores de la comunidad que escriben en .VOZ desde su propia experiencia y mirada.",
  });
  const colaboradores = await getColaboradores();

  return (
    <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
      <header className="max-w-2xl">
        <p className="eyebrow text-acento">{header.eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl">{header.title}</h1>
        <p className="mt-4 text-principal/70">{header.description}</p>
      </header>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {colaboradores.map((c) => (
          <Link
            key={c.id}
            href={`/colaboradores/${c.id}`}
            className="block rounded-2xl border border-principal/10 p-6 transition-colors hover:border-acento"
          >
            <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-principal/10 font-display text-xl text-principal/60">
              {c.photoUrl ? (
                <Image src={c.photoUrl} alt={c.name} fill className="object-cover" />
              ) : (
                c.photoInitials
              )}
            </div>
            <p className="mt-4 font-display text-xl">{c.name}</p>
            <p className="mt-2 line-clamp-3 text-sm text-principal/60">{c.bio}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
