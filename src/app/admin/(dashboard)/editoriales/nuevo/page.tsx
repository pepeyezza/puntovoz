export const dynamic = "force-dynamic";
import PostForm from "@/components/admin/PostForm";
import { createPost } from "@/lib/actions/posts";

export default function NuevoEditorialPage() {
  return (
    <div>
      <h1 className="font-display text-3xl">Nuevo editorial</h1>
      <p className="mt-1 text-principal/60">Se publica como artículo propio de .VOZ.</p>

      <div className="mt-8">
        <PostForm action={createPost} />
      </div>
    </div>
  );
}
