export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { prisma } from "@/lib/prisma";
import { updatePost } from "@/lib/actions/posts";

export default async function EditarEditorialPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { categories: true, tags: true },
  });

  if (!post) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl">Editar editorial</h1>
      <p className="mt-1 text-principal/60">{post.title}</p>

      <div className="mt-8">
        <PostForm
          action={updatePost.bind(null, post.id)}
          esNuevo={false}
          defaultValues={{
            title: post.title,
            subtitle: post.subtitle ?? undefined,
            content: post.content,
            status: post.status,
            featured: post.featured,
            coverImage: post.coverImage ?? undefined,
          }}
        />
      </div>
    </div>
  );
}
