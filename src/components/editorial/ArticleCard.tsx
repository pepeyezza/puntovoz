import Link from "next/link";
import Image from "next/image";

type ArticleCardProps = {
  slug: string;
  title: string;
  subtitle?: string;
  category?: string;
  date?: string;
  coverImage?: string;
  size?: "default" | "large";
  featured?: boolean;
  author?: string; // solo se muestra cuando es colaborador
};

export default function ArticleCard({
  slug,
  title,
  subtitle,
  category,
  date,
  coverImage,
  size = "default",
  featured,
  author,
}: ArticleCardProps) {
  return (
    <Link href={`/editoriales/${slug}`} className="group block">
      {/* Imagen de portada */}
      <div className={`relative overflow-hidden rounded-2xl bg-principal/5 ${size === "large" ? "aspect-[4/3]" : "aspect-[16/9]"}`}>
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-principal/20 font-logo text-2xl">.VOZ</div>
        )}
        {featured && (
          <span className="absolute left-3 top-3 rounded-lg bg-joven px-2.5 py-1 text-xs font-semibold text-principal">
            Destacado
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="mt-4">
        {category && <p className="eyebrow text-acento">{category}</p>}
        <h3 className={`mt-1 font-display leading-snug group-hover:text-acento transition-colors ${size === "large" ? "text-2xl" : "text-xl"}`}>
          {title}
        </h3>
        {subtitle && <p className="mt-2 text-sm text-principal/60 line-clamp-2">{subtitle}</p>}
        <div className="mt-3 flex flex-col gap-1">
          {author && (
            <span className="text-xs font-medium text-principal/70">{author}</span>
          )}
          <div className="flex items-center gap-2 text-xs text-principal/40">
            <span>{date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
