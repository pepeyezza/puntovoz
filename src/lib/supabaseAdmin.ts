import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase para uso EXCLUSIVAMENTE server-side (API routes, Server
 * Actions). Usa la service role key, que tiene permisos de escritura en
 * Storage y nunca debe exponerse al navegador.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Falta configurar NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY en el .env"
    );
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export const VOZ_MEDIA_BUCKET = "voz-media";
