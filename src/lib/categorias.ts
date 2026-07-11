// Categorías unificadas para Editoriales, Audios, Videos y filtros del Home
export const CATEGORIAS_VOZ = [
  "Educación",
  "Ciencia y Tecnología",
  "Cultura",
  "Política y Gobernanza",
  "Desarrollo Productivo",
  "Comunidad",
] as const;

export type CategoriaVoz = (typeof CATEGORIAS_VOZ)[number];

// Especialidades para colaboradores (mismas categorías)
export const ESPECIALIDADES_COLABORADOR = CATEGORIAS_VOZ;
