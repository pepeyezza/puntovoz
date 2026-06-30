function getYoutubeEmbedUrl(url: string) {
  // Soporta youtube.com/watch?v=, youtu.be/ y youtube.com/embed/
  let videoId = "";
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      videoId = u.pathname.slice(1);
    } else if (u.pathname.includes("/embed/")) {
      videoId = u.pathname.split("/embed/")[1];
    } else {
      videoId = u.searchParams.get("v") ?? "";
    }
  } catch {
    videoId = "";
  }
  return `https://www.youtube.com/embed/${videoId}`;
}

type VideoCardProps = {
  title: string;
  description?: string;
  youtubeUrl: string;
  date?: string;
};

export default function VideoCard({ title, description, youtubeUrl, date }: VideoCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-principal/10 bg-secundario">
      <div className="aspect-video">
        <iframe
          src={getYoutubeEmbedUrl(youtubeUrl)}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="h-full w-full"
        />
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg leading-snug">{title}</h3>
        {description && <p className="mt-1 text-sm text-principal/60 line-clamp-2">{description}</p>}
        {date && <p className="mt-2 text-xs text-principal/40">{date}</p>}
      </div>
    </article>
  );
}
