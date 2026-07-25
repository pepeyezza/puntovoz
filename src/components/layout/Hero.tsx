import Link from "next/link";

type HeroProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

export default function Hero({
  eyebrow = "Voz propia, mirada local",
  title = "Pensar, divulgar, informar.",
  description = "Editoriales, audios y datos sobre desarrollo local, educación, tecnología y cultura — pensados para quien quiere entender, no solo enterarse.",
}: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-principal/10">
      <div className="mx-auto grid max-w-editorial gap-6 px-5 py-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:px-8 lg:py-8">

        {/* Columna izquierda — texto */}
        <div className="flex flex-col justify-center">
          <p className="eyebrow text-acento">{eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl font-medium leading-[1.05] tracking-tight lg:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-md text-base text-principal/70">{description}</p>

          {/* Botones en mobile — debajo del texto */}
          <div className="mt-6 flex flex-wrap items-center gap-2 lg:hidden">
            <Link href="/editoriales" className="rounded-lg bg-acento px-6 py-3 text-sm font-semibold text-secundario transition-opacity hover:opacity-90">
              Últimas notas
            </Link>
            <Link href="/observatorio" className="rounded-lg bg-joven px-6 py-3 text-sm font-semibold text-principal transition-opacity hover:opacity-90">
              Data
            </Link>
            <Link href="/colaboradores" className="rounded-lg bg-principal px-6 py-3 text-sm font-semibold text-secundario transition-opacity hover:opacity-90">
              Colaboradores
            </Link>
          </div>

          {/* Barras en mobile */}
          <div aria-hidden className="mt-8 flex h-28 items-end justify-center gap-1.5 lg:hidden">
            {WAVE_HEIGHTS.map((h, i) => (
              <span key={i} className="w-2 rounded-full"
                style={{ height: `${h}%`, backgroundColor: i % 5 === 0 ? "var(--color-joven)" : i % 3 === 0 ? "var(--color-acento)" : "var(--color-principal)" }}
              />
            ))}
          </div>
        </div>

        {/* Columna derecha — barras arriba, botones centrados debajo (solo desktop) */}
        <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-5">
          {/* Barras */}
          <div aria-hidden className="flex h-48 w-full items-end justify-center gap-1.5">
            {WAVE_HEIGHTS.map((h, i) => (
              <span key={i} className="w-3 rounded-full"
                style={{ height: `${h}%`, backgroundColor: i % 5 === 0 ? "var(--color-joven)" : i % 3 === 0 ? "var(--color-acento)" : "var(--color-principal)" }}
              />
            ))}
          </div>
          {/* Botones centrados debajo de las barras */}
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/editoriales" className="rounded-lg bg-acento px-6 py-3 text-sm font-semibold text-secundario transition-opacity hover:opacity-90">
              Últimas notas
            </Link>
            <Link href="/observatorio" className="rounded-lg bg-joven px-6 py-3 text-sm font-semibold text-principal transition-opacity hover:opacity-90">
              Data
            </Link>
            <Link href="/colaboradores" className="rounded-lg bg-principal px-6 py-3 text-sm font-semibold text-secundario transition-opacity hover:opacity-90">
              Colaboradores
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

const WAVE_HEIGHTS = [30, 55, 40, 70, 45, 90, 60, 35, 75, 50, 65, 40, 85, 55, 30, 60, 45, 70, 50, 38];
