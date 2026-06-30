import { createIndicador } from "@/lib/actions/indicadores";

export default function NuevoIndicadorPage() {
  return (
    <div>
      <h1 className="font-display text-3xl">Nuevo indicador</h1>

      <form action={createIndicador} className="mt-8 max-w-lg space-y-5">
        <div>
          <label className="text-sm font-medium">Nombre</label>
          <input
            name="nombre"
            type="text"
            required
            placeholder="Ej: Empleo registrado"
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Valor</label>
            <input
              name="valor"
              type="number"
              step="0.1"
              required
              className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Unidad</label>
            <input
              name="unidad"
              type="text"
              required
              placeholder="%, unid., proy…"
              className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Período</label>
            <input
              name="periodo"
              type="text"
              required
              placeholder="2026-Q2"
              className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Categoría</label>
            <input
              name="categoria"
              type="text"
              placeholder="Empleo, Producción…"
              className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Fuente (opcional)</label>
          <input
            name="fuente"
            type="text"
            placeholder="Ej: INDEC, relevamiento propio…"
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario hover:-translate-y-0.5">
            Guardar
          </button>
          <a href="/admin/observatorio/indicadores" className="rounded-full border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
