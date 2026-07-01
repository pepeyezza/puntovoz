export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { marcarLeido } from "@/lib/actions/contacto";

async function getMensajes() {
  try {
    return await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export default async function AdminContactoPage() {
  const mensajes = await getMensajes();

  return (
    <div>
      <h1 className="font-display text-3xl">Mensajes de contacto</h1>
      <p className="mt-1 text-principal/60">Consultas recibidas desde el formulario público.</p>

      <div className="mt-8 space-y-4">
        {mensajes.length === 0 ? (
          <p className="text-principal/50">No hay mensajes todavía.</p>
        ) : (
          mensajes.map((m) => (
            <div
              key={m.id}
              className={`rounded-2xl border p-6 ${m.leido ? "border-principal/10" : "border-acento/40 bg-acento/5"}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{m.nombre}</p>
                  <p className="text-sm text-principal/50">{m.email}</p>
                </div>
                {!m.leido && (
                  <form action={marcarLeido.bind(null, m.id)}>
                    <button type="submit" className="text-sm font-medium text-acento hover:underline">
                      Marcar como leído
                    </button>
                  </form>
                )}
              </div>
              <p className="mt-3 text-sm text-principal/80">{m.mensaje}</p>
              <p className="mt-2 text-xs text-principal/40">{m.createdAt.toLocaleString("es-AR")}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
