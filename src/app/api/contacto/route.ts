import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  mensaje: z.string().min(10),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  try {
    await prisma.contactMessage.create({ data: parsed.data });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No se pudo enviar el mensaje" }, { status: 500 });
  }
}
