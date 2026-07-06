import { useState, useEffect, useRef, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Play, Camera, Tv2 } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────
const eventImages = [
  "/images/WhatsApp Image 2026-07-05 at 20.18.27.jpeg",
  "/images/WhatsApp Image 2026-07-05 at 20.18.28 (1).jpeg",
  "/images/WhatsApp Image 2026-07-05 at 20.18.28 (2).jpeg",
  "/images/WhatsApp Image 2026-07-05 at 20.18.28.jpeg",
  "/images/WhatsApp Image 2026-07-05 at 20.18.29 (1).jpeg",
  "/images/WhatsApp Image 2026-07-05 at 20.18.29 (2).jpeg",
  "/images/WhatsApp Image 2026-07-05 at 20.18.29.jpeg",
  "/images/WhatsApp Image 2026-07-05 at 20.18.30 (1).jpeg",
  "/images/WhatsApp Image 2026-07-05 at 20.18.30 (2).jpeg",
  "/images/WhatsApp Image 2026-07-05 at 20.18.30.jpeg",
  "/images/WhatsApp Image 2026-07-05 at 20.18.31 (1).jpeg",
  "/images/WhatsApp Image 2026-07-05 at 20.18.31.jpeg",
  "/images/WhatsApp Image 2026-07-05 at 20.18.32.jpeg",
];

const mediaImages = [
  "/Media/WhatsApp Image 2026-07-05 at 20.20.25.jpeg",
  "/Media/WhatsApp Image 2026-07-05 at 20.28.31.jpeg",
  "/Media/WhatsApp Image 2026-07-05 at 20.28.32.jpeg",
  "/Media/WhatsApp Image 2026-07-05 at 20.28.34.jpeg",
  "/Media/WhatsApp Image 2026-07-05 at 20.28.35.jpeg",
  "/Media/WhatsApp Image 2026-07-05 at 20.28.37.jpeg",
  "/Media/WhatsApp Image 2026-07-05 at 20.28.44.jpeg",
  "/Media/WhatsApp Image 2026-07-05 at 20.28.46.jpeg",
  "/Media/WhatsApp Image 2026-07-05 at 20.28.48.jpeg",
  "/Media/WhatsApp Image 2026-07-05 at 20.28.50.jpeg",
];

const mediaVideos = [
  { src: "/Media/171025_mkt.mp4",                                label: "SCNTSE 2025 — Highlights" },
  { src: "/Media/WhatsApp Video 2026-07-05 at 20.20.57.mp4",    label: "SCNTSE 2025 — Ceremony" },
  { src: "/Media/WhatsApp Video 2026-07-05 at 20.30.29.mp4",    label: "SCNTSE 2025 — Award Presentation" },
];

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape")     onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all"
        aria-label="Close"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Prev arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all hover:scale-110"
        aria-label="Previous"
      >
        <ChevronLeft className="h-7 w-7" />
      </button>

      {/* Image */}
      <div
        className="relative w-full max-w-5xl px-20 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={idx}
          src={images[idx]}
          alt={`Photo ${idx + 1}`}
          className="max-h-[82vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
          style={{ animation: "fadeIn 0.2s ease" }}
        />
        {/* Counter + dots */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-white/50 text-sm">{idx + 1} / {images.length}</span>
          <div className="flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`rounded-full transition-all duration-200 ${
                  i === idx
                    ? "w-5 h-2 bg-accent"
                    : "w-2 h-2 bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Next arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all hover:scale-110"
        aria-label="Next"
      >
        <ChevronRight className="h-7 w-7" />
      </button>
    </div>
  );
}

