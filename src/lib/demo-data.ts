// Datos de ejemplo usados como fallback cuando Prisma no tiene contenido aún
// (típicamente en desarrollo antes de correr el seed, o en este entregable
// de demostración). Las páginas intentan leer de Prisma primero.

export type VideoDemo = {
  slug: string;
  title: string;
  description: string;
  youtubeUrl: string;
  category: string;
  date: string;
};

export const VIDEOS_DEMO: VideoDemo[] = [
  {
    slug: "recorrido-feria-emprendedores",
    title: "Recorrido por la Feria de Emprendedores Locales",
    description: "Un repaso audiovisual por los stands y proyectos presentados este año.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: "Emprendedurismo",
    date: "20 de junio, 2026",
  },
  {
    slug: "entrevista-completa-cooperativa",
    title: "Entrevista completa: cooperativa láctea local",
    description: "La versión en video de la nota sobre la recuperación del sector lechero.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: "Producción",
    date: "10 de junio, 2026",
  },
  {
    slug: "muestra-fotografica-centro-cultural",
    title: "Así fue la apertura de la muestra fotográfica",
    description: "Imágenes y testimonios del evento en el Centro Cultural.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: "Cultura",
    date: "3 de julio, 2026",
  },
];

export type EditorialDemo = {
  slug: string;
  title: string;
  subtitle: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  coverImage?: string;
};

export const EDITORIALES_DEMO: EditorialDemo[] = [
  {
    slug: "presupuesto-participativo-2026",
    title: "Qué propone el nuevo presupuesto participativo",
    subtitle: "Un repaso a los ejes de inversión definidos por los vecinos.",
    content: `El presupuesto participativo 2026 reúne más de cuarenta propuestas votadas por la comunidad, con foco en infraestructura barrial, espacios verdes y programas educativos.

A diferencia de ediciones anteriores, este año la consulta incorporó una etapa de devolución pública, donde cada área municipal explicó el estado de avance de los proyectos seleccionados en el ciclo previo.

Los ejes con mayor cantidad de votos fueron pavimentación de calles secundarias, ampliación de la red de ciclovías y refacción de plazas barriales. La implementación se extenderá a lo largo de todo el ejercicio 2026, con informes de avance trimestrales.`,
    category: "Política y gestión",
    tags: ["presupuesto", "participación ciudadana", "gestión pública"],
    author: "Redacción .VOZ",
    date: "20 de junio, 2026",
  },
  {
    slug: "produccion-lechera-chascomus",
    title: "La producción lechera vuelve a crecer en la región",
    subtitle: "Datos del último semestre y el rol de las cooperativas locales.",
    content: `Tras dos años de retracción, el sector lechero del partido muestra señales de recuperación. Las cooperativas locales reportan un incremento sostenido en el volumen de acopio durante el primer semestre del año.

Productores consultados atribuyen la mejora a una combinación de condiciones climáticas favorables y a líneas de financiamiento específicas impulsadas desde el sector privado.

El desafío que persiste es la logística de distribución hacia centros urbanos más alejados, donde los costos de transporte siguen siendo el principal limitante para la rentabilidad de los pequeños productores.`,
    category: "Producción",
    tags: ["producción láctea", "cooperativas", "economía regional"],
    author: "Redacción .VOZ",
    date: "18 de junio, 2026",
  },
  {
    slug: "escuelas-tecnicas-innovacion",
    title: "Escuelas técnicas: el semillero de la innovación local",
    subtitle: "Cómo se forman los perfiles que demanda la industria regional.",
    content: `Las escuelas técnicas de la región vienen ajustando sus orientaciones para responder a una demanda creciente de perfiles vinculados a automatización y mantenimiento industrial.

Directivos consultados destacan que la articulación con empresas locales permitió incorporar pasantías y prácticas profesionalizantes concretas, algo que hace una década era excepcional.

El desafío hacia adelante es sostener la matrícula en un contexto donde muchos jóvenes migran a centros urbanos más grandes en busca de oportunidades, pese a la oferta de formación de calidad disponible en el propio partido.`,
    category: "Educación",
    tags: ["educación técnica", "empleo joven", "innovación"],
    author: "Redacción .VOZ",
    date: "15 de junio, 2026",
  },
];

export type AudioDemo = {
  slug: string;
  title: string;
  description: string;
  spotifyUrl: string;
  category: string;
  date: string;
};

