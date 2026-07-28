import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const HERRAMIENTAS = [
  { nombre: "ChatGPT", categoria: "IA", descripcion: "Asistente de IA conversacional de OpenAI. Ideal para redactar, resumir, traducir y responder preguntas complejas.", enlace: "https://chatgpt.com", destacada: true },
  { nombre: "Claude", categoria: "IA", descripcion: "Asistente de IA de Anthropic. Destacado por su razonamiento, analisis de documentos y generacion de contenido.", enlace: "https://claude.ai", destacada: true },
  { nombre: "Gemini", categoria: "IA", descripcion: "IA de Google integrada con sus servicios. Busqueda avanzada, analisis de imagenes y asistencia en Google Workspace.", enlace: "https://gemini.google.com", destacada: false },
  { nombre: "Perplexity AI", categoria: "IA", descripcion: "Motor de busqueda con IA que cita sus fuentes. Excelente para investigacion y verificacion de informacion.", enlace: "https://perplexity.ai", destacada: false },
  { nombre: "Midjourney", categoria: "IA", descripcion: "Generador de imagenes por IA a partir de descripciones de texto. Muy usado en diseno y comunicacion visual.", enlace: "https://midjourney.com", destacada: false },
  { nombre: "Canva", categoria: "Comunicacion e Interaccion", descripcion: "Diseno grafico online sin conocimientos previos. Ideal para redes sociales, presentaciones y materiales institucionales.", enlace: "https://canva.com", destacada: true },
  { nombre: "Mailchimp", categoria: "Comunicacion e Interaccion", descripcion: "Plataforma de email marketing. Permite enviar newsletters, automatizar campanas y analizar resultados.", enlace: "https://mailchimp.com", destacada: false },
  { nombre: "WhatsApp Business", categoria: "Comunicacion e Interaccion", descripcion: "Version de WhatsApp para organizaciones. Permite atender consultas, automatizar respuestas y difundir novedades.", enlace: "https://business.whatsapp.com", destacada: false },
  { nombre: "Notion", categoria: "Productividad y Ofimatica", descripcion: "Espacio de trabajo todo-en-uno. Notas, bases de datos, wikis y gestion de proyectos en una sola herramienta.", enlace: "https://notion.so", destacada: true },
  { nombre: "Google Workspace", categoria: "Productividad y Ofimatica", descripcion: "Suite de herramientas de Google: Docs, Sheets, Drive, Meet y mas. Colaboracion en tiempo real desde cualquier dispositivo.", enlace: "https://workspace.google.com", destacada: false },
  { nombre: "Trello", categoria: "Productividad y Ofimatica", descripcion: "Gestion visual de tareas con tableros y tarjetas. Sencillo de usar para equipos pequenos y proyectos personales.", enlace: "https://trello.com", destacada: false },
  { nombre: "Slack", categoria: "Gestion y Organizacion", descripcion: "Mensajeria y colaboracion para equipos. Organiza conversaciones por canales tematicos e integra otras herramientas.", enlace: "https://slack.com", destacada: false },
  { nombre: "Monday.com", categoria: "Gestion y Organizacion", descripcion: "Plataforma de gestion de proyectos flexible. Seguimiento de tareas, cronogramas y reportes de equipo.", enlace: "https://monday.com", destacada: false },
  { nombre: "Asana", categoria: "Gestion y Organizacion", descripcion: "Gestion de proyectos y tareas para equipos. Permite asignar responsables, fechas y seguir el avance de cada iniciativa.", enlace: "https://asana.com", destacada: false },
];

export async function GET() {
  try {
    let cargadas = 0;
    for (const h of HERRAMIENTAS) {
      const slug = slugify(h.nombre);
      const existe = await (prisma as any).herramientaTecnologica.findUnique({ where: { slug } });
      if (!existe) {
        await (prisma as any).herramientaTecnologica.create({ data: { ...h, slug } });
        cargadas++;
      }
    }
    return NextResponse.json({ ok: true, cargadas, mensaje: `${cargadas} herramientas nuevas cargadas.` });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
