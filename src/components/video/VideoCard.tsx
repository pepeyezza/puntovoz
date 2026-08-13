function getEmbedUrl(url: string): string {
  try {
    const u = new URL(url);

    // Vimeo
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return `https://player.vimeo.com/video/${id}`;
    }

    // YouTube Shorts
    if (u.pathname.includes("/shorts/")) {
      const id = u.pathname.split("/shorts/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    // youtu.be
    if (u.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }

    // youtube.com/embed/
    if (u.pathname.includes("/embed/")) {
      return url;
    }

    // youtube.com/watch?v=
    const v = u.searchParams.get("v");
    if (v) return `https://www.youtube.com/embed/${v}`;

  } catch {}
  return url;
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
          src={getEmbedUrl(youtubeUrl)}
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
