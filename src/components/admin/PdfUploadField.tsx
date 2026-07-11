"use client";
import { useState } from "react";

type Props = { name: string; defaultValue?: string; label?: string };

export default function PdfUploadField({ name, defaultValue = "", label = "Plan de estudios (PDF)" }: Props) {
  const [url, setUrl] = useState(defaultValue);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("loading"); setError(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "No se pudo subir el archivo"); setStatus("error"); return; }
      setUrl(data.url); setStatus("idle");
    } catch { setError("No se pudo subir el archivo."); setStatus("error"); }
  }

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="mt-2 flex items-center gap-4">
        <label className="inline-block cursor-pointer rounded-full border border-principal/15 px-4 py-2 text-sm font-medium hover:border-acento hover:text-acento">
          {status === "loading" ? "Subiendo…" : url ? "Cambiar PDF" : "Subir PDF"}
          <input type="file" accept="application/pdf" className="hidden" onChange={onFileChange} disabled={status === "loading"} />
        </label>
        {url && <a href={url} target="_blank" rel="noreferrer" className="text-sm font-medium text-acento hover:underline">Ver PDF →</a>}
      </div>
      {error && <p className="mt-1 text-xs text-acento">{error}</p>}
      <input type="hidden" name={name} value={url} readOnly />
    </div>
  );
}
