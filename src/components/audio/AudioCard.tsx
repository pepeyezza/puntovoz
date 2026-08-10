type AudioCardProps = {
  title: string;
  description?: string;
  spotifyUrl: string;
  date?: string;
};

function toEmbedUrl(spotifyUrl: string) {
  return spotifyUrl.replace("open.spotify.com/", "open.spotify.com/embed/");
}

export default function AudioCard({ title, description, spotifyUrl, date }: AudioCardProps) {
  return (
    <article className="rounded-2xl bg-principal p-5">
      <iframe
        src={toEmbedUrl(spotifyUrl)}
        width="100%"
        height="152"
        style={{ borderRadius: 10 }}
        title={`Reproductor de ${title}`}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />
      <h3 className="mt-4 font-display text-lg leading-snug text-secundario">{title}</h3>
      {description && <p className="mt-1 text-sm text-secundario/55 line-clamp-2">{description}</p>}
      {date && <p className="mt-2 text-xs text-secundario/35">{date}</p>}
    </article>
  );
}
