import Link from "next/link";

export default function ArtistCard({ artist }) {
  return (
    <Link href={`/artists/${artist.slug}`} className="group block text-center">
      <div className="aspect-square overflow-hidden bg-zinc-100">
        {artist.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={artist.photoUrl}
            alt={artist.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-zinc-300">
            No image
          </div>
        )}
      </div>
      <h3 className="mt-3 text-base font-bold text-heading transition-colors group-hover:text-gold">
        {artist.name}
      </h3>
    </Link>
  );
}
