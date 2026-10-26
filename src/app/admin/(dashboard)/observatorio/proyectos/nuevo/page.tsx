export const dynamic = "force-dynamic";
import { createProyecto } from "@/lib/actions/iniciativas";
import IniciativaForm from "@/components/admin/IniciativaForm";

export default function NuevaIniciativaPage() {
  return (
    <div>
      <h1 className="font-display text-3xl">Nueva iniciativa</h1>
      <IniciativaForm action={createProyecto} cancelHref="/admin/observatorio/proyectos" />
    </div>
  );
}
