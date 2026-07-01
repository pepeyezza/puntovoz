export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { createUser, deleteUser } from "@/lib/actions/users";
import RoleSelectForm from "@/components/admin/RoleSelectForm";

async function getUsers() {
  try {
    return await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  } catch {
    return [];
  }
}

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Administrador",
  EDITOR: "Editor",
  COLLABORATOR: "Colaborador",
};

export default async function AdminUsuariosPage() {
  const users = await getUsers();

  return (
    <div>
      <h1 className="font-display text-3xl">Usuarios</h1>
      <p className="mt-1 text-principal/60">Gestión de cuentas y permisos del equipo editorial.</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-principal/10">
          <table className="w-full text-sm">
            <thead className="bg-principal/[0.03] text-left text-principal/50">
              <tr>
                <th className="px-5 py-3 font-medium">Nombre</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Rol</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-principal/10">
                  <td className="px-5 py-3 font-medium">{u.name}</td>
                  <td className="px-5 py-3 text-principal/60">{u.email}</td>
                  <td className="px-5 py-3">
                    <RoleSelectForm userId={u.id} currentRole={u.role} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <form action={deleteUser.bind(null, u.id)}>
                      <button type="submit" className="text-sm font-medium text-principal/50 hover:text-acento">
                        Eliminar
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-principal/10 p-6">
          <h2 className="font-display text-xl">Nuevo usuario</h2>
          <form action={createUser} className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Nombre</label>
              <input
                name="name"
                type="text"
                required
                className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Contraseña inicial</label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Rol</label>
              <select
                name="role"
                defaultValue="EDITOR"
                className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento"
              >
                <option value="ADMIN">Administrador</option>
                <option value="EDITOR">Editor</option>
                <option value="COLLABORATOR">Colaborador</option>
              </select>
            </div>
            <button type="submit" className="w-full rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario">
              Crear usuario
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
