"use client";

import { useState, useRef } from "react";
import { GripVertical } from "lucide-react";

type Item = { id: string; title: string; subtitle?: string; badge?: string };
type Props = { items: Item[]; tipo: "audio" | "video" | "agenda" | "post" | "proyecto" | "herramienta"; onReorder?: (ids: string[]) => void };

export default function ReorderableList({ items: initialItems, tipo }: Props) {
  const [items, setItems] = useState(initialItems);
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const dragNode = useRef<HTMLDivElement | null>(null);

  function handleDragStart(e: React.DragEvent, idx: number) {
    setDragging(idx);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    setOver(idx);
  }

  function handleDrop(e: React.DragEvent, idx: number) {
    e.preventDefault();
    if (dragging === null || dragging === idx) return;
    const newItems = [...items];
    const [moved] = newItems.splice(dragging, 1);
    newItems.splice(idx, 0, moved);
    setItems(newItems);
    setDragging(null);
    setOver(null);
  }

  function handleDragEnd() {
    setDragging(null);
    setOver(null);
  }

  async function guardarOrden() {
    setSaving(true);
    const payload = items.map((item, i) => ({ id: item.id, orden: i + 1 }));
    await fetch("/api/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: payload, tipo }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-principal/50">Arrastrá los items para reordenarlos, luego guardá.</p>
        <button
          onClick={guardarOrden}
          disabled={saving}
          className="rounded-lg bg-principal px-5 py-2 text-sm font-semibold text-secundario disabled:opacity-60"
        >
          {saving ? "Guardando..." : saved ? "✓ Guardado" : "Guardar orden"}
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={(e) => handleDrop(e, idx)}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all cursor-grab active:cursor-grabbing ${
              dragging === idx ? "opacity-40 scale-95" : ""
            } ${over === idx && dragging !== idx ? "border-acento bg-acento/5" : "border-principal/10 bg-secundario"}`}
          >
            <GripVertical size={16} className="shrink-0 text-principal/30" />
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-principal/5 text-xs font-bold text-principal/40">
              {idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-1">{item.title}</p>
              {item.subtitle && <p className="text-xs text-principal/40">{item.subtitle}</p>}
            </div>
            {item.badge && (
              <span className="shrink-0 rounded-lg bg-principal/5 px-2 py-0.5 text-xs text-principal/50">{item.badge}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