export const AUDIOS_DEMO: AudioDemo[] = [
  {
    slug: "ep-12-desarrollo-productivo",
    title: "Episodio 12: Desarrollo productivo en clave regional",
    description: "Conversamos con referentes del sector sobre los desafíos de escalar.",
    spotifyUrl: "https://open.spotify.com/episode/0000000000000000000000",
    category: "Producción",
    date: "19 de junio, 2026",
  },
  {
    slug: "ep-11-educacion-tecnica",
    title: "Episodio 11: Educación técnica y futuro del trabajo",
    description: "Qué habilidades necesitan hoy los jóvenes de la región.",
    spotifyUrl: "https://open.spotify.com/episode/0000000000000000000001",
    category: "Educación",
    date: "12 de junio, 2026",
  },
  {
    slug: "playlist-voces-comunidad",
    title: "Playlist .VOZ — Voces de la comunidad",
    description: "Una selección de entrevistas destacadas de los últimos meses.",
    spotifyUrl: "https://open.spotify.com/playlist/0000000000000000000002",
    category: "Comunidad",
    date: "Actualizada semanalmente",
  },
];

export const INDICADORES_DEMO = [
  { nombre: "Empleo registrado", valor: 68.4, unidad: "%", periodo: "2026-Q2", categoria: "Empleo" },
  { nombre: "Establecimientos productivos", valor: 312, unidad: "unid.", periodo: "2026-Q2", categoria: "Producción" },
  { nombre: "Proyectos en curso", valor: 14, unidad: "proy.", periodo: "2026-Q2", categoria: "Infraestructura" },
  { nombre: "Matrícula educación técnica", valor: 940, unidad: "alumnos", periodo: "2026", categoria: "Educación" },
];

export const ENTREVISTAS_DEMO = [
  {
    slug: "entrevista-cooperativa-lechera",
    entrevistado: "María Elena Suárez",
    cargo: "Presidenta de cooperativa láctea local",
    resumen: "Sobre el repunte del sector y los desafíos logísticos pendientes.",
    contenido: `María Elena Suárez lleva quince años al frente de la cooperativa y vivió de cerca las distintas crisis del sector.

En esta charla repasa cómo se gestó la recuperación del último semestre y por qué considera que la articulación entre productores chicos es la clave para sostenerla en el tiempo.`,
    date: "10 de junio, 2026",
  },
  {
    slug: "entrevista-director-escuela-tecnica",
    entrevistado: "Roberto Daniel Ibarra",
    cargo: "Director de Escuela Técnica N°1",
    resumen: "Cómo se adapta la formación técnica a la demanda industrial actual.",
    contenido: `Ibarra explica el rediseño curricular que llevó adelante la institución en los últimos tres años, incorporando contenidos de automatización y mantenimiento predictivo.

También aborda el desafío de retener matrícula frente a la migración de jóvenes hacia centros urbanos más grandes.`,
    date: "3 de junio, 2026",
  },
];

export const PROYECTOS_DEMO = [
  { nombre: "Ampliación red de ciclovías", estado: "En curso", area: "Infraestructura" },
  { nombre: "Polo tecnológico municipal", estado: "Planificado", area: "Tecnología" },
  { nombre: "Refacción de plazas barriales", estado: "En curso", area: "Espacios públicos" },
  { nombre: "Programa de pasantías técnicas", estado: "Finalizado", area: "Educación" },
];

export const AGENDA_DEMO = [
  { titulo: "Feria de emprendedores locales", fecha: "28 de junio, 2026", lugar: "Plaza Independencia", categoria: "Emprendedurismo" },
  { titulo: "Apertura muestra fotográfica", fecha: "3 de julio, 2026", lugar: "Centro Cultural", categoria: "Cultura" },
  { titulo: "Jornada de innovación productiva", fecha: "10 de julio, 2026", lugar: "Sociedad Rural", categoria: "Producción" },
];

export type ColaboradorDemo = {
  slug: string;
  name: string;
  bio: string;
  photoInitials: string;
  socials: { label: string; href: string }[];
};

