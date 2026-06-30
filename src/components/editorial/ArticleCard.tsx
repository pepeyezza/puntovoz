import Link from "next/link";
import Image from "next/image";

export type ArticleCardProps = {
  slug: string;
  title: string;
  subtitle?: string;
  coverImage?: string;
  category?: string;
  date?: string;
  size?: "default" | "large";
};

export default function ArticleCard({
  slug,
  title,
  subtitle,
  coverImage,
  category,
  date,
  size = "default",
}: ArticleCardProps) {
  return (
    <Link href={`/editoriales/${slug}`} className="group block">
      <div className="overflow-hidden rounded-2xl bg-principal/5">
        <div className={`relative ${size === "large" ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-principal/10 text-principal/30">
              .VOZ
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        {category && (
          <span className="eyebrow text-acento">{category}</span>
        )}
        <h3
          className={`mt-2 font-display leading-snug group-hover:text-acento ${
            size === "large" ? "text-2xl lg:text-3xl" : "text-lg"
          }`}
        >
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 line-clamp-2 text-sm text-principal/60">{subtitle}</p>
        )}
        {date && <p className="mt-2 text-xs text-principal/40">{date}</p>}
      </div>
    </Link>
  );
}
