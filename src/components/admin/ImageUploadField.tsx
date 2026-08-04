"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  name: string;
  defaultValue?: string;
  label?: string;
  acceptPdf?: boolean;
};

export default function ImageUploadField({ name, defaultValue = "", label = "Imagen", acceptPdf = false }: Props) {
  const [url, setUrl] = useState(defaultValue);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const isPdf = url?.toLowerCase().endsWith(".pdf");
  const accept = acceptPdf
    ? "image/png,image/jpeg,image/webp,image/gif,application/pdf"
    : "image/png,image/jpeg,image/webp,image/gif";
  const acceptLabel = acceptPdf ? "imagen o PDF" : "imagen";

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("loading");
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "No se pudo subir el archivo"); setStatus("error"); return; }
      setUrl(data.url);
      setStatus("idle");
    } catch {
      setError("No se pudo subir. Revisa tu conexion.");
      setStatus("error");
    }
  }

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="mt-2 flex items-start gap-4">
        {url ? (
          isPdf ? (
            <a href={url} target="_blank" rel="noreferrer"
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-acento/30 bg-acento/5 text-xs font-medium text-acento hover:bg-acento/10">
              PDF ↗
            </a>
          ) : (
            <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-principal/15 bg-principal/5">
              <Image src={url} alt="Vista previa" fill className="object-cover" unoptimized />
            </div>
          )
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-principal/20 text-xs text-principal/40">
            Sin archivo
          </div>
        )}
        <div className="flex-1 space-y-2">
          <label className="inline-block cursor-pointer rounded-lg border border-principal/15 px-4 py-2 text-sm font-medium hover:border-acento hover:text-acento">
            {status === "loading" ? "Subiendo..." : url ? `Cambiar ${acceptLabel}` : `Subir ${acceptLabel}`}
            <input type="file" accept={accept} className="hidden" onChange={onFileChange} disabled={status === "loading"} />
          </label>
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
            placeholder="...o pega una URL"
            className="w-full rounded-lg border border-principal/15 bg-secundario px-3 py-2 text-xs outline-none focus-visible:border-acento" />
          {error && <p className="text-xs text-acento">{error}</p>}
        </div>
      </div>
      <input type="hidden" name={name} value={url} readOnly />
    </div>
  );
}
