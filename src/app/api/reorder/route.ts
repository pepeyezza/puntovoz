export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { items, tipo } = await req.json();
  // items: [{ id, orden }], tipo: "audio" | "video" | "agenda"

  if (!items || !tipo) return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });

  try {
    await Promise.all(
      items.map(({ id, orden }: { id: string; orden: number }) => {
        if (tipo === "audio") return prisma.audio.update({ where: { id }, data: { orden } });
        if (tipo === "video") return prisma.video.update({ where: { id }, data: { orden } });
        if (tipo === "agenda") return prisma.eventoAgenda.update({ where: { id }, data: { orden } });
      })
    );
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
