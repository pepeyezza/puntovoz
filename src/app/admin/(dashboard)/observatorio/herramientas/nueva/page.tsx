import { createHerramienta } from "@/lib/actions/herramientas";
import { CATEGORIAS_HERRAMIENTAS } from "@/lib/herramientas";
import ImageUploadField from "@/components/admin/ImageUploadField";

export default function Page() {
  return (
    <div>
      <h1 className="font-display text-3xl">Nueva herramienta</h1>
      <form action={createHerramienta} className="mt-8 max-w-lg space-y-5">
        <div>
          <label className="text-sm font-medium">Nombre</label>
          <input name="nombre" type="text" required placeholder="Ej: Notion" className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
        <div>
          <label className="text-sm font-medium">Descripción</label>
          <textarea name="descripcion" rows={3} placeholder="Breve descripción de la herramienta y sus usos..." className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
        <div>
          <label className="text-sm font-medium">Categoría</label>
          <select name="categoria" className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento">
            {CATEGORIAS_HERRAMIENTAS.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Link a la herramienta</label>
          <input name="enlace" type="url" required placeholder="https://..." className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
        <ImageUploadField name="logoUrl" label="Logo o miniatura" />
        <div className="flex items-center gap-2">
          <input type="checkbox" name="destacada" id="destacada" className="h-4 w-4 rounded accent-acento" />
          <label htmlFor="destacada" className="text-sm font-medium cursor-pointer">Destacar en el resumen de Data</label>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="rounded-lg bg-principal px-6 py-3 text-sm font-semibold text-secundario hover:-translate-y-0.5">Guardar</button>
          <a href="/admin/observatorio/herramientas" className="rounded-lg border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento">Cancelar</a>
        </div>
      </form>
    </div>
  );
}
