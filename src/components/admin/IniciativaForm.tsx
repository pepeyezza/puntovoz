import ImageUploadField from "@/components/admin/ImageUploadField";
import RichTextEditor from "@/components/admin/RichTextEditor";

type Defaults = {
  nombre?: string;
  descripcion?: string;
  area?: string;
  tipo?: string;
  estado?: string;
  responsable?: string;
  periodo?: string;
  ubicacion?: string;
  destinatarios?: string;
  enlace?: string;
  detalle?: string;
  cifras?: string;
  logoUrl?: string;
  imagen?: string;
  galeria?: string[];
  documentoUrl?: string;
  documentoTitulo?: string;
};

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  defaults?: Defaults;
  cancelHref: string;
};

const INPUT =
  "mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento";

export default function IniciativaForm({ action, defaults = {}, cancelHref }: Props) {
  const galeria = defaults.galeria ?? [];

  return (
    <form action={action} className="mt-8 max-w-2xl space-y-5">
      <h2 className="font-display text-xl">Datos principales</h2>

      <div>
        <label className="text-sm font-medium">Nombre</label>
        <input name="nombre" type="text" required defaultValue={defaults.nombre} className={INPUT} />
      </div>

      <div>
        <label className="text-sm font-medium">Descripción corta</label>
        <p className="mt-0.5 text-xs text-principal/40">Se ve en la tarjeta de la lista.</p>
        <div className="mt-2">
          <RichTextEditor name="descripcion" defaultValue={defaults.descripcion ?? ""} placeholder="Descripción corta..." />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Tipo</label>
          <select name="tipo" defaultValue={defaults.tipo ?? "publico"} className={INPUT}>
            <option value="publico">Público</option>
            <option value="privado">Privado</option>
            <option value="mixto">Mixto</option>
            <option value="comunitario">Comunitario</option>
            <option value="internacional">Internacional</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Estado</label>
          <select name="estado" defaultValue={defaults.estado ?? ""} className={INPUT}>
            <option value="">Sin indicar</option>
            <option value="en_curso">En curso</option>
            <option value="planificada">Planificada</option>
            <option value="finalizada">Finalizada</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Área</label>
        <input name="area" type="text" defaultValue={defaults.area} placeholder="Infraestructura, Educación..." className={INPUT} />
      </div>

      <ImageUploadField name="logoUrl" defaultValue={defaults.logoUrl ?? ""} label="Logo o identidad de la organización (miniatura)" />
      <ImageUploadField name="imagen" defaultValue={defaults.imagen ?? ""} label="Imagen principal" />

      <h2 className="pt-4 font-display text-xl">Ficha completa</h2>
      <p className="-mt-3 text-xs text-principal/50">
        Todos estos campos son opcionales. Solo se muestran en la ficha los que completes.
      </p>

      <div>
        <label className="text-sm font-medium">Responsable</label>
        <input name="responsable" type="text" defaultValue={defaults.responsable} placeholder="Quién la lleva adelante" className={INPUT} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Período</label>
          <input name="periodo" type="text" defaultValue={defaults.periodo} placeholder="2025 · en curso" className={INPUT} />
        </div>
        <div>
          <label className="text-sm font-medium">Ubicación</label>
          <input name="ubicacion" type="text" defaultValue={defaults.ubicacion} placeholder="Barrio, localidad o zona" className={INPUT} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">A quién llega</label>
        <input name="destinatarios" type="text" defaultValue={defaults.destinatarios} placeholder="Público destinatario" className={INPUT} />
      </div>

      <div>
        <label className="text-sm font-medium">Link</label>
        <p className="mt-0.5 text-xs text-principal/40">La URL completa se muestra visible en la ficha.</p>
        <input name="enlace" type="url" defaultValue={defaults.enlace} placeholder="https://..." className={INPUT} />
      </div>

      <div>
        <label className="text-sm font-medium">Detalle</label>
        <p className="mt-0.5 text-xs text-principal/40">Texto largo: objetivos, etapas, resultados.</p>
        <div className="mt-2">
          <RichTextEditor name="detalle" defaultValue={defaults.detalle ?? ""} placeholder="Detalle de la iniciativa..." />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">En números</label>
        <p className="mt-0.5 text-xs text-principal/40">
          Hasta 4 cifras clave, una por línea, con el formato valor | descripción. Por ejemplo: 700 km | de caminos a planificar
        </p>
        <textarea
          name="cifras"
          rows={4}
          defaultValue={defaults.cifras}
          placeholder={"700 km | de caminos a planificar\n3 | etapas de trabajo"}
          className={INPUT}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Galería</label>
        <p className="mt-0.5 text-xs text-principal/40">Hasta 4 fotos.</p>
        <div className="mt-2 space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <ImageUploadField key={i} name="galeria" defaultValue={galeria[i] ?? ""} label={`Foto ${i + 1}`} />
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Documento descargable</label>
        <input name="documentoTitulo" type="text" defaultValue={defaults.documentoTitulo} placeholder="Nombre del documento (por ejemplo, Plan director)" className={INPUT} />
        <div className="mt-3">
          <ImageUploadField name="documentoUrl" defaultValue={defaults.documentoUrl ?? ""} label="Archivo PDF" acceptPdf={true} />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="rounded-lg bg-principal px-6 py-3 text-sm font-semibold text-secundario">
          Guardar
        </button>
        <a href={cancelHref} className="rounded-lg border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento">
          Cancelar
        </a>
      </div>
    </form>
  );
}
