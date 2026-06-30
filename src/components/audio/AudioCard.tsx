type AudioCardProps = {
  title: string;
  description?: string;
  spotifyUrl: string;
  date?: string;
};

function toEmbedUrl(spotifyUrl: string) {
  // Convierte una URL normal de Spotify (episodio o playlist) a su versión embed
  return spotifyUrl.replace("open.spotify.com/", "open.spotify.com/embed/");
}

export default function AudioCard({ title, description, spotifyUrl, date }: AudioCardProps) {
  return (
    <article className="rounded-2xl border border-principal/10 bg-secundario p-4">
      <iframe
        src={toEmbedUrl(spotifyUrl)}
        width="100%"
        height="152"
        style={{ borderRadius: 12 }}
        title={`Reproductor de ${title}`}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />
      <h3 className="mt-3 font-display text-lg leading-snug">{title}</h3>
      {description && <p className="mt-1 text-sm text-principal/60 line-clamp-2">{description}</p>}
      {date && <p className="mt-2 text-xs text-principal/40">{date}</p>}
    </article>
  );
}
