export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON invalido" }, { status: 400 }); }

  const { items, tipo } = body;
  if (!items || !Array.isArray(items) || !tipo) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  try {
    await Promise.all(
      items.map(({ id, orden }: { id: string; orden: number }) => {
        switch (tipo) {
          case "audio":       return prisma.audio.update({ where: { id }, data: { orden } });
          case "video":       return prisma.video.update({ where: { id }, data: { orden } });
          case "agenda":      return prisma.eventoAgenda.update({ where: { id }, data: { orden } });
          case "post":        return prisma.post.update({ where: { id }, data: { orden } });
          case "proyecto":    return prisma.proyectoLocal.update({ where: { id }, data: { orden } });
          case "herramienta": return (prisma as any).herramientaTecnologica.update({ where: { id }, data: { orden } });
          default:            return Promise.resolve();
        }
      })
    );
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Reorder error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
