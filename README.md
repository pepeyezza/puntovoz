# .VOZ — Plataforma editorial

Proyecto base de la plataforma .VOZ: comunicación, divulgación y opinión sobre
desarrollo local, educación, tecnología, cultura, política y producción —
incluye el módulo **Observatorio de Chascomús**.

## Stack

- **Next.js 14** (App Router) + React + TypeScript
- **TailwindCSS** (tokens de marca: principal #1c2a38, secundario #f5f2eb, acento #c87a62, joven #f4a900)
- **Prisma** + **PostgreSQL** (pensado para Supabase)
- **NextAuth** (credenciales + roles ADMIN / EDITOR / COLLABORATOR)
- **Spotify embed** para audios

## Instalación local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# completar DATABASE_URL, NEXTAUTH_SECRET, etc.

# 3. Generar cliente Prisma y aplicar el schema
npx prisma generate
npx prisma migrate dev --name init

# 4. Cargar datos de ejemplo (usuario admin + categorías + indicadores)
node prisma/seed.js

# 5. Levantar el servidor de desarrollo
npm run dev
```

La web queda disponible en `http://localhost:3000`.
Usuario admin de prueba: `admin@voz.com.ar` / contraseña `voz2026!`
(cambiarla apenas se despliegue a producción).

## Estructura relevante

```
src/app/            rutas públicas + /api + /admin (a desarrollar)
src/components/      componentes por dominio (editorial, audio, observatorio, layout)
src/lib/             prisma.ts, auth.ts
prisma/schema.prisma modelo de datos completo (Posts, Audios, Observatorio, etc.)
```

## Panel de administración (`/admin`)

Protegido con NextAuth (credenciales + JWT) y roles `ADMIN`, `EDITOR`, `COLLABORATOR`.

- `/admin/login` — inicio de sesión
- `/admin` — resumen general con métricas y accesos rápidos
- `/admin/editoriales` (+ `/nuevo`, `/[id]/editar`) — ABM completo de editoriales, con categoría y etiquetas auto-creadas
- `/admin/audios` (+ `/nuevo`) — ABM de audios (Spotify)
- `/admin/colaboradores` — listado de usuarios con rol Colaborador
- `/admin/observatorio` — resumen con accesos a cada sub-módulo:
  - `/indicadores` (+ `/nuevo`) — ABM completo
  - `/entrevistas`, `/proyectos`, `/agenda`, `/notas` — listado + alta en una sola vista
- `/admin/categorias` — ABM de categorías y etiquetas
- `/admin/usuarios` — **solo Admin**: alta de usuarios, cambio de rol, baja
- `/admin/configuracion` — **solo Admin**: logo, paleta de colores, redes sociales (persistido en `SiteConfig`)
- `/admin/contacto` — bandeja de mensajes del formulario público

**Permisos diferenciados:** el middleware (`src/middleware.ts`) protege todo
`/admin` exigiendo sesión. La visibilidad de "Usuarios" y "Configuración" en
el menú, y la ejecución de sus Server Actions, están restringidas a rol
`ADMIN` (ver `src/lib/actions/users.ts`). El resto de las acciones (crear/
editar/eliminar contenido) están disponibles para cualquier usuario
autenticado — si se necesita una restricción más fina por sección (por
ejemplo que un Colaborador solo edite sus propios posts), es el siguiente
paso natural sobre esta base.

Usuario de prueba tras correr el seed: `admin@voz.com.ar` / `voz2026!`.

**Editor de texto enriquecido:** los campos de contenido largo (Editoriales,
Entrevistas y Notas del Observatorio) usan un editor Tiptap propio
(`src/components/admin/RichTextEditor.tsx`) con toolbar de negrita, cursiva,
subtítulos, listas, cita y enlaces. Guarda el contenido como HTML en un
input oculto, y las páginas públicas lo renderizan con estilos dedicados
(clase `.prose-voz` en `globals.css`), con fallback automático a texto plano
para los datos de ejemplo existentes.

**Edición completa:** todos los módulos de contenido (Editoriales, Audios,
Entrevistas, Proyectos, Agenda y Notas) tienen alta, edición y baja en el
panel admin — no solo alta y baja.

**ABM completo en todas las secciones:** Editoriales, Audios, Colaboradores
(perfil + sus publicaciones), todos los módulos del Observatorio (Indicadores,
Entrevistas, Proyectos, Agenda, Notas) y Categorías/Etiquetas tienen alta,
edición y baja desde el panel.

## Páginas públicas ya implementadas

- `/` — Home
- `/editoriales` y `/editoriales/[slug]` — listado con filtro por categoría + detalle con relacionados
- `/audios` — catálogo de podcasts con buscador y filtro por categoría (embeds de Spotify)
- `/observatorio` — resumen general
- `/observatorio/indicadores` — indicadores + gráfico de evolución (Recharts)
- `/observatorio/entrevistas` y `/observatorio/entrevistas/[slug]`
- `/observatorio/proyectos` — con filtro por estado
- `/observatorio/agenda` — línea de tiempo de eventos
- `/observatorio/notas` y `/observatorio/notas/[slug]`
- `/colaboradores` — listado de autores invitados
- `/colaboradores/[slug]` — perfil de autor + sus publicaciones
- `/colaboradores/[slug]/[postSlug]` — detalle de una publicación de colaborador
- `/sobre-nosotros` — historia, misión, visión, valores y equipo
- `/contacto` — formulario (persiste en `ContactMessage`) + redes + mapa embebido

Con esto, el sitio público de .VOZ queda completo. Todas estas páginas usan
datos de ejemplo de `src/lib/demo-data.ts` como fallback; el siguiente paso
natural es reemplazar esos arrays por consultas a Prisma
(`prisma.post.findMany()`, `prisma.indicador.findMany()`, etc.).

## Próximos pasos sugeridos (no incluidos aún en este entregable)

1. Subida real de imágenes (hoy se pega una URL) a Supabase Storage desde el panel admin.
2. Permisos más finos por sección (ej. que un Colaborador solo pueda editar sus propios posts).
3. Selector visual de categorías/etiquetas existentes en el formulario de Editoriales (hoy es un campo de texto libre que crea la categoría si no existe).
4. Buscador global (editoriales + audios + observatorio + colaboradores).

## Despliegue

### 1. Base de datos — Supabase
1. Crear proyecto en [supabase.com](https://supabase.com).
2. Copiar la **connection string** (modo "Transaction pooler" para Vercel) a `DATABASE_URL`.
3. Correr `npx prisma migrate deploy` apuntando a esa base.

### 2. Frontend + API — Vercel
1. Importar el repo en [vercel.com](https://vercel.com).
2. Configurar las variables de entorno (`DATABASE_URL`, `NEXTAUTH_URL` = dominio de producción, `NEXTAUTH_SECRET`, claves de Supabase).
3. Build command por defecto (`next build`) — Vercel detecta Next.js automáticamente.
4. Tras el primer deploy, correr el seed manualmente una vez (o vía un script de migración) para crear el usuario admin inicial.

### 3. Dominio propio
Apuntar el dominio de `.VOZ` desde el panel de Vercel (Settings → Domains) y actualizar `NEXTAUTH_URL`.
