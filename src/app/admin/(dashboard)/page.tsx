import { prisma } from "@/lib/prisma";

async function getResumen() {
  try {
    const [posts, audios, colaboradores, mensajes] = await Promise.all([
      prisma.post.count(),
      prisma.audio.count(),
      prisma.user.count({ where: { role: "COLLABORATOR" } }),
      prisma.contactMessage.count({ where: { leido: false } }),
    ]);
    return { posts, audios, colaboradores, mensajes, conectado: true };
  } catch {
    // Si no hay base de datos conectada todavía, mostramos el panel igual
    return { posts: 0, audios: 0, colaboradores: 0, mensajes: 0, conectado: false };
  }
}

export default async function AdminDashboardPage() {
  const resumen = await getResumen();

  const tarjetas = [
    { label: "Editoriales y posts", valor: resumen.posts, href: "/admin/editoriales" },
    { label: "Audios publicados", valor: resumen.audios, href: "/admin/audios" },
    { label: "Colaboradores", valor: resumen.colaboradores, href: "/admin/colaboradores" },
    { label: "Mensajes sin leer", valor: resumen.mensajes, href: "/admin/contacto" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl">Resumen</h1>
      <p className="mt-1 text-principal/60">Estado general del contenido publicado en .VOZ.</p>

      {!resumen.conectado && (
        <div className="mt-6 rounded-xl border border-acento/30 bg-acento/10 px-5 py-3 text-sm text-acento">
          No se pudo conectar con la base de datos. Verificá <code>DATABASE_URL</code> en tu <code>.env</code>.
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tarjetas.map((t) => (
          <a key={t.label} href={t.href} className="rounded-2xl border border-principal/10 p-6 transition-colors hover:border-acento">
            <p className="font-display text-4xl text-acento">{t.valor}</p>
            <p className="mt-2 text-sm text-principal/60">{t.label}</p>
          </a>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-principal/10 p-6">
        <p className="font-medium">Accesos rápidos</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="/admin/editoriales/nuevo" className="rounded-full bg-principal px-5 py-2 text-sm font-semibold text-secundario hover:-translate-y-0.5">
            + Nuevo editorial
          </a>
          <a href="/admin/audios/nuevo" className="rounded-full border border-principal/15 px-5 py-2 text-sm font-medium hover:border-acento hover:text-acento">
            + Nuevo audio
          </a>
          <a href="/admin/observatorio/indicadores/nuevo" className="rounded-full border border-principal/15 px-5 py-2 text-sm font-medium hover:border-acento hover:text-acento">
            + Nuevo indicador
          </a>
        </div>
      </div>
    </div>
  );
}
