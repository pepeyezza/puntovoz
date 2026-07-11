type Indicador = {
  nombre: string;
  valor: number;
  unidad: string;
  periodo: string;
};

const DATOS_EJEMPLO: Indicador[] = [
  { nombre: "Empleo registrado", valor: 68.4, unidad: "%", periodo: "2026-Q2" },
  { nombre: "Establecimientos productivos", valor: 312, unidad: "unid.", periodo: "2026-Q2" },
  { nombre: "Proyectos en curso", valor: 14, unidad: "proy.", periodo: "2026-Q2" },
];

type Props = {
  indicadores?: Indicador[];
  titulo?: string;
  linkLabel?: string;
};

export default function ObservatorioPreview({
  indicadores = DATOS_EJEMPLO,
  titulo = "El partido, en numeros",
  linkLabel = "Ver Data completo",
}: Props) {
  return (
    <section className="border-y border-principal/10 bg-principal py-16 text-secundario">
      <div className="mx-auto max-w-editorial px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-joven">Data - Chascomus</p>
            <h2 className="mt-2 font-display text-3xl">{titulo}</h2>
          </div>
          <a href="/observatorio" className="text-sm font-semibold hover:text-joven">
            {linkLabel}
          </a>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {indicadores.map((ind) => (
            <div key={ind.nombre} className="rounded-2xl border border-secundario/15 p-6">
              <p className="text-sm text-secundario/60">{ind.nombre}</p>
              <p className="mt-2 font-display text-4xl text-joven">
                {ind.valor}
                <span className="ml-1 text-lg text-secundario/60">{ind.unidad}</span>
              </p>
              <p className="mt-1 text-xs text-secundario/40">{ind.periodo}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}