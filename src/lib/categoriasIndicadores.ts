export const CATEGORIAS_INDICADORES = [
  "Economía y producción",
  "Empleo",
  "Demografía y sociedad",
  "Educación",
  "Salud",
  "Infraestructura y ambiente",
  "Turismo",
  "Agro y producción",
] as const;

export type CategoriaIndicador = (typeof CATEGORIAS_INDICADORES)[number];
