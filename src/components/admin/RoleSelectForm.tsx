"use client";

import { useRef } from "react";
import { updateUserRole } from "@/lib/actions/users";

export default function RoleSelectForm({ userId, currentRole }: { userId: string; currentRole: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={updateUserRole.bind(null, userId)}>
      <select
        name="role"
        defaultValue={currentRole}
        onChange={() => formRef.current?.requestSubmit()}
        className="rounded-lg border border-principal/15 bg-secundario px-2 py-1 text-xs"
      >
        <option value="ADMIN">Administrador</option>
        <option value="EDITOR">Editor</option>
        <option value="COLLABORATOR">Colaborador</option>
      </select>
    </form>
  );
}
