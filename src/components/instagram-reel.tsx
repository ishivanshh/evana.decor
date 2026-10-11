import Image from "next/image";
import { Clapperboard } from "lucide-react";

type InstagramReelProps = {
  url?: string;
  poster: { src: string; alt: string };
};

function getInstagramEmbedUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || !["instagram.com", "www.instagram.com"].includes(parsed.hostname)) return undefined;
    const match = parsed.pathname.match(/^\/(reel|p|tv)\/([A-Za-z0-9_-]+)\/?(?:embed\/?)?$/);
    if (!match) return undefined;
    return `https://www.instagram.com/${match[1]}/${match[2]}/embed/`;
  } catch {
    return undefined;
  }
}

export function InstagramReel({ url, poster }: InstagramReelProps) {
  const embedUrl = url ? getInstagramEmbedUrl(url) : undefined;

  if (url && !embedUrl) {
    return <div className="flex aspect-[.72] items-center justify-center bg-[#f1ebe3] p-5 text-center text-sm text-[#82776d]">
      Add a valid Instagram reel URL to display this video.
    </div>;
  }

  if (embedUrl) {
    return <div className="aspect-[.72] overflow-hidden bg-white">
      <iframe
        src={embedUrl}
        title={`Instagram reel: ${poster.alt}`}
        className="h-full w-full border-0"
        allow="encrypted-media; picture-in-picture; clipboard-write; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>;
  }

  return <div className="relative aspect-[.72] overflow-hidden bg-[#e8e1d8]" aria-label="Instagram reel coming soon">
    <Image src={poster.src} alt={poster.alt} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#30241c]/45 text-center text-white">
      <Clapperboard size={22} strokeWidth={1.4} />
      <span className="text-[9px] uppercase tracking-[.18em]">Reel coming soon</span>
    </div>
  </div>;
}
