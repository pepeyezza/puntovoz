import Link from "next/link";
import type { ReactNode } from "react";

export type Tone = "acento" | "joven" | "principal";

const TONES: Record<Tone, string> = {
  acento: "bg-acento text-secundario",
  joven: "bg-joven text-principal",
  principal: "bg-principal text-secundario",
};

const COLORS = ["#1c2a38", "#c87a62", "#f4a900", "#cfc8b8", "#7a8794", "#e3b9a9"];

const COLS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
};

/** Cuenta elementos agrupados por una clave y los devuelve ordenados de mayor a menor. */
export function contar<T>(items: T[], clave: (item: T) => string) {
  const mapa = new Map<string, number>();
  items.forEach((item) => {
    const k = clave(item);
    mapa.set(k, (mapa.get(k) ?? 0) + 1);
  });
  return Array.from(mapa.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

type StripItem = { label: string; value: string; unit?: string; caption?: string };

/** Franja oscura de resumen con etiqueta de color a la izquierda. */
export function Strip({ label, tone, items }: { label: string; tone: Tone; items: StripItem[] }) {
  const cols = COLS[Math.min(Math.max(items.length, 1), 5)];
  return (
    <div className="overflow-hidden rounded-2xl bg-principal md:flex">
      <div className={`flex items-center px-5 py-4 text-sm font-medium md:w-36 md:shrink-0 ${TONES[tone]}`}>{label}</div>
      <div className={`grid flex-1 grid-cols-2 ${cols}`}>
        {items.map((it, i) => (
          <div
            key={`${it.label}-${i}`}
            className="border-t border-secundario/15 px-4 py-3 md:border-l md:border-t-0 md:first:border-l-0"
          >
            <p className="line-clamp-1 text-xs text-secundario/60">{it.label}</p>
            <p className={`mt-0.5 font-display text-2xl ${i === 0 ? "text-joven" : "text-secundario"}`}>
              {it.value}
              {it.unit && <span className="ml-1 text-sm text-secundario/50">{it.unit}</span>}
            </p>
            {it.caption && <p className="text-xs text-secundario/45">{it.caption}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Panel blanco con título y numerito opcional. */
export function Panel({ n, title, children }: { n?: number; title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-5">
      <div className="flex items-center gap-2.5">
        {n !== undefined && (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-principal text-xs font-medium text-secundario">
            {n}
          </span>
        )}
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

type Dato = { label: string; value: number };

/** Gráfico circular con leyenda y porcentajes. */
export function DonutChart({ data }: { data: Dato[] }) {
  const total = data.reduce((suma, d) => suma + d.value, 0);
  if (total === 0) return <p className="text-sm text-principal/50">Todavía no hay datos para mostrar.</p>;

  const R = 40;
  const C = 2 * Math.PI * R;
  let acumulado = 0;

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 120 120" className="h-24 w-24 shrink-0" role="img" aria-label="Gráfico circular">
        <g transform="rotate(-90 60 60)" fill="none" strokeWidth="16">
          {data.map((d, i) => {
            const largo = (d.value / total) * C;
            const circulo = (
              <circle
                key={`${d.label}-${i}`}
                cx="60"
                cy="60"
                r={R}
                stroke={COLORS[i % COLORS.length]}
                strokeDasharray={`${largo} ${C - largo}`}
                strokeDashoffset={-acumulado}
              />
            );
            acumulado += largo;
            return circulo;
          })}
        </g>
      </svg>
      <ul className="min-w-0 space-y-1.5 text-xs">
        {data.map((d, i) => (
          <li key={`${d.label}-${i}`} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="truncate">
              {d.label} <span className="text-principal/50">{Math.round((d.value / total) * 100)}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Barras horizontales con el valor al final. */
export function BarList({ data }: { data: Dato[] }) {
  if (data.length === 0) return <p className="text-sm text-principal/50">Todavía no hay datos para mostrar.</p>;
  const max = Math.max(...data.map((d) => d.value));
  return (
    <ul className="space-y-2.5">
      {data.map((d, i) => (
        <li key={`${d.label}-${i}`} className="flex items-center gap-3 text-xs">
          <span className="w-28 shrink-0 truncate" title={d.label}>
            {d.label}
          </span>
          <div className="h-3 flex-1 rounded bg-principal/10">
            <div
              className="h-3 rounded"
              style={{ width: `${(d.value / max) * 100}%`, backgroundColor: COLORS[i % 4] }}
            />
          </div>
          <span className="w-6 text-right text-principal/60">{d.value}</span>
        </li>
      ))}
    </ul>
  );
}

type TileProps = {
  title: string;
  href: string;
  tone: Tone;
  icon: ReactNode;
  meta?: string;
  children: ReactNode;
};

/** Tarjeta de sección con cabecera de color, vista previa y enlace "Ver todo". */
export function SectionTile({ title, href, tone, icon, meta, children }: TileProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white">
      <Link href={href} className={`flex items-center gap-2.5 px-4 py-3 ${TONES[tone]}`}>
        {icon}
        <span className="text-sm font-medium">{title}</span>
        {meta && <span className="ml-auto text-xs opacity-80">{meta}</span>}
      </Link>
      <div className="flex-1 p-4">{children}</div>
      <Link
        href={href}
        className="border-t border-principal/10 px-4 py-2.5 text-xs font-medium text-acento hover:bg-principal/5"
      >
        Ver todo →
      </Link>
    </div>
  );
}