export const COLABORADORES_DEMO: ColaboradorDemo[] = [
  {
    slug: "marina-lopez",
    name: "Marina López",
    bio: "Socióloga y docente. Escribe sobre educación y políticas públicas locales desde una mirada territorial.",
    photoInitials: "ML",
    socials: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
    ],
  },
  {
    slug: "tomas-ferreyra",
    name: "Tomás Ferreyra",
    bio: "Productor agropecuario de tercera generación. Aporta su mirada sobre el campo y la economía regional.",
    photoInitials: "TF",
    socials: [{ label: "Instagram", href: "https://instagram.com" }],
  },
  {
    slug: "valentina-rossi",
    name: "Valentina Rossi",
    bio: "Gestora cultural. Cubre agenda, arte y patrimonio para .VOZ desde hace dos años.",
    photoInitials: "VR",
    socials: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "X / Twitter", href: "https://twitter.com" },
    ],
  },
];

export type PostColaboradorDemo = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  authorSlug: string;
  category: string;
  date: string;
};

export const POSTS_COLABORADORES_DEMO: PostColaboradorDemo[] = [
  {
    slug: "educacion-rural-desafios",
    title: "Los desafíos pendientes de la educación rural",
    excerpt: "Una mirada sobre el acceso y la calidad educativa en las zonas más alejadas del partido.",
    content: `La distancia sigue siendo el principal obstáculo para garantizar continuidad educativa en las escuelas rurales del partido.

Sumado a esto, la conectividad desigual complica la implementación de propuestas pedagógicas que en la zona urbana ya son habituales.

Pese a estas dificultades, varias escuelas rurales lograron sostener proyectos comunitarios que merecen ser puestos en valor.`,
    authorSlug: "marina-lopez",
    category: "Educación",
    date: "14 de junio, 2026",
  },
  {
    slug: "campo-y-clima-2026",
    title: "Cómo impactó el clima en la campaña 2026",
    excerpt: "Un repaso desde adentro del campo a un año con condiciones poco habituales.",
    content: `La campaña 2026 estuvo marcada por un otoño más húmedo de lo esperado, lo que retrasó las labores de siembra en buena parte del partido.

Para muchos productores, esto significó reorganizar la planificación de los próximos meses, priorizando los lotes con mejor drenaje.

A pesar de las dificultades, el balance general del sector es moderadamente positivo respecto al año anterior.`,
    authorSlug: "tomas-ferreyra",
    category: "Producción",
    date: "5 de junio, 2026",
  },
  {
    slug: "patrimonio-cultural-revalorizacion",
    title: "El patrimonio cultural que empezamos a revalorizar",
    excerpt: "Edificios y espacios históricos que vuelven a estar en agenda comunitaria.",
    content: `En los últimos meses, varios espacios con valor patrimonial volvieron a estar en el centro de la conversación pública, impulsados por vecinos y organizaciones culturales.

Esta nota recorre tres casos concretos donde la gestión comunitaria logró frenar el deterioro de edificios con historia.

El desafío hacia adelante es traducir ese interés en políticas concretas de preservación.`,
    authorSlug: "valentina-rossi",
    category: "Cultura",
    date: "1 de junio, 2026",
  },
];

export const NOTAS_OBSERVATORIO_DEMO = [
  {
    slug: "balance-semestral-desarrollo-local",
    titulo: "Balance semestral del desarrollo local",
    resumen: "Un repaso a los principales indicadores del primer semestre de 2026.",
    date: "22 de junio, 2026",
    contenido: `El primer semestre de 2026 mostró señales mixtas para el desarrollo local: mientras el empleo registrado y la producción láctea muestran recuperación, otros sectores se mantienen estables sin grandes variaciones.

La cantidad de proyectos en curso se sostuvo en catorce, con foco en infraestructura y espacios públicos, mientras que el polo tecnológico municipal sigue en etapa de planificación.

Hacia el segundo semestre, el desafío será sostener el ritmo de obra pública en un contexto de presupuesto ajustado, además de consolidar la articulación entre el sector educativo técnico y la demanda productiva regional.`,
  },
  {
    slug: "mapa-productivo-partido",
    titulo: "Cómo se compone hoy el mapa productivo del partido",
    resumen: "Sectores que crecen, sectores que se estancan y por qué.",
    date: "8 de junio, 2026",
    contenido: `El tejido productivo del partido sigue apoyado mayoritariamente en la actividad agropecuaria y láctea, aunque en los últimos años se observa una diversificación gradual hacia servicios y turismo.

Los 312 establecimientos productivos registrados muestran una distribución relativamente estable respecto al año anterior, con una leve tendencia al crecimiento en el sector de servicios vinculados al turismo de fin de semana.

La principal limitación que señalan los actores locales sigue siendo la infraestructura logística, particularmente para quienes producen lejos de las rutas principales.`,
  },
];
