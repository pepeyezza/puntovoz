import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getColaboradores() {
  try {
    return await prisma.user.findMany({
      where: { role: "COLLABORATOR" },
      include: { posts: true },
      orderBy: { name: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function AdminColaboradoresPage() {
  const colaboradores = await getColaboradores();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Colaboradores</h1>
          <p className="mt-1 text-principal/60">
            Autores invitados. Para dar de alta uno nuevo, creá su usuario en{" "}
            <Link href="/admin/usuarios" className="text-acento hover:underline">
              Usuarios
            </Link>{" "}
            con rol "Colaborador".
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {colaboradores.length === 0 ? (
          <p className="text-principal/50">Todavía no hay colaboradores registrados.</p>
        ) : (
          colaboradores.map((c) => (
            <Link key={c.id} href={`/admin/colaboradores/${c.id}`} className="block rounded-2xl border border-principal/10 p-6 transition-colors hover:border-acento">
              <p className="font-display text-xl">{c.name}</p>
              <p className="mt-1 text-sm text-principal/50">{c.email}</p>
              <p className="mt-3 text-sm text-principal/60">{c.posts.length} publicación(es)</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