// ─── Auto-scrolling Carousel ──────────────────────────────────────────────────
function AutoCarousel({
  images,
  accentClass = "accent",
  onImageClick,
}: {
  images: string[];
  accentClass?: string;
  onImageClick: (i: number) => void;
}) {
  const trackRef  = useRef<HTMLDivElement>(null);
  const rafRef    = useRef<number>(0);
  const posRef    = useRef(0);
  const pausedRef = useRef(false);

  // We duplicate the list for seamless infinite loop
  const doubled = [...images, ...images];

  const SPEED = 0.6; // px per frame

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const step = () => {
      if (!pausedRef.current) {
        posRef.current += SPEED;
        // Reset when we've scrolled one full set width
        const halfWidth = track.scrollWidth / 2;
        if (posRef.current >= halfWidth) posRef.current -= halfWidth;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      {/* Left fade */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-[#0a0a1a] to-transparent" />
      {/* Right fade */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-[#0a0a1a] to-transparent" />

      <div ref={trackRef} className="flex gap-4 w-max will-change-transform">
        {doubled.map((src, i) => (
          <button
            key={`${src}-${i}`}
            onClick={() => onImageClick(i % images.length)}
            className="group relative flex-shrink-0 w-64 h-44 md:w-80 md:h-56 rounded-2xl overflow-hidden border border-white/10 hover:border-accent/60 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-accent/20 focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label={`View photo ${(i % images.length) + 1}`}
          >
            <img
              src={src}
              alt={`Gallery ${(i % images.length) + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              draggable={false}
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <span className="text-white text-xs font-semibold tracking-widest uppercase bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                Click to enlarge
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
type Tab = "event" | "media";

export default function GallerySection() {
  const [tab, setTab]               = useState<Tab>("event");
  const [lightbox, setLightbox]     = useState<{ images: string[]; idx: number } | null>(null);

  const openEvent = useCallback((i: number) => setLightbox({ images: eventImages, idx: i }), []);
  const openMedia = useCallback((i: number) => setLightbox({ images: mediaImages, idx: i }), []);

  return (
    <section id="gallery" className="py-24 overflow-hidden">
      {/* ── Header ── */}
      <div className="container mx-auto px-4 text-center mb-14">
        <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-3">
          Photos &amp; Media Coverage
        </h2>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Relive the moments from SCNTSE 2025 — the ceremony, scholars, and press coverage.
        </p>
      </div>

      {/* ── Tab switcher ── */}
      <div className="flex justify-center mb-12 px-4">
        <div className="glass-effect rounded-2xl p-1 flex gap-1 shadow-xl">
          <button
            onClick={() => setTab("event")}
            className={`flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
              tab === "event"
                ? "bg-gradient-to-r from-accent to-blue-500 text-white shadow-lg"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Camera className="h-4 w-4" />
            Event Photos
            <span className="opacity-60 text-xs">({eventImages.length})</span>
          </button>
          <button
            onClick={() => setTab("media")}
            className={`flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
              tab === "media"
                ? "bg-gradient-to-r from-purple-500 to-secondary text-white shadow-lg"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Tv2 className="h-4 w-4" />
            Media Coverage
            <span className="opacity-60 text-xs">({mediaImages.length + mediaVideos.length})</span>
          </button>
        </div>
      </div>

      {/* ── Event Photos carousel ── */}
      {tab === "event" && (
        <div className="space-y-3">
          {/* Row 1 — scrolls left */}
          <AutoCarousel images={eventImages} onImageClick={openEvent} />
          {/* Row 2 — same images offset, also scrolls (gives depth) */}
          <AutoCarousel
            images={[...eventImages.slice(6), ...eventImages.slice(0, 6)]}
            onImageClick={(i) => openEvent((i + 6) % eventImages.length)}
          />
        </div>
      )}

      {/* ── Media Coverage ── */}
      {tab === "media" && (
        <div className="space-y-12">
          {/* Press images carousel */}
          <div>
            <p className="text-center text-sm font-semibold text-white/40 uppercase tracking-widest mb-5">
              Press &amp; News Coverage
            </p>
            <AutoCarousel images={mediaImages} onImageClick={openMedia} />
          </div>

          {/* Videos */}
          <div className="container mx-auto px-4">
            <p className="text-center text-sm font-semibold text-white/40 uppercase tracking-widest mb-7">
              Video Coverage
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {mediaVideos.map(({ src, label }) => (
                <div
                  key={src}
                  className="group glass-effect rounded-2xl overflow-hidden border border-white/10 hover:border-accent/40 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-1"
                >
                  <div className="relative aspect-video bg-black">
                    <video
                      src={src}
                      controls
                      preload="metadata"
                      className="w-full h-full object-cover"
                      aria-label={label}
                    />
                  </div>
                  <div className="px-4 py-3 flex items-center gap-2">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
                      <Play className="h-3.5 w-3.5 text-accent fill-accent" />
                    </div>
                    <p className="text-sm font-semibold text-white/80 leading-tight">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          startIndex={lightbox.idx}
          onClose={() => setLightbox(null)}
        />
      )}

      {/* Fade-in keyframe */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </section>
  );
}
