import { SECCION_COLORS } from "@/components/observatorio/ObservatorioNav";

type Props = {
  seccion: string;
  children: React.ReactNode;
};

export default function DataSeccionWrapper({ seccion, children }: Props) {
  const color = SECCION_COLORS[seccion] ?? SECCION_COLORS["/observatorio"];

  return (
    <div
      className={`min-h-screen ${color.bg} ${color.text}`}
      style={(color as any).style}
    >
      {children}
    </div>
  );
}
