export const dynamic = "force-dynamic";
import { createInstitucionCientifica } from "@/lib/actions/investigacion";
import ImageUploadField from "@/components/admin/ImageUploadField";

export default function Page() {
  return (
    <div>
      <h1 className="font-display text-3xl">Nueva institución científica</h1>
      <form action={createInstitucionCientifica} className="mt-8 max-w-xl space-y-5">
        <div><label className="text-sm font-medium">Nombre</label><input name="nombre" type="text" required className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" /></div>
        <div><label className="text-sm font-medium">Descripción</label><textarea name="descripcion" rows={3} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" /></div>
        <div><label className="text-sm font-medium">Dirección</label><input name="direccion" type="text" className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm font-medium">Teléfono</label><input name="telefono" type="text" className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" /></div>
          <div><label className="text-sm font-medium">Email</label><input name="email" type="email" className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" /></div>
        </div>
        <div><label className="text-sm font-medium">Sitio web</label><input name="web" type="url" placeholder="https://…" className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" /></div>
        <ImageUploadField name="logoUrl" label="Logo de la institución" />
        <div className="flex gap-3 pt-2">
          <button type="submit" className="rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario">Guardar</button>
          <a href="/admin/observatorio/investigacion" className="rounded-full border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento">Cancelar</a>
        </div>
      </form>
    </div>
  );
}
