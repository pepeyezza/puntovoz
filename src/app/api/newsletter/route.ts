export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, interes } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { interes: interes || null },
      create: { email, interes: interes || null },
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    // Si ya existe el suscriptor no es un error
    return NextResponse.json({ ok: true });
  }
}
