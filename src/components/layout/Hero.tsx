import Link from "next/link";

type HeroProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

export default function Hero({
  eyebrow = "Voz propia, mirada local",
  title = "Contamos lo que pasa en nuestro territorio.",
  description = "Editoriales, audios y datos sobre desarrollo local, educación, tecnología y cultura — pensados para quien quiere entender, no solo enterarse.",
}: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-principal/10">
      <div className="mx-auto grid max-w-editorial gap-10 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-24">
        <div>
          <p className="eyebrow text-acento">{eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-md text-base text-principal/70">{description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/editoriales"
              className="rounded-full bg-acento px-6 py-3 text-sm font-semibold text-secundario transition-transform hover:-translate-y-0.5"
            >
              Leer las últimas notas
            </Link>
            <Link
              href="/audios"
              className="text-sm font-semibold text-principal underline-offset-4 hover:underline"
            >
              Escuchar .VOZ →
            </Link>
          </div>
        </div>

        {/* Marca visual: onda de audio estilizada, ancla al concepto sonoro de la marca */}
        <div aria-hidden className="flex h-40 items-end justify-center gap-1.5 lg:h-56">
          {WAVE_HEIGHTS.map((h, i) => (
            <span
              key={i}
              className="w-2 rounded-full bg-principal lg:w-3"
              style={{
                height: `${h}%`,
                backgroundColor: i % 5 === 0 ? "var(--color-joven)" : i % 3 === 0 ? "var(--color-acento)" : undefined,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const WAVE_HEIGHTS = [30, 55, 40, 70, 45, 90, 60, 35, 75, 50, 65, 40, 85, 55, 30, 60, 45, 70, 50, 38];
