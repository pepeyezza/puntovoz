export const dynamic = "force-dynamic";

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
      <p className="mt-1 text-principal/60">
        Podés publicarlo como colaboración o directamente en Editoriales.
      </p>

      <div className="mt-4 rounded-xl border border-joven/30 bg-joven/5 px-5 py-4 text-sm text-principal/70">
        <strong className="text-principal">Tipo de publicación:</strong> si elegís <em>Editorial</em>, la nota aparece en la sección Editoriales y en el home junto a las notas propias de .VOZ. Si elegís <em>Colaboración</em>, aparece en el perfil del colaborador y también en Editoriales con tu nombre como autor.
      </div>

      <div className="mt-8">
        <PostForm
          action={createPost}
          hiddenFields={{ authorId: colaborador.id }}
          cancelHref={`/admin/colaboradores/${colaborador.id}`}
          showTypeSelector
        />
      </div>
    </div>
  );
}
