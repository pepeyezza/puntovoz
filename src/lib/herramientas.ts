export const CATEGORIAS_HERRAMIENTAS = [
  "IA",
  "Comunicacion e Interaccion",
  "Productividad y Ofimatica",
  "Gestion y Organizacion",
  "Otros",
] as const;

export type CategoriaHerramienta = (typeof CATEGORIAS_HERRAMIENTAS)[number];

// Herramientas de ejemplo — se muestran cuando la base está vacía
export const HERRAMIENTAS_DEMO = [
  // IA
  {
    id: "1", slug: "chatgpt", nombre: "ChatGPT", categoria: "IA",
    descripcion: "Asistente de IA conversacional de OpenAI. Ideal para redactar, resumir, traducir y responder preguntas complejas.",
    enlace: "https://chatgpt.com", logoUrl: "", destacada: true,
  },
  {
    id: "2", slug: "claude-ai", nombre: "Claude", categoria: "IA",
    descripcion: "Asistente de IA de Anthropic. Destacado por su razonamiento, análisis de documentos y generación de contenido seguro.",
    enlace: "https://claude.ai", logoUrl: "", destacada: true,
  },
  {
    id: "3", slug: "gemini", nombre: "Gemini", categoria: "IA",
    descripcion: "IA de Google integrada con sus servicios. Búsqueda avanzada, análisis de imágenes y asistencia en Google Workspace.",
    enlace: "https://gemini.google.com", logoUrl: "", destacada: false,
  },
  {
    id: "4", slug: "perplexity", nombre: "Perplexity AI", categoria: "IA",
    descripcion: "Motor de búsqueda con IA que cita sus fuentes. Excelente para investigación y verificación de información.",
    enlace: "https://perplexity.ai", logoUrl: "", destacada: false,
  },
  {
    id: "5", slug: "midjourney", nombre: "Midjourney", categoria: "IA",
    descripcion: "Generador de imágenes por IA a partir de descripciones de texto. Muy usado en diseño y comunicación visual.",
    enlace: "https://midjourney.com", logoUrl: "", destacada: false,
  },
  // Comunicación e Interacción
  {
    id: "6", slug: "canva", nombre: "Canva", categoria: "Comunicacion e Interaccion",
    descripcion: "Diseño gráfico online sin conocimientos previos. Ideal para redes sociales, presentaciones y materiales institucionales.",
    enlace: "https://canva.com", logoUrl: "", destacada: true,
  },
  {
    id: "7", slug: "mailchimp", nombre: "Mailchimp", categoria: "Comunicacion e Interaccion",
    descripcion: "Plataforma de email marketing. Permite enviar newsletters, automatizar campañas y analizar resultados.",
    enlace: "https://mailchimp.com", logoUrl: "", destacada: false,
  },
  {
    id: "8", slug: "whatsapp-business", nombre: "WhatsApp Business", categoria: "Comunicacion e Interaccion",
    descripcion: "Versión de WhatsApp para organizaciones. Permite atender consultas, automatizar respuestas y difundir novedades.",
    enlace: "https://business.whatsapp.com", logoUrl: "", destacada: false,
  },
  // Productividad y Ofimática
  {
    id: "9", slug: "notion", nombre: "Notion", categoria: "Productividad y Ofimatica",
    descripcion: "Espacio de trabajo todo-en-uno. Notas, bases de datos, wikis y gestión de proyectos en una sola herramienta.",
    enlace: "https://notion.so", logoUrl: "", destacada: true,
  },
  {
    id: "10", slug: "google-workspace", nombre: "Google Workspace", categoria: "Productividad y Ofimatica",
    descripcion: "Suite de herramientas de Google: Docs, Sheets, Drive, Meet y más. Colaboración en tiempo real desde cualquier dispositivo.",
    enlace: "https://workspace.google.com", logoUrl: "", destacada: false,
  },
  {
    id: "11", slug: "trello", nombre: "Trello", categoria: "Productividad y Ofimatica",
    descripcion: "Gestión visual de tareas con tableros y tarjetas. Sencillo de usar para equipos pequeños y proyectos personales.",
    enlace: "https://trello.com", logoUrl: "", destacada: false,
  },
  // Gestión y Organización
  {
    id: "12", slug: "slack", nombre: "Slack", categoria: "Gestion y Organizacion",
    descripcion: "Mensajería y colaboración para equipos. Organiza conversaciones por canales temáticos e integra otras herramientas.",
    enlace: "https://slack.com", logoUrl: "", destacada: false,
  },
  {
    id: "13", slug: "monday", nombre: "Monday.com", categoria: "Gestion y Organizacion",
    descripcion: "Plataforma de gestión de proyectos flexible. Seguimiento de tareas, cronogramas y reportes de equipo.",
    enlace: "https://monday.com", logoUrl: "", destacada: false,
  },
  {
    id: "14", slug: "asana", nombre: "Asana", categoria: "Gestion y Organizacion",
    descripcion: "Gestión de proyectos y tareas para equipos. Permite asignar responsables, fechas y seguir el avance de cada iniciativa.",
    enlace: "https://asana.com", logoUrl: "", destacada: false,
  },
];
