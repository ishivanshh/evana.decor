"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type EventPhoto = { src: string; alt: string };

export function EventSlider({ photos }: { photos: EventPhoto[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (photos.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex(index => (index + 1) % photos.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [photos.length]);

  return (
    <div>
      <h2 className="font-display mb-5 text-4xl sm:text-5xl text-center">Evana at different events</h2>
      {photos.length === 0 ? (
        <div className="flex aspect-[1.15] items-center justify-center bg-[#e8e1d8] p-8 text-center text-sm text-[#82776d]">
          Add event photos to <code className="mx-1">public/event/</code> to show the slider.
        </div>
      ) : (
        <div className="relative aspect-[1.15] overflow-hidden bg-[#e8e1d8]" aria-label="Evana event photos">
          {photos.map((photo, index) => (
            <Image
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-cover transition-opacity duration-700 ${index === activeIndex ? "opacity-100" : "opacity-0"}`}
              aria-hidden={index !== activeIndex}
            />
          ))}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {photos.map((photo, index) => (
              <button
                key={photo.src}
                type="button"
                aria-label={`Show event photo ${index + 1}`}
                aria-pressed={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-7 bg-white" : "w-1.5 bg-white/60"}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
