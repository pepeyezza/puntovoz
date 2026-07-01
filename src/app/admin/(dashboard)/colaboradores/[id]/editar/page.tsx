export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateColaboradorProfile } from "@/lib/actions/colaboradores";
import ImageUploadField from "@/components/admin/ImageUploadField";

export default async function EditarColaboradorPage({ params }: { params: { id: string } }) {
  const colaborador = await prisma.user.findUnique({ where: { id: params.id } });
  if (!colaborador) notFound();

  const socials = (colaborador.socials as any) ?? {};

  return (
    <div>
      <h1 className="font-display text-3xl">Editar perfil</h1>
      <p className="mt-1 text-principal/60">{colaborador.email}</p>

      <form action={updateColaboradorProfile.bind(null, colaborador.id)} className="mt-8 max-w-lg space-y-5">
        <div>
          <label className="text-sm font-medium">Nombre</label>
          <input
            name="name"
            type="text"
            required
            defaultValue={colaborador.name}
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Biografía</label>
          <textarea
            name="bio"
            rows={3}
            defaultValue={colaborador.bio ?? ""}
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>

        <ImageUploadField name="photoUrl" defaultValue={colaborador.photoUrl ?? ""} label="Foto de perfil" />

        <div>
          <p className="text-sm font-medium">Redes sociales</p>
          <div className="mt-2 space-y-3">
            <input name="instagram" type="url" defaultValue={socials.instagram ?? ""} placeholder="Instagram" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <input name="twitter" type="url" defaultValue={socials.twitter ?? ""} placeholder="X / Twitter" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <input name="linkedin" type="url" defaultValue={socials.linkedin ?? ""} placeholder="LinkedIn" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario hover:-translate-y-0.5">
            Guardar
          </button>
          <a href={`/admin/colaboradores/${colaborador.id}`} className="rounded-full border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
