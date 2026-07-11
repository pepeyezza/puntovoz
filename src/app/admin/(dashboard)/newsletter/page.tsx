export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

async function getSuscriptores() {
  try {
    return await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
  } catch { return []; }
}

export default async function NewsletterAdminPage() {
  const suscriptores = await getSuscriptores();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Suscriptores</h1>
          <p className="mt-1 text-principal/60">
            {suscriptores.length} suscriptor(es) al newsletter de .VOZ
          </p>
        </div>
        {suscriptores.length > 0 && (
          <a
            href={`data:text/csv;charset=utf-8,Email,Interes,Fecha\n${suscriptores.map((s) => `${s.email},${s.interes ?? ""},${s.createdAt.toLocaleDateString("es-AR")}`).join("\n")}`}
            download="suscriptores-voz.csv"
            className="rounded-full border border-principal/15 px-5 py-2.5 text-sm font-medium hover:border-acento hover:text-acento"
          >
            Exportar CSV
          </a>
        )}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-principal/10">
        <table className="w-full text-sm">
          <thead className="bg-principal/[0.03] text-left text-principal/50">
            <tr>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Interés</th>
              <th className="px-5 py-3 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {suscriptores.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-principal/50">
                  Todavía no hay suscriptores. El formulario del Home guardará aquí los registros.
                </td>
              </tr>
            ) : (
              suscriptores.map((s) => (
                <tr key={s.id} className="border-t border-principal/10">
                  <td className="px-5 py-3 font-medium">{s.email}</td>
                  <td className="px-5 py-3 text-principal/60">{s.interes ?? "—"}</td>
                  <td className="px-5 py-3 text-principal/50">
                    {s.createdAt.toLocaleDateString("es-AR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
