import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin, VOZ_MEDIA_BUCKET } from "@/lib/supabaseAdmin";

const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const TAMANO_MAXIMO = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
  }
  if (!TIPOS_PERMITIDOS.includes(file.type)) {
    return NextResponse.json({ error: "Formato no soportado. Usá JPG, PNG, WEBP o GIF." }, { status: 400 });
  }
  if (file.size > TAMANO_MAXIMO) {
    return NextResponse.json({ error: "La imagen pesa más de 5MB." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const ext = file.name.split(".").pop() || "jpg";
    const filePath = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(VOZ_MEDIA_BUCKET)
      .upload(filePath, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(VOZ_MEDIA_BUCKET).getPublicUrl(filePath);

    return NextResponse.json({ url: data.publicUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error al subir la imagen" }, { status: 500 });
  }
}
