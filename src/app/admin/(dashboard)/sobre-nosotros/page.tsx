import { prisma } from "@/lib/prisma";
import { updateAboutContent } from "@/lib/actions/about";
import RichTextEditor from "@/components/admin/RichTextEditor";

const VALORES_DEFAULT = [
  { titulo: "Credibilidad", descripcion: "Chequeamos antes de publicar y citamos nuestras fuentes." },
  { titulo: "Pensamiento crítico", descripcion: "No repetimos el discurso oficial ni el del sentido común." },
  { titulo: "Cercanía", descripcion: "Escribimos para la comunidad, no para una audiencia abstracta." },
  { titulo: "Visión de futuro", descripcion: "Nos importa hacia dónde va la región, no solo lo que pasó hoy." },
];

const EQUIPO_DEFAULT = [{ nombre: "Redacción .VOZ", rol: "Editorial y coordinación general" }];

async function getConfig() {
  try {
    return await prisma.siteConfig.findUnique({ where: { id: "singleton" } });
  } catch {
    return null;
  }
}

export default async function AdminSobreNosotrosPage() {
  const config = await getConfig();
  const valores = (config?.aboutValores as any[]) ?? VALORES_DEFAULT;
  const equipo = (config?.aboutEquipo as any[]) ?? EQUIPO_DEFAULT;

  return (
    <div>
      <h1 className="font-display text-3xl">Sección .VOZ</h1>
      <p className="mt-1 text-principal/60">
        Editá la historia, misión, visión, valores y equipo que se muestran en la página pública ".VOZ".
      </p>

      <form action={updateAboutContent} className="mt-8 max-w-2xl space-y-10">
        <div>
          <label className="text-sm font-medium">Nuestra historia</label>
          <div className="mt-2">
            <RichTextEditor name="historia" defaultValue={config?.aboutHistoria ?? ""} placeholder="Contá la historia del proyecto…" />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Misión</label>
            <textarea
              name="mision"
              rows={4}
              defaultValue={config?.aboutMision ?? ""}
              className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Visión</label>
            <textarea
              name="vision"
              rows={4}
              defaultValue={config?.aboutVision ?? ""}
              className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">Valores</p>
          <p className="mt-1 text-xs text-principal/50">Hasta 4. Dejá el título vacío para que no se muestre.</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-principal/10 p-4">
                <input
                  name={`valor_${i + 1}_titulo`}
                  type="text"
                  defaultValue={valores[i]?.titulo ?? ""}
                  placeholder={`Título del valor ${i + 1}`}
                  className="w-full rounded-lg border border-principal/15 bg-secundario px-3 py-2 text-sm outline-none focus-visible:border-acento"
                />
                <textarea
                  name={`valor_${i + 1}_descripcion`}
                  rows={2}
                  defaultValue={valores[i]?.descripcion ?? ""}
                  placeholder="Descripción breve"
                  className="mt-2 w-full rounded-lg border border-principal/15 bg-secundario px-3 py-2 text-sm outline-none focus-visible:border-acento"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">Equipo</p>
          <p className="mt-1 text-xs text-principal/50">
            Hasta 6 personas. Dejá el nombre vacío para que no se muestre. (Los colaboradores con perfil propio ya aparecen automáticamente en su sección — esto es para sumar nombres adicionales del equipo editorial).
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="rounded-xl border border-principal/10 p-4">
                <input
                  name={`miembro_${i + 1}_nombre`}
                  type="text"
                  defaultValue={equipo[i]?.nombre ?? ""}
                  placeholder="Nombre"
                  className="w-full rounded-lg border border-principal/15 bg-secundario px-3 py-2 text-sm outline-none focus-visible:border-acento"
                />
                <input
                  name={`miembro_${i + 1}_rol`}
                  type="text"
                  defaultValue={equipo[i]?.rol ?? ""}
                  placeholder="Rol"
                  className="mt-2 w-full rounded-lg border border-principal/15 bg-secundario px-3 py-2 text-sm outline-none focus-visible:border-acento"
                />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario hover:-translate-y-0.5">
          Guardar
        </button>
      </form>
    </div>
  );
}
