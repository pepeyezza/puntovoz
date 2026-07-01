export const dynamic = "force-dynamic";
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const res = await signIn("credentials", { email, password, redirect: false });

    setLoading(false);
    if (res?.error) {
      setError("Email o contraseña incorrectos.");
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-5">
      <div className="w-full max-w-sm rounded-2xl border border-principal/10 p-8">
        <p className="font-logo text-2xl font-bold">
          <span className="text-acento">.</span>VOZ <span className="font-body text-base font-normal text-principal/40">admin</span>
        </p>
        <p className="mt-1 text-sm text-principal/60">Ingresá con tu cuenta de equipo.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
            />
          </div>

          {error && <p className="text-sm text-acento">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
