"use client";

import { useState } from "react";

export default function Newsletter() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;

    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setStatus(res.ok ? "ok" : "error");
  }

  return (
    <section className="bg-secundario py-16">
      <div className="mx-auto max-w-editorial px-5 lg:px-8">
        <div className="rounded-3xl bg-acento/10 p-10 lg:p-14">
          <p className="eyebrow text-acento">Sumate</p>
          <h2 className="mt-2 max-w-md font-display text-3xl">
            Recibí lo más relevante de .VOZ cada semana.
          </h2>

          {status === "ok" ? (
            <p className="mt-6 text-sm font-medium text-principal">
              Listo, ya estás suscripto. Gracias por sumarte.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
              <label htmlFor="email" className="sr-only">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="tu@email.com"
                className="flex-1 rounded-full border border-principal/15 bg-secundario px-5 py-3 text-sm outline-none focus-visible:border-acento"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {status === "loading" ? "Enviando…" : "Suscribirme"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="mt-3 text-sm text-acento">No pudimos suscribirte, probá de nuevo.</p>
          )}
        </div>
      </div>
    </section>
  );
}
