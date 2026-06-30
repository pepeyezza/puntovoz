import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostForm from "@/components/admin/PostForm";
import { createPost } from "@/lib/actions/posts";

export default async function NuevoPostColaboradorPage({ params }: { params: { id: string } }) {
  const colaborador = await prisma.user.findUnique({ where: { id: params.id } });
  if (!colaborador) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl">Nuevo post de {colaborador.name}</h1>
      <p className="mt-1 text-principal/60">Se publica en la sección Colaboradores.</p>

      <div className="mt-8">
        <PostForm
          action={createPost}
          hiddenFields={{ type: "COLABORADOR", authorId: colaborador.id }}
          cancelHref={`/admin/colaboradores/${colaborador.id}`}
        />
      </div>
    </div>
  );
}
