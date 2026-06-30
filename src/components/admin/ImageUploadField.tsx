"use client";

import { useState } from "react";
import Image from "next/image";

type ImageUploadFieldProps = {
  name: string;
  defaultValue?: string;
  label?: string;
};

export default function ImageUploadField({ name, defaultValue = "", label = "Imagen" }: ImageUploadFieldProps) {
  const [url, setUrl] = useState(defaultValue);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("loading");
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo subir la imagen");
        setStatus("error");
        return;
      }

      setUrl(data.url);
      setStatus("idle");
    } catch {
      setError("No se pudo subir la imagen. Revisá tu conexión.");
      setStatus("error");
    }
  }

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>

      <div className="mt-2 flex items-start gap-4">
        {url ? (
          <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-principal/15 bg-principal/5">
            <Image src={url} alt="Vista previa" fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-principal/20 text-xs text-principal/40">
            Sin imagen
          </div>
        )}

        <div className="flex-1 space-y-2">
          <label className="inline-block cursor-pointer rounded-full border border-principal/15 px-4 py-2 text-sm font-medium hover:border-acento hover:text-acento">
            {status === "loading" ? "Subiendo…" : url ? "Cambiar imagen" : "Subir desde el equipo"}
            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={onFileChange} disabled={status === "loading"} />
          </label>

          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="…o pegá una URL de imagen"
            className="w-full rounded-lg border border-principal/15 bg-secundario px-3 py-2 text-xs outline-none focus-visible:border-acento"
          />

          {error && <p className="text-xs text-acento">{error}</p>}
        </div>
      </div>

      {/* Input real que viaja con el form */}
      <input type="hidden" name={name} value={url} readOnly />
    </div>
  );
}
