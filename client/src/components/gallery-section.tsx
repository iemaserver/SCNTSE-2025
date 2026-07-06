import { useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Play, Image as ImageIcon, Film, ZoomIn } from "lucide-react";

// ─── Image gallery (SCNTSE 2025 event photos) ───────────────────────────────
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

// ─── Media coverage (news / press images & videos) ──────────────────────────
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
  { src: "/Media/171025_mkt.mp4", label: "SCNTSE 2025 — Highlights" },
  { src: "/Media/WhatsApp Video 2026-07-05 at 20.20.57.mp4", label: "SCNTSE 2025 — Ceremony" },
  { src: "/Media/WhatsApp Video 2026-07-05 at 20.30.29.mp4", label: "SCNTSE 2025 — Award Presentation" },
];

type Tab = "event" | "media";

// ─── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({
  images,
  index,
  onClose,
}: {
  images: string[];
  index: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);

  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(
    () => setCurrent((c) => (c + 1) % images.length),
    [images.length]
  );

  // keyboard navigation
  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    },
    [prev, next, onClose]
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={handleKey}
      tabIndex={0}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-10"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Prev */}
      <button
        className="absolute left-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-10"
        onClick={(e) => { e.stopPropagation(); prev(); }}
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Image */}
      <div
        className="max-w-5xl max-h-[85vh] w-full px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[current]}
          alt={`Gallery photo ${current + 1}`}
          className="w-full h-full object-contain rounded-xl shadow-2xl"
          style={{ maxHeight: "85vh" }}
        />
        <p className="text-center text-white/60 text-sm mt-3">
          {current + 1} / {images.length}
        </p>
      </div>

      {/* Next */}
      <button
        className="absolute right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-10"
        onClick={(e) => { e.stopPropagation(); next(); }}
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function GallerySection() {
  const [activeTab, setActiveTab] = useState<Tab>("event");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const currentImages = activeTab === "event" ? eventImages : mediaImages;

  return (
    <section id="gallery" className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Photos & Media Coverage
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Relive the moments from SCNTSE 2025 — the ceremony, the scholars, and the press coverage.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="glass-effect rounded-2xl p-1 flex gap-1">
            <button
              onClick={() => setActiveTab("event")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === "event"
                  ? "bg-accent text-white shadow-lg shadow-accent/30"
                  : "text-white/60 hover:text-white"
              }`}
              aria-pressed={activeTab === "event"}
            >
              <ImageIcon className="h-4 w-4" />
              Event Photos
              <span className="ml-1 text-xs opacity-70">({eventImages.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("media")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === "media"
                  ? "bg-secondary text-white shadow-lg shadow-secondary/30"
                  : "text-white/60 hover:text-white"
              }`}
              aria-pressed={activeTab === "media"}
            >
              <Film className="h-4 w-4" />
              Media Coverage
              <span className="ml-1 text-xs opacity-70">({mediaImages.length + mediaVideos.length})</span>
            </button>
          </div>
        </div>

        {/* ── Event Photos grid ── */}
        {activeTab === "event" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {eventImages.map((src, i) => (
              <button
                key={src}
                onClick={() => setLightboxIndex(i)}
                className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 hover:border-accent/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label={`Open photo ${i + 1}`}
              >
                <img
                  src={src}
                  alt={`SCNTSE 2025 event photo ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                  <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-lg" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── Media Coverage: images + videos ── */}
        {activeTab === "media" && (
          <div className="space-y-12">
            {/* Press / News images */}
            <div>
              <h3 className="text-xl font-bold text-secondary mb-5 flex items-center gap-2">
                <ImageIcon className="h-5 w-5" /> Press Coverage — Photos
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {mediaImages.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setLightboxIndex(i)}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 hover:border-secondary/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary"
                    aria-label={`Open media photo ${i + 1}`}
                  >
                    <img
                      src={src}
                      alt={`Media coverage photo ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                      <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-lg" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Videos */}
            <div>
              <h3 className="text-xl font-bold text-accent mb-5 flex items-center gap-2">
                <Play className="h-5 w-5" /> Video Coverage
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mediaVideos.map(({ src, label }) => (
                  <div
                    key={src}
                    className="glass-effect rounded-2xl overflow-hidden border border-white/10 hover:border-accent/40 transition-all duration-200"
                  >
                    <video
                      src={src}
                      controls
                      preload="metadata"
                      className="w-full aspect-video object-cover bg-black"
                      aria-label={label}
                    />
                    <div className="px-4 py-3">
                      <p className="text-sm font-semibold text-white/80 flex items-center gap-2">
                        <Play className="h-3.5 w-3.5 text-accent" />
                        {label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={currentImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}
