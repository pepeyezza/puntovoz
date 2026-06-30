/**
 * Heurística simple para distinguir contenido HTML generado por el editor
 * enriquecido (Tiptap) del texto plano usado en los datos de ejemplo
 * (donde los párrafos se separan con una línea en blanco).
 */
export function esHtmlEnriquecido(content: string): boolean {
  return /<\/?(p|h2|h3|ul|ol|li|blockquote|strong|em|a)[\s>]/i.test(content);
}

export type PageHeaderDefaults = {
  eyebrow: string;
  title: string;
  description?: string;
};

/**
 * Trae el encabezado editable (eyebrow/título/descripción) de una página
 * pública desde SiteConfig.pageHeaders, con fallback a los valores por
 * defecto si todavía no se configuró nada para esa página.
 */
export async function getPageHeader(key: string, defaults: PageHeaderDefaults): Promise<PageHeaderDefaults> {
  try {
    const { prisma } = await import("@/lib/prisma");
    const config = await prisma.siteConfig.findUnique({ where: { id: "singleton" } });
    const headers = (config?.pageHeaders as Record<string, Partial<PageHeaderDefaults>>) ?? {};
    const saved = headers[key] ?? {};
    return {
      eyebrow: saved.eyebrow || defaults.eyebrow,
      title: saved.title || defaults.title,
      description: saved.description || defaults.description,
    };
  } catch {
    return defaults;
  }
}
