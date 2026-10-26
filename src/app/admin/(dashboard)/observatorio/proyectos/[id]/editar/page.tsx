export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProyecto } from "@/lib/actions/iniciativas";
import IniciativaForm from "@/components/admin/IniciativaForm";

export default async function Page({ params }: { params: { id: string } }) {
  const p: any = await prisma.proyectoLocal.findUnique({ where: { id: params.id } });
  if (!p) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl">Editar iniciativa</h1>
      <p className="mt-1 text-principal/60">{p.nombre}</p>
      <IniciativaForm
        action={updateProyecto.bind(null, p.id)}
        cancelHref="/admin/observatorio/proyectos"
        defaults={{
          nombre: p.nombre ?? "",
          descripcion: p.descripcion ?? "",
          area: p.area ?? "",
          tipo: p.tipo ?? "publico",
          estado: p.estado ?? "",
          responsable: p.responsable ?? "",
          periodo: p.periodo ?? "",
          ubicacion: p.ubicacion ?? "",
          destinatarios: p.destinatarios ?? "",
          enlace: p.enlace ?? "",
          detalle: p.detalle ?? "",
          cifras: p.cifras ?? "",
          logoUrl: p.logoUrl ?? "",
          imagen: p.imagen ?? "",
          galeria: Array.isArray(p.galeria) ? p.galeria : [],
          documentoUrl: p.documentoUrl ?? "",
          documentoTitulo: p.documentoTitulo ?? "",
        }}
      />
    </div>
  );
}
