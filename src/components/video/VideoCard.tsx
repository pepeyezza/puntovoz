function getYoutubeEmbedUrl(url: string) {
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
  } catch { videoId = ""; }
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
    <article className="overflow-hidden rounded-2xl bg-principal">
      <div className="aspect-video">
        <iframe
          src={getYoutubeEmbedUrl(youtubeUrl)}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="h-full w-full"
        />
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg leading-snug text-secundario">{title}</h3>
        {description && <p className="mt-1 text-sm text-secundario/55 line-clamp-2">{description}</p>}
        {date && <p className="mt-2 text-xs text-secundario/35">{date}</p>}
      </div>
    </article>
  );
}
