const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("voz2026!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@voz.com.ar" },
    update: {},
    create: {
      name: "Administrador .VOZ",
      email: "admin@voz.com.ar",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  const categorias = ["Educación", "Tecnología", "Cultura", "Política", "Producción", "Comunidad"];
  for (const nombre of categorias) {
    await prisma.category.upsert({
      where: { slug: nombre.toLowerCase() },
      update: {},
      create: { name: nombre, slug: nombre.toLowerCase() },
    });
  }

  await prisma.indicador.createMany({
    data: [
      { nombre: "Empleo registrado", valor: 68.4, unidad: "%", periodo: "2026-Q2", categoria: "empleo" },
      { nombre: "Establecimientos productivos", valor: 312, unidad: "unid.", periodo: "2026-Q2", categoria: "producción" },
      { nombre: "Proyectos en curso", valor: 14, unidad: "proy.", periodo: "2026-Q2", categoria: "infraestructura" },
    ],
  });

  console.log("Seed completo. Admin:", admin.email, "/ password: voz2026!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
