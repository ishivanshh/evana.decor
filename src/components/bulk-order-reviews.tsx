import Image from "next/image";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

const reviewsDirectory = path.join(process.cwd(), "public", "reviews");
const reviewPhotos = existsSync(reviewsDirectory)
  ? readdirSync(reviewsDirectory, { withFileTypes: true })
      .filter(entry => entry.isFile() && /\.(avif|gif|jpe?g|png|webp)$/i.test(entry.name))
      .sort((left, right) => left.name.localeCompare(right.name))
      .slice(0, 3)
      .map(entry => ({ src: `/reviews/${entry.name}`, alt: "A playful Evana customer review" }))
  : [];

export function BulkOrderReviews() {
  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row">
      {[0, 1, 2].map(index => {
        const photo = reviewPhotos[index];
        return (
          <div key={photo?.src ?? `review-placeholder-${index}`} className="relative aspect-[.82] min-w-0 flex-1 overflow-hidden bg-[#eee7dd]">
            {photo ? (
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-6 text-center text-xs leading-6 text-[#82776d]">
                Add another review image to <code className="mx-1">public/reviews/</code>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
