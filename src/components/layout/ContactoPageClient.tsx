"use client";

import { useState } from "react";

const REDES = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Spotify", href: "https://open.spotify.com" },
  { label: "X / Twitter", href: "https://twitter.com" },
];

type Props = {
  header: { eyebrow: string; title: string; description?: string };
};

export default function ContactoPageClient({ header }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = {
      nombre: (form.elements.namedItem("nombre") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      mensaje: (form.elements.namedItem("mensaje") as HTMLTextAreaElement).value,
    };

    const res = await fetch("/api/contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setStatus("ok");
      form.reset();
    } else {
      setStatus("error");
    }
  }

  return (
    <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
      <header className="max-w-2xl">
        <p className="eyebrow text-acento">{header.eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl">{header.title}</h1>
        <p className="mt-4 text-principal/70">{header.description}</p>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          {status === "ok" ? (
            <div className="rounded-2xl border border-principal/10 bg-principal/[0.03] p-8">
              <p className="font-display text-xl">Mensaje enviado</p>
              <p className="mt-2 text-principal/70">
                Gracias por escribirnos, te responderemos a la brevedad.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label htmlFor="nombre" className="text-sm font-medium">
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  minLength={2}
                  className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
                />
              </div>

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
                <label htmlFor="mensaje" className="text-sm font-medium">
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  required
                  minLength={10}
                  rows={5}
                  className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {status === "loading" ? "Enviando…" : "Enviar mensaje"}
              </button>

              {status === "error" && (
                <p className="text-sm text-acento">No pudimos enviar el mensaje, probá de nuevo.</p>
              )}
            </form>
          )}
        </div>

        <div>
          <div className="rounded-2xl border border-principal/10 p-6">
            <p className="eyebrow text-acento">Redes</p>
            <ul className="mt-4 space-y-3">
              {REDES.map((r) => (
                <li key={r.label}>
                  <a href={r.href} target="_blank" rel="noreferrer" className="text-sm font-medium hover:text-acento">
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Mapa opcional — placeholder embebible con Google Maps */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-principal/10">
            <iframe
              title="Ubicación de .VOZ en Chascomús"
              src="https://www.google.com/maps?q=Chascom%C3%BAs,+Buenos+Aires,+Argentina&output=embed"
              width="100%"
              height="220"
              loading="lazy"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
